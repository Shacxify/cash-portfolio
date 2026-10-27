import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Copy,
  FileDown,
  FolderOpen,
  Github,
  Home,
  Layers,
  Linkedin,
  Mail,
  PartyPopper,
  User,
  Wrench,
  Youtube,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { projects } from "@/data/projects";
import { useCopyEmail } from "@/hooks/use-copy-email";
import {
  CELEBRATE_EVENT,
  COFFEE_CHAT_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  OPEN_PALETTE_EVENT,
  RESUME_URL,
  YOUTUBE_URL,
} from "@/lib/site";

const sections = [
  { label: "Top", href: "#top", Icon: Home },
  { label: "Featured Work", href: "#work", Icon: Layers },
  { label: "Toolkit", href: "#skills", Icon: Wrench },
  { label: "About & CV", href: "#cv", Icon: User },
  { label: "Contact", href: "#contact", Icon: Mail },
  { label: "All projects", href: "/projects", Icon: FolderOpen },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const copyEmail = useCopyEmail();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  // Close first, then act, so the dialog's focus restore doesn't fight the action.
  const run = (fn: () => void) => () => {
    setOpen(false);
    setTimeout(fn, 0);
  };
  const go = (href: string) => run(() => (window.location.href = href));
  const openTab = (href: string) => run(() => window.open(href, "_blank", "noopener"));
  const fire = (event: string) => run(() => window.dispatchEvent(new Event(event)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">Quick search</DialogTitle>
        <DialogDescription className="sr-only">
          Jump to a section, open a project, or get in touch.
        </DialogDescription>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item][data-selected=true]]:bg-[rgba(134,163,151,0.16)]">
          <CommandInput placeholder="Where to? Try “VNTG”, “email”, or “CV”" />
          <CommandList className="max-h-[min(420px,60vh)]">
            <CommandEmpty>Nothing here yet. Try “email” or “CV”.</CommandEmpty>

            <CommandGroup heading="Actions">
              <CommandItem onSelect={run(copyEmail)}>
                <Copy className="mr-2 h-4 w-4" /> Copy email address
              </CommandItem>
              <CommandItem onSelect={go(COFFEE_CHAT_MAILTO)} keywords={["meet", "book", "chat"]}>
                <Mail className="mr-2 h-4 w-4" /> Grab a coffee chat
              </CommandItem>
              {RESUME_URL && (
                <CommandItem onSelect={go(RESUME_URL)} keywords={["cv", "pdf"]}>
                  <FileDown className="mr-2 h-4 w-4" /> Download résumé
                </CommandItem>
              )}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Go to">
              {sections.map(({ label, href, Icon }) => (
                <CommandItem key={href} onSelect={go(href)}>
                  <Icon className="mr-2 h-4 w-4" /> {label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.map((p) => (
                <CommandItem
                  key={p.title}
                  value={`${p.title} ${p.tag}`}
                  onSelect={p.href.startsWith("http") ? openTab(p.href) : go(p.href)}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span className="truncate">{p.title}</span>
                  <span className="ml-auto pl-3 text-[11px] text-muted-foreground">{p.year}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Elsewhere">
              <CommandItem onSelect={openTab(LINKEDIN_URL)}>
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-50" />
              </CommandItem>
              <CommandItem onSelect={openTab(GITHUB_URL)}>
                <Github className="mr-2 h-4 w-4" /> GitHub
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-50" />
              </CommandItem>
              <CommandItem onSelect={openTab(YOUTUBE_URL)}>
                <Youtube className="mr-2 h-4 w-4" /> YouTube
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-50" />
              </CommandItem>
              <CommandItem onSelect={fire(CELEBRATE_EVENT)} keywords={["confetti", "party", "fun"]}>
                <PartyPopper className="mr-2 h-4 w-4" /> Celebrate
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
