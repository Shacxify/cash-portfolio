import { useEffect, useRef } from "react";
import { drawFish, mouthOf, spawnFish, type Fish, type FishKind } from "./fish";

type Props = {
  /** First strike or tap: the parent starts a round on it. */
  onCast: () => void;
  /** A fish was landed. Returns the text to float above the water. */
  onCatch: (kind: FishKind) => string;
  /** A fish got away (struck too early or too late). */
  onMiss: () => void;
};

type Float = { x: number; y: number; text: string; color: string; life: number };
type Ripple = { x: number; y: number; r: number; life: number };
type Bubble = { x: number; y: number; r: number; vy: number };

const BITE_WINDOW = 550;
const REEL_MS = 520;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// The pond: a canvas game loop. Fish carry site links; hover the hook over a
// fish's mouth, wait for it to nibble, then strike inside the short bite window.
export function FishingGame({ onCast, onCatch, onMiss }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onCast, onCatch, onMiss });

  useEffect(() => {
    callbacks.current = { onCast, onCatch, onMiss };
  }, [onCast, onCatch, onMiss]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedScale = reduce ? 0.6 : 1;

    let w = 0;
    let h = 0;
    let started = false;
    const waterTop = () => h * 0.22;
    const wave = (x: number, t: number) => (reduce ? 0 : Math.sin(x * 0.02 + t * 0.0015) * 3);

    const hook = { x: 0, y: 0, tx: 0, ty: 0 };
    let rodX = 0;
    let fish: Fish[] = [];
    let engaged: Fish | null = null;
    let floats: Float[] = [];
    let ripples: Ripple[] = [];
    let bubbles: Bubble[] = [];
    let lastSpawn = 0;
    let now = 0;

    const clampTarget = () => {
      hook.tx = clamp(hook.tx, 10, w - 10);
      hook.ty = clamp(hook.ty, waterTop() + 16, h - 12);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!started) {
        started = true;
        hook.x = hook.tx = rodX = w / 2;
        hook.y = hook.ty = waterTop() + (h - waterTop()) * 0.3;
        // Stock the pond so it isn't empty on arrival.
        for (let i = 0; i < 4; i++) {
          const f = spawnFish(w, waterTop(), h, speedScale);
          f.x = w * (0.15 + Math.random() * 0.7);
          fish.push(f);
        }
      }
      clampTarget();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    const targetCount = () => Math.round(clamp(w / 140, 4, 8));

    const float = (x: number, text: string, color = "#361D2E") => {
      floats.push({ x: clamp(x, 70, w - 70), y: waterTop() - 14, text, color, life: 1 });
    };

    const flee = (f: Fish, msg: string) => {
      f.state = "flee";
      f.dir = f.x < hook.x ? -1 : 1;
      f.speed = Math.max(f.speed * 2.5, 170 * speedScale);
      engaged = null;
      // Shaking off junk is a good thing, so only real fish break the combo.
      if (f.kind.tier !== "junk") {
        float(hook.x, msg, "#8A7F74");
        callbacks.current.onMiss();
      }
    };

    const strike = () => {
      callbacks.current.onCast();
      ripples.push({ x: hook.x, y: waterTop() + wave(hook.x, now), r: 3, life: 1 });
      const f = engaged;
      if (!f) return;
      if (f.state === "bite") {
        f.state = "reeled";
        f.timer = REEL_MS;
        engaged = null;
        const text = callbacks.current.onCatch(f.kind);
        float(hook.x, text, f.kind.tier === "junk" ? "#8A7F74" : "#361D2E");
      } else {
        flee(f, "Too early!");
      }
    };

    const step = (dt: number, t: number) => {
      const wt = waterTop();
      const k = 1 - Math.pow(0.8, dt / 16.67);
      hook.x += (hook.tx - hook.x) * k;
      hook.y += (hook.ty - hook.y) * k;
      rodX += (hook.x - rodX) * (1 - Math.pow(0.96, dt / 16.67));

      const active = fish.filter((f) => f.state !== "flee" && f.state !== "reeled").length;
      if (active < targetCount() && t - lastSpawn > 650) {
        fish.push(spawnFish(w, wt, h, speedScale));
        lastSpawn = t;
      }

      for (const f of fish) {
        const mouth = mouthOf(f);
        const dist = Math.hypot(mouth.x - hook.x, mouth.y - hook.y);
        switch (f.state) {
          case "swim":
            f.x += (f.dir * f.speed * dt) / 1000;
            f.y = f.baseY + Math.sin(t * 0.002 + f.phase) * (reduce ? 2 : 6);
            if (!engaged && dist < 14 + f.size * 0.35) {
              f.state = "nibble";
              f.timer = 300 + Math.random() * 600;
              engaged = f;
            }
            break;
          case "nibble":
          case "bite": {
            // Hold the mouth on the hook while it decides.
            const pull = k * 0.5;
            f.x += (hook.x - f.dir * f.size * 0.95 - f.x) * pull;
            f.y += (hook.y - f.y) * pull;
            f.timer -= dt;
            if (dist > 48) flee(f, "Spooked it");
            else if (f.timer <= 0) {
              if (f.state === "nibble") {
                f.state = "bite";
                f.timer = BITE_WINDOW;
              } else flee(f, "Missed!");
            }
            break;
          }
          case "flee":
            f.x += (f.dir * f.speed * dt) / 1000;
            f.y += (f.baseY - f.y) * 0.02;
            break;
          case "reeled":
            f.timer -= dt;
            f.x += (hook.x - f.x) * k * 0.4;
            f.y += (wt - 34 - f.y) * k * 0.35;
            f.alpha = clamp(f.timer / 220, 0, 1);
            break;
        }
      }
      fish = fish.filter((f) => (f.state === "reeled" ? f.timer > 0 : f.x > -140 && f.x < w + 140));

      if (!reduce && Math.random() < dt / 400) {
        bubbles.push({
          x: Math.random() * w,
          y: h + 4,
          r: 1.5 + Math.random() * 2.5,
          vy: 18 + Math.random() * 22,
        });
      }
      for (const b of bubbles) b.y -= (b.vy * dt) / 1000;
      bubbles = bubbles.filter((b) => b.y > wt + 4);

      for (const fl of floats) {
        fl.life -= dt / 1300;
        fl.y -= dt * 0.025;
      }
      floats = floats.filter((fl) => fl.life > 0);

      for (const r of ripples) {
        r.r += dt * 0.05;
        r.life -= dt / 650;
      }
      ripples = ripples.filter((r) => r.life > 0);
    };

    const surfacePath = (t: number) => {
      const wt = waterTop();
      ctx.beginPath();
      ctx.moveTo(0, wt + wave(0, t));
      for (let x = 16; x <= w + 16; x += 16) ctx.lineTo(x, wt + wave(x, t));
    };

    const draw = (t: number) => {
      const wt = waterTop();
      ctx.clearRect(0, 0, w, h);

      // Water body: sage at the surface, deepening toward blackberry.
      surfacePath(t);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const water = ctx.createLinearGradient(0, wt, 0, h);
      water.addColorStop(0, "rgba(134,163,151,0.28)");
      water.addColorStop(0.55, "rgba(134,163,151,0.48)");
      water.addColorStop(1, "rgba(54,29,46,0.42)");
      ctx.fillStyle = water;
      ctx.fill();

      for (const b of bubbles) {
        ctx.beginPath();
        ctx.arc(b.x + Math.sin(b.y * 0.05) * 2, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(250,250,249,0.45)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (const f of fish) if (f !== engaged) drawFish(ctx, f, t, true);
      // The engaged fish draws last so its label sits on top.
      if (engaged) drawFish(ctx, engaged, t, true);

      surfacePath(t);
      ctx.strokeStyle = "rgba(250,250,249,0.75)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (const r of ripples) {
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r, r.r * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(250,250,249,${r.life * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Line: rod tip -> bobber (slack curve) -> hook.
      const state = engaged?.state;
      const dunk = state === "bite" ? 7 : state === "nibble" ? Math.sin(t * 0.05) * 2 : 0;
      const bobY = wt + wave(hook.x, t) + dunk;
      ctx.beginPath();
      ctx.moveTo(rodX, 0);
      ctx.quadraticCurveTo((rodX + hook.x) / 2, bobY * 0.75, hook.x, bobY);
      ctx.strokeStyle = "rgba(54,29,46,0.55)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(hook.x, bobY);
      ctx.lineTo(hook.x, hook.y - 8);
      ctx.strokeStyle = "rgba(54,29,46,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hook
      ctx.beginPath();
      ctx.moveTo(hook.x, hook.y - 8);
      ctx.lineTo(hook.x, hook.y + 2);
      ctx.arc(hook.x - 4, hook.y + 2, 4, 0, Math.PI);
      ctx.lineTo(hook.x - 8, hook.y - 1);
      ctx.strokeStyle = "#361D2E";
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.stroke();

      // Bobber
      ctx.beginPath();
      ctx.arc(hook.x, bobY, 6, Math.PI, 0);
      ctx.fillStyle = "#361D2E";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hook.x, bobY, 6, 0, Math.PI);
      ctx.fillStyle = "#FAFAF9";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hook.x, bobY, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(54,29,46,0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (state === "bite") {
        const pop = reduce ? 1 : 1 + Math.sin(t * 0.03) * 0.08;
        ctx.save();
        ctx.translate(hook.x, bobY - 24);
        ctx.scale(pop, pop);
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fillStyle = "#E1B07E";
        ctx.fill();
        ctx.fillStyle = "#361D2E";
        ctx.font = "800 15px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("!", 0, 1);
        ctx.restore();
      }

      for (const fl of floats) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, fl.life * 1.5);
        ctx.font = "700 14px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(250,250,249,0.9)";
        ctx.strokeText(fl.text, fl.x, fl.y);
        ctx.fillStyle = fl.color;
        ctx.fillText(fl.text, fl.x, fl.y);
        ctx.restore();
      }
    };

    let raf = 0;
    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      now = t;
      step(dt, t);
      draw(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const setTarget = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      hook.tx = clientX - rect.left;
      hook.ty = clientY - rect.top;
      clampTarget();
    };
    const onPointerMove = (e: PointerEvent) => setTarget(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => {
      // Mouse: click strikes wherever the hook is. Touch: a tap moves the hook,
      // and a tap while something is nibbling strikes.
      if (e.pointerType === "mouse") {
        setTarget(e.clientX, e.clientY);
        strike();
      } else if (engaged) {
        strike();
      } else {
        setTarget(e.clientX, e.clientY);
        callbacks.current.onCast();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const stepPx = 28;
      if (e.key === "ArrowLeft") hook.tx -= stepPx;
      else if (e.key === "ArrowRight") hook.tx += stepPx;
      else if (e.key === "ArrowUp") hook.ty -= stepPx;
      else if (e.key === "ArrowDown") hook.ty += stepPx;
      else if (e.key === " " || e.key === "Enter") strike();
      else return;
      e.preventDefault();
      clampTarget();
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Fishing pond. Move the pointer or use the arrow keys to aim the hook. When the bobber dips and an exclamation mark appears, click, tap, or press Space to reel the fish in. Each fish is a link to a page on this site."
        className="block h-full w-full cursor-crosshair touch-none outline-none"
      />
    </div>
  );
}
