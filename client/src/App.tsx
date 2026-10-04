import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, Router as WouterRouter } from "wouter";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Code2,
  Gamepad2,
  Github,
  Linkedin,
  MousePointer2,
  Mail,
  Maximize2,
  Menu,
  Moon,
  Pause,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Sun,
  Terminal,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Youtube,
  Zap,
  Monitor,
  RotateCcw,
  RotateCw,
  Shield,
  Flame,
  Award,
} from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

function assetUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}

const ACCENT = "#16d6bd";
let arcadeAudio: AudioContext | null = null;
let isSoundEnabled = true;
try {
  if (typeof window !== "undefined" && localStorage.getItem("pixelguild-sound") === "off") {
    isSoundEnabled = false;
  }
} catch { /* storage may be disabled */ }

let footerControls: { toggleSound: () => void; toggleCabinet: () => void } | null = null;

function playArcadeTone(kind: "hover" | "click" | "transition" | "hit" | "win" | "chomp" | "parry") {
  try {
    if (!isSoundEnabled) return;
    if (typeof window !== "undefined" && localStorage.getItem("pixelguild-sound") === "off") return;
    arcadeAudio ??= new AudioContext();
    const ctx = arcadeAudio;
    if (ctx.state === "suspended") void ctx.resume();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const frequencies = { hover: 420, click: 180, transition: 110, hit: 75, win: 720, chomp: 320, parry: 880 };
    oscillator.type = kind === "hit" ? "square" : kind === "parry" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequencies[kind], ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "win" ? 980 : kind === "chomp" ? 190 : frequencies[kind] * .68, ctx.currentTime + (kind === "transition" ? .22 : .09));
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(kind === "hover" ? .018 : kind === "chomp" ? .035 : .045, ctx.currentTime + .008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (kind === "win" ? .35 : .12));
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + (kind === "win" ? .36 : .14));
  } catch { /* audio is an enhancement and may be unavailable */ }
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Demo Reel", href: "/demo-reel/" },
  { label: "Backstory", href: "/backstory/" },
  { label: "Tech Tree", href: "/skills/" },
  { label: "Hobbies", href: "/hobbies/" },
  { label: "Bio & Contact", href: "/bio/" },
  { label: "Arcade", href: "/arcade/" },
];

const DEMO_REEL_URL = assetUrl("karthik_veeranala_demo_reel.mp4");

export interface ProjectMediaItem {
  type: "video" | "image";
  url: string;
  title: string;
  caption: string;
}

const projects = [
  {
    slug: "e2e-automation-suite",
    title: "HEADLESS E2E AUTOMATION SUITE",
    type: "Unreal Engine 5.7 / Systems internship",
    description: "A project-agnostic Unreal Engine C++ harness for headless test flows, recursive Slate/UMG discovery, physics determinism, replication checks, and GPU backbuffer streaming.",
    tags: ["Unreal Engine 5.7", "C++", "Win32", "FFmpeg"],
    tone: "signal",
    stat: "01 / 05",
    media: assetUrl("portfolio_media/screenshots/e2e_plugin/00_ue5_editor_e2e_suite_workspace.png"),
    video: assetUrl("videos/02_e2e_automation_suite.mp4"),
    gallery: [
      {
        type: "video" as const,
        url: assetUrl("videos/02_e2e_automation_suite.mp4"),
        title: "E2E Automation Harness Reel",
        caption: "15s Windmill procedural assembly test + 10s UE5 Editor Slate plugin runner",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/e2e_plugin/00_ue5_editor_e2e_suite_workspace.png"),
        title: "UE5 Editor Automation Workspace",
        caption: "Central test orchestration harness running natively inside Unreal Engine 5.7",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/e2e_plugin/00_ue5_editor_e2e_suite_panel.png"),
        title: "Slate Test Runner & Discovery Panel",
        caption: "Recursive Slate/UMG widget tree inspection with dynamic state validation",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/e2e_plugin/00_ue5_editor_e2e_progress_window.png"),
        title: "Live Execution Progress Tree",
        caption: "Real-time automated step verification with deterministic timing markers",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/e2e_plugin/11_e2e_simulation_game_launch.png"),
        title: "Procedural Windmill Assembly",
        caption: "Automated physics and procedural component placement test flow",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/e2e_plugin/e2e_automation_architecture.svg"),
        title: "Sandboxed Subsystem Architecture",
        caption: "Win32 isolated desktop harness & raw backbuffer streaming to FFmpeg stdin",
      },
    ],
  },
  {
    slug: "the-interlude",
    title: "THE INTERLUDE",
    type: "1st place / CodeDay 2.0",
    description: "A 6-DOF zero-gravity flight simulator built in 24 hours, with predictive lead-target AI, escalating interceptors, and visceral space-combat feel.",
    tags: ["Unreal Engine 4", "Physics", "AI"],
    tone: "moon",
    stat: "02 / 05",
    media: assetUrl("portfolio_media/screenshots/the_interlude/interlude_maxres_thumbnail.jpg"),
    video: assetUrl("videos/01_the_interlude.mp4"),
    gallery: [
      {
        type: "video" as const,
        url: assetUrl("videos/01_the_interlude.mp4"),
        title: "The Interlude Gameplay Reel",
        caption: "24-Hour CodeDay 1st Place: 6-DOF zero-gravity flight and intercept AI dogfight",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/the_interlude/interlude_maxres_thumbnail.jpg"),
        title: "Interceptor Starfighter Key Art",
        caption: "Custom starfighter model with multi-directional thrusters and cockpit hud",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/the_interlude/action_captures/interlude_frame_01_00m05s.jpg"),
        title: "Zero-G Asteroid Field Navigation",
        caption: "Newtonian physics momentum with responsive pitch/yaw/roll torque dampening",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/the_interlude/action_captures/interlude_frame_02_00m11s.jpg"),
        title: "Predictive Lead-Target Intercept",
        caption: "State-machine enemy AI calculating velocity vectors and lead-intercept angles",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/the_interlude/action_captures/interlude_frame_03_00m19s.jpg"),
        title: "Evasive Slalom Maneuvers",
        caption: "High-G asteroid slalom testing dynamic physics collision boundaries",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/the_interlude/action_captures/interlude_frame_04_00m26s.jpg"),
        title: "Laser Salvo & Niagara Trails",
        caption: "Dual hitscan/ballistic laser trails with procedural camera kickback",
      },
    ],
  },
  {
    slug: "byteoasis",
    title: "BYTEOASIS: CODE TO ESCAPE",
    type: "2nd place / HackRush 2.0",
    description: "A first-person puzzle survival adventure where a stranded programmer repairs logic terminals, bypasses security grids, and executes commands across a cyber-archipelago.",
    tags: ["Unreal Engine", "Puzzle", "Terminals"],
    tone: "reset",
    stat: "03 / 05",
    media: assetUrl("portfolio_media/screenshots/byte_oasis/byte_oasis_maxres_thumbnail.jpg"),
    video: assetUrl("videos/03_byte_oasis.mp4"),
    gallery: [
      {
        type: "video" as const,
        url: assetUrl("videos/03_byte_oasis.mp4"),
        title: "ByteOasis Gameplay Reel",
        caption: "48-Hour HackRush 2nd Place: In-game terminal parsing and environmental logic puzzles",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/byte_oasis/byte_oasis_maxres_thumbnail.jpg"),
        title: "Cyber-Archipelago Key Art",
        caption: "Stranded programmer exploring an island network protected by logic barriers",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/byte_oasis/action_captures/byte_oasis_frame_01_00m06s.jpg"),
        title: "Island Traversal & Atmosphere",
        caption: "Custom water reflection shaders and dynamic day/night lighting cycles",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/byte_oasis/action_captures/byte_oasis_frame_02_00m13s.jpg"),
        title: "Diegetic Terminal Interface",
        caption: "In-game terminal screen parsing commandline input, flags, and system state",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/byte_oasis/action_captures/byte_oasis_frame_03_00m21s.jpg"),
        title: "Security Grid Override",
        caption: "Executing commands to bypass security perimeters and unlock drawbridges",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/byte_oasis/action_captures/byte_oasis_frame_04_00m30s.jpg"),
        title: "Logic Gate Circuit Bypass",
        caption: "Connecting circuits across islands to restore power grids and escape",
      },
    ],
  },
  {
    slug: "geek-o-wars",
    title: "GEEK'O'WARS",
    type: "Top 3 / MLH FrostHacks",
    description: "A third-person survival shooter set inside a laptop motherboard, where microscopic antivirus agents purge infected CPU cores and logic gates.",
    tags: ["Unreal Engine 4.21", "Shaders", "Combat"],
    tone: "ember",
    stat: "04 / 05",
    media: assetUrl("portfolio_media/screenshots/geek_o_wars/01_logo_banner.jpg"),
    video: assetUrl("videos/04_geek_o_wars.mp4"),
    gallery: [
      {
        type: "video" as const,
        url: assetUrl("videos/04_geek_o_wars.mp4"),
        title: "Geek'O'Wars TPS Gameplay Reel",
        caption: "MLH FrostHacks Top 3 Winner: Antivirus third-person survival combat inside a motherboard",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/geek_o_wars/01_logo_banner.jpg"),
        title: "Geek'O'Wars Key Art",
        caption: "Microscopic cyber antivirus agent defending infected CPU hardware",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/geek_o_wars/02_cyber_encounter_1.jpg"),
        title: "Motherboard Circuit Arena",
        caption: "Custom neon PCB trace materials, heat sink towers, and CPU socket architecture",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/geek_o_wars/03_cyber_encounter_2.jpg"),
        title: "Emissive Trace Shaders",
        caption: "Reactive pulse shaders illuminating circuit pathways during combat",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/geek_o_wars/04_gameplay_still_1.jpg"),
        title: "Weapon Heat Dissipation",
        caption: "TPS weapon mechanics with overheating thresholds and recoil smoothing",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/geek_o_wars/action_captures/geek_o_wars_frame_04_00m35s.jpg"),
        title: "Malware Swarm Wave Encounter",
        caption: "Multi-class malware rushers and flanking AI pathfinding across logic gates",
      },
    ],
  },
  {
    slug: "city-of-aethel",
    title: "CITY OF AETHEL & 2D ARCADE",
    type: "Top 45 Indie Finalist / IGDC 2024",
    description: "A Phaser 3 showcase with multi-phase boss choreography, 5-hit melee combos, i-frame dodges, and eight playable web prototypes.",
    tags: ["Phaser 3", "Melee", "WebGL"],
    tone: "ember",
    stat: "05 / 05",
    media: assetUrl("portfolio_media/screenshots/phaser_games/01_city_of_aethel.png"),
    video: assetUrl("videos/05_city_of_aethel.mp4"),
    gallery: [
      {
        type: "video" as const,
        url: assetUrl("videos/05_city_of_aethel.mp4"),
        title: "City of Aethel Boss Arena Reel",
        caption: "IGDC 2024 Top 45 Finalist: 5-hit melee combos, dodge i-frames, and boss choreography",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/phaser_games/01_city_of_aethel.png"),
        title: "City of Aethel Key Art",
        caption: "Atmospheric pixel-art city ruins and story-driven action platformer setting",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/phaser_games/fixed_city_of_aethel_arena.png"),
        title: "Multi-Phase Boss Arena",
        caption: "Telegraphed ground hazards, attack cancel windows, and posture break mechanics",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/phaser_games/00_main_hub.png"),
        title: "Aicade 14-Prototype Arcade Launcher",
        caption: "Web arcade deployment containing 14 distinct gameplay & physics prototypes",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/phaser_games/03_angle_trajectory_shooter.png"),
        title: "Ballistic Trajectory Prediction",
        caption: "Parabolic trajectory calculations with real-time arc visualizers",
      },
      {
        type: "image" as const,
        url: assetUrl("portfolio_media/screenshots/phaser_games/05_kickthebuddy.png"),
        title: "Verlet Integration Ragdoll",
        caption: "Rigid-body impulse physics with particle impact sparks and cloth simulation",
      },
    ],
  },
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
      <Link href="/" className="site-nav__brand" aria-label="Karthik Veeranala portfolio">
        <BrandMark />
        <span className="site-nav__name">karthik.<span>v</span></span>
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

function DiscordIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function SocialRail() {
  const [copied, setCopied] = useState(false);
  const handleDiscordClick = () => {
    try {
      navigator.clipboard.writeText("karthikkkkv");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };
  return (
    <aside className="social-rail" aria-label="Social links">
      <a href="https://github.com/karthikveeranala" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={14} /></a>
      <a href="https://www.youtube.com/@karthikkkk.v" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={14} /></a>
      <a href="https://www.linkedin.com/in/karthikveeranala/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={14} /></a>
      <a
        href="https://discord.com/users/karthikkkkv"
        target="_blank"
        rel="noreferrer"
        aria-label="Discord: karthikkkkv"
        title={copied ? "Copied @karthikkkkv to clipboard!" : "Discord: karthikkkkv (Click to open / copy)"}
        onClick={handleDiscordClick}
        className="social-rail__discord"
      >
        <DiscordIcon size={14} />
      </a>
      <a href="mailto:veeranalakarthik@gmail.com" aria-label="Email"><Mail size={14} /></a>
    </aside>
  );
}

function ArcadeBackground() {
  const glyphs = [
    "W", "A", "S", "D",
    "A", "B", "X", "Y",
    "◀", "▲", "▶", "▼",
    "W", "A", "S", "D",
    "✦", "＋", "◆", "SPACE"
  ];
  return (
    <div className="pixel-field" aria-hidden="true">
      {glyphs.map((glyph, index) => (
        <span
          key={`${glyph}-${index}`}
          className={`pixel-field__glyph pixel-field__glyph--${index % 5} ${glyph.length > 1 ? "pixel-field__glyph--pill" : ""}`}
          style={{
            left: `${(index * 21 + 5) % 94}%`,
            top: `${(index * 31 + 8) % 90}%`,
            animationDelay: `${(index % 8) * -1.8}s`,
            animationDuration: `${12 + (index % 4) * 3}s`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}

interface Pellet {
  id: number;
  x: number;
  y: number;
}

function PixelMascot() {
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem("karthik-mascot-position");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { x: 26, y: Math.max(120, typeof window !== "undefined" ? window.innerHeight - 175 : 400) };
  });
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<"idle" | "wandering" | "dragging" | "excited">("idle");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(() => {
    try {
      const saved = localStorage.getItem("karthik-mascot-paused");
      if (saved === "false") return false;
      return true; // default: paused / resting
    } catch {
      return true;
    }
  });
  const [message, setMessage] = useState(isPaused ? "RESTING // CLICK TO WAKE" : "CALM MODE // CLICK TO REST");
  const [pelletScore, setPelletScore] = useState(0);
  const [popups, setPopups] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);
  const speedMultiplierRef = useRef(1);

  // Generate only 2 quiet, gentle ambient pellets
  const generatePellets = useCallback((count = 2): Pellet[] => {
    if (typeof window === "undefined") return [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const now = Date.now();
    const spots = [
      { x: Math.floor(w * 0.22), y: Math.floor(h * 0.32) },
      { x: Math.floor(w * 0.78), y: Math.floor(h * 0.68) },
    ];
    return spots.slice(0, count).map((s, idx) => ({ id: now + idx + 1, x: s.x, y: s.y }));
  }, []);

  const [pellets, setPellets] = useState<Pellet[]>(() => generatePellets(2));
  const mascotRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const dragOffset = useRef({ x: 0, y: 0 });
  const pointerDownRef = useRef({ x: 0, y: 0, time: 0 });
  const hasMovedRef = useRef(false);
  const restUntilRef = useRef(performance.now() + 2000); // Start with a calm 2s rest
  const lastActiveRef = useRef(Date.now());

  useEffect(() => {
    try {
      localStorage.setItem("karthik-mascot-position", JSON.stringify(position));
    } catch {}
  }, [position]);

  // Check collision with pellets
  const checkChomp = useCallback((x: number, y: number) => {
    setPellets((current) => {
      const remaining: Pellet[] = [];
      let ate = false;
      let eatenPos = { x: 0, y: 0 };
      for (const p of current) {
        const dist = Math.hypot(p.x - (x + 28), p.y - (y + 28));
        if (dist < 38 && !ate) {
          ate = true;
          eatenPos = { x: p.x, y: p.y };
        } else {
          remaining.push(p);
        }
      }
      if (ate) {
        playArcadeTone("chomp");
        setPelletScore((s) => s + 10);
        // Rest peacefully for 4.5 seconds after eating to avoid non-stop zooming
        restUntilRef.current = performance.now() + 4500;
        setState("idle");
        setMessage("NOM! RESTING...");

        const popId = Date.now() + Math.random();
        setPopups((pops) => [...pops, { id: popId, x: eatenPos.x, y: eatenPos.y, text: "+10" }]);
        setTimeout(() => {
          setPopups((pops) => pops.filter((p) => p.id !== popId));
        }, 850);

        if (remaining.length === 0) {
          setTimeout(() => {
            setPellets(generatePellets(2));
          }, 3000);
        }
      }
      return ate ? remaining : current;
    });
  }, [generatePellets]);

  // Pointer move & up handlers with threshold to distinguish left click from drag
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (pointerDownRef.current.time === 0) return;
      const dist = Math.hypot(
        event.clientX - pointerDownRef.current.x,
        event.clientY - pointerDownRef.current.y
      );
      if (dist > 6) {
        hasMovedRef.current = true;
        if (!dragging) {
          setDragging(true);
          setState("dragging");
          setMessage("DRAGGING PAC-KV!");
        }
        const prevX = positionRef.current.x;
        const nextX = Math.max(8, Math.min(window.innerWidth - 74, event.clientX - dragOffset.current.x));
        const nextY = Math.max(64, Math.min(window.innerHeight - 76, event.clientY - dragOffset.current.y));

        if (nextX - prevX > 2) setFacing(1);
        else if (nextX - prevX < -2) setFacing(-1);

        const next = { x: nextX, y: nextY };
        positionRef.current = next;
        if (mascotRef.current) mascotRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
        checkChomp(next.x, next.y);
      }
    };

    const onPointerUp = () => {
      if (pointerDownRef.current.time === 0) return;
      const hadMoved = hasMovedRef.current;
      pointerDownRef.current = { x: 0, y: 0, time: 0 };
      hasMovedRef.current = false;

      if (dragging) {
        setDragging(false);
        setState("idle");
        setPosition(positionRef.current);
        return;
      }

      // If user clicked with no drag threshold exceeded: TOGGLE PAUSE!
      if (!hadMoved) {
        setIsPaused((prev) => {
          const next = !prev;
          try {
            localStorage.setItem("karthik-mascot-paused", String(next));
          } catch {}
          if (next) {
            setState("idle");
            playArcadeTone("click");
            setMessage("⏸ PAUSED // CLICK TO RESUME");
          } else {
            setState("idle");
            playArcadeTone("win");
            setMessage("▶ RESUMED // CRUISING CALMLY");
            restUntilRef.current = performance.now() + 1500;
          }
          return next;
        });
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, checkChomp]);

  // Gentle, calm autonomous roaming loop (48px/s speed + resting pauses)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      if (!dragging && !isPaused) {
        // Respect resting periods
        if (now < restUntilRef.current) {
          setState("idle");
          animId = requestAnimationFrame(step);
          return;
        }

        const curX = positionRef.current.x + 22;
        const curY = positionRef.current.y + 22;

        let closest: Pellet | null = null;
        let minDist = Infinity;
        for (const p of pellets) {
          const d = Math.hypot(p.x - curX, p.y - curY);
          if (d < minDist) {
            minDist = d;
            closest = p;
          }
        }

        if (closest) {
          setState("wandering");
          const dx = closest.x - curX;
          const dy = closest.y - curY;
          const angle = Math.atan2(dy, dx);
          // Very gentle cruising speed: 48px per second (cut down from 125px/s)
          const speed = 48 * speedMultiplierRef.current;

          const nextX = Math.max(8, Math.min(window.innerWidth - 74, positionRef.current.x + Math.cos(angle) * speed * dt));
          const nextY = Math.max(64, Math.min(window.innerHeight - 76, positionRef.current.y + Math.sin(angle) * speed * dt));

          positionRef.current = { x: nextX, y: nextY };
          if (mascotRef.current) {
            mascotRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
          }

          if (dx > 2) setFacing(1);
          else if (dx < -2) setFacing(-1);

          if (minDist <= 32) {
            checkChomp(nextX, nextY);
          }
        } else if (pellets.length === 0) {
          setPellets(generatePellets(2));
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [dragging, isPaused, pellets, checkChomp, generatePellets]);

  return (
    <>
      <div className="pellet-field" aria-hidden="true">
        {pellets.map((p) => (
          <span
            key={p.id}
            className="pacman-pellet"
            style={{ left: `${p.x}px`, top: `${p.y}px` }}
          />
        ))}
        {popups.map((pop) => (
          <span
            key={pop.id}
            className="pellet-popup"
            style={{ left: `${pop.x}px`, top: `${pop.y}px` }}
          >
            {pop.text}
          </span>
        ))}
      </div>

      <div
        ref={mascotRef}
        className={`pixel-mascot pixel-mascot--pacman ${dragging ? "is-dragging" : ""} is-${state} ${isPaused ? "is-paused" : ""}`}
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const rect = event.currentTarget.getBoundingClientRect();
          dragOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
          pointerDownRef.current = { x: event.clientX, y: event.clientY, time: Date.now() };
          hasMovedRef.current = false;
        }}
        role="button"
        tabIndex={0}
        aria-label="Interactive Pac-Man mascot (Left click to pause or resume)"
        title="Left click to pause/resume | Drag to move"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            setIsPaused((p) => !p);
          }
        }}
      >
        <span className="pixel-mascot__bubble">{message}</span>
        <div
          className="pacman-sprite"
          style={{ transform: `scaleX(${facing})` }}
          aria-hidden="true"
        >
          <svg
            className="pacman-svg"
            viewBox="0 0 100 100"
            width="44"
            height="44"
          >
            <path
              className="pacman-svg__body"
              d={isPaused ? "M 50 50 L 86 25 A 44 44 0 1 0 86 75 Z" : undefined}
            >
              {!isPaused && (
                <animate
                  attributeName="d"
                  dur="0.28s"
                  repeatCount="indefinite"
                  values="
                    M 50 50 L 86 25 A 44 44 0 1 0 86 75 Z;
                    M 50 50 L 93.8 44 A 44 44 0 1 0 93.8 56 Z;
                    M 50 50 L 86 25 A 44 44 0 1 0 86 75 Z
                  "
                />
              )}
            </path>
            <circle className="pacman-svg__eye" cx="56" cy="27" r="5.5" />
          </svg>
        </div>
        <span className="pixel-mascot__tag">
          PAC-KV • {pelletScore} PTS {isPaused ? "• PAUSED" : ""}
        </span>
      </div>
    </>
  );
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

function CheatTerminal({
  open,
  unlocked,
  theme,
  onClose,
  onToggleCabinet,
  onDeveloper,
  onToggleTheme,
  onPartyMode,
  onMatrixMode,
  onBigheadMode,
  onSetPalette,
}: {
  open: boolean;
  unlocked: boolean;
  theme: "beige" | "neon";
  onClose: () => void;
  onToggleCabinet: () => void;
  onDeveloper: () => void;
  onToggleTheme: () => void;
  onPartyMode: () => void;
  onMatrixMode: () => void;
  onBigheadMode: () => void;
  onSetPalette: (pal: string) => void;
}) {
  const [, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([
    "=== KARTHIK V DEV CONSOLE v2.0 ===",
    "Type HELP for available commands.",
  ]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [open, onClose]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    if (!cmd) return;

    // 1. Navigation Commands: cd <destination> or cd/<destination>
    if (cmd.startsWith("cd") || cmd.startsWith("goto")) {
      const target = cmd.replace(/^(cd\/?|goto\s*)/, "").trim().replace(/^\/+/, "");
      if (!target || target === "~" || target === "home" || target === "root") {
        setLocation("/");
        playArcadeTone("transition");
        onClose();
        setInput("");
        return;
      }

      const routeMap: Record<string, string> = {
        arcade: "/arcade/",
        backstory: "/backstory/",
        story: "/backstory/",
        "demo-reel": "/demo-reel/",
        reel: "/demo-reel/",
        demo: "/demo-reel/",
        skills: "/skills/",
        techtree: "/skills/",
        tech: "/skills/",
        tree: "/skills/",
        hobbies: "/hobbies/",
        hobby: "/hobbies/",
        bio: "/bio/",
        contact: "/bio/",
        portfolio: "/portfolio/",
        work: "/portfolio/",
        projects: "/portfolio/",
      };

      if (routeMap[target]) {
        setLocation(routeMap[target]);
        playArcadeTone("transition");
        onClose();
        setInput("");
        return;
      } else {
        setLines((prev) => [
          ...prev,
          `> ${raw}`,
          `ERR: Target "${target}" not found.`,
          `Available destinations: home, arcade, backstory, demo-reel, skills, hobbies, bio, portfolio`,
        ]);
        setInput("");
        return;
      }
    }

    // 2. Help Command
    if (cmd === "help" || cmd === "?") {
      setLines((prev) => [
        ...prev,
        `> ${raw}`,
        "─── KARTHIK V DEV CONSOLE DIRECTORY ───",
        "[NAVIGATION]",
        "  cd <page> or cd/<page>  : Warp to page & auto-close console",
        "  destinations            : home, arcade, backstory, demo-reel, skills, hobbies, bio, portfolio",
        "[CHEATS & FX]",
        "  pellets / feed          : Spawn golden pellet shower (+20)",
        "  turbo / speed           : Boost Pac-Man wandering velocity",
        "  bighead                 : Toggle giant Pac-Man mascot mode",
        "  disco / party           : Cyber rainbow neon hue rotation",
        "  matrix                  : Cascading phosphor digital code rain",
        "  godmode                 : 9999 HP & +500 DMG buff in Boss Reflex Arena",
        "  crt                     : Toggle arcade CRT cabinet mode",
        "  theme                   : Toggle Day (Beige) / Night (Neon)",
        "  theme <palette>         : cobalt | bloodmoon | matrix | tokyo | neon",
        "[SYSTEM]",
        "  whoami / stats          : Display player profile & proficiencies",
        "  clear / cls             : Clear console screen",
        "  exit / quit             : Close console modal",
      ]);
      setInput("");
      return;
    }

    // 3. Interactive Cheats
    if (cmd === "pellets" || cmd === "feed") {
      window.dispatchEvent(new CustomEvent("karthik-spawn-pellets"));
      setLines((prev) => [...prev, `> ${raw}`, "PELLET SHOWER ACTIVATED (+20 GOLDEN PELLETS SPAWNED)"]);
      setInput("");
      return;
    }

    if (cmd === "turbo" || cmd === "speed") {
      window.dispatchEvent(new CustomEvent("karthik-turbo-mascot"));
      setLines((prev) => [...prev, `> ${raw}`, "TURBO NOM ENGAGED: PAC-MAN VELOCITY BOOSTED"]);
      setInput("");
      return;
    }

    if (cmd === "bighead") {
      onBigheadMode();
      playArcadeTone("win");
      setLines((prev) => [...prev, `> ${raw}`, "BIG HEAD MODE TOGGLED"]);
      setInput("");
      return;
    }

    if (cmd === "disco" || cmd === "party") {
      onPartyMode();
      playArcadeTone("win");
      setLines((prev) => [...prev, `> ${raw}`, "CYBER RAINBOW DISCO MODE TOGGLED"]);
      setInput("");
      return;
    }

    if (cmd === "matrix") {
      onMatrixMode();
      playArcadeTone("win");
      setLines((prev) => [...prev, `> ${raw}`, "DIGITAL PHOSPHOR MATRIX RAIN TOGGLED"]);
      setInput("");
      return;
    }

    if (cmd === "godmode") {
      try {
        localStorage.setItem("karthik-godmode", "true");
      } catch {}
      playArcadeTone("win");
      setLines((prev) => [...prev, `> ${raw}`, "★ GODMODE ACTIVE: 9999 HP & +500 DMG IN BOSS ARENA ★"]);
      setInput("");
      return;
    }

    if (cmd === "crt" || cmd === "cabinet") {
      onToggleCabinet();
      setLines((prev) => [...prev, `> ${raw}`, "CRT CABINET MODE TOGGLED"]);
      setInput("");
      return;
    }

    if (cmd.startsWith("theme")) {
      const parts = cmd.split(/\s+/);
      if (parts.length > 1) {
        const pal = parts[1];
        if (["cobalt", "bloodmoon", "matrix", "tokyo", "neon"].includes(pal)) {
          onSetPalette(pal === "neon" ? "" : pal);
          if (pal !== "neon" && theme !== "neon") {
            onToggleTheme();
          }
          setLines((prev) => [...prev, `> ${raw}`, `COLOR PALETTE SWITCHED TO: ${pal.toUpperCase()}`]);
          playArcadeTone("click");
          setInput("");
          return;
        }
      }
      onToggleTheme();
      setLines((prev) => [...prev, `> ${raw}`, "DAY / NIGHT THEME TOGGLED"]);
      setInput("");
      return;
    }

    if (cmd === "whoami" || cmd === "stats") {
      setLines((prev) => [
        ...prev,
        `> ${raw}`,
        "PLAYER: KARTHIK VEERANALA",
        "ROLE: Game Developer & Designer (B.Tech CSE, IARE Hyderabad)",
        "ENGINES: Unreal Engine 5.7 / 4 (95%), C++ Gameplay (95%), Phaser 2D (85%)",
        "ACCOLADES: 1st Place CodeDay 2.0 (The Interlude), 2nd HackRush, Top 3 FrostHacks, Top 45 IGDC Indie Finalist",
        "COMMUNITY: President, Elysium Gaming Club (Organized Collegiate Esports Events)",
      ]);
      setInput("");
      return;
    }

    if (cmd === "dev") {
      onDeveloper();
      setLines((prev) => [...prev, `> ${raw}`, "DEVELOPER MODE ONLINE — hidden grid diagnostics enabled."]);
      setInput("");
      return;
    }

    if (cmd === "clear" || cmd === "cls") {
      setLines([]);
      setInput("");
      return;
    }

    if (cmd === "exit" || cmd === "quit") {
      onClose();
      setInput("");
      return;
    }

    setLines((prev) => [...prev, `> ${raw}`, `UNKNOWN COMMAND: "${raw}". Type HELP for directory.`]);
    setInput("");
  };

  if (!open) return null;
  return (
    <div
      className="cheat-terminal__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Developer cheat terminal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="cheat-terminal">
        <div className="cheat-terminal__bar">
          <span><Terminal size={13} /> KONAMI // DEV CONSOLE v2.0</span>
          <button onClick={onClose} aria-label="Close terminal">×</button>
        </div>
        <div className="cheat-terminal__body">
          <div className="cheat-terminal__unlock">
            {unlocked ? "▲ ▲ ▼ ▼ ◀ ▶ ◀ ▶ B A / ACCEPTED" : "ENTER THE CODE"}
          </div>
          {lines.map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
          <form onSubmit={submit}>
            <span>&gt;</span>
            <input
              autoFocus
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }
              }}
              placeholder="type 'help' or 'cd/arcade'..."
              aria-label="Developer terminal command"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
    const [theme, setTheme] = useState<"beige" | "neon">(() => {
    try {
      const saved = localStorage.getItem("pixelguild-theme");
      if (saved === "beige") return "beige";
      return "neon";
    } catch {
      return "neon";
    }
  });
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem("pixelguild-sound") !== "off"; } catch { return true; }
  });
  const [cabinet, setCabinet] = useState(() => { try { return localStorage.getItem("pixelguild-cabinet") === "on"; } catch { return false; } });
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [partyMode, setPartyMode] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);
  const [bigheadMode, setBigheadMode] = useState(false);
  const [palette, setPalette] = useState<string>(() => {
    try { return localStorage.getItem("pixelguild-palette") || ""; } catch { return ""; }
  });

  const cheatIndex = useRef(0);
  const savedScrollRef = useRef(0);

  const handleOpenTerminal = useCallback(() => {
    savedScrollRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    setTerminalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseTerminal = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    document.body.style.overflow = "";
    setTerminalOpen(false);
    requestAnimationFrame(() => {
      window.scrollTo({
        top: savedScrollRef.current,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    });
  }, []);

  useEffect(() => {
    try { localStorage.setItem("pixelguild-theme", theme); } catch { /* optional persistence */ }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem("pixelguild-palette", palette); } catch { /* optional persistence */ }
  }, [palette]);

  useEffect(() => {
    footerControls = {
      toggleSound: () => {
        setSoundOn((current) => {
          const next = !current;
          isSoundEnabled = next;
          try { localStorage.setItem("pixelguild-sound", next ? "on" : "off"); } catch {}
          return next;
        });
      },
      toggleCabinet: () => setCabinet((current) => !current),
    };
    return () => { footerControls = null; };
  }, []);

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
      if (event.key === "Escape") {
        if (terminalOpen) {
          event.preventDefault();
          event.stopPropagation();
          handleCloseTerminal();
          return;
        }
      }
      if (event.key.toLowerCase() === code[cheatIndex.current].toLowerCase()) cheatIndex.current += 1;
      else cheatIndex.current = event.key === code[0] ? 1 : 0;
      if (cheatIndex.current === code.length) {
        cheatIndex.current = 0;
        handleOpenTerminal();
        setDeveloperMode(true);
        playArcadeTone("win");
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [terminalOpen, handleOpenTerminal, handleCloseTerminal]);

  useEffect(() => {
    try { localStorage.setItem("pixelguild-sound", soundOn ? "on" : "off"); } catch { /* optional persistence */ }
    let lastHover = 0;
    const over = (event: PointerEvent) => { const now = performance.now(); if (soundOn && now - lastHover > 90 && (event.target as HTMLElement).closest("a,button")) { lastHover = now; playArcadeTone("hover"); } };
    const click = (event: MouseEvent) => { if (soundOn && (event.target as HTMLElement).closest("a,button")) playArcadeTone("click"); };
    window.addEventListener("pointerover", over); window.addEventListener("click", click);
    return () => { window.removeEventListener("pointerover", over); window.removeEventListener("click", click); };
  }, [soundOn]);

  const paletteClass = theme === "neon" && palette ? `palette-${palette}` : "";

  return (
    <div className={`site-shell ${theme === "neon" ? "theme-neon" : ""} ${paletteClass} ${cabinet ? "cabinet-mode" : ""} ${developerMode ? "developer-mode" : ""} ${partyMode ? "party-mode" : ""} ${matrixMode ? "matrix-mode" : ""} ${bigheadMode ? "bighead-mode" : ""}`}> 
      <div className="noise" aria-hidden="true" />
      <ArcadeBackground />
      <TopNav theme={theme} onToggleTheme={() => setTheme((current) => current === "neon" ? "beige" : "neon")} />
      <PixelMascot />
      {children}
      <SocialRail />
      {developerMode && <CursorFX />}
      <CheatTerminal
        open={terminalOpen}
        unlocked={developerMode}
        theme={theme}
        onClose={handleCloseTerminal}
        onToggleCabinet={() => setCabinet((current) => !current)}
        onDeveloper={() => setDeveloperMode(true)}
        onToggleTheme={() => setTheme((current) => current === "neon" ? "beige" : "neon")}
        onPartyMode={() => setPartyMode((v) => !v)}
        onMatrixMode={() => setMatrixMode((v) => !v)}
        onBigheadMode={() => setBigheadMode((v) => !v)}
        onSetPalette={(pal) => {
          setPalette(pal);
          if (pal && theme !== "neon") {
            setTheme("neon");
          }
        }}
      />
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
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      void videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`hero-video ${compact ? "hero-video--compact" : ""}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Karthik Veeranala Gameplay Master Reel"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={DEMO_REEL_URL} type="video/mp4" />
      </video>
      <div className="hero-video__controls" aria-label="Demo Reel Controls">
        <button
          type="button"
          className="hero-video__ctrl-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause Demo Reel" : "Play Demo Reel"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
        </button>
      </div>
    </div>
  );
}

function ProjectVisual({ tone, label, media }: { tone: string; label: string; media?: string }) {
  return (
    <div className={`project-visual project-visual--${tone}`}>
      {media && <img src={media} alt={label} loading="lazy" decoding="async" />}
      <div className="project-visual__pixel-corners" aria-hidden="true"><i /><i /><i /><i /></div>
      <span className="project-visual__label">{label}</span>
    </div>
  );
}

function ProjectCard({ project, index, onContributions }: { project: typeof projects[number]; index: number; onContributions?: (project: typeof projects[number]) => void }) {
  return <article className={`project-card project-card--${index % 2 === 0 ? "left" : "right"}`}><div className="project-card__number"><strong>{String(index + 1).padStart(2, "0")}</strong><span>/ {String(projects.length).padStart(2, "0")}</span></div><div className="project-card__content"><Link href={`/portfolio/${project.slug}/`} className="project-card__link"><ProjectVisual tone={project.tone} label={project.stat} media={project.media} /><div className="project-card__body"><div><span className="project-card__type">{project.type}</span><h3>{project.title}</h3></div><ArrowUpRight className="project-card__arrow" size={18} /><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></Link>{onContributions && <button className="project-card__contrib" onClick={() => onContributions(project)}>My contributions <ArrowRight size={13} /></button>}</div></article>;
}

function FeaturedWorkCarousel({ onContributions }: { onContributions: (project: typeof projects[number]) => void }) {
  const [active, setActive] = useState(0);
  const next = () => {
    playArcadeTone("hover");
    setActive((prev) => (prev + 1) % projects.length);
  };
  const prev = () => {
    playArcadeTone("hover");
    setActive((prev) => (prev - 1 + projects.length) % projects.length);
  };
  const current = projects[active];

  return (
    <div className="featured-carousel">
      <div className="featured-carousel__header">
        <div className="featured-carousel__counter">
          <strong>{String(active + 1).padStart(2, "0")}</strong>
          <span>/ {String(projects.length).padStart(2, "0")}</span>
          <em>{current.type}</em>
        </div>
        <div className="featured-carousel__nav-btns">
          <button type="button" className="carousel-nav-btn" onClick={prev} aria-label="Previous project">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="carousel-nav-btn" onClick={next} aria-label="Next project">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="featured-carousel__card">
        <div className="featured-carousel__visual-wrap">
          <video src={current.video ?? DEMO_REEL_URL} autoPlay muted loop playsInline preload="metadata" />
          <div className="project-visual__pixel-corners" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="featured-carousel__badge">
            <span className="badge-stat">{current.stat}</span>
            <span className="badge-name">{current.title}</span>
          </div>
        </div>

        <div className="featured-carousel__info">
          <div>
            <span className="featured-carousel__kicker">{current.type}</span>
            <h3>{current.title}</h3>
            <p>{current.description}</p>
            <div className="tag-row">
              {current.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="featured-carousel__actions">
            <Link href={`/portfolio/${current.slug}/`} className="button">
              Open case study <ArrowUpRight size={14} />
            </Link>
            <button
              type="button"
              className="button button--outline"
              onClick={() => onContributions(current)}
            >
              My contributions <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="featured-carousel__dots">
        {projects.map((p, idx) => (
          <button
            key={p.slug}
            type="button"
            className={`carousel-dot ${active === idx ? "is-active" : ""}`}
            onClick={() => {
              playArcadeTone("hover");
              setActive(idx);
            }}
            aria-label={`Jump to project ${idx + 1}`}
          >
            <span>{String(idx + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const contributionDetails: Record<string, { role: string; systems: string[]; snippet: string; metrics: string[] }> = {
  "e2e-automation-suite": { role: "Unreal Engine Developer & Tools Programmer at Cyrus 365 (2026 — Present)", systems: ["Win32 Desktop Sandboxing: Instantiates winsta0\\E2E_IsolatedDesktop, injecting hardware mouse/keyboard events without stealing OS cursor focus or user interruption.", "Slate & UMG Auto-Discovery: Recursively navigates runtime Slate widget trees via reflection, synthesizing click/drag events and validating UI state changes dynamically.", "GPU Backbuffer Video Streaming: Pipes raw frames directly from FViewport::ReadPixels to bundled FFmpeg via standard input (stdin), encoding 1080p H.264 recordings with automated pass/fail incident markers.", "Headless Multi-Instance CI Commandlet: Orchestrates dedicated server runs with 90-second deterministic state guards, validating networked replication and physics determinism in CI/CD pipelines."], snippet: `// Hardware Sandboxing & Backbuffer Stream\nvoid FE2ESandbox::InitializeIsolatedDesktop() {\n  HDESK hDesk = CreateDesktopA("E2E_Desk", ...);\n  SetThreadDesktop(hDesk);\n\n  // Stream backbuffer pixels directly to FFmpeg stdin\n  FViewport* Viewport = GEngine->GameViewport->Viewport;\n  PipeBackbufferToFFmpeg(Viewport, "H264_Artifact.mp4");\n}\n\n// Status: 100% Authoritative Sync Passed\nUE_LOG(LogE2E, Display, TEXT("All Test Suites Validated!"));`, metrics: ["0% (Zero Theft) / Focus Theft", "1080p H.264 Stream / Resolution", "Unreal Engine 5.7 / Engine Version", "100% Authoritative / Sync Determinism"] },
  "the-interlude": { role: "Solo Lead Gameplay & Combat Developer (24-Hour Competitive Sprint)", systems: ["6-DOF Zero-Gravity Physics: Responsive thruster inertia, pitch/yaw/roll torque dampening, and velocity vector alignment in zero gravity.", "Predictive Lead-Target AI: State-machine enemy AI calculating velocity vectors, lead-intercept angles, and evasive rolls.", "Visceral Combat Feedback: Procedural camera shake, laser collision particle trails via Niagara, and spatial 3D audio.", "Escalating Wave Director: Dynamic difficulty balancing managing enemy squad spawns and capital cruiser encounters."], snippet: `// Predictive Lead-Target Intercept Math\nFVector USpaceCombatComponent::CalculateLeadTarget(\n    const AActor* Target, float ProjectileSpeed, float DeltaTime) {\n  if (!Target) return FVector::ZeroVector;\n\n  FVector TargetVelocity = Target->GetVelocity();\n  float Distance = FVector::Dist(GetOwner()->GetActorLocation(), Target->GetActorLocation());\n  float TimeToImpact = Distance / FMath::Max(ProjectileSpeed, 100.0f);\n\n  // Lead compensation position vector\n  return Target->GetActorLocation() + (TargetVelocity * TimeToImpact);\n}`, metrics: ["🥇 1st Place Overall / Honor", "24-Hour Hackathon / Dev Cycle", "Unreal Engine 4 / Engine", "6-DOF Newtonian / Physics Model"] },
  byteoasis: { role: "Lead Gameplay Developer & Puzzle Mechanics Designer (48-Hour Hackathon)", systems: ["In-Game Terminal Simulator: Custom syntax parser supporting commandline input, flag validation, and state triggers.", "Environmental Logic Mechanics: Water reflection shaders, day/night lighting cycles, and puzzle-triggered island drawbridges.", "Diegetic HUD & Interaction: Integrated tablet UI displaying logic logs, signal frequency decoders, and circuit status.", "Procedural Island Clues: Dynamic clue generation requiring algorithmic thinking and logic gates to bypass security barriers."], snippet: `// In-Game Terminal Command Dispatcher\nbool UTerminalParser::ExecuteCommand(const FString& InputCmd) {\n  TArray<FString> Tokens;\n  InputCmd.TrimStartAndEnd().ParseIntoArray(Tokens, TEXT(" "), true);\n  if (Tokens.Num() == 0) return false;\n\n  if (Tokens[0].Equals(TEXT("bypass_grid"), ESearchCase::IgnoreCase)) {\n    if (Tokens.Contains(TEXT("--force"))) {\n      UnlockSecurityGate();\n      return true;\n    }\n  }\n  return false;\n}`, metrics: ["🥈 2nd Place Overall / Honor", "48-Hour Hackathon / Dev Cycle", "Unreal Engine 4 / Engine", "Logic & Code Terminals / Puzzles"] },
  "geek-o-wars": { role: "Lead Gameplay Engineer & Shaders Developer (36-Hour Hackathon)", systems: ["TPS Character Controller: Responsive sprint, aim-down-sights, weapon overheating math, and projectile recoil dissipation.", "Cyber Motherboard Environment: Custom neon cyber shaders, reactive trace circuits, and emissive pulse heat sinks.", "Multi-Class Malware Spawner: Fast melee rushers, ranged trojan spreaders, and heavy boss anomalies with coordinated flanking.", "Wave Survival Resource Tension: Ammo scarcity drops, overheating cooldown balancing, and dynamic score multipliers."], snippet: `// Weapon Heat Dissipation & Firing Logic\nvoid AGeekWeapon::FireProjectile() {\n  if (CurrentHeat >= MaxHeatLimit) {\n    TriggerOverheatCooldown();\n    return;\n  }\n\n  SpawnLaserTrace(MuzzleSocket->GetComponentLocation(), AimRotation);\n  CurrentHeat = FMath::Clamp(CurrentHeat + HeatPerShot, 0.0f, MaxHeatLimit);\n  LastFireTimestamp = GetWorld()->GetTimeSeconds();\n}`, metrics: ["🥉 Top 3 Overall (MLH) / Honor", "36-Hour Hackathon / Dev Cycle", "Unreal Engine 4.21 / Engine", "Third-Person Survival / Genre"] },
  "city-of-aethel": { role: "Lead Combat Designer & Gameplay Engineer at Aicade", systems: ["Responsive Melee Combat: 5-hit combo attack buffering, animation cancel windows, and precision parry timings.", "Dodge-Roll Invulnerability Frames: Precision i-frame calculation mitigating damage vectors within 180ms reaction windows.", "Multi-Phase Boss Fight Choreography: Telegraphed ground hazard indicators, multi-stage attack phase transitions, and posture breaks.", "2D Web Arcade Engine: 14 interactive prototypes testing rigid body ragdolls, ballistic parabolic curves, and wave tension."], snippet: `// Melee Attack Combo Buffer & i-Frame Window\nfunction handleAttackInput(player) {\n  if (player.canCancel && player.comboCount < 5) {\n    player.comboCount++;\n    player.playAnimation('attack_chain_' + player.comboCount);\n    player.grantInvulnerability(180); // 180ms i-frame\n    player.resetComboTimer(600);\n  }\n}`, metrics: ["🎖️ Top 45 IGDC Finalist / Honor", "14 Web Prototypes / Prototypes", "Phaser 3 / WebGL / Engine", "5-Hit Combos + i-Frames / Combat Feel"] },
};

function ContributionDrawer({ project, onClose }: { project: typeof projects[number]; onClose: () => void }) {
  const detail = contributionDetails[project.slug] ?? contributionDetails["e2e-automation-suite"];
  return <div className="contribution-drawer__backdrop" role="dialog" aria-modal="true" aria-label={`${project.title} contributions`} onClick={onClose}><aside className="contribution-drawer" onClick={(event) => event.stopPropagation()}><button className="contribution-drawer__close" onClick={onClose} aria-label="Close contributions">×</button><Eyebrow>My contributions / {project.stat}</Eyebrow><h2>{project.title}</h2><div className="contribution-drawer__block"><Eyebrow>Role & scope</Eyebrow><strong>{detail.role}</strong></div><div className="contribution-drawer__block"><Eyebrow>Core gameplay mechanics & features</Eyebrow><ul className="contribution-list">{detail.systems.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="contribution-drawer__block"><Eyebrow>Implementation snippet (C++)</Eyebrow><pre className="contribution-code"><code>{detail.snippet}</code></pre></div><div className="contribution-drawer__block"><Eyebrow>Verification & performance highlights</Eyebrow><div className="contribution-metrics">{detail.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div></div><div className="contribution-drawer__code"><span>CONTRIBUTION_LOG // OPEN</span><code>mechanics.register("{project.slug}");</code><code>playability.signal = "clear";</code></div></aside></div>;
}

function ProjectWindow({ project, onClose, onContributions }: { project: typeof projects[number]; onClose: () => void; onContributions: () => void }) {
  return (
    <div
      className="project-window__backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project window`}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
    >
      <article
        className="project-window"
        onClick={(event) => event.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <button className="project-window__close" onClick={onClose} aria-label="Close project window">×</button>
        <div className="project-window__media">
          <ProjectVisual tone={project.tone} label={project.stat} media={project.media} />
          <video src={project.video ?? DEMO_REEL_URL} autoPlay muted loop playsInline controls />
        </div>
        <Eyebrow>Project archive / {project.type}</Eyebrow>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-window__actions">
          <button className="button" onClick={onContributions}>My contributions <ArrowRight size={13} /></button>
          <Link href={`/portfolio/${project.slug}/`} className="text-link">Open full case study <ArrowUpRight size={14} /></Link>
        </div>
      </article>
    </div>
  );
}

function BackstorySection() {
  const [activeBtn, setActiveBtn] = useState<"X" | "A" | "Y" | "B">("X");
  const controllerFocus = {
    X: { title: "GAMEPLAY & COMBAT", copy: "Deterministic simulation, 5-hit melee combos, 180ms i-frame dodge rolls, and predictive lead-target AI." },
    A: { title: "UNREAL ENGINE & C++", copy: "Production UE 5.7 C++ engine architecture, isolated desktop sandboxing, Slate/UMG automation, and streaming." },
    Y: { title: "3X HACKATHON VICTORIES", copy: "1st at CodeDay 2.0 (The Interlude), 2nd at HackRush (ByteOasis), and Top 3 at MLH FrostHacks (Geek'O'Wars)." },
    B: { title: "COMMUNITY & LEADERSHIP", copy: "President of Elysium Gaming Club organizing campus gaming culture and collegiate esports tournaments." },
  };

  const handleBtnClick = (btn: "X" | "A" | "Y" | "B") => {
    setActiveBtn(btn);
    playArcadeTone("click");
  };

  return (
    <section className="backstory-section backstory-section--highlight page-pad" id="backstory">
      <div className="backstory-editorial">
        <div className="backstory-editorial__left">
          <div className="backstory-section__stamp"><br /><strong>GAME DEVELOPER PROFILE</strong></div>
          <Eyebrow number="01">The backstory</Eyebrow>
          <h2>Engineered under pressure.<br /><span>Built for production.</span></h2>
          <p className="lead">
            I am a game developer focused on gameplay mechanics, real-time combat systems, physics simulation, and player feel. Pursuing a B.Tech in CSE at IARE Hyderabad (2023–2027), with production internship experience in Unreal Engine 5.7 C++.
          </p>

          {/* Interactive Retro Arcade Gamepad Button Cluster */}
          <div className="backstory-controller-dock">
            <div className="controller-diamond" aria-label="Arcade controller buttons">
              <button
                type="button"
                className={`ctrl-btn ctrl-btn--y ${activeBtn === "Y" ? "is-active" : ""}`}
                onClick={() => handleBtnClick("Y")}
                title="Y: 3x Hackathon Victories (Click/Tap to view)"
                aria-pressed={activeBtn === "Y"}
              >
                <span>Y</span>
                <small>TAP</small>
              </button>
              <div className="controller-diamond__middle">
                <button
                  type="button"
                  className={`ctrl-btn ctrl-btn--x ${activeBtn === "X" ? "is-active" : ""}`}
                  onClick={() => handleBtnClick("X")}
                  title="X: Gameplay & Combat (Click/Tap to view)"
                  aria-pressed={activeBtn === "X"}
                >
                  <span>X</span>
                  <small>TAP</small>
                </button>
                <button
                  type="button"
                  className={`ctrl-btn ctrl-btn--b ${activeBtn === "B" ? "is-active" : ""}`}
                  onClick={() => handleBtnClick("B")}
                  title="B: Community & Leadership (Click/Tap to view)"
                  aria-pressed={activeBtn === "B"}
                >
                  <span>B</span>
                  <small>TAP</small>
                </button>
              </div>
              <button
                type="button"
                className={`ctrl-btn ctrl-btn--a ${activeBtn === "A" ? "is-active" : ""}`}
                onClick={() => handleBtnClick("A")}
                title="A: Unreal Engine & C++ (Click/Tap to view)"
                aria-pressed={activeBtn === "A"}
              >
                <span>A</span>
                <small>TAP</small>
              </button>
            </div>
            <div className="controller-readout">
              <span className={`controller-readout__tag controller-readout__tag--${activeBtn.toLowerCase()}`}>
                PAD INPUT // [{activeBtn}] ACTIVE
              </span>
              <strong className={`controller-readout__title controller-readout__title--${activeBtn.toLowerCase()}`}>
                {controllerFocus[activeBtn].title}
              </strong>
              <p>{controllerFocus[activeBtn].copy}</p>
            </div>
          </div>

          {/* Inline facts summary strip directly below controller dock */}
          <div className="backstory-inline-facts">
            <span className="backstory-inline-facts__item"><strong>3</strong> Hackathon Victories</span>
            <span className="backstory-inline-facts__sep">•</span>
            <span className="backstory-inline-facts__item"><strong>TOP 45</strong> IGDC Indie Finalist</span>
            <span className="backstory-inline-facts__sep">•</span>
            <span className="backstory-inline-facts__item"><strong>14+</strong> Playable Prototypes</span>
            <span className="backstory-inline-facts__sep">•</span>
            <span className="backstory-inline-facts__item"><strong>PRESIDENT</strong> Gaming Club</span>
          </div>

          <div className="backstory-actions">
            <Link href="/backstory/" className="button button--outline">
              Read complete backstory <ArrowUpRight size={14} />
            </Link>
            <Link href="/skills/" className="text-link">
              Inspect tech tree <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="backstory-editorial__right">
          {/* Portrait Photo Frame with Fallback Cyber-Badge */}
          <div className="backstory-portrait-frame">
            <div className="portrait-wrap">
              <img
                src={assetUrl("karthik_portrait.png")}
                alt="Karthik Veeranala portrait"
                className="portrait-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".portrait-fallback");
                  if (fallback) (fallback as HTMLElement).style.display = "flex";
                }}
              />
              <div className="portrait-fallback">
                <span className="portrait-monogram">KV</span>
                <small>GAME DEVELOPER</small>
                <span className="portrait-beacon" />
              </div>
              <div className="portrait-corners" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="portrait-scanline" aria-hidden="true" />
            </div>
            <div className="portrait-meta">
              <span>PLAYER PROFILE // HYDERABAD, IN</span>
              <strong>KARTHIK VEERANALA</strong>
              <small>B.Tech CSE / Game Development & Design</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface BackstoryAct {
  id: string;
  actNumber: string;
  year: string;
  title: string;
  subtitle: string;
  summary: string;
  paragraphs: string[];
  tags: string[];
  metrics: { label: string; value: string }[];
}

const BACKSTORY_ACTS: BackstoryAct[] = [
  {
    id: "act-1",
    actNumber: "ACT I",
    year: "2006 — CHILDHOOD",
    title: "DAD'S PC & OCEAN OF GAMES",
    subtitle: "ROAD RASH • PRINCE OF PERSIA • WOLFENSTEIN 3D",
    summary: "The childhood spark that proved games weren't just entertainment—they were living, responsive worlds.",
    paragraphs: [
      "I was born in 2006. My earliest gaming memories were not retro floppy disks—they were huddled around my dad's monitor, playing cracked titles he downloaded off Ocean of Games.",
      "Dodging traffic and kicking rival bikers in Road Rash, timing pixel-perfect sword parries in Prince of Persia, and navigating labyrinthian corridors in Wolfenstein 3D sparked an obsession that never left. I wasn't just trying to beat high scores; I was fascinated by the underlying clockwork: How does the camera calculate physics? Why do hits feel heavy? How does code make a machine feel alive?"
    ],
    tags: ["Ocean of Games", "Dad's PC", "Road Rash", "Prince of Persia", "Wolfenstein 3D"],
    metrics: [
      { label: "Origin Year", value: "2006" },
      { label: "First PC Hook", value: "Combat Feel & Velocity" },
    ]
  },
  {
    id: "act-2",
    actNumber: "ACT II",
    year: "EARLY TEENS",
    title: "FIRST CODE: FROM SCRATCH TO C++",
    subtitle: "BLOCK LOGIC • TRIGONOMETRY • SELF-TAUGHT CORE",
    summary: "Snapping logic blocks together for the first time, followed by diving into self-taught text code and game math.",
    paragraphs: [
      "Curiosity naturally pushed me to build my first game on Scratch. Snapping visual logic blocks together to make sprites move, jump, and collide gave me an instant rush of adrenaline: I had created something playable with my own hands.",
      "From there, visual scripts weren't enough. I made the leap into text-based programming—teaching myself C++, coordinate trigonometry, velocity vectors, and game engine concepts entirely through public documentation, tutorials, trial, error, and sheer persistence."
    ],
    tags: ["Scratch", "Self-Taught", "C++", "Trigonometry", "Game Loops"],
    metrics: [
      { label: "First Prototype", value: "Scratch (Age 11)" },
      { label: "Language", value: "Self-Taught C++" },
    ]
  },
  {
    id: "act-3",
    actNumber: "ACT III",
    year: "2022 — 2024",
    title: "THE CRUCIBLE: 24–48H HACKATHONS",
    subtitle: "FAILED BUILDS • RUTHLESS SCOPE • 3X PODIUM WINS",
    summary: "High-pressure competitive game jams where failing fast forged ruthless scoping and combat feel discipline.",
    paragraphs: [
      "I threw myself into competitive game jams and hackathons under brutal 24-to-48 hour clocks. In the beginning, I failed. Ideas were overscoped, mechanics collapsed under time pressure, and projects barely held together before submission deadlines.",
      "Every failure became my best teacher. I learned to cut fluff ruthlessly, prioritize core player feedback loops, tune camera shake, and execute under intense constraints. That trial by fire paid off: 1st Place Overall at CodeDay 2.0 (The Interlude), 2nd Place at HackRush (ByteOasis), and Top 3 at MLH FrostHacks (Geek'O'Wars)."
    ],
    tags: ["CodeDay 2.0 (1st)", "HackRush (2nd)", "MLH FrostHacks (Top 3)", "Fast Scoping"],
    metrics: [
      { label: "Podium Finishes", value: "3x Victories" },
      { label: "Sprint Duration", value: "24–48 Hours" },
    ]
  },
  {
    id: "act-4",
    actNumber: "ACT IV",
    year: "2024 — 2025",
    title: "INTO THE ARENA: IGDC & ELYSIUM",
    subtitle: "TOP 45 INDIE FINALIST • GAMING CLUB PRESIDENT • ESPORTS",
    summary: "Validating combat feel on the national indie stage and leading collegiate gaming culture.",
    paragraphs: [
      "Building 14 playable prototypes culminated in City of Aethel—a top-down action prototype engineered with 5-hit attack combo buffering, 180ms i-frame dodge rolls, and posture parries—earning a Top 45 Indie Game Finalist selection at the India Game Developer Conference (IGDC 2024).",
      "Simultaneously, as President of the Elysium Gaming Club at IARE, I stepped up to cultivate competitive collegiate gaming on campus, organizing esports tournaments and gaming events for students."
    ],
    tags: ["IGDC 2024 Finalist", "City of Aethel", "Elysium Gaming Club", "Esports Organizer"],
    metrics: [
      { label: "IGDC Honor", value: "Top 45 Indie Finalist" },
      { label: "Campus Role", value: "Gaming Club President" },
    ]
  },
  {
    id: "act-5",
    actNumber: "ACT V",
    year: "2026 — PRESENT",
    title: "THE ENGINE ROOM: UNREAL 5.7 C++",
    subtitle: "HEADLESS AUTOMATION • DETERMINISM • PRODUCTION PIPELINES",
    summary: "Engineering production engine systems, isolated sandboxes, and verification tools in Unreal Engine 5.7.",
    paragraphs: [
      "Today, my focus is locked on production Unreal Engine C++ architecture. Working at Cyrus 365, I architected a project-agnostic End-to-End Automation & Verification harness in UE 5.7 C++.",
      "The harness instantiates isolated Win32 desktops to prevent OS mouse theft, recursively discovers runtime Slate and UMG widget trees via reflection, and pipes raw viewport backbuffer frames directly to bundled FFmpeg via stdin for automated pass/fail verification."
    ],
    tags: ["Unreal Engine 5.7", "C++", "Win32 Sandboxing", "FFmpeg Pipelines", "Slate Reflection"],
    metrics: [
      { label: "Engine Focus", value: "UE 5.7 C++ Core" },
      { label: "Focus Theft", value: "0% (Zero OS Theft)" },
    ]
  }
];

function BackstoryPage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Sync scroll progress through the master cinema track
  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const stickyTop = 138; // TopNav (58px) + chapter-jumper dock (~76px)
      const stageHeight = stageRef.current ? stageRef.current.offsetHeight : 640;
      const scrollableDistance = rect.height - stageHeight;
      if (scrollableDistance <= 0) return;

      const currentScrolled = stickyTop - rect.top;
      const p = Math.max(0, Math.min(1, currentScrolled / scrollableDistance));
      setProgress(p);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const totalActs = BACKSTORY_ACTS.length;
  // Calculate active act index (0 to 4)
  const actIndex = Math.min(totalActs - 1, Math.floor(progress * totalActs));
  // Local progress within the current act: [0, 1]
  const localProgress = (progress * totalActs) - actIndex;

  // Jump directly to an act by calculating exact window scroll position
  const jumpToAct = (targetIndex: number) => {
    if (!trackRef.current) return;
    playArcadeTone("click");
    const rect = trackRef.current.getBoundingClientRect();
    const stickyTop = 138;
    const stageHeight = stageRef.current ? stageRef.current.offsetHeight : 640;
    const scrollableDistance = trackRef.current.offsetHeight - stageHeight;
    const targetProgress = targetIndex / totalActs;
    const targetScrolled = targetProgress * scrollableDistance;
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const targetScrollY = currentScrollY + rect.top - stickyTop + targetScrolled + 4;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  const currentAct = BACKSTORY_ACTS[actIndex] ?? BACKSTORY_ACTS[0];

  // Exact Cinema Dissolve Math:
  // Phase 1 (0 to 0.38): Title Slate visible, shrinks slightly and dissolves out
  const slateOpacity = Math.max(0, 1 - localProgress * 2.6);
  const slateScale = Math.max(0.88, 1 - localProgress * 0.16);
  const slateTranslateY = localProgress * -28;

  // Phase 2 (0.38 to 0.82): Story Narrative dissolves in on the EXACT SAME STAGE
  // From 0.82 to 1.0 (for acts 0-3), story dissolves out to prepare for next act's Title Slate
  let storyOpacity = 0;
  let storyTranslateY = 30;

  if (localProgress >= 0.38) {
    if (localProgress < 0.52) {
      // Dissolve in
      const inT = (localProgress - 0.38) / 0.14;
      storyOpacity = inT;
      storyTranslateY = (1 - inT) * 25;
    } else if (actIndex === totalActs - 1 || localProgress <= 0.82) {
      // Sustained readability
      storyOpacity = 1;
      storyTranslateY = 0;
    } else {
      // Dissolve out into next act (only for acts 0 through 3)
      const outT = (localProgress - 0.82) / 0.16;
      storyOpacity = Math.max(0, 1 - outT);
      storyTranslateY = -outT * 20;
    }
  }

  const isSlateActive = slateOpacity > 0.08;
  const isStoryActive = storyOpacity > 0.08;

  return (
    <main className="inner-page backstory-page">
      <PageHeader
        number="02"
        kicker="Backstory"
        title={<span>FROM OCEAN OF GAMES<br /><span style={{ color: "var(--teal)" }}>TO UNREAL ENGINE 5.7 C++</span></span>}
        copy="A scroll-driven cinematic documentary. Scroll down to watch each chapter title dissolve directly into the story."
      />

      {/* CINEMA DOCUMENTARY FEATURE ZONE */}
      <div className="cinema-documentary-zone">
        {/* STICKY CHAPTER QUICK JUMPER DOCK */}
        <nav className={`chapter-jumper page-pad ${progress >= 0.96 ? "is-hidden" : ""}`} aria-label="Chapter quick navigation">
        <div className="chapter-jumper__inner">
          <div className="chapter-jumper__header">
            <span className="chapter-jumper__label">MY BACKSTORY // CHAPTERS:</span>
            <span className="chapter-jumper__indicator">
              ACT {actIndex + 1} OF {totalActs} • {Math.round(progress * 100)}%
            </span>
          </div>

          <div className="chapter-jumper__links">
            {BACKSTORY_ACTS.map((act, idx) => (
              <button
                key={act.id}
                type="button"
                className={`chapter-jumper__btn ${actIndex === idx ? "is-active" : ""}`}
                onClick={() => jumpToAct(idx)}
                title={`Jump to ${act.actNumber} (${act.year})`}
              >
                <strong>{act.actNumber}</strong>
                <small>{act.title.split(":")[0]}</small>
              </button>
            ))}
          </div>

          {/* Overall Documentary Progress Track */}
          <div className="chapter-jumper__progress-track">
            <div
              className="chapter-jumper__progress-bar"
              style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
            />
          </div>
        </div>
      </nav>

      {/* MASTER CINEMATIC SCROLL TRACK */}
      <section ref={trackRef} className="cinema-documentary-track">
        <div
          ref={stageRef}
          className="cinema-viewport-stage page-pad"
          style={{
            opacity: progress >= 0.98 ? Math.max(0, 1 - (progress - 0.98) * 50) : 1,
            pointerEvents: progress >= 0.98 ? "none" : "auto",
          }}
        >
          {/* Ambient Background & Grid */}
          <div className="cinema-stage-glow" aria-hidden="true" />
          <div className="cinema-stage-grid" aria-hidden="true" />

          {/* Top Cinema HUD */}
          <div className="cinema-hud-top">
            <div className="cinema-hud-badge">
              <span className="cinema-rec-dot" />
              <span>MY BACKSTORY // ACT 0{actIndex + 1} OF 0{totalActs}</span>
            </div>
            <div className="cinema-hud-meta">
              <span>{currentAct.actNumber} • {currentAct.year}</span>
              <span className="cinema-hud-fps">[ 24 FPS ]</span>
            </div>
          </div>

          {/* PHASE A: THEATRICAL TITLE SLATE */}
          <div
            className="cinema-slate"
            style={{
              opacity: slateOpacity,
              transform: `scale(${slateScale}) translateY(${slateTranslateY}px)`,
              pointerEvents: isSlateActive ? "auto" : "none",
            }}
          >
            <div className="cinema-slate__badge">
              <span className="cinema-slate-act">{currentAct.actNumber}</span>
              <span className="cinema-slate-year">{currentAct.year}</span>
            </div>
            <h2 className="cinema-slate__title">{currentAct.title}</h2>
            <p className="cinema-slate__subtitle">{currentAct.subtitle}</p>

            <div className="cinema-slate__hint">
              <ChevronDown size={14} className="animate-bounce" />
              <span>SCROLL DOWN TO DISSOLVE INTO CHAPTER</span>
            </div>
          </div>

          {/* PHASE B: NARRATIVE STORY CARD (ON THE EXACT SAME STAGE) */}
          <div
            className="cinema-story"
            style={{
              opacity: storyOpacity,
              transform: `translateY(${storyTranslateY}px)`,
              pointerEvents: isStoryActive ? "auto" : "none",
            }}
          >
            <div className="cinema-story__header">
              <div className="cinema-story__badge">
                <span>{currentAct.actNumber} // CHAPTER ARCHIVE</span>
                <em>{currentAct.year}</em>
              </div>
              <h3 className="cinema-story__title">{currentAct.title}</h3>
            </div>

            <div className="cinema-story__grid">
              {/* Left Column: Summary & Metrics */}
              <div className="cinema-story__summary-panel">
                <Eyebrow>Chapter Overview</Eyebrow>
                <p className="cinema-story__lead">{currentAct.summary}</p>

                <div className="cinema-story__metrics">
                  {currentAct.metrics.map((m) => (
                    <div key={m.label} className="cinema-metric">
                      <strong>{m.value}</strong>
                      <small>{m.label}</small>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Narrative Prose & Tags */}
              <div className="cinema-story__narrative-panel">
                <div className="cinema-story__prose">
                  {currentAct.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="tag-row cinema-story__tags">
                  {currentAct.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cinema Controls HUD */}
          <div className="cinema-hud-bottom">
            <div className="cinema-hud-progress">
              <div className="cinema-hud-progress-bar">
                <div
                  className="cinema-hud-progress-fill"
                  style={{ width: `${Math.round(localProgress * 100)}%` }}
                />
              </div>
              <span>
                {isSlateActive ? "TITLE SLATE" : "STORY ARCHIVE"} • {Math.round(localProgress * 100)}%
              </span>
            </div>

            <div className="cinema-hud-nav">
              <button
                type="button"
                className="cinema-nav-btn"
                onClick={() => jumpToAct(Math.max(0, actIndex - 1))}
                disabled={actIndex === 0}
                aria-label="Previous chapter"
              >
                ◀ PREV ACT
              </button>
              <button
                type="button"
                className="cinema-nav-btn cinema-nav-btn--next"
                onClick={() => jumpToAct(Math.min(totalActs - 1, actIndex + 1))}
                disabled={actIndex === totalActs - 1}
                aria-label="Next chapter"
              >
                NEXT ACT ▶
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* PLAYER PROFILE STATS STRIP */}
      <section className="backstory-portrait-strip page-pad">
        <div className="backstory-portrait-strip__content">
          <div className="backstory-portrait-frame">
            <div className="portrait-wrap">
              <img
                src={assetUrl("karthik_portrait.png")}
                alt="Karthik Veeranala portrait"
                className="portrait-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".portrait-fallback");
                  if (fallback) (fallback as HTMLElement).style.display = "flex";
                }}
              />
              <div className="portrait-fallback">
                <span className="portrait-monogram">KV</span>
                <small>GAME DEVELOPER</small>
                <span className="portrait-beacon" />
              </div>
              <div className="portrait-corners" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="portrait-scanline" aria-hidden="true" />
            </div>
          </div>
          <div className="backstory-dossier-meta">
            <Eyebrow>Player Profile</Eyebrow>
            <h2>KARTHIK VEERANALA</h2>
            <p>Game Developer &amp; Designer pursuing B.Tech in CSE at IARE Hyderabad (2023–2027). Specializing in Unreal Engine 5.7 C++, combat feel, physics simulation, and rapid prototyping.</p>
            <div className="bio-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", marginTop: "24px" }}>
              <div><strong>3</strong><span>Hackathon<br />victories</span></div>
              <div><strong>TOP 45</strong><span>IGDC indie<br />finalist</span></div>
              <div><strong>14+</strong><span>Playable<br />prototypes</span></div>
              <div><strong>UE</strong><span>5.7 gameplay<br />systems</span></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Home() {
  const roles = ["Game Developer", "Game Designer", "Gameplay Programmer", "Unreal Engine Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [contribModal, setContribModal] = useState<typeof projects[number] | null>(null);
  useEffect(() => { const timer = window.setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2200); return () => window.clearInterval(timer); }, []);
  return (
    <main>
      <section className="home-hero page-pad" id="home">
        <video className="home-hero__video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={assetUrl("landing-worlds-reel.mp4")} type="video/mp4" /></video>
        <div className="home-hero__veil" aria-hidden="true" />
        <div className="hero-identity">
          <Eyebrow>Unreal Engine & gameplay developer</Eyebrow>
          <h1>KARTHIK<br /><span>VEERANALA</span></h1>
          <div className="hero-identity__sub"><span key={roles[roleIndex]} className="hero-role">{roles[roleIndex]}</span><em>—</em><small>Unreal Engine • C++ • Gameplay • Prototypes</small></div>
        </div>
        <div className="hero-side-note"><span>EXPLORE</span><ArrowDownRight size={16} /></div>
        <div className="hero-bottomline"><StatusPill>OPEN TO GAME DEVELOPER & GAMEPLAY ROLES</StatusPill><span>HYDERABAD, INDIA / UTC+05:30</span></div>
      </section>

      <BackstorySection />

      <section className="featured-section page-pad">
        <div className="section-topline"><Eyebrow number="02">Featured work</Eyebrow><Link href="/portfolio/" className="text-link">Open portfolio <ArrowUpRight size={14} /></Link></div>
        <FeaturedWorkCarousel onContributions={setContribModal} />
      </section>

      <section className="reel-band page-pad">
        <div className="reel-band__copy"><Eyebrow number="03">Demo Reel</Eyebrow><h2>Demo Reel<br /><span>in motion.</span></h2><p>A 2-minute comprehensive demonstration of Unreal Engine 5.7 C++ gameplay mechanics, combat feel, and playable prototypes.</p><Link href="/demo-reel/" className="button button--outline">Watch Demo Reel <Play size={13} fill="currentColor" /></Link></div>
        <HeroVideo />
      </section>

      <section className="manifesto page-pad">
        <div className="manifesto__rail"><span>MORE THAN A PORTFOLIO</span><span>04</span></div>
        <div className="manifesto__content"><p>Every mechanic hides a story. Every prototype is a question made playable.</p><div className="manifesto__mark"><BrandMark /><span>KV / 2026</span></div></div>
      </section>

      <CoinCatcher />
      {contribModal && <ContributionDrawer project={contribModal} onClose={() => setContribModal(null)} />}
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
  return (
    <section className="coin-catcher page-pad">
      <div className="coin-catcher__copy">
        <Eyebrow number="05">Easter egg / coin hunt</Eyebrow>
        <h2>Catch the<br /><span>glitch coin.</span></h2>
        <p>Tap the coin before it jumps. A tiny reward for exploring the page.</p>
        <p className="coin-catcher__secret-hint">
          <em>Whisper:</em> Do you know what the Konami Code is? Why don’t you try entering it anywhere on the site...
        </p>
        <strong>SCORE {String(score).padStart(2, "0")}</strong>
      </div>
      <div className="coin-catcher__screen">
        <span className="coin-catcher__scanline" />
        <button className="glitch-coin" style={{ left: `${coin.left}%`, top: `${coin.top}%` }} onClick={collect} aria-label="Collect glitch coin">✦</button>
        <span className="coin-catcher__hint">CLICK THE STAR / +10 XP</span>
      </div>
    </section>
  );
}

export interface AicadeGame {
  id: string;
  title: string;
  category: "Action & Combat" | "Physics & Ragdoll" | "Platformer & Exploration";
  path: string;
  thumbnail: string;
  aspect: "16:9 Landscape" | "9:16 Portrait";
  badge?: string;
  tagline: string;
  description: string;
  controls: string;
  tech: string[];
}

const aicadeGames: AicadeGame[] = [
  {
    id: "city_of_aethel",
    title: "City of Aethel",
    category: "Action & Combat",
    path: "city_of_aethel/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/01_city_of_aethel.png"),
    aspect: "16:9 Landscape",
    badge: "IGDC 2024 Top 45 Finalist",
    tagline: "Fast-Paced Melee Combat with Attack Chains & Dodge Rolls",
    description: "Award-nominated top-down action game featuring 5-hit attack combo buffering, 180ms i-frame dodge rolls, posture-breaking parries, and multi-phase arena encounters.",
    controls: "WASD: Move | J: Attack / Combo | K: Dodge Roll | Space: Interact",
    tech: ["Phaser 3", "Combo Buffer", "i-Frames", "Finite State Machine"],
  },
  {
    id: "angle_trajectory_shooter",
    title: "Total Crush: Demolition Ballistics",
    category: "Physics & Ragdoll",
    path: "angle_trajectory_shooter/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/03_angle_trajectory_shooter.png"),
    aspect: "16:9 Landscape",
    badge: "Matter.js Rigid Body",
    tagline: "Predictive Trajectory Simulation & Destructible Structures",
    description: "Physics-based siege launcher simulating projectile parabolas, angular velocity, impact force impulses, and chain-reaction structural collapse.",
    controls: "Mouse Drag & Release: Aim Angle & Launch Velocity",
    tech: ["Matter.js Physics", "Parabolic Trajectory", "Impulse Forces"],
  },
  {
    id: "canon_forcareer",
    title: "Cannon Rampart",
    category: "Action & Combat",
    path: "canon_forcareer/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/04_canon_forcareer.png"),
    aspect: "16:9 Landscape",
    badge: "Wave Defense",
    tagline: "Defensive Turret Ballistics & Horde Pacing",
    description: "Fortress defense prototype balancing reload cooldowns, projectile travel time, dynamic enemy wave pacing, and explosive splash radiuses.",
    controls: "Mouse Aim & Click: Fire Cannon | 1-3: Select Ammo Type",
    tech: ["Ballistic Arc", "Wave Spawner", "Area-of-Effect"],
  },
  {
    id: "kickthebuddy",
    title: "Ragdoll Rampage",
    category: "Physics & Ragdoll",
    path: "kickthebuddy/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/05_kickthebuddy.png"),
    aspect: "16:9 Landscape",
    badge: "Ragdoll Simulation",
    tagline: "Multi-Joint Skeletal Physics & Impact Impulse",
    description: "Interactive ragdoll playground with multi-joint Verlet constraints, collision sound feedback, dynamic spring stiffness, and velocity-scaled particle impacts.",
    controls: "Mouse Click & Drag: Grab & Toss Ragdoll | Weapon Bar: Select Toy",
    tech: ["Verlet Integration", "Multi-Joint Skeletal", "Impulse Dynamics"],
  },
  {
    id: "vertical_canon",
    title: "Skyward Cannon: Mobile Defense",
    category: "Action & Combat",
    path: "vertical_canon/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/06_vertical_canon.png"),
    aspect: "9:16 Portrait",
    badge: "Mobile Portrait Layout",
    tagline: "Vertical Precision Interception & Screen Shake",
    description: "Mobile portrait arcade shooter engineered for vertical screen real estate, fast-twitch projectile deflection, combo multipliers, and juicy screen shake feedback.",
    controls: "Touch / Click & Drag: Aim & Auto-Fire Skyward",
    tech: ["Portrait Viewport", "Screen Shake FX", "Combo Multipliers"],
  },
  {
    id: "harrypotter",
    title: "Into the Beastverse",
    category: "Action & Combat",
    path: "harrypotter/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/07_harrypotter.png"),
    aspect: "16:9 Landscape",
    badge: "Narrative Encounter",
    tagline: "Spell Slinging, Magic Missiles & Narrative Beats",
    description: "Thematic fantasy action prototype with projectile homing spells, shielding wards, dynamic boss mana phases, and atmospheric narrative dialogue triggers.",
    controls: "Arrow Keys / WASD: Move | Click / Space: Cast Spell | Q: Shield Ward",
    tech: ["Spell Projectiles", "Dialogue Triggers", "Homing Ballistics"],
  },
  {
    id: "maze_runner",
    title: "Maze Runner",
    category: "Platformer & Exploration",
    path: "maze_runner/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/08_maze_runner.png"),
    aspect: "16:9 Landscape",
    badge: "Waypoint AI Patrols",
    tagline: "Grid Navigation, Line-of-Sight & Stealth Routing",
    description: "Top-down labyrinth stealth game with patrol node pathfinding, enemy vision cones, keycard security gates, and fog-of-war tilemap exploration.",
    controls: "WASD / Arrow Keys: Move Runner | Shift: Sprint",
    tech: ["Tilemap Collision", "Patrol AI Nodes", "Vision Cones"],
  },
  {
    id: "vertical_maze",
    title: "Tower Ascent: Dungeon Escape",
    category: "Platformer & Exploration",
    path: "vertical_maze/index.html",
    thumbnail: assetUrl("portfolio_media/screenshots/phaser_games/09_vertical_maze.png"),
    aspect: "16:9 Landscape",
    badge: "Vertical Platformer",
    tagline: "Vertical Traversal, Ladder State Machines & Hazard Timing",
    description: "Vertical ascent platformer featuring ladder climbing states, moving spike hazards, falling platforms, gravity manipulation, and precision jump buffering.",
    controls: "A/D or Left/Right: Run | W/Up: Climb Ladders | Space: Jump",
    tech: ["Platform Physics", "Climbing State Machine", "Hazard Triggers"],
  },
];

function AicadeCabinetModal({ game, onClose }: { game: AicadeGame; onClose: () => void }) {
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  const isPortrait = game.aspect.includes("Portrait");

  return (
    <div
      className="aicade-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${game.title} Playable Cabinet`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        className={`aicade-modal ${isPortrait ? "aicade-modal--portrait" : ""}`}
      >
        <div className="aicade-modal__header">
          <div className="aicade-modal__header-left">
            <Gamepad2 size={16} />
            <strong>{game.title.toUpperCase()}</strong>
            <span>• {game.category} • {game.aspect}</span>
          </div>
          <div className="aicade-modal__header-actions">
            <button
              type="button"
              className="aicade-modal__btn"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
            >
              <Maximize2 size={12} /> {fullscreen ? "WINDOW" : "FULLSCREEN"}
            </button>
            <a
              href={assetUrl(`aicade/${game.path}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="aicade-modal__btn"
              title="Open prototype in separate browser tab"
            >
              <ArrowUpRight size={12} /> NEW TAB
            </a>
            <button
              type="button"
              className="aicade-modal__close-btn"
              onClick={onClose}
              aria-label="Close cabinet"
            >
              ×
            </button>
          </div>
        </div>

        <div className={`aicade-modal__viewport ${isPortrait ? "aicade-modal__viewport--portrait" : "aicade-modal__viewport--landscape"}`}>
          <iframe
            src={assetUrl(`aicade/${game.path}`)}
            title={game.title}
            className="aicade-modal__iframe"
            allow="fullscreen; gamepad"
          />
        </div>

        <div className="aicade-modal__footer">
          <div className="aicade-modal__controls">
            <strong>CONTROLS:</strong> {game.controls}
          </div>
          <div className="aicade-modal__tech">
            <strong>TECH STACK:</strong>
            {game.tech.map((t) => (
              <span key={t}>[{t}]</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArcadePage() {
  const [activeGame, setActiveGame] = useState<AicadeGame | null>(null);
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [vaultCategory, setVaultCategory] = useState<string>("All");

  // Read URL query parameter "?game=city_of_aethel"
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const gameParam = params.get("game");
      if (gameParam) {
        const found = aicadeGames.find((g) => g.id === gameParam);
        if (found) {
          setActiveGame(found);
        }
      }
    }
  }, []);

  // 4 Featured Phaser Prototypes requested by the user
  const showcaseIds = ["city_of_aethel", "kickthebuddy", "harrypotter", "vertical_maze"];
  const featuredGames = useMemo(() => {
    return showcaseIds.map((id) => aicadeGames.find((g) => g.id === id)).filter(Boolean) as AicadeGame[];
  }, []);

  const vaultCategories = ["All", "Action & Combat", "Physics & Ragdoll", "Platformer & Exploration"];

  const filteredVaultGames = useMemo(() => {
    if (vaultCategory === "All") return aicadeGames;
    return aicadeGames.filter((g) => g.category === vaultCategory);
  }, [vaultCategory]);

  return (
    <main className="inner-page arcade-page">
      <PageHeader
        number="06"
        kicker="Arcade"
        title={<>Take a break.<br /><span>Play the prototypes.</span></>}
        copy="Done exploring the systems and demo reel? Jump into these retro-inspired arcade builds and production Phaser prototypes engineered with custom state machines, timing reflexes, and physics simulations."
      />

      {/* Featured Phaser 2D Prototypes Showcase */}
      <section className="aicade-section page-pad">
        <div className="aicade-header">
          <div className="section-topline">
            <Eyebrow>Phaser 3 Game Showcase</Eyebrow>
            <button
              type="button"
              className="button button--tiny button--outline"
              onClick={() => {
                playArcadeTone("click");
                setVaultModalOpen(true);
              }}
            >
              <span>View All 8 Games Vault</span> <ArrowUpRight size={13} />
            </button>
          </div>
          <h2>Featured Prototypes &amp; <span>Combat Mechanics</span></h2>
          <p>
            During my gameplay engineering and combat design tenure at Aicade, I architected 8 production-grade 2D web prototypes to test combat buffering, rigid-body physics, and AI navigation. Below are the 4 featured flagship games, with the remaining 4 playable in the full archive.
          </p>
        </div>

        <div className="aicade-grid">
          {featuredGames.map((game) => (
            <article key={game.id} className="aicade-card">
              <div
                className="aicade-card__media"
                onClick={() => {
                  playArcadeTone("transition");
                  setActiveGame(game);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Play ${game.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    playArcadeTone("transition");
                    setActiveGame(game);
                  }
                }}
              >
                <img src={game.thumbnail} alt={game.title} loading="lazy" />
                <span className="aicade-card__scanline" />
                <div className="aicade-card__badge-overlay">
                  <span className="aicade-card__pill">{game.category}</span>
                  {game.badge && (
                    <span className="aicade-card__pill aicade-card__pill--accolade">
                      ★ {game.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="aicade-card__content">
                <div className="aicade-card__meta">
                  <span>{game.aspect}</span>
                  <span>PHASER 3</span>
                </div>
                <h3>{game.title}</h3>
                <p className="aicade-card__tagline">{game.tagline}</p>
                <p className="aicade-card__desc">{game.description}</p>
                <div className="aicade-card__tags">
                  {game.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="aicade-card__actions">
                  <button
                    type="button"
                    className="aicade-card__play-btn"
                    onClick={() => {
                      playArcadeTone("transition");
                      setActiveGame(game);
                    }}
                  >
                    <Play size={12} fill="currentColor" /> Play Game
                  </button>
                  <span className="aicade-card__aspect">{game.aspect}</span>
                </div>
              </div>
            </article>
          ))}

          {/* 5th Card: More Games Vault Trigger */}
          <article
            className="aicade-card aicade-card--vault-trigger"
            onClick={() => {
              playArcadeTone("transition");
              setVaultModalOpen(true);
            }}
            role="button"
            tabIndex={0}
            aria-label="Open Full Playable Games Vault"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                playArcadeTone("transition");
                setVaultModalOpen(true);
              }
            }}
          >
            <div className="aicade-card__vault-art">
              <div className="aicade-card__vault-icon">
                <Gamepad2 size={36} />
              </div>
              <span className="aicade-card__scanline" />
              <div className="aicade-card__badge-overlay">
                <span className="aicade-card__pill aicade-card__pill--accolade">ARCHIVE VAULT</span>
                <span className="aicade-card__pill">8 PROTOTYPES</span>
              </div>
            </div>

            <div className="aicade-card__content">
              <div className="aicade-card__meta">
                <span>MATTER.JS + PHASER</span>
                <span>MORE HERE</span>
              </div>
              <h3>+4 More Playable Prototypes</h3>
              <p className="aicade-card__tagline">Total Crush, Cannon Rampart, Skyward Cannon &amp; Maze Runner</p>
              <p className="aicade-card__desc">
                Access the complete archive of experimental ballistics simulations, turret defense pacing, mobile portrait layouts, and tilemap stealth pathfinding.
              </p>
              <div className="aicade-card__tags">
                <span>Matter.js</span>
                <span>Ballistics Arc</span>
                <span>Portrait Viewport</span>
                <span>Stealth AI</span>
              </div>
              <div className="aicade-card__actions">
                <button
                  type="button"
                  className="aicade-card__play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playArcadeTone("transition");
                    setVaultModalOpen(true);
                  }}
                >
                  <Gamepad2 size={12} /> Explore All 8 Games
                </button>
                <span className="aicade-card__aspect">ALL 8 LIVE</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Reflex Combat Boss Fight Arena */}
      <BossFight />

      {/* Cabinet Play Modal */}
      {activeGame && (
        <AicadeModal game={activeGame} onClose={() => setActiveGame(null)} />
      )}

      {/* All 8 Games Vault Modal Window */}
      {vaultModalOpen && (
        <div className="aicade-vault-backdrop" onClick={() => setVaultModalOpen(false)}>
          <div className="aicade-vault-window" onClick={(e) => e.stopPropagation()}>
            <div className="aicade-vault-header">
              <div className="aicade-vault-header__left">
                <Gamepad2 size={18} />
                <strong>PLAYABLE PHASER 3 VAULT // ALL 8 GAMES</strong>
                <span>[ PRODUCTION ARCHIVE ]</span>
              </div>
              <button
                type="button"
                className="aicade-vault-close-btn"
                onClick={() => setVaultModalOpen(false)}
                title="Close archive (Esc)"
              >
                ✕
              </button>
            </div>

            <div className="aicade-vault-body">
              <div className="aicade-vault-intro">
                <p>Complete archive of 8 interactive 2D prototypes developed during my gameplay engineering tenure at Aicade testing mechanics feel, combat buffering, rigid-body ragdoll physics, and AI navigation. Click any game to launch directly in the arcade cabinet.</p>
                <div className="aicade-filters" style={{ margin: "14px 0 24px" }}>
                  {vaultCategories.map((cat) => {
                    const count = cat === "All" ? aicadeGames.length : aicadeGames.filter((g) => g.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`aicade-filter-btn ${vaultCategory === cat ? "is-active" : ""}`}
                        onClick={() => {
                          playArcadeTone("click");
                          setVaultCategory(cat);
                        }}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="aicade-grid aicade-grid--vault">
                {filteredVaultGames.map((game) => (
                  <article key={game.id} className="aicade-card">
                    <div
                      className="aicade-card__media"
                      onClick={() => {
                        playArcadeTone("transition");
                        setActiveGame(game);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Play ${game.title}`}
                    >
                      <img src={game.thumbnail} alt={game.title} loading="lazy" />
                      <span className="aicade-card__scanline" />
                      <div className="aicade-card__badge-overlay">
                        <span className="aicade-card__pill">{game.category}</span>
                        {game.badge && (
                          <span className="aicade-card__pill aicade-card__pill--accolade">
                            ★ {game.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="aicade-card__content">
                      <div className="aicade-card__meta">
                        <span>{game.aspect}</span>
                        <span>PHASER 3</span>
                      </div>
                      <h3>{game.title}</h3>
                      <p className="aicade-card__tagline">{game.tagline}</p>
                      <p className="aicade-card__desc">{game.description}</p>
                      <div className="aicade-card__tags">
                        {game.tech.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                      <div className="aicade-card__actions">
                        <button
                          type="button"
                          className="aicade-card__play-btn"
                          onClick={() => {
                            playArcadeTone("transition");
                            setActiveGame(game);
                          }}
                        >
                          <Play size={12} fill="currentColor" /> Play Game
                        </button>
                        <span className="aicade-card__aspect">{game.aspect}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BossFight() {
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(() => {
    try {
      return localStorage.getItem("karthik-godmode") === "true" ? 9999 : 100;
    } catch {
      return 100;
    }
  });
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [message, setMessage] = useState("BOSS LOCK-ON // TIMED REFLEX COMBAT");
  const [highScores, setHighScores] = useState([4500, 3200, 2450]);
  const [bossState, setBossState] = useState<"idle" | "telegraph" | "lunging" | "stunned" | "hurt" | "dead">("idle");
  const [telegraphProgress, setTelegraphProgress] = useState(0);
  const [isParryWindow, setIsParryWindow] = useState(false);

  const bossStateRef = useRef(bossState);
  bossStateRef.current = bossState;
  const isParryWindowRef = useRef(isParryWindow);
  isParryWindowRef.current = isParryWindow;
  const isAlive = bossHp > 0 && playerHp > 0;
  const isEnraged = bossHp < 50 && bossHp > 0;

  // Boss attack cycle
  useEffect(() => {
    if (!isAlive) return;

    let progressInterval: number | null = null;
    let lungeTimeout: number | null = null;
    let stunTimeout: number | null = null;

    const attackTimer = window.setInterval(() => {
      // Only initiate attack if completely idle and alive
      if (bossStateRef.current !== "idle") return;

      setBossState("telegraph");
      let p = 0;
      // 2.2s windup: 40 increments of 55ms
      const tickMs = isEnraged ? 45 : 55;

      progressInterval = window.setInterval(() => {
        p += 2.5;
        setTelegraphProgress(p);

        // 600ms golden parry window between 68% and 92%
        if (p >= 68 && p <= 92) {
          setIsParryWindow(true);
        } else {
          setIsParryWindow(false);
        }

        if (p >= 100) {
          clearInterval(progressInterval!);
          setIsParryWindow(false);
          setTelegraphProgress(0);

          // Phase 2: Lunging claw strike
          setBossState("lunging");
          playArcadeTone("hit");
          setMessage("⚠️ BOSS LUNGES FORWARD!");

          lungeTimeout = window.setTimeout(() => {
            // Apply damage if boss wasn't stunned/dodged
            if (bossStateRef.current === "lunging") {
              const retaliation = isEnraged ? 22 : 14;
              setPlayerHp((hp) => {
                const isGod = (() => {
                  try { return localStorage.getItem("karthik-godmode") === "true"; } catch { return false; }
                })();
                if (isGod) return hp;
                const nextHp = Math.max(0, hp - retaliation);
                if (nextHp === 0) {
                  setMessage("SYSTEM OVERLOAD // CLICK RESET TO RETRY");
                  playArcadeTone("hit");
                }
                return nextHp;
              });
              setCombo(0);
              setMessage(`UNGUARDED HIT! -${retaliation} HP (Time your parry in the gold zone!)`);
              setBossState("idle");
            }
          }, 420);
        }
      }, tickMs);
    }, isEnraged ? 2600 : 3800);

    return () => {
      clearInterval(attackTimer);
      if (progressInterval) clearInterval(progressInterval);
      if (lungeTimeout) clearTimeout(lungeTimeout);
      if (stunTimeout) clearTimeout(stunTimeout);
    };
  }, [isAlive, isEnraged]);

  const strike = () => {
    if (!isAlive) return;
    const isStunned = bossState === "stunned";
    const baseDamage = isStunned ? 18 : 10 + Math.floor(Math.random() * 8);
    const multiplier = 1 + combo * 0.25;
    const damage = Math.round(baseDamage * multiplier);
    const nextBoss = Math.max(0, bossHp - damage);

    setBossHp(nextBoss);
    setScore((s) => s + damage * 15);
    setCombo((c) => {
      const nextC = c + 1;
      if (nextC > maxCombo) setMaxCombo(nextC);
      return nextC;
    });

    playArcadeTone("hit");

    if (nextBoss === 0) {
      setBossState("dead");
      setIsParryWindow(false);
      setTelegraphProgress(0);
      setMessage("★ BOSS DEFEATED! CLICK RESET TO PLAY AGAIN ★");
      playArcadeTone("win");
      setHighScores((scores) => [...scores, score + damage * 20].sort((a, b) => b - a).slice(0, 3));
    } else {
      if (bossState !== "stunned") {
        setBossState("hurt");
        setTimeout(() => {
          setBossState((curr) => (curr === "hurt" ? "idle" : curr));
        }, 240);
      }
      setMessage(isStunned ? `CRITICAL STRIKE ON STUNNED BOSS! -${damage} HP` : `DIRECT STRIKE -${damage} (${Math.round(multiplier * 100)}% MULTIPLIER)`);
    }
  };

  const parry = () => {
    if (!isAlive) return;
    if (isParryWindowRef.current || (bossState === "telegraph" && telegraphProgress >= 65)) {
      playArcadeTone("parry");
      setIsParryWindow(false);
      setTelegraphProgress(0);
      const bonusScore = 300;
      setScore((s) => s + bonusScore);
      setCombo((c) => c + 2);
      const counterDamage = 22;
      const nextBoss = Math.max(0, bossHp - counterDamage);
      setBossHp(nextBoss);

      if (nextBoss === 0) {
        setBossState("dead");
        setMessage("★ CRITICAL PARRY FINISHER! BOSS DEFEATED! CLICK RESET TO PLAY AGAIN ★");
        playArcadeTone("win");
      } else {
        setBossState("stunned");
        setMessage(`⚡ PERFECT PARRY! BOSS STUNNED FOR 2.5s! +${bonusScore} PTS ⚡`);
        // Stun for 2.5 seconds
        window.setTimeout(() => {
          setBossState((curr) => (curr === "stunned" ? "idle" : curr));
          setMessage("BOSS RECOVERS FROM STUN // READY");
        }, 2500);
      }
    } else {
      playArcadeTone("hit");
      const penalty = 12;
      setPlayerHp((hp) => {
        const isGod = (() => {
          try { return localStorage.getItem("karthik-godmode") === "true"; } catch { return false; }
        })();
        if (isGod) return hp;
        return Math.max(0, hp - penalty);
      });
      setCombo(0);
      setMessage(`MISTIMED PARRY! -${penalty} HP (Watch for the glowing yellow zone!)`);
    }
  };

  const dodge = () => {
    if (!isAlive) return;
    if (bossStateRef.current === "telegraph" || bossStateRef.current === "lunging") {
      playArcadeTone("transition");
      setBossState("idle");
      setTelegraphProgress(0);
      setIsParryWindow(false);
      setScore((s) => s + 75);
      setMessage("DODGE ROLL SUCCESS! 0 DAMAGE // BOSS WHIFFED!");
    } else {
      playArcadeTone("hover");
      setMessage("EVASIVE ROLL // CLEAR");
    }
  };

  const reset = () => {
    setBossHp(100);
    const isGod = (() => {
      try { return localStorage.getItem("karthik-godmode") === "true"; } catch { return false; }
    })();
    setPlayerHp(isGod ? 9999 : 100);
    setScore(0);
    setCombo(0);
    setBossState("idle");
    setTelegraphProgress(0);
    setIsParryWindow(false);
    setMessage("BOSS SIGNAL DETECTED // READY");
    playArcadeTone("click");
  };

  return (
    <section className="boss-arena page-pad">
      <div className="boss-arena__copy">
        <Eyebrow>Boss Fight Mini Game</Eyebrow>
        <h2>Break the<br /><span>{isEnraged ? "ENRAGED BEAST" : "LOGIC BEAST"}</span></h2>
        <p>A timing-based reflex combat encounter. Watch the charging meter: when it enters the <strong>GOLD PARRY ZONE</strong>, hit <strong>PARRY</strong> to stun the boss and land critical hits!</p>
        <div className="boss-arena__stats">
          <span>PLAYER <b>{playerHp}%</b></span>
          <span>BOSS <b>{bossHp}%</b></span>
          <span>COMBO <b>{combo}x</b></span>
          <span>SCORE <b>{String(score).padStart(4, "0")}</b></span>
        </div>
      </div>

      <div className="boss-arena__cabinet">
        <div className={`boss-arena__screen ${isEnraged ? "is-enraged" : ""} state-${bossState}`}>
          {/* Boss character entity with dynamic combat states */}
          <div
            className={`boss-sprite is-${bossState} ${isEnraged ? "is-enraged" : ""}`}
            aria-hidden="true"
          >
            <i /><i /><i /><b /><b /><em />
            {bossState === "stunned" && <div className="boss-stun-stars">★ ★ ★</div>}
            {bossState === "lunging" && <div className="boss-claw-slash" />}
            {bossState === "dead" && <div className="boss-death-effect">💥 K.O. 💥</div>}
          </div>

          {/* Victory & Defeat Overlays */}
          {bossHp === 0 && (
            <div className="boss-defeat-overlay boss-defeat-overlay--victory">
              <strong>VICTORY ACHIEVED!</strong>
              <span>LOGIC BEAST DEFEATED</span>
              <button type="button" className="button button--victory" onClick={reset}>
                <RefreshCw size={13} /> CLICK RESET TO PLAY AGAIN
              </button>
            </div>
          )}

          {playerHp === 0 && (
            <div className="boss-defeat-overlay boss-defeat-overlay--defeat">
              <strong style={{ color: "var(--rust)" }}>CRITICAL DEFEAT!</strong>
              <span>SYSTEM INTEGRITY COMPROMISED</span>
              <button type="button" className="button button--defeat" onClick={reset}>
                <RefreshCw size={13} /> CLICK RESET TO RETRY
              </button>
            </div>
          )}

          {/* Telegraph charging meter */}
          <div className="attack-meter-wrap">
            <span className="attack-meter-label">
              {bossHp === 0
                ? "🏆 BOSS DEFEATED! CLICK RESET TO PLAY AGAIN 🏆"
                : playerHp === 0
                ? "💀 SYSTEM OVERLOAD! CLICK RESET TO RETRY 💀"
                : bossState === "telegraph"
                ? isParryWindow
                  ? "⚡ PARRY NOW! (PRESS PARRY) ⚡"
                  : "CHARGING ATTACK..."
                : bossState === "stunned"
                ? "★★★ BOSS STUNNED! ATTACK NOW! ★★★"
                : bossState === "lunging"
                ? "⚠️ LUNGING CLAW STRIKE!"
                : "READY"}
            </span>
            <div className="attack-meter-bar">
              <div
                className={`attack-meter-fill ${isParryWindow ? "is-parry-active" : ""}`}
                style={{ width: `${telegraphProgress}%` }}
              />
              <span className="parry-zone-marker" title="Parry Window (68% - 92%)" />
            </div>
          </div>

          <span className="boss-arena__status">{message}</span>
          <div className="health-bar">
            <i style={{ width: `${bossHp}%`, background: isEnraged ? "#ff3b30" : "var(--rust)" }} />
          </div>
        </div>

        <div className="boss-arena__controls">
          <button className="button" onClick={strike} disabled={!isAlive}>
            <Zap size={14} /> Strike
          </button>
          <button
            className={`button button--parry ${isParryWindow ? "is-alert" : ""}`}
            onClick={parry}
            disabled={!isAlive}
            title="Time your parry when meter hits the gold zone"
          >
            <Shield size={14} /> Parry
          </button>
          <button className="button button--outline" onClick={dodge} disabled={!isAlive}>
            Dodge
          </button>
          <button
            className={`button ${!isAlive ? (bossHp === 0 ? "button--victory" : "button--defeat") : "button--tiny"}`}
            onClick={reset}
          >
            <RefreshCw size={12} /> {!isAlive ? (bossHp === 0 ? "Click Reset to Play Again" : "Click Reset to Retry") : "Reset"}
          </button>
        </div>
      </div>

      <div className="scoreboard">
        <Eyebrow>Local leaderboard</Eyebrow>
        {highScores.map((highScore, index) => (
          <div key={`${highScore}-${index}`}>
            <span>0{index + 1}</span>
            <strong>{String(highScore).padStart(4, "0")}</strong>
            <small>{index === 0 ? "MASTER PARRY" : index === 1 ? "FAST PROTOTYPER" : "COMBAT MASTER"}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function PageHeader({ number, kicker, title, copy }: { number: string; kicker: string; title?: React.ReactNode; copy?: string }) {
  return (
    <section className="page-header page-pad">
      <div className="page-header__main">
        <Eyebrow number={number}>{kicker}</Eyebrow>
        {title && <h1>{title}</h1>}
        {copy && <p>{copy}</p>}
      </div>
    </section>
  );
}

function DemoReelPage() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(140);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      void videoRef.current.play();
      setPlaying(true);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    playArcadeTone("click");
  };

  const seekTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    if (!playing) {
      void videoRef.current.play();
      setPlaying(true);
    }
    playArcadeTone("click");
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
    playArcadeTone("click");
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void playerRef.current.requestFullscreen();
    }
  };

  const handleScrub = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const target = ratio * duration;
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const chapters = [
    { title: "The Interlude (1st Place CodeDay 2.0)", time: "00:04", seconds: 4 },
    { title: "Cyrus 365 E2E Automation Suite (UE 5.7 C++)", time: "00:30", seconds: 30 },
    { title: "ByteOasis: Code to Escape (2nd Place HackRush)", time: "00:57", seconds: 57 },
    { title: "Geek'O'Wars (Top 3 MLH FrostHacks)", time: "01:23", seconds: 83 },
    { title: "City of Aethel & Playable Arcade (Top 45 IGDC Finalist)", time: "01:49", seconds: 109 },
  ];

  return (
    <main className="inner-page">
      <PageHeader number="01" kicker="Demo Reel" />
      <section className="reel-page__player page-pad">
        <div ref={playerRef} className="reel-player reel-player--enhanced">
          <div className="hero-video hero-video--compact">
            <video
              ref={videoRef}
              autoPlay
              muted={muted}
              loop
              playsInline
              preload="metadata"
              aria-label="Karthik Veeranala Gameplay & Systems Demo Reel"
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration || 140);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={DEMO_REEL_URL} type="video/mp4" />
            </video>
          </div>

          {/* Scrubbable Duration Bar */}
          <div className="reel-scrubber" onClick={handleScrub} title="Click to seek">
            <div
              className="reel-scrubber__fill"
              style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }}
            />
            <span
              className="reel-scrubber__thumb"
              style={{ left: `${(currentTime / Math.max(1, duration)) * 100}%` }}
            />
          </div>

          {/* Player Controls Dock */}
          <div className="reel-controls-dock">
            <div className="reel-controls-dock__left">
              <button
                type="button"
                className="reel-ctrl-btn"
                onClick={togglePlay}
                aria-label={playing ? "Pause reel" : "Play reel"}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              </button>
              <button
                type="button"
                className="reel-ctrl-btn reel-ctrl-btn--seek"
                onClick={() => seekBy(-10)}
                aria-label="Rewind 10 seconds"
                title="Rewind 10s"
              >
                <RotateCcw size={15} /> <span>-10s</span>
              </button>
              <button
                type="button"
                className="reel-ctrl-btn reel-ctrl-btn--seek"
                onClick={() => seekBy(10)}
                aria-label="Forward 10 seconds"
                title="Forward 10s"
              >
                <RotateCw size={15} /> <span>+10s</span>
              </button>
              <button
                type="button"
                className="reel-ctrl-btn"
                onClick={toggleMute}
                aria-label={muted ? "Unmute audio" : "Mute audio"}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
            </div>

            <div className="reel-controls-dock__right">
              <span className="reel-time-readout">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button
                type="button"
                className="reel-ctrl-btn"
                onClick={toggleFullscreen}
                aria-label="Toggle Fullscreen"
                title="Fullscreen"
              >
                <Maximize2 size={17} />
              </button>
            </div>
          </div>
        </div>

        <div className="reel-page__meta">
          <div>
            <Eyebrow>Credits</Eyebrow>
            <p>Direction & Game Design / Karthik Veeranala<br />Engine Architecture / Unreal Engine 5.7 & 4.21 C++<br />2D Web Arcade / Phaser 3 WebGL</p>
          </div>
          <div className="reel-meta-chapters-block">
            <Eyebrow>Chapters // Click to Jump</Eyebrow>
            <div className="reel-meta-chapters">
              {chapters.map((ch) => (
                <button
                  key={ch.title}
                  type="button"
                  className="reel-meta-chapter-btn"
                  onClick={() => seekTo(ch.seconds)}
                  title={`Jump to ${ch.time} — ${ch.title}`}
                >
                  <span className="reel-meta-chapter-time">{ch.time}</span>
                  <span className="reel-meta-chapter-sep">—</span>
                  <span className="reel-meta-chapter-title">{ch.title}</span>
                  <ArrowRight size={12} className="reel-meta-chapter-arrow" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}



function generateScatteredPositions() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) {
    return {
      games: { x: 12, y: 12, rot: 0 },
      reading: { x: 12, y: 240, rot: 0 },
      athletics: { x: 12, y: 468, rot: 0 },
      creative: { x: 12, y: 696, rot: 0 },
    };
  }
  // 4 discrete spatial zones for wide desktop screens
  const zones = [
    { minX: 24, maxX: 85, minY: 20, maxY: 65 },
    { minX: 330, maxX: 410, minY: 16, maxY: 60 },
    { minX: 25, maxX: 85, minY: 310, maxY: 355 },
    { minX: 335, maxX: 415, minY: 305, maxY: 350 },
  ];
  const shuffledZones = [...zones].sort(() => Math.random() - 0.5);
  const ids = ["games", "reading", "athletics", "creative"];
  const res: Record<string, { x: number; y: number; rot: number }> = {};

  ids.forEach((id, idx) => {
    const zone = shuffledZones[idx];
    const x = Math.round(zone.minX + Math.random() * (zone.maxX - zone.minX));
    const y = Math.round(zone.minY + Math.random() * (zone.maxY - zone.minY));
    const rot = Number(((Math.random() - 0.5) * 5.5).toFixed(1));
    res[id] = { x, y, rot };
  });
  return res;
}

function HobbiesPage() {
  const hobbies = [
    {
      id: "games",
      title: "Gaming",
      label: "RETRO TO MODERN",
      copy: "Playing everything from retro icons to modern titles to dissect mechanics & feel: AC3, Tomb Raider, FIFA 16, Fortnite, Minecraft, Road Rash, Prince of Persia, OG Wolfenstein 3D, Doom, Tekken, and Mortal Kombat.",
      art: "games",
      note: "DISSECT / PLAY / ADAPT",
    },
    {
      id: "reading",
      title: "Manga & Anime",
      label: "NARRATIVE & ART",
      copy: "Avid reader and collector with complete physical manga collections of Jujutsu Kaisen, Demon Slayer, and Attack on Titan, alongside following seasonal and classic anime.",
      art: "reading",
      note: "STORY / ART / LORE",
    },
    {
      id: "athletics",
      title: "Football & F1",
      label: "PACE & TACTICS",
      copy: "Playing football on the pitch and watching European matchdays with the same adrenaline as following Formula 1 Grand Prix weekends—tracking race strategy, reaction windows, and pacing.",
      art: "athletics",
      note: "PACE / RESET / COMMIT",
    },
    {
      id: "creative",
      title: "Guitar & Loot",
      label: "CREATIVE & COLLECTIBLES",
      copy: "Acoustic fingerstyle guitar, kitchen cooking experiments, and curating an ongoing collection of scale figures, rare Pokémon cards, and game posters.",
      art: "creative",
      note: "MAKE / TUNE / COLLECT",
    },
  ];

  const [active, setActive] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; rot: number }>>(() => {
    return generateScatteredPositions();
  });
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    dragMovedRef.current = false;
    setDraggingCard(id);
    setActive(id);
    playArcadeTone("hover");
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setDraggingCard(null);
  };

  useEffect(() => {
    if (!draggingCard) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const cardWidth = 260;
      const cardHeight = 240;
      dragMovedRef.current = true;

      // Strictly clamp inside canvas bounds!
      const rawX = e.clientX - canvasRect.left - dragOffsetRef.current.x;
      const rawY = e.clientY - canvasRect.top - dragOffsetRef.current.y;
      const clampedX = Math.max(8, Math.min(canvasRect.width - cardWidth - 8, rawX));
      const clampedY = Math.max(8, Math.min(canvasRect.height - cardHeight - 8, rawY));

      setPositions((prev) => ({
        ...prev,
        [draggingCard]: { x: clampedX, y: clampedY, rot: 0 },
      }));
    };

    const onPointerUp = () => {
      setDraggingCard(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [draggingCard]);

  return (
    <main className="inner-page hobbies-page">
      <PageHeader number="04" kicker="Hobbies" />
      <section className="hobby-field page-pad">
        <div className="hobby-field__topline">
          <Eyebrow>4 signals found</Eyebrow>
          <span>DRAG CARDS ANYWHERE INSIDE THE BOX // HOVER TO REVEAL</span>
        </div>
        <div ref={canvasRef} className="hobby-field__canvas">
          {hobbies.map((hobby, index) => {
            const pos = positions[hobby.id] ?? { x: 30, y: 30, rot: 0 };
            const isDragging = draggingCard === hobby.id;
            const isSelected = active === hobby.id;
            return (
              <button
                key={hobby.id}
                className={`hobby-card hobby-card--${hobby.art} ${isSelected ? "is-active" : ""} ${isDragging ? "is-dragging" : ""}`}
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${isDragging ? 0 : (pos.rot ?? 0)}deg)`,
                  position: "absolute",
                  left: 0,
                  top: 0,
                  cursor: isDragging ? "grabbing" : "grab",
                  zIndex: isDragging ? 25 : isSelected ? 15 : 2,
                  transition: isDragging ? "none" : "box-shadow 0.2s, border-color 0.2s, transform 0.22s ease-out",
                }}
                onPointerDown={(e) => handlePointerDown(hobby.id, e)}
                onPointerUp={handlePointerUp}
                onClick={() => {
                  if (!dragMovedRef.current) setActive(active === hobby.id ? null : hobby.id);
                }}
                aria-label={hobby.title}
              >
                <span className="hobby-card__index">0{index + 1}</span>
                <span className={`hobby-card__art hobby-card__art--${hobby.art}`} aria-hidden="true"><i /><i /><i /><b /></span>
                <span className="hobby-card__body">
                  <small>{hobby.label}</small>
                  <strong>{hobby.title}</strong>
                  <em>{hobby.note}</em>
                </span>
                <span className="hobby-card__window">
                  <b>{hobby.title.toUpperCase()} // SIGNAL</b>
                  <span>{hobby.copy}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="hobby-note page-pad">
        <Eyebrow>Why it matters</Eyebrow>
        <p>These are not side quests. They are inputs: gaming dissects player feel, manga & anime inspire composition, football & F1 tune reaction speed, and guitar & collecting keep creativity tactile.</p>
      </section>
      <Footer />
    </main>
  );
}

function BioPage() {
  const [sent, setSent] = useState(false);
  return (
    <main className="inner-page">
      <PageHeader number="05" kicker="Bio & Contact" />
      <section className="bio-layout page-pad">
        <div className="bio-copy">
          <Eyebrow>About the player</Eyebrow>
          <p className="bio-copy__lead">I am a game developer and designer currently pursuing a B.Tech in Computer Science and Engineering at IARE Hyderabad (2023–2027), with a deep focus on Unreal Engine C++, real-time combat feel, gameplay mechanics, and player experience.</p>
          <p>My journey started on my dad's PC playing downloaded classics, building logic prototypes in Scratch, and self-learning C++ game architecture. I honed my skills under high-pressure constraints in 24–48 hour competitive hackathons—winning 1st Place at CodeDay 2.0, 2nd Place at HackRush, and Top 3 at MLH FrostHacks—alongside earning a Top 45 Indie Finalist selection at IGDC 2024 for City of Aethel. As President of the Elysium Gaming Club at IARE, I organize campus gaming culture and collegiate esports tournaments.</p>
          <div className="bio-stats">
            <div><strong>3</strong><span>hackathon<br />victories</span></div>
            <div><strong>TOP 45</strong><span>IGDC indie<br />finalist</span></div>
            <div><strong>14+</strong><span>playable<br />prototypes</span></div>
            <div><strong>UE</strong><span>5.7 gameplay<br />core</span></div>
          </div>
          <StatusPill>OPEN TO GAME DEVELOPER & GAMEPLAY ROLES</StatusPill>
        </div>
        <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
          <Eyebrow>Send a signal</Eyebrow>
          {sent ? (
            <div className="form-success">
              <Sparkles size={22} />
              <h2>Transmission received.</h2>
              <p>Thanks for reaching out! I will get back to you shortly.</p>
              <button type="button" className="text-link" onClick={() => setSent(false)}>Send another <ArrowRight size={14} /></button>
            </div>
          ) : (
            <>
              <label>Name<input required placeholder="Your name" /></label>
              <label>Signal path<input required type="email" placeholder="you@example.com" /></label>
              <label>Message<textarea required placeholder="Tell me about the game or prototype you want to build..." rows={5} /></label>
              <button className="button" type="submit">Send transmission <Send size={14} /></button>
            </>
          )}
        </form>
      </section>
      <Footer />
    </main>
  );
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
  const nodeProficiency: Record<string, number> = {
    ue: 95,
    cpp: 95,
    phaser: 85,
    gameplay: 92,
    tools: 90,
  };

  const selectNode = (node: typeof techNodes[number]) => {
    setSelected(node);
    playArcadeTone("click");
  };

  return (
    <main className="inner-page tech-page">
      <PageHeader number="03" kicker="Tech Tree" />
      <section className="tech-tree page-pad">
        <div className="tech-tree__map">
          <svg className="tech-tree__svg-lines" aria-hidden="true" viewBox="0 0 500 400">
            <line x1="120" y1="100" x2="380" y2="100" className="circuit-line circuit-line--pulse" />
            <line x1="120" y1="100" x2="120" y2="280" className="circuit-line" />
            <line x1="380" y1="100" x2="380" y2="280" className="circuit-line circuit-line--pulse" />
            <line x1="120" y1="280" x2="380" y2="280" className="circuit-line" />
            <line x1="250" y1="100" x2="250" y2="280" className="circuit-line circuit-line--active" />
          </svg>
          <div className="tech-tree__nodes-grid">
            {techNodes.map((node) => {
              const isSelected = selected.id === node.id;
              return (
                <button
                  type="button"
                  key={node.id}
                  className={`tech-node tech-node--${node.color} ${isSelected ? "is-selected" : ""}`}
                  onClick={() => selectNode(node)}
                  onMouseEnter={() => playArcadeTone("hover")}
                  aria-pressed={isSelected}
                  aria-label={`Skill node: ${node.label}`}
                >
                  <div className="tech-node__top">
                    <span>{node.rank}</span>
                    <span className="tech-node__status">{isSelected ? "● ACTIVE" : "○ INSPECT"}</span>
                  </div>
                  <strong>{node.label}</strong>
                  <div className="tech-node__meta">
                    <em>{nodeProficiency[node.id]}% MASTERY</em>
                    <small>{isSelected ? "VIEWING SPECS" : "SELECT NODE"}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP INTERACTIVE INSPECTOR */}
        <aside className="tech-inspector tech-inspector--desktop">
          <Eyebrow>Selected node / {selected.rank}</Eyebrow>
          <h2>{selected.label}</h2>
          <div className="mastery-gauge">
            <div className="mastery-gauge__bar">
              <div
                className="mastery-gauge__fill"
                style={{ width: `${nodeProficiency[selected.id]}%` }}
              />
            </div>
            <span>{nodeProficiency[selected.id]}% PROFICIENCY</span>
          </div>
          <p>{selected.copy}</p>
          <div className="tech-inspector__tools">
            {selected.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
          <div className="tech-inspector__used">
            <Eyebrow>Deployed in production</Eyebrow>
            <strong>{selected.usedIn}</strong>
          </div>
          <Link href="/portfolio/" className="button button--outline">
            View project archives <ArrowUpRight size={13} />
          </Link>
        </aside>

        {/* MOBILE LINEAR TECH TREE (All nodes expanded one after another, no node selecting required) */}
        <div className="tech-tree__mobile-list">
          {techNodes.map((node) => (
            <article key={`mob-${node.id}`} className={`tech-mobile-card tech-mobile-card--${node.color}`}>
              <div className="tech-mobile-card__header">
                <div>
                  <span className="tech-mobile-card__rank">{node.rank}</span>
                  <h3>{node.label}</h3>
                </div>
                <span className="tech-mobile-card__pct">{nodeProficiency[node.id]}%</span>
              </div>
              <div className="mastery-gauge">
                <div className="mastery-gauge__bar">
                  <div className="mastery-gauge__fill" style={{ width: `${nodeProficiency[node.id]}%` }} />
                </div>
              </div>
              <p>{node.copy}</p>
              <div className="tech-inspector__tools">
                {node.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
              <div className="tech-mobile-card__used">
                <small>DEPLOYED IN</small>
                <strong>{node.usedIn}</strong>
              </div>
            </article>
          ))}
          <Link href="/portfolio/" className="button button--outline" style={{ justifyContent: "center", marginTop: "12px" }}>
            View project archives <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      <section className="inventory-strip page-pad">
        <Eyebrow>Inventory readout</Eyebrow>
        <div>
          <span><strong>05</strong> skill nodes</span>
          <span><strong>14+</strong> prototypes</span>
          <span><strong>04</strong> engine lanes</span>
          <span><strong>∞</strong> combinations</span>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function PortfolioCarousel({ items, onContributions }: { items: typeof projects; onContributions: (project: typeof projects[number]) => void }) {
  const [active, setActive] = useState(0);
  const list = items.length ? items : projects;
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<typeof projects[number] | null>(null);
  const lastWheel = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const rotate = useCallback((direction: number) => setActive((value) => (value + direction + list.length) % list.length), [list.length]);
  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      // FIX: If a project dossier modal is open, let the user scroll inside it without rotating the carousel!
      if (selected) return;
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      if (now - lastWheel.current < 240) return;
      lastWheel.current = now;
      rotate(event.deltaY > 0 ? 1 : -1);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [rotate, selected]);
  return (
    <div ref={carouselRef} className="portfolio-carousel" onKeyDown={(event) => { if (event.key === "ArrowDown") rotate(1); if (event.key === "ArrowUp") rotate(-1); }} tabIndex={0}>
      <div className="portfolio-carousel__hint"><Eyebrow>Scroll to rotate / click to inspect</Eyebrow><span>{String(active + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span></div>
      <div className="portfolio-carousel__stage">
        {list.map((project, index) => {
          const raw = (index - active + list.length) % list.length;
          const offset = raw > list.length / 2 ? raw - list.length : raw;
          const visible = Math.abs(offset) <= 2;
          const isFocus = offset === 0;
          return (
            <button key={project.slug} className={`portfolio-carousel__card ${isFocus ? "is-focus" : ""} ${hovered === index ? "is-hovered" : ""}`} style={{ transform: `translate(-50%, -50%) translate3d(${Math.sign(offset) * Math.pow(Math.abs(offset), 1.45) * 42}px, ${offset * 190}px, ${isFocus ? 140 : -Math.abs(offset) * 115}px) rotateX(${offset * 23}deg) rotateY(${offset * -13}deg) rotateZ(${offset * -2.5}deg) scale(${isFocus ? 1 : .76 - Math.abs(offset) * .025})`, opacity: visible ? (isFocus ? 1 : .58) : 0, zIndex: 20 - Math.abs(offset), pointerEvents: visible ? "auto" : "none" }} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setActive(index)} onClick={() => setSelected(project)}>
              <div className="portfolio-carousel__poster">
                <ProjectVisual tone={project.tone} label={project.stat} media={project.media} />
                {(hovered === index || isFocus) && <video src={project.video ?? DEMO_REEL_URL} autoPlay muted loop playsInline />}
              </div>
              <div className="portfolio-carousel__caption"><span>{project.type}</span><strong>{project.title}</strong><small>{isFocus ? "OPEN ARCHIVE ↗" : project.stat}</small></div>
            </button>
          );
        })}
      </div>
      <div className="portfolio-carousel__mobile-nav">
        <button
          type="button"
          className="portfolio-carousel__mobile-btn"
          onClick={() => {
            playArcadeTone("hover");
            rotate(-1);
          }}
          aria-label="Previous project"
        >
          <ChevronLeft size={20} />
          <span>PREV</span>
        </button>
        <div className="portfolio-carousel__mobile-counter">
          <strong>{String(active + 1).padStart(2, "0")}</strong> / {String(list.length).padStart(2, "0")}
        </div>
        <button
          type="button"
          className="portfolio-carousel__mobile-btn"
          onClick={() => {
            playArcadeTone("hover");
            rotate(1);
          }}
          aria-label="Next project"
        >
          <span>NEXT</span>
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="portfolio-carousel__rail">{list.map((project, index) => <button key={project.slug} className={active === index ? "is-selected" : ""} onClick={() => setActive(index)}>{String(index + 1).padStart(2, "0")}</button>)}</div>
      {selected && <ProjectWindow project={selected} onClose={() => setSelected(null)} onContributions={() => { setSelected(null); onContributions(selected); }} />}
    </div>
  );
}

function PortfolioPage() {
  const [contribution, setContribution] = useState<typeof projects[number] | null>(null);
  return (
    <main className="inner-page portfolio-page-new">
      <PageHeader number="07" kicker="Portfolio" />
      <section className="portfolio-page page-pad">
        <PortfolioCarousel items={projects} onContributions={setContribution} />
      </section>
      {contribution && <ContributionDrawer project={contribution} onClose={() => setContribution(null)} />}
      <Footer />
    </main>
  );
}


function ProjectMediaGallery({ gallery, tone, stat }: { gallery: ProjectMediaItem[]; tone: string; stat: string }) {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const [lightbox, setLightbox] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = gallery[active] ?? gallery[0];

  const next = useCallback(() => {
    playArcadeTone("hover");
    setActive((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  const prev = useCallback(() => {
    playArcadeTone("hover");
    setActive((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    setIsPlaying(true);
  }, [active]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else void videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="project-media-gallery">
      <div className="project-media-gallery__stage">
        {current.type === "video" ? (
          <div className="project-media-gallery__video-wrap">
            <video
              ref={videoRef}
              src={current.url}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              key={current.url}
              style={{ objectFit: fitMode }}
            />
            <div className="project-media-gallery__video-controls">
              <button
                type="button"
                className="media-ctrl-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              </button>
              <button
                type="button"
                className="media-ctrl-btn"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button
                type="button"
                className="media-ctrl-btn"
                onClick={() => setFitMode((f) => (f === "cover" ? "contain" : "cover"))}
                title={fitMode === "cover" ? "Switch to Fit Screen" : "Switch to Fill Screen"}
                aria-label="Toggle fit mode"
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                className="media-ctrl-btn"
                onClick={() => setLightbox(true)}
                aria-label="Expand fullscreen"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="project-media-gallery__image-wrap" onClick={() => setLightbox(true)}>
            <img
              src={current.url}
              alt={current.title}
              loading="lazy"
              style={{ objectFit: fitMode }}
            />
            <div className="project-media-gallery__video-controls">
              <button
                type="button"
                className="media-ctrl-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setFitMode((f) => (f === "cover" ? "contain" : "cover"));
                }}
                title={fitMode === "cover" ? "Switch to Fit Screen" : "Switch to Fill Screen"}
                aria-label="Toggle fit mode"
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                className="media-ctrl-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(true);
                }}
                title="Expand image"
                aria-label="Expand image"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="project-media-gallery__pixel-corners" aria-hidden="true">
          <i /><i /><i /><i />
        </div>

        <button
          type="button"
          className="project-media-gallery__nav project-media-gallery__nav--prev"
          onClick={prev}
          aria-label="Previous media"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          className="project-media-gallery__nav project-media-gallery__nav--next"
          onClick={next}
          aria-label="Next media"
        >
          <ChevronRight size={24} />
        </button>

        <div className="project-media-gallery__hud">
          <div className="project-media-gallery__hud-badge">
            <span className={`badge-pill badge-pill--${current.type}`}>
              {current.type === "video" ? "1080P REEL" : "SCREENSHOT"}
            </span>
            <span>{String(active + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span>
          </div>
          <div className="project-media-gallery__hud-info">
            <strong>{current.title}</strong>
            <p>{current.caption}</p>
          </div>
        </div>
      </div>

      <div className="project-media-gallery__filmstrip">
        {gallery.map((item, idx) => (
          <button
            key={item.url + idx}
            type="button"
            className={`filmstrip-thumb ${active === idx ? "is-active" : ""}`}
            onClick={() => {
              playArcadeTone("click");
              setActive(idx);
            }}
            aria-label={`Select media slide ${idx + 1}: ${item.title}`}
          >
            <span className="filmstrip-thumb__idx">{String(idx + 1).padStart(2, "0")}</span>
            {item.type === "video" ? (
              <div className="filmstrip-thumb__video-placeholder">
                <Play size={14} fill="currentColor" />
                <small>REEL</small>
              </div>
            ) : (
              <img src={item.url} alt={item.title} loading="lazy" />
            )}
            <span className="filmstrip-thumb__title">{item.title}</span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="project-media-gallery__lightbox"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightbox(false)}
            aria-label="Close lightbox"
          >
            ×
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {current.type === "video" ? (
              <video src={current.url} controls autoPlay />
            ) : (
              <img src={current.url} alt={current.title} />
            )}
            <div className="lightbox-caption">
              <strong>{current.title}</strong>
              <p>{current.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectPage({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug) ?? projects[0];
  const next = projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];
  const detail = contributionDetails[project.slug] ?? contributionDetails["e2e-automation-suite"];
  const [showCode, setShowCode] = useState(false);

  return (
    <main className="inner-page project-page">
      <section className="project-page__hero page-pad">
        <Link href="/portfolio/" className="text-link">
          <ArrowLeft size={14} /> Back to portfolio
        </Link>
        <div className="project-page__hero-copy">
          <div className="project-page__hero-meta">
            <Eyebrow>Project / {project.stat}</Eyebrow>
            <StatusPill>{project.type}</StatusPill>
          </div>
          <h1>{project.title}</h1>
          <p className="project-page__lead">{project.description}</p>
        </div>

        <ProjectMediaGallery gallery={project.gallery} tone={project.tone} stat={project.stat} />
      </section>

      <section className="project-detail page-pad">
        <div className="project-detail__facts">
          <div>
            <Eyebrow>Role & Scope</Eyebrow>
            <strong>{detail.role}</strong>
          </div>
          <div>
            <Eyebrow>Tech Stack</Eyebrow>
            <strong>{project.tags.join(" • ")}</strong>
          </div>
          <div>
            <Eyebrow>Status / Accolade</Eyebrow>
            <StatusPill>{project.type}</StatusPill>
          </div>
        </div>

        <div className="project-detail__copy">
          {project.slug === "city-of-aethel" && (
            <div className="aicade-project-banner">
              <div className="aicade-project-banner__info">
                <Eyebrow>Playable Web Prototypes</Eyebrow>
                <h3>Play City of Aethel & All 8 Arcade Prototypes</h3>
                <p>
                  Experience the award-nominated 5-hit attack combo buffering, 180ms i-frame dodge rolls, and boss posture mechanics directly in your browser.
                </p>
              </div>
              <Link href="/arcade/?game=city_of_aethel" className="button button--primary aicade-launch-btn">
                <Gamepad2 size={16} /> Launch Arcade Cabinet ↗
              </Link>
            </div>
          )}

          <div className="project-detail__section">
            <Eyebrow>Core Gameplay Mechanics & Features</Eyebrow>
            <ul className="project-systems-list">
              {detail.systems.map((item, idx) => {
                const parts = item.split(": ");
                const sysTitle = parts[0];
                const sysDesc = parts.slice(1).join(": ");
                return (
                  <li key={idx}>
                    <strong>{sysTitle}</strong>
                    {sysDesc && <span>: {sysDesc}</span>}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="project-detail__section">
            <Eyebrow>Verification & Performance Highlights</Eyebrow>
            <div className="project-detail__metrics">
              {detail.metrics.map((metric) => (
                <div key={metric} className="metric-pill">
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="project-detail__code-block">
            <div className="code-block-header">
              <Eyebrow>Implementation Snippet (C++)</Eyebrow>
              <button
                type="button"
                className="button button--tiny"
                onClick={() => setShowCode((v) => !v)}
              >
                {showCode ? "Hide C++ Source" : "Inspect C++ Source"}
              </button>
            </div>
            {showCode && (
              <pre className="contribution-code">
                <code>{detail.snippet}</code>
              </pre>
            )}
          </div>

          <Link href={`/portfolio/${next.slug}/`} className="next-project">
            <span>Next project</span>
            <strong>{next.title}</strong>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Footer() {
  const [soundOn, setSoundOn] = useState(() => { try { return localStorage.getItem("pixelguild-sound") !== "off"; } catch { return true; } });
  const [cabinetOn, setCabinetOn] = useState(() => { try { return localStorage.getItem("pixelguild-cabinet") === "on"; } catch { return false; } });
  return (
    <footer className="site-footer page-pad">
      <div className="site-footer__mark"><BrandMark /><span>KV / KARTHIK VEERANALA</span></div>
      <div className="site-footer__middle"><Eyebrow>Keep in touch</Eyebrow><a href="mailto:veeranalakarthik@gmail.com">veeranalakarthik@gmail.com</a></div>
      <div className="site-footer__controls">
        <span>ARCADE CONTROLS</span>
        <button className="footer-control" onClick={() => { footerControls?.toggleCabinet(); setCabinetOn((value) => !value); }} aria-label={cabinetOn ? "Exit CRT cabinet mode" : "Enter CRT cabinet mode"}><Monitor size={13} /> {cabinetOn ? "CRT ON" : "CRT"}</button>
        <button className="footer-control" onClick={() => {
          footerControls?.toggleSound();
          setSoundOn((value) => {
            const next = !value;
            isSoundEnabled = next;
            try { localStorage.setItem("pixelguild-sound", next ? "on" : "off"); } catch {}
            return next;
          });
        }} aria-label={soundOn ? "Mute arcade sounds" : "Unmute arcade sounds"}>
          {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />} {soundOn ? "SFX ON" : "SFX OFF"}
        </button>
      </div>
      <div className="site-footer__bottom">
        <span>© 2026 KARTHIK VEERANALA / GAME DEVELOPMENT & DESIGN</span>
        <span className="footer-secret-hint" title="Psst... Ever typed the Konami Code on a game developer's website?">
          Built under constraints • <em>Do you know what the Konami Code is? Try entering it...</em> <Sparkles size={12} />
        </span>
      </div>
    </footer>
  );
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
  return <div className="boot-sequence" aria-label="Loading Karthik Veeranala portfolio"><div className="boot-sequence__logo">KV<span>_</span></div><div className="boot-sequence__bar"><i /></div><div className="boot-sequence__copy"><span>INITIALIZING PLAYER PROFILE</span><strong>LOADING WORLDS / 05</strong><small>UNREAL ENGINE // PLAYABLE WORLDS</small></div></div>;
}

function App() {
  const [booting, setBooting] = useState(() => { try { return !sessionStorage.getItem("pixelguild-booted"); } catch { return true; } });
  useEffect(() => { if (!booting) return; const timer = window.setTimeout(() => { try { sessionStorage.setItem("pixelguild-booted", "1"); } catch { /* no-op */ } setBooting(false); }, 1450); return () => window.clearTimeout(timer); }, [booting]);
  const baseUrl = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return (
    <ErrorBoundary>
      <WouterRouter base={baseUrl}>
        {booting && <BootSequence />}
        <SiteShell>
          <Router />
        </SiteShell>
      </WouterRouter>
    </ErrorBoundary>
  );
}

export default App;
