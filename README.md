# 🕹️ Karthik Veeranala — Interactive Game Developer Portfolio

<div align="center">
  <a href="https://karthikveeranala.github.io/karthikv/">
    <img src="client/public/portfolio_media/screenshots/the_interlude/interlude_maxres_thumbnail.jpg" width="100%" alt="Karthik Veeranala Portfolio Banner" style="border-radius: 8px; border: 2px solid #56f7d2;" />
  </a>
  <p align="center">
    <a href="https://karthikveeranala.github.io/karthikv/">
      <img alt="Interactive Portfolio" src="https://img.shields.io/badge/Playable_Portfolio-Live_Site-0066A1?style=flat&labelColor=1f1f1f&color=56f7d2&logo=googlechrome&logoColor=white">
    </a>
    <a href="https://karthikveeranala.github.io/karthikv/demo-reel/">
      <img alt="Demo Reel" src="https://img.shields.io/badge/Demo_Reel-Watch_Now-red?style=flat&labelColor=1f1f1f&color=ff4757&logo=youtube&logoColor=white">
    </a>
    <a href="https://karthikveeranala.github.io/karthikv/arcade/">
      <img alt="Playable Prototypes" src="https://img.shields.io/badge/Arcade_Vault-8_Live_Games-purple?style=flat&labelColor=1f1f1f&color=9b59b6&logo=itch.io&logoColor=white">
    </a>
    <a href="https://github.com/KarthikVeeranala/karthikv/actions/workflows/deploy.yml">
      <img alt="GitHub Pages Deployment" src="https://github.com/KarthikVeeranala/karthikv/actions/workflows/deploy.yml/badge.svg">
    </a>
  </p>
</div>

Welcome to the source repository for **Karthik Veeranala's Interactive Portfolio** (`karthikv`). 

This web application is an arcade-cabinet and CRT-inspired portfolio engineered with **React 19, Vite, TypeScript, and Tailwind CSS**, featuring an embedded **Phaser 3 / Matter.js Arcade Vault**, interactive terminal simulation, sound effects, and comprehensive case studies for Unreal Engine C++ combat systems, Win32 automation tooling, and hackathon-winning titles.

---

## ⚡ Quick Links

- **🌐 Live Deployment**: [https://karthikveeranala.github.io/karthikv/](https://karthikveeranala.github.io/karthikv/)
- **🎬 2-Minute Demo Reel**: [https://karthikveeranala.github.io/karthikv/demo-reel/](https://karthikveeranala.github.io/karthikv/demo-reel/)
- **🕹️ 2D Arcade Vault**: [https://karthikveeranala.github.io/karthikv/arcade/](https://karthikveeranala.github.io/karthikv/arcade/)
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
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/KarthikVeeranala/karthikv.git

# Navigate to client directory
cd karthikv/client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 📂 Project Structure

```
karthikv/
├── client/
│   ├── public/
│   │   ├── arcade_games/          # Self-contained Phaser 3 game builds
│   │   ├── portfolio_media/       # Action captures, thumbnails & media assets
│   │   └── audio/                 # UI click, blip, and retro sound effects
│   ├── src/
│   │   ├── components/            # UI components (Navbar, ArcadeCabinet, Terminal, etc.)
│   │   ├── pages/                 # Routing pages (Home, Projects, Skills, DemoReel, Arcade)
│   │   ├── data/                  # Project datasets and timeline entries
│   │   └── context/               # Audio, theme, and controller state contexts
│   └── package.json
├── portfolio_media/               # Root media mirror for GitHub direct linking
├── PROFILE_README.md              # Source for GitHub Profile (KarthikVeeranala/KarthikVeeranala)
└── README.md                      # Repository overview & setup guide
```

---

## 📬 Contact & Connect

- **Portfolio**: [karthikveeranala.github.io/karthikv/](https://karthikveeranala.github.io/karthikv/)
- **LinkedIn**: [linkedin.com/in/karthikveeranala/](https://www.linkedin.com/in/karthikveeranala/)
- **Email**: [veeranalakarthik@gmail.com](mailto:veeranalakarthik@gmail.com)
- **Discord**: `karthikkkkv`
