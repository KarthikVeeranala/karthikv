import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleUserRound,
  Code2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  MoveUpRight,
  Play,
  Send,
  Sparkles,
  Twitch,
  X,
  Youtube,
} from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

const ACCENT = "#16d6bd";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Demo Reel", href: "/demo-reel/" },
  { label: "Marketplace", href: "/marketplace/" },
  { label: "Blog", href: "/blog/" },
  { label: "Hobbies", href: "/hobbies/" },
  { label: "Bio & Contact", href: "/bio/" },
  { label: "GitHub", href: "/github/" },
];

const projects = [
  {
    slug: "emberline",
    title: "EMBERLINE",
    type: "Narrative systems / 2026",
    description: "A quiet sci-fi traversal study about memory, weather, and the paths players leave behind.",
    tags: ["Unity", "Systems", "Worldbuilding"],
    tone: "ember",
    stat: "01 / 04",
  },
  {
    slug: "moon-archive",
    title: "MOON ARCHIVE",
    type: "Puzzle adventure / 2025",
    description: "A tactile archive of impossible rooms, modular rules, and tiny discoveries hidden in plain sight.",
    tags: ["Godot", "UX", "Prototyping"],
    tone: "moon",
    stat: "02 / 04",
  },
  {
    slug: "hollow-signal",
    title: "HOLLOW SIGNAL",
    type: "Action prototype / 2024",
    description: "An atmospheric combat playground built around rhythm, response, and the tension before a reveal.",
    tags: ["Unreal", "Combat", "Direction"],
    tone: "signal",
    stat: "03 / 04",
  },
  {
    slug: "soft-reset",
    title: "SOFT RESET",
    type: "Experimental / 2023",
    description: "A tiny playable essay about the comfort of restarting and the stories we carry forward.",
    tags: ["Web", "Interaction", "Writing"],
    tone: "reset",
    stat: "04 / 04",
  },
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

function TopNav() {
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
        <a className="nav-link nav-link--github" href="https://github.com/" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={10} /></a>
        <Link href="/portfolio/" className={`nav-cta ${isActive("/portfolio/", location) ? "is-active" : ""}`}>Portfolio</Link>
      </nav>
      <button className="site-nav__menu" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </header>
  );
}

function SocialRail() {
  return (
    <aside className="social-rail" aria-label="Social links">
      <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={14} /></a>
      <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={14} /></a>
      <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={14} /></a>
      <a href="mailto:hello@example.com" aria-label="Email"><Mail size={14} /></a>
    </aside>
  );
}

function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <TopNav />
      {children}
      <SocialRail />
      <div className="site-cursor" aria-hidden="true"><span /></div>
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
      <div className="hero-video__caption"><span>THE UNDERGROUNDS</span><span>Atmosphere study / placeholder</span></div>
    </div>
  );
}

function ProjectVisual({ tone, label }: { tone: string; label: string }) {
  return (
    <div className={`project-visual project-visual--${tone}`}>
      <div className="project-visual__grid" />
      <div className="project-visual__orb" />
      <div className="project-visual__frame"><span>+</span><span>+</span><span>+</span><span>+</span></div>
      <span className="project-visual__label">{label}</span>
    </div>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  return (
    <Link href={`/portfolio/${project.slug}/`} className={`project-card project-card--${index % 2 === 0 ? "left" : "right"}`}>
      <ProjectVisual tone={project.tone} label={project.stat} />
      <div className="project-card__body">
        <div>
          <span className="project-card__type">{project.type}</span>
          <h3>{project.title}</h3>
        </div>
        <ArrowUpRight className="project-card__arrow" size={18} />
        <p>{project.description}</p>
        <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <main>
      <section className="home-hero page-pad" id="home">
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="hero-identity">
          <Eyebrow number="00">Independent game developer / placeholder</Eyebrow>
          <h1>PIXEL<br /><span>GUILD</span></h1>
          <div className="hero-identity__sub"><span>Game</span><b>Design</b><em>—</em><small>systems / worlds / play</small></div>
        </div>
        <div className="hero-side-note"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={16} /></div>
        <div className="hero-bottomline"><StatusPill /><span>BASED SOMEWHERE ON EARTH / UTC+00</span></div>
      </section>

      <section className="intro-chapter page-pad page-pad--chapter">
        <div className="chapter-index">01</div>
        <div className="intro-chapter__content">
          <Eyebrow>THE PLAYGROUND</Eyebrow>
          <h2>Ideas are<br /><span>levels</span> waiting<br />to be played.</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pixel Guild is a placeholder studio practice for curious worlds, expressive systems, and the quiet details that make a player lean closer.</p>
          <Link href="/bio/" className="text-link">Read the field notes <ArrowUpRight size={14} /></Link>
        </div>
        <div className="intro-chapter__sigil" aria-hidden="true"><span>◈</span><small>PG / 001</small></div>
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
        <div className="manifesto__content"><p>Every system hides a story. Every interface is a little world.</p><div className="manifesto__mark"><BrandMark /><span>PIXEL GUILD / 2026</span></div></div>
      </section>

      <Footer />
    </main>
  );
}

function PageHeader({ number, kicker, title, copy }: { number: string; kicker: string; title: React.ReactNode; copy: string }) {
  return <section className="page-header page-pad"><Eyebrow number={number}>{kicker}</Eyebrow><h1>{title}</h1><p>{copy}</p></section>;
}

function DemoReelPage() {
  const [playing, setPlaying] = useState(false);
  return <main className="inner-page"><PageHeader number="01" kicker="Demo reel" title={<>Rooms with a<br /><span>pulse.</span></>} copy="A placeholder cut of atmosphere, interaction, and the tiny transitions between one playable idea and the next." /><section className="reel-page__player page-pad"><div className="reel-player"><HeroVideo compact /><button className="reel-player__play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause reel" : "Play reel"}>{playing ? "Ⅱ" : <Play size={22} fill="currentColor" />}</button><div className="reel-player__bar"><span className="reel-player__progress" style={{ width: playing ? "42%" : "12%" }} /><span className="reel-player__time">00:00:06</span></div></div><div className="reel-page__meta"><div><Eyebrow>Credits</Eyebrow><p>Direction / Placeholder Name<br />Sound / Silent cut<br />Engine / Whatever feels right</p></div><div><Eyebrow>Chapters</Eyebrow><p>00:00 — The descent<br />00:02 — A signal wakes<br />00:05 — The threshold</p></div></div></section><section className="chapter-list page-pad"><div className="section-topline"><Eyebrow number="02">Selected chapters</Eyebrow><span className="muted-label">CLICK TO JUMP / PLACEHOLDER</span></div>{["The descent", "Glyph language", "A room remembers"].map((item, index) => <button key={item} className="chapter-row"><span>0{index + 1}</span><strong>{item}</strong><small>{index === 0 ? "00:00" : index === 1 ? "00:02" : "00:05"}</small><ArrowRight size={15} /></button>)}</section><Footer /></main>;
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
  const sideQuests = [{ title: "World sketching", label: "SIDE QUEST 01", copy: "Loose maps, impossible architecture, and a folder called final-final-2." }, { title: "Ambient collecting", label: "SIDE QUEST 02", copy: "Train stations, rain on glass, and the hum of machines nobody notices." }, { title: "Tiny experiments", label: "SIDE QUEST 03", copy: "One-button games and interfaces that only make sense after midnight." }];
  return <main className="inner-page"><PageHeader number="04" kicker="Hobbies" title={<>Side quests<br /><span>and odd jobs.</span></>} copy="The small practices around the work that keep the main quest from getting too serious." /><section className="hobby-map page-pad"><div className="hobby-map__topline"><Eyebrow>Personal map / placeholder</Eyebrow><span>3 LOCATIONS FOUND</span></div><div className="hobby-map__canvas"><div className="map-path" /><div className="map-node map-node--a"><span>01</span><b>LOOK</b></div><div className="map-node map-node--b"><span>02</span><b>LISTEN</b></div><div className="map-node map-node--c"><span>03</span><b>MAKE</b></div><div className="map-coordinates">42° 00′ 00″ N<br />PLACEHOLDER / EARTH</div></div></section><section className="side-quests page-pad">{sideQuests.map((quest, index) => <article className="side-quest" key={quest.title}><div className="side-quest__icon">{index === 0 ? "✦" : index === 1 ? "◌" : "⌁"}</div><div><Eyebrow>{quest.label}</Eyebrow><h2>{quest.title}</h2><p>{quest.copy}</p></div><ArrowUpRight size={17} /></article>)}</section><Footer /></main>;
}

function BioPage() {
  const [sent, setSent] = useState(false);
  return <main className="inner-page"><PageHeader number="05" kicker="Bio & Contact" title={<>Let’s make<br /><span>something playable.</span></>} copy="A placeholder bio for the person behind Pixel Guild, currently open to thoughtful collaborations, strange prototypes, and good questions." /><section className="bio-layout page-pad"><div className="bio-copy"><Eyebrow>About the player</Eyebrow><p className="bio-copy__lead">I’m a game developer and systems-minded designer exploring the space between a rule and the feeling it creates.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec ullamcorper nulla non metus auctor fringilla.</p><div className="bio-stats"><div><strong>08</strong><span>years making<br />playable things</span></div><div><strong>24</strong><span>worlds explored<br />in notes & prototypes</span></div><div><strong>∞</strong><span>placeholder<br />curiosity remaining</span></div></div><StatusPill>OPEN TO SELECT PROJECTS</StatusPill></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><Eyebrow>Send a signal</Eyebrow>{sent ? <div className="form-success"><Sparkles size={22} /><h2>Transmission received.</h2><p>Thanks for the placeholder message. I’ll return through the portal soon.</p><button type="button" className="text-link" onClick={() => setSent(false)}>Send another <ArrowRight size={14} /></button></div> : <><label>Name<input required placeholder="Your name" /></label><label>Signal path<input required type="email" placeholder="you@example.com" /></label><label>Message<textarea required placeholder="Tell me a little about the world you want to build..." rows={5} /></label><button className="button" type="submit">Send transmission <Send size={14} /></button></>}</form></section><Footer /></main>;
}

function GitHubPage() {
  const repos = ["world-builder", "soft-reset", "glyph-kit", "quiet-ui", "weather-system"];
  return <main className="inner-page"><PageHeader number="06" kicker="GitHub" title={<>Open source,<br /><span>open doors.</span></>} copy="A placeholder activity log for code, tools, experiments, and the useful mess that happens between releases." /><section className="github-layout page-pad"><div className="github-profile"><div className="profile-orbit"><CircleUserRound size={44} /></div><Eyebrow>Player profile</Eyebrow><h2>placeholder-name</h2><p>Systems / tools / game design</p><a href="https://github.com/" target="_blank" rel="noreferrer" className="text-link">Visit profile <ArrowUpRight size={14} /></a><div className="contribution-grid">{Array.from({ length: 84 }, (_, index) => <i key={index} className={index % 7 === 0 ? "is-hot" : index % 3 === 0 ? "is-warm" : ""} />)}</div><small>CONTRIBUTIONS / PLACEHOLDER / LAST 12 MONTHS</small></div><div className="repo-list"><div className="section-topline"><Eyebrow>Repositories</Eyebrow><span className="muted-label">5 PUBLIC / 0 PRIVATE</span></div>{repos.map((repo, index) => <a href="https://github.com/" target="_blank" rel="noreferrer" className="repo-row" key={repo}><Code2 size={17} /><div><strong>{repo}</strong><span>Placeholder repository description with a little useful context.</span></div><small>{index % 2 ? "TS" : "C#"}</small><ArrowUpRight size={15} /></a>)}</div></section><Footer /></main>;
}

function PortfolioPage() {
  const [filter, setFilter] = useState("ALL");
  const tags = ["ALL", "SYSTEMS", "WORLDS", "PROTOTYPES"];
  const filtered = filter === "ALL" ? projects : projects.filter((project) => project.tags.some((tag) => tag.toUpperCase().includes(filter.slice(0, -1))));
  return <main className="inner-page"><PageHeader number="07" kicker="Portfolio" title={<>Selected<br /><span>levels.</span></>} copy="A placeholder archive of game systems, worlds, interfaces, and small experiments built to be touched." /><section className="portfolio-page page-pad"><div className="filter-row">{tags.map((tag) => <button key={tag} className={filter === tag ? "is-selected" : ""} onClick={() => setFilter(tag)}>{tag}</button>)}</div><div className="portfolio-grid">{filtered.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div></section><Footer /></main>;
}

function ProjectPage({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug) ?? projects[0];
  const next = projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length];
  return <main className="inner-page project-page"><section className="project-page__hero page-pad"><Link href="/portfolio/" className="text-link"><ArrowLeft size={14} /> Back to portfolio</Link><div className="project-page__hero-copy"><Eyebrow>Project / {project.stat}</Eyebrow><h1>{project.title}</h1><p>{project.description}</p></div><ProjectVisual tone={project.tone} label="CASE STUDY / PLACEHOLDER" /></section><section className="project-detail page-pad"><div className="project-detail__facts"><div><Eyebrow>Role</Eyebrow><strong>Design / Direction / Placeholder</strong></div><div><Eyebrow>Stack</Eyebrow><strong>{project.tags.join(" / ")}</strong></div><div><Eyebrow>Status</Eyebrow><StatusPill>CASE STUDY PLACEHOLDER</StatusPill></div></div><div className="project-detail__copy"><p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is a replaceable case study intro for the core idea, the constraints, and the player-facing outcome.</p><div className="project-detail__columns"><div><h2>01 / The brief</h2><p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nulla vitae elit libero, a pharetra augue.</p></div><div><h2>02 / The result</h2><p>Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus.</p></div></div><div className="project-detail__gallery"><ProjectVisual tone={project.tone} label="MEDIA / 01" /><ProjectVisual tone="signal" label="MEDIA / 02" /></div><Link href={`/portfolio/${next.slug}/`} className="next-project"><span>Next project</span><strong>{next.title}</strong><ArrowRight size={20} /></Link></div></section><Footer /></main>;
}

function Footer() {
  return <footer className="site-footer page-pad"><div className="site-footer__mark"><BrandMark /><span>PIXEL GUILD</span></div><div className="site-footer__middle"><Eyebrow>Keep in touch</Eyebrow><a href="mailto:hello@example.com">hello@example.com</a></div><div className="site-footer__bottom"><span>© 2026 PIXEL GUILD / PLACEHOLDER STUDIO</span><span>Built for the next level <Sparkles size={12} /></span></div></footer>;
}

function Router() {
  const [location] = useLocation();
  const path = normalizePath(location);
  if (path === "/") return <Home />;
  if (path === "/demo-reel/") return <DemoReelPage />;
  if (path === "/marketplace/") return <MarketplacePage />;
  if (path === "/blog/") return <BlogPage />;
  if (path.startsWith("/blog/")) return <ArticlePage slug={path.split("/")[2]} />;
  if (path === "/hobbies/") return <HobbiesPage />;
  if (path === "/bio/") return <BioPage />;
  if (path === "/github/") return <GitHubPage />;
  if (path === "/portfolio/") return <PortfolioPage />;
  if (path.startsWith("/portfolio/")) return <ProjectPage slug={path.split("/")[2]} />;
  return <NotFoundPage />;
}

function NotFoundPage() {
  return <main className="not-found page-pad"><Eyebrow>404 / Uncharted</Eyebrow><h1>This level<br /><span>doesn’t exist.</span></h1><p>Maybe the map changed. Maybe the link was only a placeholder.</p><Link href="/" className="button">Return home <ArrowRight size={14} /></Link></main>;
}

function App() {
  return <ErrorBoundary><SiteShell><Router /></SiteShell></ErrorBoundary>;
}

export default App;
