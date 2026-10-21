import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNowStrict } from "date-fns";
import { GITHUB_USER } from "@/lib/site";

type Activity = {
  repo: string;
  url: string;
  message: string | null;
  pushedAt: string;
};

const CACHE_KEY = "cj:now-building";
const CACHE_TTL_MS = 10 * 60 * 1000;

function readCache(): Activity | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: Activity };
    return Date.now() - at < CACHE_TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: Activity) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // storage can be unavailable (private mode); the tile still works
  }
}

// Unauthenticated GitHub API: 60 requests/hour per visitor IP, and the tile
// spends two per session at most thanks to the cache above.
async function fetchLatest(signal: AbortSignal): Promise<Activity | null> {
  const reposRes = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&type=owner&per_page=10`,
    { signal, headers: { Accept: "application/vnd.github+json" } },
  );
  if (!reposRes.ok) return null;
  const repos = (await reposRes.json()) as {
    name: string;
    full_name: string;
    html_url: string;
    pushed_at: string;
    fork: boolean;
    private: boolean;
  }[];
  const repo = repos.find((r) => !r.fork && !r.private && r.name !== GITHUB_USER);
  if (!repo) return null;

  let message: string | null = null;
  const commitsRes = await fetch(
    `https://api.github.com/repos/${repo.full_name}/commits?per_page=1`,
    { signal, headers: { Accept: "application/vnd.github+json" } },
  );
  if (commitsRes.ok) {
    const [latest] = (await commitsRes.json()) as { commit: { message: string } }[];
    message = latest?.commit.message.split("\n")[0] ?? null;
  }
  return { repo: repo.name, url: repo.html_url, message, pushedAt: repo.pushed_at };
}

export function NowBuilding() {
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setActivity(cached);
      return;
    }
    const ctrl = new AbortController();
    fetchLatest(ctrl.signal)
      .then((data) => {
        if (!data) return;
        writeCache(data);
        setActivity(data);
      })
      .catch(() => {
        // network or rate limit: the tile simply stays hidden
      });
    return () => ctrl.abort();
  }, []);

  if (!activity) return null;

  return (
    <motion.a
      href={activity.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full px-4 py-2 text-[13px] text-foreground/80 transition-colors hover:bg-white/85"
      style={{
        border: "1px solid rgba(0,0,0,0.1)",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
      }}
      aria-label={`Now building ${activity.repo} on GitHub`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
      </span>
      <span className="shrink-0 font-medium text-foreground">Now building</span>
      <span className="shrink-0 font-mono text-[12px]">{activity.repo}</span>
      {activity.message && (
        <span className="hidden min-w-0 truncate text-foreground/60 sm:inline">
          “{activity.message}”
        </span>
      )}
      <span className="shrink-0 text-foreground/50">
        {formatDistanceToNowStrict(new Date(activity.pushedAt), { addSuffix: true })}
      </span>
    </motion.a>
  );
}
