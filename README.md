# 🕹️ Karthik Veeranala — Interactive Game Developer Portfolio

<div align="center">
  <p align="center">
    <a href="https://karthikveeranala.github.io/portfolio/">
      <img alt="Interactive Portfolio" src="https://img.shields.io/badge/Playable_Portfolio-Live_Site-0066A1?style=flat&labelColor=1f1f1f&color=56f7d2&logo=googlechrome&logoColor=white">
    </a>
    <a href="https://karthikveeranala.github.io/portfolio/demo-reel/">
      <img alt="Demo Reel" src="https://img.shields.io/badge/Demo_Reel-Watch_Now-red?style=flat&labelColor=1f1f1f&color=ff4757&logo=youtube&logoColor=white">
    </a>
    <a href="https://karthikveeranala.github.io/portfolio/arcade/">
      <img alt="Playable Prototypes" src="https://img.shields.io/badge/Arcade_Vault-8_Live_Games-purple?style=flat&labelColor=1f1f1f&color=9b59b6&logo=itch.io&logoColor=white">
    </a>
    <a href="https://github.com/KarthikVeeranala/portfolio/actions/workflows/deploy.yml">
      <img alt="GitHub Pages Deployment" src="https://github.com/KarthikVeeranala/portfolio/actions/workflows/deploy.yml/badge.svg">
    </a>
  </p>
</div>

Welcome to the source repository for **Karthik Veeranala's Interactive Portfolio** (`portfolio`). 

This web application is an arcade-cabinet and CRT-inspired portfolio engineered with **React 19, Vite, TypeScript, and Tailwind CSS**, featuring an embedded **Phaser 3 / Matter.js Arcade Vault**, interactive terminal simulation, sound effects, and comprehensive case studies for Unreal Engine C++ combat systems, Win32 automation tooling, and hackathon-winning titles.

---

## ⚡ Quick Links

- **🌐 Live Deployment**: [https://karthikveeranala.github.io/portfolio/](https://karthikveeranala.github.io/portfolio/)
- **🎬 2-Minute Demo Reel**: [https://karthikveeranala.github.io/portfolio/demo-reel/](https://karthikveeranala.github.io/portfolio/demo-reel/)
- **🕹️ 2D Arcade Vault**: [https://karthikveeranala.github.io/portfolio/arcade/](https://karthikveeranala.github.io/portfolio/arcade/)
- **👤 GitHub Profile**: [https://github.com/KarthikVeeranala](https://github.com/KarthikVeeranala)

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 19, TypeScript
- **Bundler & Build**: Vite
- **Styling**: Tailwind CSS, PostCSS, Custom Retro CRT scanline shaders & glowing neon animations
- **Arcade Engines**: Phaser 3 (WebGL / Canvas), Matter.js Physics Engine
- **Icons & UI**: Lucide React, Custom Gamepad / Arcade SVG components
- **Deployment**: Automated GitHub Pages CI/CD workflow (`.github/workflows/deploy.yml`)

---

## 🌟 Key Features

1. **Arcade Vault (8 Playable Games)**:
   - Direct in-browser gameplay with keyboard and touch/gamepad controls.
   - Includes *City of Aethel* (IGDC 2024 Top 45 Finalist), *Total Crush*, *Ragdoll Rampage*, and more.
2. **Interactive Terminal & Gamepad Navigation**:
   - Keyboard hotkeys (`[1]` - `[6]`, `[ESC]`) and responsive arcade controller HUD.
3. **Deep Engineering Case Studies**:
   - Detailed write-ups on *The Interlude* (UE4 6-DOF dogfighting), *ByteOasis* (in-game CLI), *Geek'O'Wars* (cyber TPS), and the *Headless E2E Automation Suite* (UE 5.7 C++ Win32 harness).
4. **Day / Night Themes & Responsive Layout**:
   - Fully optimized for desktop, tablets, and mobile screens.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- pnpm or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/KarthikVeeranala/portfolio.git

# Navigate into directory
cd portfolio

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Production Build

```bash
# Build production bundle
pnpm run build

# Preview build locally
pnpm run preview
```

---

## 📂 Project Structure

```
portfolio/
├── client/
│   ├── public/
│   │   ├── arcade_games/          # Self-contained Phaser 3 game builds
│   │   ├── portfolio_media/       # Action captures, thumbnails & media assets
│   │   └── audio/                 # UI click, blip, and retro sound effects
│   └── src/
│       ├── components/            # UI components (Navbar, ArcadeCabinet, Terminal, etc.)
│       ├── App.tsx                # Pages and routing (Home, Projects, Skills, DemoReel, Arcade)
│       └── index.css              # Custom CRT, themes & arcade styling
├── portfolio_media/               # Root media mirror for GitHub direct linking
├── .github/workflows/deploy.yml   # Automated GitHub Pages deployment
└── README.md                      # Repository overview & setup guide
```

---

## 📬 Contact & Connect

- **Portfolio**: [karthikveeranala.github.io/portfolio/](https://karthikveeranala.github.io/portfolio/)
- **LinkedIn**: [linkedin.com/in/karthikveeranala/](https://www.linkedin.com/in/karthikveeranala/)
- **Email**: [veeranalakarthik@gmail.com](mailto:veeranalakarthik@gmail.com)
- **Discord**: `karthikkkkv`
