# Karthik Veeranala — Game Developer & Game Designer

> **Unreal Engine 5.7 / C++ Gameplay Engineer & 2D Arcade Engine Architect**  
> B.Tech Computer Science & Engineering (IARE Hyderabad) | President, Elysium Gaming Club (200+ Developers)  
> 🏆 1st Place CodeDay 2.0 • 🥈 2nd Place HackRush • 🥉 Top 3 FrostHacks (MLH) • 🎖️ Top 45 IGDC Indie Finalist  

[![GitHub Pages Deployment](https://github.com/KarthikVeeranala/karthikv/actions/workflows/deploy.yml/badge.svg)](https://github.com/KarthikVeeranala/karthikv/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

---

## 🎮 Portfolio Overview

An interactive, retro-arcade-inspired portfolio built to showcase production Unreal Engine C++ gameplay systems, custom Slate/UMG automation harnesses, 6-DOF Newtonian flight physics, and eight playable 2D HTML5/Phaser prototypes developed during my gameplay engineering tenure at **Aicade**.

- **Live Site**: [https://karthikveeranala.github.io/karthikv/](https://karthikveeranala.github.io/karthikv/)
- **LinkedIn**: [linkedin.com/in/karthikveeranala/](https://www.linkedin.com/in/karthikveeranala/)
- **Discord**: `karthikkkkv`
- **Email**: [karthik.veeranala@gmail.com](mailto:karthik.veeranala@gmail.com)

---

## 🚀 Flagship Game Development Projects

| Project | Role & Focus | Engine & Tech | Accolade / Highlight |
| :--- | :--- | :--- | :--- |
| **Headless E2E Automation Suite** | Systems & Automation Engineer | Unreal Engine 5.7, C++, Win32, Slate/UMG | Project-agnostic headless harness, recursive widget discovery, Win32 raw backbuffer streaming to FFmpeg. |
| **The Interlude** | Solo Lead Combat & Gameplay Dev | Unreal Engine 4, C++, 6-DOF Newtonian Physics | **🥇 1st Place Overall** (CodeDay 2.0) — Zero-G thruster inertia, predictive lead-target AI, Niagara laser trails. |
| **ByteOasis** | Lead Gameplay & Mechanics Dev | Unreal Engine 4, C++, Terminal Sim | **🥈 2nd Place Overall** (HackRush) — Custom CLI command parser, reflection shaders, algorithmic island puzzles. |
| **Geek-O-Wars** | Lead Gameplay & Shaders Dev | Unreal Engine 4.21, C++, Custom Shaders | **🥉 Top 3 Overall** (FrostHacks / MLH) — Third-person shooter with weapon overheating curves and malware wave AI. |
| **City of Aethel & 2D Arcade** | Lead Combat Designer & Engine Dev | Phaser 3, WebGL, Matter.js, State Machines | **🎖️ Top 45 Finalist** (IGDC 2024) — 5-hit attack combo buffering, 180ms i-frame dodge rolls, 8 playable web prototypes. |

---

## 🕹️ Playable 2D Web Prototypes (Aicade Showcase)

All eight production-grade 2D prototypes built at Aicade are bundled and playable in-browser directly via the `/arcade/` route:

1. **City of Aethel** (`/arcade/?game=city_of_aethel`)
   - *Category*: Action & Combat (16:9 Landscape)
   - *Mechanics*: 5-hit melee attack buffer, 180ms i-frame dodge roll, posture-breaking parries, multi-phase boss fight.
2. **Total Crush: Demolition Ballistics** (`/arcade/?game=angle_trajectory_shooter`)
   - *Category*: Physics & Ragdoll (16:9 Landscape)
   - *Mechanics*: Matter.js 2D rigid-body simulation, parabolic trajectory prediction, structural collapse impulses.
3. **Cannon Rampart** (`/arcade/?game=canon_forcareer`)
   - *Category*: Action & Combat (16:9 Landscape)
   - *Mechanics*: Defensive turret ballistics, dynamic wave spawner, projectile travel time balancing, area-of-effect damage.
4. **Ragdoll Rampage** (`/arcade/?game=kickthebuddy`)
   - *Category*: Physics & Ragdoll (16:9 Landscape)
   - *Mechanics*: Multi-joint skeletal ragdoll with Verlet integration, spring constraints, impulse velocity scaling.
5. **Skyward Cannon: Mobile Defense** (`/arcade/?game=vertical_canon`)
   - *Category*: Action & Combat (9:16 Portrait)
   - *Mechanics*: Vertical screen interception shooter, procedural screen shake FX, combo multipliers, touch/mouse drag aim.
6. **Into the Beastverse** (`/arcade/?game=harrypotter`)
   - *Category*: Action & Combat (16:9 Landscape)
   - *Mechanics*: Magic missile projectile homing, shield warding mechanics, multi-phase mana boss choreography.
7. **Maze Runner** (`/arcade/?game=maze_runner`)
   - *Category*: Platformer & Exploration (16:9 Landscape)
   - *Mechanics*: Top-down tilemap collision, waypoint patrol AI nodes, line-of-sight stealth detection cones.
8. **Tower Ascent: Dungeon Escape** (`/arcade/?game=vertical_maze`)
   - *Category*: Platformer & Exploration (16:9 Landscape)
   - *Mechanics*: Vertical ascent platformer, ladder climbing finite state machines, moving hazards, jump buffer timing.

---

## 👾 Retro Retention Features & Developer Console

- **Konami Code Activation**: Press `↑ ↑ ↓ ↓ ← → ← → B A` anywhere on the site to unlock the **Karthik V Developer Console v2.0**.
- **Console Commands**:
  - `help` / `?`: Display full command directory.
  - `cd <page>` / `cd/<page>`: Warp instantly to any route (`arcade`, `backstory`, `demo-reel`, `skills`, `hobbies`, `bio`, `portfolio`).
  - `theme <palette>`: Switch color palettes (`cobalt`, `bloodmoon`, `matrix`, `tokyo`, `neon`).
  - `pellets` / `feed`: Spawn golden pellet shower for the Pac-Man companion.
  - `godmode`: Grant 9999 HP & +500 damage in the Boss Reflex Arena.
  - `matrix`: Cascading digital phosphor rain.
  - `bighead`: Giant Pac-Man mascot mode.
  - `disco`: Cyber rainbow color hue cycling.
- **Interactive Companion**: Click the custom Pac-Man mascot to pause/resume movement or drag it anywhere on screen.
- **Boss Reflex Arena**: Timed reflex boss fight on `/arcade/` featuring windup telegraphs, a golden 600ms parry window, and posture stuns.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom CSS Variables, Pixel Retro Font Typography (`Press Start 2P`, `VT323`)
- **Routing**: Wouter (Lightweight client-side router with GitHub Pages SPA 404 fallback redirection)
- **Icons**: Lucide React
- **Game Engines**: Unreal Engine 5.7 / 4 (C++), Phaser 3 (WebGL/Canvas), Matter.js
- **Audio**: Web Audio API Procedural Synthesizer (Chiptune oscs for clicks, transitions, parries, hits, and wins)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 20+
- npm (or pnpm)

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000/`.

### Build Production Bundle
```bash
npm run build
```
Generates optimized static assets in `dist/`.

### Preview Production Build
```bash
npm run preview
```

---

## 🚢 Deployment (GitHub Pages)

This repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

1. Every commit pushed to `main` triggers automated build and validation.
2. The compiled static distribution (`dist/`) is deployed to GitHub Pages.
3. `client/public/404.html` and SPA redirect handler in `client/index.html` ensure clean client-side routing across all direct URLs.

---

© 2026 Karthik Veeranala. All rights reserved.
