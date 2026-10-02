# Pixel Guild — Implementation Plan

## Product scope
Responsive game developer portfolio inspired by the supplied reference: near-black long-scroll composition, tiny utility navigation, oversized centered hero wordmark, teal accent, sparse social rail, and cinematic pacing. The new experience keeps the restraint but adds game-inspired HUD signals, project chapters, playable-feeling controls, and placeholder/lorem ipsum copy.

## Design direction
- **Design movement:** cinematic game UI / editorial portfolio hybrid.
- **Core principles:** quiet immersion, precise utility, high-contrast focus, tactile feedback.
- **Color philosophy:** charcoal-black grounds the page like a dark game viewport; bone white carries the editorial type; signal teal is the ownable accent for active states, cursor trails, and magical UI energy; rust/orange is reserved for rare status markers.
- **Layout paradigm:** long-scroll narrative with asymmetrical chapter reveals rather than a centered card grid; content floats inside a broad viewport with vertical rails and offset project panels.
- **Signature elements:** teal scanlines and glyph ticks, thin circular HUD frames, and a persistent social/navigation rail.
- **Interaction philosophy:** navigation feels like selecting a game menu; hover/focus states brighten the teal signal, cards lift slightly, and buttons use compact monospace labels with clear focus rings.
- **Animation:** slow ambient glow, subtle grain and drift, measured reveal transitions, no distracting loops; prefers opacity/transform and respects reduced-motion.
- **Typography system:** Space Grotesk for expressive headings, IBM Plex Mono for navigation, metadata, labels, and HUD readouts.
- **Brand essence:** a portfolio that feels like entering a handcrafted game world — focused, atmospheric, and built for collaborators.
- **Voice:** direct, curious, quietly confident. Example lines: “Play the work.” / “Every system hides a story.”
- **Wordmark & logo:** pixel-guild mark formed by three offset corner brackets around a small diamond glyph, paired with the PIXEL GUILD wordmark.
- **Signature brand color:** Signal Teal `#16d6bd`.

## Structure
- `client/src/App.tsx`: shared shell, route selection, all portfolio page compositions, content data, interactions.
- `client/src/index.css`: design tokens, reset, responsive layout, motion, scanline/grain treatments, typography.
- `public/manus-routes.json`: route manifest for home, top-level pages, and dynamic project/article paths.
- `public/dungeon-reel.mp4`: generated silent hero reel, used as a background video with CSS fallback.
- `app.config.ts`: project logo metadata.

## Routes
- `/`
- `/demo-reel/`
- `/marketplace/`
- `/blog/`
- `/blog/:slug`
- `/hobbies/`
- `/bio/`
- `/github/`
- `/portfolio/`
- `/portfolio/:slug`

## Implementation choices
- Keep the project static-friendly; no server or database needed for placeholders.
- Use wouter for route parsing and `Link` for navigation.
- Use native video controls only on the reel page; home video is muted/autoplay/loop with a text fallback.
- Form submit is client-only with a success state; no external side effect.
- All content is replaceable data; links use safe placeholders.
