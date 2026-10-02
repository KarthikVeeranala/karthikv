import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleUserRound,
  Code2,
  Gamepad2,
  Github,
  Instagram,
  Linkedin,
  MousePointer2,
  Mail,
  Menu,
  Moon,
  Sun,
  MoveUpRight,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Trophy,
  Twitch,
  Zap,
  X,
  Youtube,
  Volume2,
  VolumeX,
  Monitor,
  Terminal,
} from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

const ACCENT = "#16d6bd";
let arcadeAudio: AudioContext | null = null;
let footerControls: { toggleSound: () => void; toggleCabinet: () => void } | null = null;
function playArcadeTone(kind: "hover" | "click" | "transition" | "hit" | "win") {
  try {
    arcadeAudio ??= new AudioContext();
    const ctx = arcadeAudio;
    if (ctx.state === "suspended") void ctx.resume();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const frequencies = { hover: 420, click: 180, transition: 110, hit: 75, win: 720 };
    oscillator.type = kind === "hit" ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(frequencies[kind], ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "win" ? 980 : frequencies[kind] * .68, ctx.currentTime + (kind === "transition" ? .22 : .09));
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(kind === "hover" ? .018 : .045, ctx.currentTime + .008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (kind === "win" ? .35 : .12));
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + (kind === "win" ? .36 : .14));
  } catch { /* audio is an enhancement and may be unavailable */ }
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Backstory", href: "/backstory/" },
  { label: "Demo Reel", href: "/demo-reel/" },
  { label: "Hobbies", href: "/hobbies/" },
  { label: "Bio & Contact", href: "/bio/" },
  { label: "Arcade", href: "/arcade/" },
  { label: "Tech Tree", href: "/skills/" },
];

const projects = [
  { slug: "e2e-automation-suite", title: "HEADLESS E2E AUTOMATION SUITE", type: "Unreal Engine 5.7 / Systems internship", description: "A project-agnostic Unreal Engine C++ harness for headless test flows, recursive Slate/UMG discovery, physics determinism, replication checks, and GPU backbuffer streaming.", tags: ["Unreal Engine 5.7", "C++", "Win32", "FFmpeg"], tone: "signal", stat: "01 / 05", media: "https://temporary-agile-orion-yb206ij.vercel.app/portfolio_media/screenshots/e2e_plugin/00_ue5_editor_e2e_suite_workspace.png" },
  { slug: "the-interlude", title: "THE INTERLUDE", type: "1st place / CodeDay 2.0", description: "A 6-DOF zero-gravity flight simulator built in 24 hours, with predictive lead-target AI, escalating interceptors, and visceral space-combat feel.", tags: ["Unreal Engine 4", "Physics", "AI"], tone: "moon", stat: "02 / 05", media: "https://temporary-agile-orion-yb206ij.vercel.app/portfolio_media/screenshots/the_interlude/interlude_maxres_thumbnail.jpg" },
  { slug: "byteoasis", title: "BYTEOASIS: CODE TO ESCAPE", type: "2nd place / HackRush 2.0", description: "A first-person puzzle survival adventure where a stranded programmer repairs logic terminals, bypasses security grids, and executes commands across a cyber-archipelago.", tags: ["Unreal Engine", "Puzzle", "Terminals"], tone: "reset", stat: "03 / 05", media: "https://temporary-agile-orion-yb206ij.vercel.app/portfolio_media/screenshots/byte_oasis/byte_oasis_maxres_thumbnail.jpg" },
  { slug: "geek-o-wars", title: "GEEK'O'WARS", type: "Top 3 / MLH FrostHacks", description: "A third-person survival shooter set inside a laptop motherboard, where microscopic antivirus agents purge infected CPU cores and logic gates.", tags: ["Unreal Engine 4.21", "Shaders", "Combat"], tone: "ember", stat: "04 / 05", media: "https://temporary-agile-orion-yb206ij.vercel.app/portfolio_media/screenshots/geek_o_wars/01_logo_banner.jpg" },
  { slug: "city-of-aethel", title: "CITY OF AETHEL & 2D ARCADE", type: "Top 45 finalist / IGDC 2024", description: "A Phaser 3 showcase with multi-phase boss choreography, 5-hit melee combos, i-frame dodges, and eight playable web prototypes.", tags: ["Phaser 3", "Melee", "WebGL"], tone: "ember", stat: "05 / 05", media: "https://temporary-agile-orion-yb206ij.vercel.app/portfolio_media/screenshots/phaser_games/01_city_of_aethel.png" },
];

const posts = [
  { slug: "building-worlds-from-rules", category: "FIELD NOTES", date: "OCT 02, 2026", title: "Building worlds from rules that want to be broken", excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Integer a felis at justo finibus." },
  { slug: "the-pause-between-inputs", category: "DESIGN LOG", date: "SEP 18, 2026", title: "The pause between inputs is where the feeling lives", excerpt: "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean lacinia bibendum nulla sed consectetur." },
  { slug: "notes-on-quiet-ui", category: "SCREENSHOTS", date: "AUG 11, 2026", title: "Notes on quiet UI, noisy worlds, and useful friction", excerpt: "Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac consectetur ac, vestibulum at eros." },
];

function normalizePath(path: string) {
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function isActive(href: string, path: string) {
  const current = normalizePath(path);
  if (href === "/") return current === "/";
  return current === href || current.startsWith(href);
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-mark__corner brand-mark__corner--a" />
      <span className="brand-mark__corner brand-mark__corner--b" />
      <span className="brand-mark__diamond" />
    </span>
  );
}

function TopNav({ theme, onToggleTheme }: { theme: "beige" | "neon"; onToggleTheme: () => void }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [location]);
  return (
    <header className="site-nav">
      <Link href="/" className="site-nav__brand" aria-label="Pixel Guild home">
        <BrandMark />
        <span className="site-nav__name">pixel<span>guild</span></span>
      </Link>
      <nav className={`site-nav__links ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href, location) ? "is-active" : ""}`}>
            {item.label}
          </Link>
        ))}
        <Link href="/portfolio/" className={`nav-cta ${isActive("/portfolio/", location) ? "is-active" : ""}`}>Portfolio</Link>
      </nav>
      <button className="theme-toggle" onClick={onToggleTheme} aria-label={theme === "neon" ? "Switch to beige day mode" : "Switch to neon night mode"} title={theme === "neon" ? "Beige day mode" : "Neon night mode"}>{theme === "neon" ? <Sun size={13} /> : <Moon size={13} />}<span>{theme === "neon" ? "DAY" : "NIGHT"}</span></button>
      <button className="site-nav__menu" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </header>
  );
}

function SocialRail() {
  return (
    <aside className="social-rail" aria-label="Social links">
      <a href="https://github.com/karthikveeranala" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={14} /></a>
      <a href="https://www.youtube.com/channel/UCUQkvmq6x0K-aLXb2B7yg9A" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={14} /></a>
      <a href="https://www.linkedin.com/in/karthikveeranala/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={14} /></a>
      <a href="mailto:karthik.veeranala@gmail.com" aria-label="Email"><Mail size={14} /></a>
    </aside>
  );
}

function ArcadeBackground() {
  return <div className="pixel-field" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} className={`pixel-field__bit pixel-field__bit--${index % 4}`} style={{ left: `${(index * 37) % 97}%`, top: `${(index * 61) % 94}%`, animationDelay: `${(index % 9) * -0.7}s`, animationDuration: `${5 + (index % 5)}s` }} />)}</div>;
}

function PixelMascot() {
  const [position, setPosition] = useState(() => ({ x: 22, y: Math.max(120, window.innerHeight - 155) }));
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("DRAG ME");
  const mascotRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const dragOffset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  useEffect(() => { try { const saved = localStorage.getItem("pixelguild-mascot-position"); if (saved) { const parsed = JSON.parse(saved); positionRef.current = parsed; setPosition(parsed); } } catch { /* use the default spawn point */ } }, []);
  useEffect(() => { try { localStorage.setItem("pixelguild-mascot-position", JSON.stringify(position)); } catch { /* optional persistence */ } }, [position]);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      moved.current = true;
      const next = { x: Math.max(8, Math.min(window.innerWidth - 74, event.clientX - dragOffset.current.x)), y: Math.max(64, Math.min(window.innerHeight - 76, event.clientY - dragOffset.current.y)) };
      positionRef.current = next;
      if (mascotRef.current) mascotRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
    };
    const up = () => { if (!dragging) return; setDragging(false); setPosition(positionRef.current); };
    window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerup", up, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [dragging]);
  return <div ref={mascotRef} className={`pixel-mascot ${dragging ? "is-dragging" : ""}`} style={{ left: 0, top: 0, transform: `translate3d(${position.x}px, ${position.y}px, 0)` }} onPointerDown={(event) => { event.preventDefault(); const rect = event.currentTarget.getBoundingClientRect(); dragOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }; moved.current = false; setDragging(true); }} onClick={() => { if (!moved.current) setMessage((current) => current === "DRAG ME" ? "HI PLAYER!" : "DRAG ME"); }} role="button" tabIndex={0} aria-label="Draggable Pixel Guild mascot" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setMessage("READY!"); }}><span className="pixel-mascot__bubble">{message}</span><span className="pixel-mascot__sprite" aria-hidden="true"><i /><i /><i /><b /><b /><em /></span><span className="pixel-mascot__tag">PG-01</span></div>;
}

function CursorFX() {
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointer = useRef({ x: -100, y: -100 });
  const frame = useRef(0);
  useEffect(() => {
    const move = (event: PointerEvent) => { pointer.current = { x: event.clientX, y: event.clientY }; if (!frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; trailRefs.current.forEach((node, index) => { if (node) node.style.transform = `translate3d(${pointer.current.x + index * 3}px, ${pointer.current.y + index * 3}px, 0) scale(${1 - index * .08})`; }); }); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); if (frame.current) cancelAnimationFrame(frame.current); };
  }, []);
  return <div className="cursor-fx" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <span key={index} ref={(node) => { trailRefs.current[index] = node; }} style={{ opacity: Math.max(0, .75 - index * .1) }} />)}</div>;
}

function CheatTerminal({ open, unlocked, onClose, onToggleCabinet, onDeveloper }: { open: boolean; unlocked: boolean; onClose: () => void; onToggleCabinet: () => void; onDeveloper: () => void }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>(["PIXEL GUILD DEV CONSOLE v1.0", "Type HELP for commands."]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;
    const responses: Record<string, string> = { help: "COMMANDS: DEV / CABINET / BOSS / PIXEL / CLEAR", dev: "DEVELOPER MODE ONLINE — hidden grid diagnostics enabled.", cabinet: "CRT CABINET TOGGLE SENT.", boss: "BOSS ARENA READY — open /arcade/.", pixel: "PIXEL TRAIL AMPLIFIED — cursor particles unlocked.", clear: "" };
    if (command === "cabinet") onToggleCabinet();
    if (command === "dev" || command === "pixel") onDeveloper();
    setLines((current) => command === "clear" ? [] : [...current, `> ${command}`, responses[command] ?? "UNKNOWN COMMAND — TRY HELP"]);
    setInput("");
  };
  if (!open) return null;
  return <div className="cheat-terminal__backdrop" role="dialog" aria-modal="true" aria-label="Developer cheat terminal"><div className="cheat-terminal"><div className="cheat-terminal__bar"><span><Terminal size={13} /> KONAMI // DEV UNLOCK</span><button onClick={onClose} aria-label="Close terminal">×</button></div><div className="cheat-terminal__body"><div className="cheat-terminal__unlock">{unlocked ? "▲ ▲ ▼ ▼ ◀ ▶ ◀ ▶ B A / ACCEPTED" : "ENTER THE CODE"}</div>{lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}<form onSubmit={submit}><span>&gt;</span><input autoFocus value={input} onChange={(event) => setInput(event.target.value)} placeholder="type a command" aria-label="Developer terminal command" /></form></div></div></div>;
}

function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [theme, setTheme] = useState<"beige" | "neon">(() => {
    try { return localStorage.getItem("pixelguild-theme") === "neon" ? "neon" : "beige"; } catch { return "beige"; }
  });
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem("pixelguild-sound") !== "off"; } catch { return true; }
  });
  const [cabinet, setCabinet] = useState(() => { try { return localStorage.getItem("pixelguild-cabinet") === "on"; } catch { return false; } });
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const cheatIndex = useRef(0);
  useEffect(() => {
    try { localStorage.setItem("pixelguild-theme", theme); } catch { /* optional persistence */ }
  }, [theme]);
  useEffect(() => { footerControls = { toggleSound: () => setSoundOn((current) => !current), toggleCabinet: () => setCabinet((current) => !current) }; return () => { footerControls = null; }; }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (soundOn) playArcadeTone("transition");
  }, [location]);
  useEffect(() => {
    try { localStorage.setItem("pixelguild-cabinet", cabinet ? "on" : "off"); } catch { /* optional persistence */ }
  }, [cabinet]);
  useEffect(() => {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setTerminalOpen(false); return; }
      if (event.key.toLowerCase() === code[cheatIndex.current].toLowerCase()) cheatIndex.current += 1;
      else cheatIndex.current = event.key === code[0] ? 1 : 0;
      if (cheatIndex.current === code.length) { cheatIndex.current = 0; setTerminalOpen(true); setDeveloperMode(true); playArcadeTone("win"); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("pixelguild-sound", soundOn ? "on" : "off"); } catch { /* optional persistence */ }
    let lastHover = 0;
    const over = (event: PointerEvent) => { const now = performance.now(); if (soundOn && now - lastHover > 90 && (event.target as HTMLElement).closest("a,button")) { lastHover = now; playArcadeTone("hover"); } };
    const click = (event: MouseEvent) => { if (soundOn && (event.target as HTMLElement).closest("a,button")) playArcadeTone("click"); };
    window.addEventListener("pointerover", over); window.addEventListener("click", click);
    return () => { window.removeEventListener("pointerover", over); window.removeEventListener("click", click); };
  }, [soundOn]);
  return (
    <div className={`site-shell ${theme === "neon" ? "theme-neon" : ""} ${cabinet ? "cabinet-mode" : ""} ${developerMode ? "developer-mode" : ""}`}> 
      <div className="noise" aria-hidden="true" />
      <ArcadeBackground />
      <TopNav theme={theme} onToggleTheme={() => setTheme((current) => current === "neon" ? "beige" : "neon")} />
      <PixelMascot />
      {children}
      <SocialRail />
      <CursorFX />
      <CheatTerminal open={terminalOpen} unlocked={developerMode} onClose={() => setTerminalOpen(false)} onToggleCabinet={() => setCabinet((current) => !current)} onDeveloper={() => setDeveloperMode(true)} />
    </div>
  );
}

function Eyebrow({ children, number }: { children: React.ReactNode; number?: string }) {
  return <div className="eyebrow"><span className="eyebrow__line" /><span>{number ? `${number} / ` : ""}{children}</span></div>;
}

function SectionHeading({ kicker, title, copy, align = "left" }: { kicker: string; title: string; copy?: string; align?: "left" | "right" }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <Eyebrow>{kicker}</Eyebrow>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function StatusPill({ children = "AVAILABLE FOR COLLABORATION" }: { children?: React.ReactNode }) {
  return <span className="status-pill"><span className="status-pill__dot" />{children}</span>;
}

function HeroVideo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`hero-video ${compact ? "hero-video--compact" : ""}`}>
      <video autoPlay muted loop playsInline preload="metadata" aria-label="Atmospheric dark fantasy dungeon reel">
        <source src="/dungeon-reel.mp4" type="video/mp4" />
      </video>
      <div className="hero-video__fallback" aria-hidden="true">
        <div className="dungeon-arch"><span /><span /><span /></div>
      </div>
      <div className="hero-video__veil" />
      <div className="hero-video__hud"><span>REEL_06</span><span>00:06 / 00:06</span></div>
      <div className="hero-video__caption"><span>THE UNDERGROUNDS</span><span>Dark-fantasy systems reel / Karthik Veeranala</span></div>
    </div>
  );
}

function ProjectVisual({ tone, label, media }: { tone: string; label: string; media?: string }) {
  return (
    <div className={`project-visual project-visual--${tone}`}>
      {media && <img src={media} alt={label} loading="lazy" />}
      <div className="project-visual__pixel-corners" aria-hidden="true"><i /><i /><i /><i /></div>
      <span className="project-visual__label">{label}</span>
    </div>
  );
}

function ProjectCard({ project, index, onContributions }: { project: typeof projects[number]; index: number; onContributions?: (project: typeof projects[number]) => void }) {
  return <article className={`project-card project-card--${index % 2 === 0 ? "left" : "right"}`}><div className="project-card__number"><strong>{String(index + 1).padStart(2, "0")}</strong><span>/ {String(projects.length).padStart(2, "0")}</span></div><div className="project-card__content"><Link href={`/portfolio/${project.slug}/`} className="project-card__link"><ProjectVisual tone={project.tone} label={project.stat} media={project.media} /><div className="project-card__body"><div><span className="project-card__type">{project.type}</span><h3>{project.title}</h3></div><ArrowUpRight className="project-card__arrow" size={18} /><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></Link>{onContributions && <button className="project-card__contrib" onClick={() => onContributions(project)}>My contributions <ArrowRight size={13} /></button>}</div></article>;
}

const contributionDetails: Record<string, { role: string; systems: string[]; snippet: string; metrics: string[] }> = {
  "e2e-automation-suite": { role: "Unreal Engine Systems & Automation Engineer at Cyrus 365 (2026 — Present)", systems: ["Win32 Desktop Sandboxing: Instantiates winsta0\\E2E_IsolatedDesktop, injecting hardware mouse/keyboard events without stealing OS cursor focus or user interruption.", "Slate & UMG Auto-Discovery: Recursively navigates runtime Slate widget trees via reflection, synthesizing click/drag events and validating UI state changes dynamically.", "GPU Backbuffer Video Streaming: Pipes raw frames directly from FViewport::ReadPixels to bundled FFmpeg via standard input (stdin), encoding 1080p H.264 recordings with automated pass/fail incident markers.", "Headless Multi-Instance CI Commandlet: Orchestrates dedicated server runs with 90-second deterministic state guards, validating networked replication and physics determinism in CI/CD pipelines."], snippet: `// Hardware Sandboxing & Backbuffer Stream\nvoid FE2ESandbox::InitializeIsolatedDesktop() {\n  HDESK hDesk = CreateDesktopA("E2E_Desk", ...);\n  SetThreadDesktop(hDesk);\n\n  // Stream backbuffer pixels directly to FFmpeg stdin\n  FViewport* Viewport = GEngine->GameViewport->Viewport;\n  PipeBackbufferToFFmpeg(Viewport, "H264_Artifact.mp4");\n}\n\n// Status: 100% Authoritative Sync Passed\nUE_LOG(LogE2E, Display, TEXT("All Test Suites Validated!"));`, metrics: ["0% (Zero Theft) / Focus Theft", "1080p H.264 Stream / Resolution", "Unreal Engine 5.7 / Engine Version", "100% Authoritative / Sync Determinism"] },
  "the-interlude": { role: "Solo Lead Gameplay & Systems Developer (24-Hour Competitive Sprint)", systems: ["6-DOF Zero-Gravity Physics: Responsive thruster inertia, pitch/yaw/roll torque dampening, and velocity vector alignment in zero gravity.", "Predictive Lead-Target AI: State-machine enemy AI calculating velocity vectors, lead-intercept angles, and evasive rolls.", "Visceral Combat Feedback: Procedural camera shake, laser collision particle trails via Niagara, and spatial 3D audio.", "Escalating Wave Director: Dynamic difficulty balancing managing enemy squad spawns and capital cruiser encounters."], snippet: `// Predictive Lead-Target Intercept Math\nFVector USpaceCombatComponent::CalculateLeadTarget(\n    const AActor* Target, float ProjectileSpeed, float DeltaTime) {\n  if (!Target) return FVector::ZeroVector;\n\n  FVector TargetVelocity = Target->GetVelocity();\n  float Distance = FVector::Dist(GetOwner()->GetActorLocation(), Target->GetActorLocation());\n  float TimeToImpact = Distance / FMath::Max(ProjectileSpeed, 100.0f);\n\n  // Lead compensation position vector\n  return Target->GetActorLocation() + (TargetVelocity * TimeToImpact);\n}`, metrics: ["🥇 1st Place Overall / Honor", "24-Hour Hackathon / Dev Cycle", "Unreal Engine 4 / Engine", "6-DOF Newtonian / Physics Model"] },
  byteoasis: { role: "Lead Systems Developer & Mechanics Designer (48-Hour Hackathon)", systems: ["In-Game Terminal Simulator: Custom syntax parser supporting commandline input, flag validation, and state triggers.", "Environmental Logic Mechanics: Water reflection shaders, day/night lighting cycles, and puzzle-triggered island drawbridges.", "Diegetic HUD & Interaction: Integrated tablet UI displaying logic logs, signal frequency decoders, and circuit status.", "Procedural Island Clues: Dynamic clue generation requiring algorithmic thinking and logic gates to bypass security barriers."], snippet: `// In-Game Terminal Command Dispatcher\nbool UTerminalParser::ExecuteCommand(const FString& InputCmd) {\n  TArray<FString> Tokens;\n  InputCmd.TrimStartAndEnd().ParseIntoArray(Tokens, TEXT(" "), true);\n  if (Tokens.Num() == 0) return false;\n\n  if (Tokens[0].Equals(TEXT("bypass_grid"), ESearchCase::IgnoreCase)) {\n    if (Tokens.Contains(TEXT("--force"))) {\n      UnlockSecurityGate();\n      return true;\n    }\n  }\n  return false;\n}`, metrics: ["🥈 2nd Place Overall / Honor", "48-Hour Hackathon / Dev Cycle", "Unreal Engine 4 / Engine", "Logic & Code Terminals / Puzzles"] },
  "geek-o-wars": { role: "Lead Gameplay Engineer & Shaders Developer (36-Hour Hackathon)", systems: ["TPS Character Controller: Responsive sprint, aim-down-sights, weapon overheating math, and projectile recoil dissipation.", "Cyber Motherboard Environment: Custom neon cyber shaders, reactive trace circuits, and emissive pulse heat sinks.", "Multi-Class Malware Spawner: Fast melee rushers, ranged trojan spreaders, and heavy boss anomalies with coordinated flanking.", "Wave Survival Resource Tension: Ammo scarcity drops, overheating cooldown balancing, and dynamic score multipliers."], snippet: `// Weapon Heat Dissipation & Firing Logic\nvoid AGeekWeapon::FireProjectile() {\n  if (CurrentHeat >= MaxHeatLimit) {\n    TriggerOverheatCooldown();\n    return;\n  }\n\n  SpawnLaserTrace(MuzzleSocket->GetComponentLocation(), AimRotation);\n  CurrentHeat = FMath::Clamp(CurrentHeat + HeatPerShot, 0.0f, MaxHeatLimit);\n  LastFireTimestamp = GetWorld()->GetTimeSeconds();\n}`, metrics: ["🥉 Top 3 Overall (MLH) / Honor", "36-Hour Hackathon / Dev Cycle", "Unreal Engine 4.21 / Engine", "Third-Person Survival / Genre"] },
  "city-of-aethel": { role: "Lead Combat Designer & Gameplay Engineer at Aicade", systems: ["Responsive Melee Combat: 5-hit combo attack buffering, animation cancel windows, and precision parry timings.", "Dodge-Roll Invulnerability Frames: Precision i-frame calculation mitigating damage vectors within 180ms reaction windows.", "Multi-Phase Boss Fight Choreography: Telegraphed ground hazard indicators, multi-stage attack phase transitions, and posture breaks.", "2D Web Arcade Engine: 14 interactive prototypes testing rigid body ragdolls, ballistic parabolic curves, and wave tension."], snippet: `// Melee Attack Combo Buffer & i-Frame Window\nfunction handleAttackInput(player) {\n  if (player.canCancel && player.comboCount < 5) {\n    player.comboCount++;\n    player.playAnimation('attack_chain_' + player.comboCount);\n    player.grantInvulnerability(180); // 180ms i-frame\n    player.resetComboTimer(600);\n  }\n}`, metrics: ["🎖️ Top 45 IGDC Finalist / Honor", "14 Web Prototypes / Prototypes", "Phaser 3 / WebGL / Engine", "5-Hit Combos + i-Frames / Combat Feel"] },
};

function ContributionDrawer({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const detail = contributionDetails[project.slug] ?? contributionDetails["e2e-automation-suite"];
  return <div className="contribution-drawer__backdrop" role="dialog" aria-modal="true" aria-label={`${project.title} contributions`} onClick={onClose}><aside className="contribution-drawer" onClick={(event) => event.stopPropagation()}><button className="contribution-drawer__close" onClick={onClose} aria-label="Close contributions">×</button><Eyebrow>My contributions / {project.stat}</Eyebrow><h2>{project.title}</h2><div className="contribution-drawer__block"><Eyebrow>Role & scope</Eyebrow><strong>{detail.role}</strong></div><div className="contribution-drawer__block"><Eyebrow>Core systems architected</Eyebrow><ul className="contribution-list">{detail.systems.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="contribution-drawer__block"><Eyebrow>Implementation snippet (C++)</Eyebrow><pre className="contribution-code"><code>{detail.snippet}</code></pre></div><div className="contribution-drawer__block"><Eyebrow>Verification & performance highlights</Eyebrow><div className="contribution-metrics">{detail.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div></div><div className="contribution-drawer__code"><span>CONTRIBUTION_LOG // OPEN</span><code>systems.register("{project.slug}");</code><code>playability.signal = "clear";</code></div></aside></div>;
}

function ProjectWindow({ project, onClose, onContributions }: { project: typeof projects[number]; onClose: () => void; onContributions: () => void }) {
  return <div className="project-window__backdrop" role="dialog" aria-modal="true" aria-label={`${project.title} project window`} onClick={onClose}><article className="project-window" onClick={(event) => event.stopPropagation()}><button className="project-window__close" onClick={onClose} aria-label="Close project window">×</button><div className="project-window__media"><ProjectVisual tone={project.tone} label={project.stat} media={project.media} /><video src="/dungeon-reel.mp4" autoPlay muted loop playsInline /></div><Eyebrow>Project dossier / {project.type}</Eyebrow><h2>{project.title}</h2><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-window__actions"><button className="button" onClick={onContributions}>My contributions <ArrowRight size={13} /></button><Link href={`/portfolio/${project.slug}/`} className="text-link">Open full case study <ArrowUpRight size={14} /></Link></div></article></div>;
}


function BackstorySection() {
  return <section className="backstory-section page-pad" id="backstory"><div className="backstory-section__intro"><Eyebrow number="01">The backstory</Eyebrow><h2>My story is<br /><span>built under pressure.</span></h2><p>I am a game developer and engine systems programmer focused on low-level graphics, deterministic simulation, and real-time interaction. I am currently pursuing a B.Tech in Computer Science and Engineering at IARE Hyderabad (2023–2027), with a deep focus on graphics, systems programming, and algorithms.</p><Link href="/backstory/" className="text-link">Read the full backstory <ArrowUpRight size={14} /></Link></div><div className="backstory-section__facts"><div><strong>4+</strong><span>Hackathon victories</span></div><div><strong>14+</strong><span>Playable prototypes</span></div><div><strong>200+</strong><span>Student developers in Elysium Gaming Club</span></div><div><strong>UE 5.7</strong><span>Automation core</span></div></div></section>;
}

function BackstoryPage() {
  const milestones = [
    ["2026 — PRESENT", "Unreal Engine Systems Intern / Cyrus 365", "Architected an End-to-End Automation & Headless Verification harness in UE 5.7 C++, with Win32 isolated desktops, recursive Slate/UMG discovery, and direct backbuffer FFmpeg streaming."],
    ["2024 — 2025", "Game Developer & Systems Prototyper / Aicade", "Engineered 14 playable 2D prototypes testing combat feel, rigid-body ragdolls, and boss encounter choreography, including the IGDC finalist City of Aethel."],
    ["2024 — 2025", "President & Game Jam Organizer / Elysium Gaming Club — IARE", "Directing campus game development workshops, student hackathons, and collegiate esports tournaments for 200+ active student developers."],
    ["2022 — 2024", "Lead Systems & Gameplay Engineer / MLH & CodeDay", "Won 1st Place Overall at CodeDay 2.0 with The Interlude, 2nd at HackRush with ByteOasis, and Top 3 at FrostHacks with Geek'O'Wars."],
  ];
  return <main className="inner-page backstory-page"><PageHeader number="01" kicker="Biography / the backstory" title={<>Ruthless execution.<br /><span>Playable results.</span></>} copy="The long route from systems programming and competitive game jams to engine architecture, community leadership, and high-velocity prototypes." /><section className="backstory-story page-pad"><div><Eyebrow>My story</Eyebrow><p className="lead">My engineering philosophy centers on ruthless execution under constraints. Over the past three years I have spearheaded teams in 24–48 hour competitive hackathons, turning ambitious mechanics into shippable, playable loops.</p><p>As President of the Elysium Gaming Club at IARE, I oversee campus game development initiatives, Unreal and Unity workshops, and collegiate esports tournaments for a community of more than 200 active students.</p></div><div className="backstory-identity"><span>KV</span><strong>Karthik Veeranala</strong><small>Hyderabad, India / B.Tech CSE</small></div></section><section className="timeline page-pad"><div className="section-topline"><Eyebrow>Career trajectory</Eyebrow><span className="muted-label">EXPERIENCE & MILESTONE PATH</span></div>{milestones.map(([date, title, copy]) => <article className="timeline-row" key={title}><span>{date}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</section><section className="skills-strip page-pad"><Eyebrow>Proficiency & tools</Eyebrow><h2>Experience with engines<br /><span>& systems.</span></h2><div className="skills-strip__grid"><div><strong>95%</strong><h3>Unreal Engine 5.7 / 4</h3><p>Engine source builds, C++ core architecture, Slate/UMG UI auto-discovery, Win32 subsystems, Niagara particles, and dedicated servers.</p></div><div><strong>95%</strong><h3>C++ Systems & Low-Level</h3><p>Memory management, multi-threading, desktop sandboxing, backbuffer pixel streaming to FFmpeg, and state machines.</p></div><div><strong>85%</strong><h3>Phaser 2D Web Engine</h3><p>WebGL Canvas rendering, projectile trajectory prediction, ragdoll impulse integration, and web deployment pipelines.</p></div></div></section><Footer /></main>;
}

function Home() {
  return (
    <main>
      <section className="home-hero page-pad" id="home">
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="hero-identity">
          <Eyebrow number="00">Unreal Engine systems & gameplay architecture</Eyebrow>
          <h1>KARTHIK<br /><span>VEERANALA</span></h1>
          <div className="hero-identity__sub"><span>Game</span><b>Developer</b><em>—</em><small>systems / prototyping / play</small></div>
        </div>
        <div className="hero-side-note"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={16} /></div>
        <div className="hero-bottomline"><StatusPill>OPEN TO SYSTEMS & GAMEPLAY ROLES</StatusPill><span>HYDERABAD, INDIA / UTC+05:30</span></div>
      </section>

      <BackstorySection />

      <section className="intro-chapter page-pad page-pad--chapter">
        <div className="chapter-index">01</div>
        <div className="intro-chapter__content">
          <Eyebrow>THE PLAYGROUND</Eyebrow>
          <h2>Systems are<br /><span>feelings</span> waiting<br />to be played.</h2>
          <p>Game developer and engine programmer with a strong focus on Unreal Engine C++ architecture, headless automation frameworks, and high-velocity gameplay prototyping.</p>
          <Link href="/portfolio/" className="text-link">Explore the systems portfolio <ArrowUpRight size={14} /></Link>
        </div>
        <div className="intro-chapter__sigil" aria-hidden="true"><span>▦</span><small>KV / 001</small></div>
      </section>

      <section className="featured-section page-pad">
        <div className="section-topline"><Eyebrow number="02">Featured work</Eyebrow><Link href="/portfolio/" className="text-link">Open portfolio <ArrowUpRight size={14} /></Link></div>
        <div className="featured-grid">{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      </section>

      <section className="reel-band page-pad">
        <div className="reel-band__copy"><Eyebrow number="03">Demo reel</Eyebrow><h2>A door,<br /><span>left open.</span></h2><p>A 06-second atmosphere study made to test the temperature of a world before a single quest begins.</p><Link href="/demo-reel/" className="button button--outline">Watch the reel <Play size={13} fill="currentColor" /></Link></div>
        <HeroVideo />
      </section>

      <section className="manifesto page-pad">
        <div className="manifesto__rail"><span>MORE THAN A PORTFOLIO</span><span>SCROLL / 04</span></div>
        <div className="manifesto__content"><p>Every system hides a story. Every prototype is a question made playable.</p><div className="manifesto__mark"><BrandMark /><span>KV / 2026</span></div></div>
      </section>

      <CoinCatcher />
      <Footer />
    </main>
  );
}


function CoinCatcher() {
  const [score, setScore] = useState(0);
  const [coin, setCoin] = useState({ left: 64, top: 34 });
  const collect = () => {
    setScore((value) => value + 1);
    setCoin({ left: 16 + Math.random() * 68, top: 18 + Math.random() * 62 });
  };
  return <section className="coin-catcher page-pad"><div className="coin-catcher__copy"><Eyebrow number="04">Easter egg / coin hunt</Eyebrow><h2>Catch the<br /><span>glitch coin.</span></h2><p>Tap the coin before it jumps. A tiny reward for exploring the page.</p><strong>SCORE {String(score).padStart(2, "0")}</strong></div><div className="coin-catcher__screen"><span className="coin-catcher__scanline" /><button className="glitch-coin" style={{ left: `${coin.left}%`, top: `${coin.top}%` }} onClick={collect} aria-label="Collect glitch coin">✦</button><span className="coin-catcher__hint">CLICK THE STAR / +10 XP</span></div></section>;
}

function ArcadePage() {
  const cards = useMemo(() => ["★", "★", "◆", "◆", "●", "●", "✦", "✦", "☾", "☾", "▣", "▣"].sort(() => Math.random() - 0.5), []);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  useEffect(() => {
    if (flipped.length !== 2) return;
    setMoves((value) => value + 1);
    const timeout = window.setTimeout(() => {
      if (cards[flipped[0]] === cards[flipped[1]]) setMatched((value) => [...value, ...flipped]);
      setFlipped([]);
    }, 560);
    return () => window.clearTimeout(timeout);
  }, [flipped, cards]);
  const reset = () => { setFlipped([]); setMatched([]); setMoves(0); };
  return <main className="inner-page arcade-page"><PageHeader number="08" kicker="Arcade / secret room" title={<>Press start.<br /><span>Play a round.</span></>} copy="A tiny memory match hidden inside the portfolio. Find every pair, beat the clock, and unlock the cabinet glow." /><section className="arcade-cabinet page-pad"><div className="arcade-cabinet__top"><span><Gamepad2 size={15} /> PLAYER 01</span><span><Trophy size={14} /> MATCH {matched.length / 2} / 6</span><span>MOVES {moves}</span></div><div className="memory-grid">{cards.map((symbol, index) => <button key={index} className={`memory-card ${flipped.includes(index) || matched.includes(index) ? "is-face-up" : ""} ${matched.includes(index) ? "is-matched" : ""}`} onClick={() => { if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) setFlipped((value) => [...value, index]); }} aria-label={`Memory card ${index + 1}`}>{flipped.includes(index) || matched.includes(index) ? symbol : "?"}</button>)}</div><div className="arcade-cabinet__bottom"><span>{matched.length === cards.length ? "PERFECT RUN! CABINET CLEARED." : "FIND THE PAIRS / NO CHEATING"}</span><button className="button button--tiny" onClick={reset}><RefreshCw size={12} /> Reset</button></div></section><BossFight /><div className="arcade-tips page-pad"><div><Zap size={17} /><p>Click the Pixel Guild mascot to change its mood. Drag it anywhere and it remembers the spot.</p></div><div><MousePointer2 size={17} /><p>Every card, project visual, and video panel has a little hover state waiting for you.</p></div></div><Footer /></main>;
}

function BossFight() {
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("BOSS SIGNAL DETECTED");
  const [highScores, setHighScores] = useState([3200, 2450, 1800]);
  const strike = () => {
    if (bossHp <= 0 || playerHp <= 0) return;
    const damage = 9 + Math.floor(Math.random() * 13);
    const retaliation = 4 + Math.floor(Math.random() * 10);
    const nextBoss = Math.max(0, bossHp - damage);
    const nextPlayer = Math.max(0, playerHp - retaliation);
    setBossHp(nextBoss); setPlayerHp(nextPlayer); setScore((value) => value + damage * 10);
    if (nextBoss === 0) { setMessage("BOSS CLEARED / NEW HIGH SCORE"); playArcadeTone("win"); setHighScores((scores) => [...scores, score + damage * 10].sort((a, b) => b - a).slice(0, 3)); }
    else if (nextPlayer === 0) { setMessage("PLAYER DOWN / INSERT COIN"); playArcadeTone("hit"); }
    else { setMessage(`DIRECT HIT -${damage} / RETALIATION -${retaliation}`); playArcadeTone("hit"); }
  };
  const reset = () => { setBossHp(100); setPlayerHp(100); setScore(0); setMessage("BOSS SIGNAL DETECTED"); };
  return <section className="boss-arena page-pad"><div className="boss-arena__copy"><Eyebrow number="09">Boss fight / score attack</Eyebrow><h2>Break the<br /><span>logic beast.</span></h2><p>Strike the systems boss before it overloads your player core. Every run is scored locally in this browser.</p><div className="boss-arena__stats"><span>PLAYER <b>{playerHp}%</b></span><span>BOSS <b>{bossHp}%</b></span><span>SCORE <b>{String(score).padStart(4, "0")}</b></span></div></div><div className="boss-arena__cabinet"><div className="boss-arena__screen"><div className="boss-sprite" aria-hidden="true"><i /><i /><i /><b /><b /><em /></div><span className="boss-arena__status">{message}</span><div className="health-bar"><i style={{ width: `${bossHp}%` }} /></div></div><div className="boss-arena__controls"><button className="button" onClick={strike} disabled={bossHp === 0 || playerHp === 0}>Strike <Zap size={14} /></button><button className="button button--tiny" onClick={reset}>Reset <RefreshCw size={12} /></button></div></div><div className="scoreboard"><Eyebrow>Local leaderboard</Eyebrow>{highScores.map((highScore, index) => <div key={`${highScore}-${index}`}><span>0{index + 1}</span><strong>{String(highScore).padStart(4, "0")}</strong><small>{index === 0 ? "SYSTEM BREAKER" : index === 1 ? "FAST PROTOTYPER" : "PLAYER 01"}</small></div>)}</div></section>;
}

function PageHeader({ number, kicker, title, copy }: { number: string; kicker: string; title: React.ReactNode; copy: string }) {
  return <section className="page-header page-pad"><div className="page-header__main"><Eyebrow number={number}>{kicker}</Eyebrow><h1>{title}</h1><p>{copy}</p></div><div className="page-header__index" aria-hidden="true"><span>{number}</span><i /><i /><i /><small>SCROLL / PLAY</small></div></section>;
}

function DemoReelPage() {
  const [playing, setPlaying] = useState(false);
  return <main className="inner-page"><PageHeader number="01" kicker="Demo reel" title={<>Rooms with a<br /><span>pulse.</span></>} copy="A compact atmosphere reel for systems, interaction, and the tiny transitions between one playable idea and the next." /><section className="reel-page__player page-pad"><div className="reel-player"><HeroVideo compact /><button className="reel-player__play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause reel" : "Play reel"}>{playing ? "Ⅱ" : <Play size={22} fill="currentColor" />}</button><div className="reel-player__bar"><span className="reel-player__progress" style={{ width: playing ? "42%" : "12%" }} /><span className="reel-player__time">00:00:06</span></div></div><div className="reel-page__meta"><div><Eyebrow>Credits</Eyebrow><p>Direction / Karthik Veeranala<br />Sound / Silent cut<br />Engine / Unreal / Unity studies</p></div><div><Eyebrow>Chapters</Eyebrow><p>00:00 — The descent<br />00:02 — A signal wakes<br />00:05 — The threshold</p></div></div></section><section className="chapter-list page-pad"><div className="section-topline"><Eyebrow number="02">Selected chapters</Eyebrow><span className="muted-label">CLICK TO JUMP / SOURCE REEL</span></div>{["The descent", "Glyph language", "A room remembers"].map((item, index) => <button key={item} className="chapter-row"><span>0{index + 1}</span><strong>{item}</strong><small>{index === 0 ? "00:00" : index === 1 ? "00:02" : "00:05"}</small><ArrowRight size={15} /></button>)}</section><Footer /></main>;
}

function MarketplacePage() {
  const items = ["Modular dungeon kit", "UI glyph pack", "Ambient loop studies", "Quest log template", "Pixel shader notes", "Field recording bundle"];
  return <main className="inner-page"><PageHeader number="02" kicker="Marketplace" title={<>Tools for<br /><span>other worlds.</span></>} copy="Placeholder resources for teams, solo builders, and anyone who likes their prototypes with a little atmosphere." /><section className="marketplace-grid page-pad">{items.map((item, index) => <article className="market-card" key={item}><div className={`market-card__art market-card__art--${index % 4}`}><span>{String(index + 1).padStart(2, "0")}</span><Sparkles size={18} /></div><div className="market-card__body"><span className="market-card__category">{index % 2 ? "TEMPLATE / DIGITAL" : "ASSET / DIGITAL"}</span><h2>{item}</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder pack description.</p><div className="market-card__footer"><strong>€—.—</strong><button className="button button--tiny">View item <ArrowUpRight size={12} /></button></div></div></article>)}</section><section className="callout-strip page-pad"><span>NEED A DIFFERENT LOADOUT?</span><Link href="/bio/" className="text-link">Start a conversation <ArrowUpRight size={14} /></Link></section><Footer /></main>;
}

function BlogPage() {
  return <main className="inner-page"><PageHeader number="03" kicker="Blog" title={<>Notes from<br /><span>the workbench.</span></>} copy="Field notes, design fragments, and placeholder thoughts on building worlds that feel good to inhabit." /><section className="blog-list page-pad">{posts.map((post, index) => <Link href={`/blog/${post.slug}/`} key={post.slug} className="blog-row"><div className="blog-row__number">0{index + 1}</div><div className="blog-row__content"><div className="blog-row__meta"><span>{post.category}</span><span>{post.date}</span></div><h2>{post.title}</h2><p>{post.excerpt}</p></div><ArrowUpRight className="blog-row__arrow" size={18} /></Link>)}</section><Footer /></main>;
}

function ArticlePage({ slug }: { slug: string }) {
  const post = posts.find((item) => item.slug === slug) ?? posts[0];
  return <main className="inner-page article-page"><PageHeader number="03 / ARTICLE" kicker={post.category} title={<>{post.title}</>} copy={`${post.date} / 7 min placeholder read`} /><article className="article-body page-pad"><div className="article-body__hero"><ProjectVisual tone="moon" label="FIELD NOTE / 001" /></div><div className="article-body__copy"><p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p><p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue.</p><h2>The useful edge of friction</h2><p>Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Etiam porta sem malesuada magna mollis euismod.</p><blockquote>“A good interface tells you where to look without telling you what to feel.”</blockquote><p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p><div className="article-body__footer"><Link href="/blog/" className="text-link"><ArrowLeft size={14} /> Back to notes</Link><span>END OF TRANSMISSION</span></div></div></article><Footer /></main>;
}

function HobbiesPage() {
  const hobbies = [
    { title: "Games", label: "COMMUNITY & COMPETITION", copy: "Founding and leading the Elysium Gaming Club at IARE, organizing collegiate LAN tournaments, casting competitive brackets, and analyzing mechanical balance in Valorant, Apex Legends, and CS2.", art: "games", note: "PLAY / LEAD / COMPETE" },
    { title: "Reading", label: "SYSTEMS & IDEAS", copy: "Digging through engine documentation, graphics papers, design postmortems, and the small technical notes that turn an interesting mechanic into a reliable system.", art: "reading", note: "STUDY / CONNECT / QUESTION" },
    { title: "Athletics", label: "RHYTHM & DISCIPLINE", copy: "Fast competitive play, tournament pressure, and regular movement keep the feedback loop sharp: react, reset, read the field, and commit to the next move.", art: "athletics", note: "MOVE / RESET / REPEAT" },
    { title: "Creative", label: "VISUAL COMPOSITION", copy: "Exploring lighting moods, atmospheric volumetric fog, and camera composition studies inside Unreal Engine 5’s Lumen pipeline, alongside custom rigs, cooling loops, and macro pads.", art: "creative", note: "LOOK / LISTEN / MAKE" },
  ];
  const [active, setActive] = useState<string | null>(null);
  return <main className="inner-page hobbies-page"><PageHeader number="04" kicker="Creative pursuits / source notes" title={<>The things that<br /><span>keep me sharp.</span></>} copy="Competitive gameplay, systems research, physical rhythm, and visual experimentation all feed the way I build playable worlds." /><section className="hobby-field page-pad"><div className="hobby-field__topline"><Eyebrow>4 signals found</Eyebrow><span>HOVER OR SELECT A CARD</span></div><div className="hobby-field__canvas">{hobbies.map((hobby, index) => <button key={hobby.title} className={`hobby-card hobby-card--${hobby.art} ${active === hobby.title ? "is-active" : ""}`} onClick={() => setActive(active === hobby.title ? null : hobby.title)}><span className="hobby-card__index">0{index + 1}</span><span className={`hobby-card__art hobby-card__art--${hobby.art}`} aria-hidden="true"><i /><i /><i /><b /></span><span className="hobby-card__body"><small>{hobby.label}</small><strong>{hobby.title}</strong><em>{hobby.note}</em></span><span className="hobby-card__window"><b>{hobby.title.toUpperCase()} // SIGNAL</b><span>{hobby.copy}</span></span></button>)}</div></section><section className="hobby-note page-pad"><Eyebrow>Why it matters</Eyebrow><p>These are not side quests. They are inputs: competition teaches feedback, reading builds context, athletics tunes timing, and creative work gives systems a point of view.</p></section><Footer /></main>;
}


function BioPage() {
  const [sent, setSent] = useState(false);
  return <main className="inner-page"><PageHeader number="05" kicker="Bio & Contact" title={<>Let’s make<br /><span>something playable.</span></>} copy="Game developer and engine systems programmer with a strong foundation in low-level graphics, deterministic simulation, and real-time interaction." /><section className="bio-layout page-pad"><div className="bio-copy"><Eyebrow>About the player</Eyebrow><p className="bio-copy__lead">I am a game developer and engine systems programmer currently pursuing a B.Tech in Computer Science and Engineering at IARE Hyderabad (2023–2027), with a deep focus on computer graphics, systems programming, and algorithms.</p><p>My engineering philosophy centers on ruthless execution under constraints. I have spearheaded teams in 24–48 hour competitive hackathons, winning 1st Place at CodeDay 2.0, 2nd Place at HackRush, and Top 3 at MLH FrostHacks. As President of Elysium Gaming Club at IARE, I oversee game development workshops and collegiate esports tournaments for 200+ active students.</p><div className="bio-stats"><div><strong>4+</strong><span>hackathon<br />victories</span></div><div><strong>14+</strong><span>playable<br />prototypes</span></div><div><strong>UE</strong><span>5.7 systems<br />core</span></div></div><StatusPill>OPEN TO SYSTEMS & GAMEPLAY ROLES</StatusPill></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><Eyebrow>Send a signal</Eyebrow>{sent ? <div className="form-success"><Sparkles size={22} /><h2>Transmission received.</h2><p>Thanks for the placeholder message. I’ll return through the portal soon.</p><button type="button" className="text-link" onClick={() => setSent(false)}>Send another <ArrowRight size={14} /></button></div> : <><label>Name<input required placeholder="Your name" /></label><label>Signal path<input required type="email" placeholder="you@example.com" /></label><label>Message<textarea required placeholder="Tell me about the system or game you want to build..." rows={5} /></label><button className="button" type="submit">Send transmission <Send size={14} /></button></>}</form></section><Footer /></main>;
}

function GitHubPage() {
  const repos = ["world-builder", "soft-reset", "glyph-kit", "quiet-ui", "weather-system"];
  return <main className="inner-page"><PageHeader number="06" kicker="GitHub" title={<>Open source,<br /><span>open doors.</span></>} copy="A placeholder activity log for code, tools, experiments, and the useful mess that happens between releases." /><section className="github-layout page-pad"><div className="github-profile"><div className="profile-orbit"><CircleUserRound size={44} /></div><Eyebrow>Player profile</Eyebrow><h2>placeholder-name</h2><p>Systems / tools / game design</p><a href="https://github.com/karthikveeranala" target="_blank" rel="noreferrer" className="text-link">Visit profile <ArrowUpRight size={14} /></a><div className="contribution-grid">{Array.from({ length: 84 }, (_, index) => <i key={index} className={index % 7 === 0 ? "is-hot" : index % 3 === 0 ? "is-warm" : ""} />)}</div><small>CONTRIBUTIONS / PLACEHOLDER / LAST 12 MONTHS</small></div><div className="repo-list"><div className="section-topline"><Eyebrow>Repositories</Eyebrow><span className="muted-label">5 PUBLIC / 0 PRIVATE</span></div>{repos.map((repo, index) => <a href="https://github.com/karthikveeranala" target="_blank" rel="noreferrer" className="repo-row" key={repo}><Code2 size={17} /><div><strong>{repo}</strong><span>Placeholder repository description with a little useful context.</span></div><small>{index % 2 ? "TS" : "C#"}</small><ArrowUpRight size={15} /></a>)}</div></section><Footer /></main>;
}

const techNodes = [
  { id: "ue", label: "UNREAL ENGINE", rank: "S+", color: "teal", tools: ["UE 5.7", "UE 4", "Slate / UMG", "Niagara"], usedIn: "Headless E2E Automation Suite, ByteOasis, Geek'O'Wars", copy: "Engine architecture, headless verification, UI auto-discovery, physics, dedicated servers, and gameplay systems." },
  { id: "cpp", label: "C++ SYSTEMS", rank: "S", color: "rust", tools: ["Memory", "Threads", "Win32", "FFmpeg"], usedIn: "E2E Automation Suite / Cyrus 365", copy: "Low-level foundations for deterministic simulation, isolated desktops, GPU backbuffer streaming, and test orchestration." },
  { id: "phaser", label: "PHASER / WEBGL", rank: "A", color: "gold", tools: ["Phaser 3", "WebGL", "Canvas", "TypeScript"], usedIn: "City of Aethel & 2D Arcade", copy: "Fast browser prototypes, boss choreography, projectile prediction, ragdoll impulses, and playable web builds." },
  { id: "gameplay", label: "GAMEPLAY SYSTEMS", rank: "S", color: "pink", tools: ["AI", "Physics", "Combat", "State machines"], usedIn: "The Interlude / 14+ prototypes", copy: "The layer where rules become feel: combat loops, predictive targeting, movement, encounters, and readable feedback." },
  { id: "tools", label: "TOOLS / PIPELINES", rank: "A", color: "blue", tools: ["Git", "CI", "Automation", "Profiling"], usedIn: "All projects / production systems", copy: "Build, test, profile, and ship workflows that let small teams move fast without losing system clarity." },
];
function TechTreePage() {
  const [selected, setSelected] = useState(techNodes[0]);
  return <main className="inner-page tech-page"><PageHeader number="10" kicker="Tech-stack inventory / interactive skill tree" title={<>Map the<br /><span>loadout.</span></>} copy="Don’t just read a list of tools. Pick a node to inspect the systems, engines, and projects behind the work." /><section className="tech-tree page-pad"><div className="tech-tree__map"><div className="tech-tree__lines" aria-hidden="true"><i /><i /><i /><i /></div>{techNodes.map((node) => <button key={node.id} className={`tech-node tech-node--${node.color} ${selected.id === node.id ? "is-selected" : ""}`} onClick={() => setSelected(node)}><span>{node.rank}</span><strong>{node.label}</strong><small>SELECT NODE</small></button>)}</div><aside className="tech-inspector"><Eyebrow>Selected node / {selected.rank}</Eyebrow><h2>{selected.label}</h2><p>{selected.copy}</p><div className="tech-inspector__tools">{selected.tools.map((tool) => <span key={tool}>{tool}</span>)}</div><div className="tech-inspector__used"><Eyebrow>Deployed in</Eyebrow><strong>{selected.usedIn}</strong></div><Link href="/portfolio/" className="button button--outline">View project dossiers <ArrowUpRight size={13} /></Link></aside></section><section className="inventory-strip page-pad"><Eyebrow>Inventory readout</Eyebrow><div><span><strong>05</strong> skill nodes</span><span><strong>14+</strong> prototypes</span><span><strong>04</strong> engine lanes</span><span><strong>∞</strong> combinations</span></div></section><Footer /></main>;
}

function PortfolioCarousel({ items, onContributions }: { items: typeof projects; onContributions: (project: typeof projects[number]) => void }) {
  const [active, setActive] = useState(0);
  const list = items.length ? items : projects;
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<typeof projects[number] | null>(null);
  const lastWheel = useRef(0);
  const rotate = (direction: number) => setActive((value) => (value + direction + list.length) % list.length);
  const handleWheel = (event: React.WheelEvent) => {
    const now = performance.now();
    if (now - lastWheel.current < 240) return;
    lastWheel.current = now;
    rotate(event.deltaY > 0 ? 1 : -1);
  };
  return (
    <div className="portfolio-carousel" onWheel={handleWheel} onKeyDown={(event) => { if (event.key === "ArrowDown") rotate(1); if (event.key === "ArrowUp") rotate(-1); }} tabIndex={0}>
      <div className="portfolio-carousel__hint"><Eyebrow>Scroll to rotate / click to inspect</Eyebrow><span>{String(active + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span></div>
      <div className="portfolio-carousel__stage">
        {list.map((project, index) => {
          const raw = (index - active + list.length) % list.length;
          const offset = raw > list.length / 2 ? raw - list.length : raw;
          const visible = Math.abs(offset) <= 2;
          const isFocus = offset === 0;
          return (
            <button key={project.slug} className={`portfolio-carousel__card ${isFocus ? "is-focus" : ""} ${hovered === index ? "is-hovered" : ""}`} style={{ transform: `translate(-50%, -50%) translateY(${offset * 205}px) translateZ(${isFocus ? 100 : -Math.abs(offset) * 110}px) rotateX(${offset * 28}deg) scale(${isFocus ? 1 : .78})`, opacity: visible ? (isFocus ? 1 : .62) : 0, zIndex: 20 - Math.abs(offset), pointerEvents: visible ? "auto" : "none" }} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setActive(index)} onClick={() => setSelected(project)}>
              <div className="portfolio-carousel__poster"><ProjectVisual tone={project.tone} label={project.stat} media={project.media} />{(hovered === index || isFocus) && <video src="/dungeon-reel.mp4" autoPlay muted loop playsInline />}</div>
              <div className="portfolio-carousel__caption"><span>{project.type}</span><strong>{project.title}</strong><small>{isFocus ? "OPEN DOSSIER ↗" : project.stat}</small></div>
            </button>
          );
        })}
      </div>
      <div className="portfolio-carousel__rail">{list.map((project, index) => <button key={project.slug} className={active === index ? "is-selected" : ""} onClick={() => setActive(index)}>{String(index + 1).padStart(2, "0")}</button>)}</div>
      {selected && <ProjectWindow project={selected} onClose={() => setSelected(null)} onContributions={() => { setSelected(null); onContributions(selected); }} />}
    </div>
  );
}

function PortfolioPage() {
  const [filter, setFilter] = useState("ALL");
  const [contribution, setContribution] = useState<typeof projects[number] | null>(null);
  const tags = ["ALL", "SYSTEMS", "WORLDS", "PROTOTYPES"];
  const filtered = filter === "ALL" ? projects : projects.filter((project) => project.tags.some((tag) => tag.toUpperCase().includes(filter.slice(0, -1))));
  return <main className="inner-page portfolio-page-new"><PageHeader number="07" kicker="Games & systems portfolio" title={<>Engine plugins,<br /><span>3D titles & prototypes.</span></>} copy="Scroll through the project carousel. Hover to wake the reel, click a card to open the dossier, and inspect the contribution log when you want the engineering details." /><section className="portfolio-page page-pad"><div className="portfolio-loadout"><Eyebrow>Carousel inventory</Eyebrow><Link href="/skills/" className="text-link">Open interactive tech tree <ArrowUpRight size={14} /></Link></div><div className="filter-row">{tags.map((tag) => <button key={tag} className={filter === tag ? "is-selected" : ""} onClick={() => setFilter(tag)}>{tag}</button>)}</div><PortfolioCarousel items={filtered} onContributions={setContribution} /></section>{contribution && <ContributionDrawer project={contribution} onClose={() => setContribution(null)} />}<Footer /></main>;
}


function ProjectPage({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug) ?? projects[0];
  const next = projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];
  return <main className="inner-page project-page"><section className="project-page__hero page-pad"><Link href="/portfolio/" className="text-link"><ArrowLeft size={14} /> Back to portfolio</Link><div className="project-page__hero-copy"><Eyebrow>Project / {project.stat}</Eyebrow><h1>{project.title}</h1><p>{project.description}</p></div><ProjectVisual tone={project.tone} label="SOURCE MEDIA / Karthik portfolio" media={project.media} /></section><section className="project-detail page-pad"><div className="project-detail__facts"><div><Eyebrow>Role</Eyebrow><strong>Systems Architecture / Gameplay Engineering</strong></div><div><Eyebrow>Stack</Eyebrow><strong>{project.tags.join(" / ")}</strong></div><div><Eyebrow>Status</Eyebrow><StatusPill>SOURCE PROJECT / CASE STUDY</StatusPill></div></div><div className="project-detail__copy"><p className="lead">This project combines systems architecture with player-facing design. The goal was to make difficult technical constraints feel invisible, responsive, and playable.</p><div className="project-detail__columns"><div><h2>01 / The brief</h2><p>The brief: build a reliable technical foundation under a tight delivery window, then turn it into a readable player experience.</p></div><div><h2>02 / The result</h2><p>The result: a tested prototype with clear systems boundaries, strong feedback, and a concrete path from experiment to shipped feature.</p></div></div><div className="project-detail__gallery"><ProjectVisual tone={project.tone} label="SOURCE MEDIA / 01" media={project.media} /><ProjectVisual tone="signal" label="MEDIA / 02" /></div><Link href={`/portfolio/${next.slug}/`} className="next-project"><span>Next project</span><strong>{next.title}</strong><ArrowRight size={20} /></Link></div></section><Footer /></main>;
}

function Footer() {
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem("pixelguild-sound") !== "off"; } catch { return true; } });
  const [cabinetOn, setCabinetOn] = useState(() => { try { return localStorage.getItem("pixelguild-cabinet") === "on"; } catch { return false; } });
  return <footer className="site-footer page-pad"><div className="site-footer__mark"><BrandMark /><span>KV / KARTHIK VEERANALA</span></div><div className="site-footer__middle"><Eyebrow>Keep in touch</Eyebrow><a href="mailto:karthik.veeranala@gmail.com">karthik.veeranala@gmail.com</a></div><div className="site-footer__controls"><span>ARCADE CONTROLS</span><button className="footer-control" onClick={() => { footerControls?.toggleCabinet(); setCabinetOn((value) => !value); }} aria-label={cabinetOn ? "Exit CRT cabinet mode" : "Enter CRT cabinet mode"}><Monitor size={13} /> {cabinetOn ? "CRT ON" : "CRT"}</button><button className="footer-control" onClick={() => { footerControls?.toggleSound(); setSoundOn((value) => !value); }} aria-label={soundOn ? "Mute arcade sounds" : "Unmute arcade sounds"}>{soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />} {soundOn ? "SFX ON" : "SFX OFF"}</button></div><div className="site-footer__bottom"><span>© 2026 KARTHIK VEERANALA / GAME SYSTEMS & PROTOTYPING</span><span>Built under constraints <Sparkles size={12} /></span></div></footer>;
}

function Router() {
  const [location] = useLocation();
  const path = normalizePath(location);
  if (path === "/") return <Home />;
  if (path === "/demo-reel/") return <DemoReelPage />;
  if (path === "/backstory/") return <BackstoryPage />;
  if (path === "/hobbies/") return <HobbiesPage />;
  if (path === "/bio/") return <BioPage />;
  if (path === "/arcade/") return <ArcadePage />;
  if (path === "/skills/") return <TechTreePage />;
  if (path === "/portfolio/") return <PortfolioPage />;
  if (path.startsWith("/portfolio/")) return <ProjectPage slug={path.split("/")[2]} />;
  return <NotFoundPage />;
}

function NotFoundPage() {
  return <main className="not-found page-pad"><Eyebrow>404 / Uncharted</Eyebrow><h1>This level<br /><span>doesn’t exist.</span></h1><p>This level is not in the current loadout. The requested source pages have been retired from navigation.</p><Link href="/" className="button">Return home <ArrowRight size={14} /></Link></main>;
}

function BootSequence() {
  return <div className="boot-sequence" aria-label="Loading Pixel Guild portfolio"><div className="boot-sequence__logo">KV<span>_</span></div><div className="boot-sequence__bar"><i /></div><div className="boot-sequence__copy"><span>INITIALIZING PLAYER PROFILE</span><strong>LOADING WORLDS / 05</strong><small>UNREAL SYSTEMS // PLAYABLE RESULTS</small></div></div>;
}

function App() {
  const [booting, setBooting] = useState(() => { try { return !sessionStorage.getItem("pixelguild-booted"); } catch { return true; } });
  useEffect(() => { if (!booting) return; const timer = window.setTimeout(() => { try { sessionStorage.setItem("pixelguild-booted", "1"); } catch { /* no-op */ } setBooting(false); }, 1450); return () => window.clearTimeout(timer); }, [booting]);
  return <ErrorBoundary>{booting && <BootSequence />}<SiteShell><Router /></SiteShell></ErrorBoundary>;
}

export default App;
