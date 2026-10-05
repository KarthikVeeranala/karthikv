/**
 * Aicade Unified High-Performance Runtime Shim for Karthik's Game Design & Development Portfolio
 * Provides robust offline fallbacks, audio cache guards, animation error boundaries,
 * constructor-based VFXLibrary, delta-spike stabilization, and hardware-accelerated 60 FPS tuning
 * across all Phaser 3 prototypes.
 */

(function (window) {
  'use strict';

  // 1. AudioContext Auto-Resume on User Interaction
  function unlockAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && AudioCtx.state === 'suspended') {
        AudioCtx.resume().catch(() => {});
      }
      if (window.Phaser && window.Phaser.Sound && window.Phaser.Sound.BaseSoundManager) {
        if (window.Phaser.Sound.BaseSoundManager.prototype && window.Phaser.Sound.BaseSoundManager.prototype.context) {
          const ctx = window.Phaser.Sound.BaseSoundManager.prototype.context;
          if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
        }
      }
    } catch (e) {}
  }

  ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { once: true, passive: true });
  });

  // 2. Global Progress Loader
  window.displayProgressLoader = function () {
    try {
      const width =
        (this.cameras && this.cameras.main && this.cameras.main.width) ||
        (this.game && this.game.config && this.game.config.width) ||
        800;
      const height =
        (this.cameras && this.cameras.main && this.cameras.main.height) ||
        (this.game && this.game.config && this.game.config.height) ||
        600;

      const boxW = Math.min(300, width * 0.7);
      const boxH = 18;
      const x = (width - boxW) / 2;
      const y = height / 2;

      const bgBox = this.add.graphics();
      bgBox.fillStyle(0x181920, 0.85);
      bgBox.fillRoundedRect(x - 2, y - 2, boxW + 4, boxH + 4, 6);
      bgBox.lineStyle(1, 0x3f3f46, 0.6);
      bgBox.strokeRoundedRect(x - 2, y - 2, boxW + 4, boxH + 4, 6);

      const bar = this.add.graphics();

      this.load.on('progress', (val) => {
        bar.clear();
        bar.fillStyle(0xd97736, 1);
        bar.fillRoundedRect(x, y, Math.max(0, boxW * val), boxH, 4);
      });

      this.load.on('complete', () => {
        try {
          bgBox.destroy();
          bar.destroy();
        } catch (err) {}
      });
    } catch (e) {}
  };

  // --- PROCEDURAL TEXTURES GENERATOR ---
  function ensureProceduralTextures(scene) {
    if (!scene || !scene.textures) return;
    const t = scene.textures;

    if (!t.exists('vfx_spark')) {
      const cvs = t.createCanvas('vfx_spark', 12, 12);
      const ctx = cvs.context;
      ctx.fillStyle = '#ffeedd';
      ctx.beginPath();
      ctx.moveTo(6, 0); ctx.lineTo(8, 4); ctx.lineTo(12, 6); ctx.lineTo(8, 8);
      ctx.lineTo(6, 12); ctx.lineTo(4, 8); ctx.lineTo(0, 6); ctx.lineTo(4, 4);
      ctx.closePath();
      ctx.fill();
      cvs.refresh();
    }

    if (!t.exists('vfx_blood')) {
      const cvs = t.createCanvas('vfx_blood', 10, 10);
      const ctx = cvs.context;
      ctx.fillStyle = '#cc1122';
      ctx.beginPath();
      ctx.arc(5, 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff4455';
      ctx.beginPath();
      ctx.arc(4, 4, 1.5, 0, Math.PI * 2);
      ctx.fill();
      cvs.refresh();
    }

    if (!t.exists('vfx_smoke')) {
      const cvs = t.createCanvas('vfx_smoke', 24, 24);
      const ctx = cvs.context;
      const grad = ctx.createRadialGradient(12, 12, 2, 12, 12, 12);
      grad.addColorStop(0, 'rgba(210, 210, 220, 0.8)');
      grad.addColorStop(0.6, 'rgba(160, 160, 170, 0.4)');
      grad.addColorStop(1, 'rgba(120, 120, 130, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 24, 24);
      cvs.refresh();
    }

    if (!t.exists('vfx_shockwave')) {
      const cvs = t.createCanvas('vfx_shockwave', 48, 48);
      const ctx = cvs.context;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(24, 24, 21, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ff9933';
      ctx.beginPath();
      ctx.arc(24, 24, 19, 0, Math.PI * 2);
      ctx.stroke();
      cvs.refresh();
    }

    if (!t.exists('vfx_ember')) {
      const cvs = t.createCanvas('vfx_ember', 8, 8);
      const ctx = cvs.context;
      const grad = ctx.createRadialGradient(4, 4, 1, 4, 4, 4);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#ffaa00');
      grad.addColorStop(1, '#ff3300');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(4, 4, 4, 0, Math.PI * 2);
      ctx.fill();
      cvs.refresh();
    }

    if (!t.exists('vfx_dust')) {
      const cvs = t.createCanvas('vfx_dust', 14, 14);
      const ctx = cvs.context;
      const grad = ctx.createRadialGradient(7, 7, 1, 7, 7, 7);
      grad.addColorStop(0, 'rgba(235, 230, 215, 0.85)');
      grad.addColorStop(0.6, 'rgba(200, 190, 175, 0.35)');
      grad.addColorStop(1, 'rgba(180, 170, 155, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(7, 7, 7, 0, Math.PI * 2);
      ctx.fill();
      cvs.refresh();
    }

    if (!t.exists('vfx_casing')) {
      const cvs = t.createCanvas('vfx_casing', 8, 4);
      const ctx = cvs.context;
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(0, 0, 8, 4);
      ctx.fillStyle = '#997700';
      ctx.fillRect(0, 0, 2, 4);
      cvs.refresh();
    }
  }

  // --- INDIE AUDIO SYNTHESIZER ---
  class IndieAudioSynth {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.enabled = true;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      } catch (e) {}
    }

    _resume() {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    playSwordSwing(pitchMod = 1) {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800 * pitchMod, now);
        filter.frequency.exponentialRampToValueAtTime(2200 * pitchMod, now + 0.08);
        filter.Q.setValueAtTime(3, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(now);
      } catch (e) {}
    }

    playBladeClash(pitchMod = 1) {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(1400 * pitchMod, now);
        osc1.frequency.exponentialRampToValueAtTime(320 * pitchMod, now + 0.18);
        osc2.frequency.setValueAtTime(880 * pitchMod, now);
        osc2.frequency.exponentialRampToValueAtTime(220 * pitchMod, now + 0.15);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.22);
        osc2.stop(now + 0.22);
      } catch (e) {}
    }

    playFleshHit(pitchMod = 1) {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180 * pitchMod, now);
        osc.frequency.exponentialRampToValueAtTime(45 * pitchMod, now + 0.1);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    playGunshot(isShotgun = false) {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const dur = isShotgun ? 0.28 : 0.15;
        const bufferSize = Math.floor(this.ctx.sampleRate * dur);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isShotgun ? 2400 : 3800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + dur);

        const kick = this.ctx.createOscillator();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(isShotgun ? 140 : 200, now);
        kick.frequency.exponentialRampToValueAtTime(40, now + 0.08);

        const kickGain = this.ctx.createGain();
        kickGain.gain.setValueAtTime(0.7, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(isShotgun ? 0.7 : 0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        kick.connect(kickGain);
        kickGain.connect(this.masterGain);

        noise.start(now);
        kick.start(now);
        kick.stop(now + 0.1);
      } catch (e) {}
    }

    playExplosion() {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const dur = 0.5;
        const bufferSize = Math.floor(this.ctx.sampleRate * dur);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.linearRampToValueAtTime(120, now + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(now);
      } catch (e) {}
    }

    playShellPing() {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400 + Math.random() * 400, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {}
    }

    playGemChime(step = 0) {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        const freq = freqs[step % freqs.length];
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }

    playGroundRumble() {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {}
    }

    playBossRumble(durationMs = 600) {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const dur = (durationMs || 600) / 1000;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(55, now);
        osc1.frequency.exponentialRampToValueAtTime(25, now + dur);
        osc2.frequency.setValueAtTime(45, now);
        osc2.frequency.exponentialRampToValueAtTime(20, now + dur);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + dur);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + dur);
        osc2.stop(now + dur);
      } catch (e) {}
    }

    playJump() {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    }

    playStep() {
      if (!this.enabled) return;
      this._resume();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    }
  }

  const audioSynth = new IndieAudioSynth();
  window.IndieAudioSynth = audioSynth;

  // --- INDIE JUICE & GAME FEEL MANAGER ---
  const IndieJuice = {
    hitStop: function (scene, durationMs = 60, timeScale = 0.05) {
      if (!scene || scene._inHitStop) return;
      scene._inHitStop = true;
      try {
        const origTimeScale = (scene.physics && scene.physics.world && scene.physics.world.timeScale) || 1;
        if (scene.physics && scene.physics.world) {
          scene.physics.world.timeScale = 1 / timeScale;
        }
        if (scene.anims) {
          scene.anims.globalTimeScale = timeScale;
        }
        setTimeout(() => {
          try {
            if (scene.physics && scene.physics.world) {
              scene.physics.world.timeScale = origTimeScale;
            }
            if (scene.anims) {
              scene.anims.globalTimeScale = 1;
            }
            scene._inHitStop = false;
          } catch (e) {
            scene._inHitStop = false;
          }
        }, durationMs);
      } catch (err) {
        scene._inHitStop = false;
      }
    },

    screenShake: function (scene, a = 120, b = 0.012) {
      try {
        if (!scene || !scene.cameras || !scene.cameras.main) return;
        let duration = a;
        let intensity = b;
        if (typeof a === 'number' && typeof b === 'number') {
          if (a < 1 && b >= 1) {
            duration = b;
            intensity = a;
          } else {
            duration = a;
            intensity = b;
          }
        }
        scene.cameras.main.shake(duration, intensity);
      } catch (e) {}
    },

    flash: function (scene, color = 0xffffff, duration = 60) {
      try {
        if (scene && scene.cameras && scene.cameras.main) {
          const r = (color >> 16) & 255;
          const g = (color >> 8) & 255;
          const b = color & 255;
          scene.cameras.main.flash(duration, r, g, b);
        }
      } catch (e) {}
    },

    floatingText: function (scene, x, y, text, isCrit = false, styleOverride = null) {
      if (!scene || !scene.add) return;
      try {
        const baseStyle = isCrit
          ? {
              fontFamily: 'Arial Black, Impact, sans-serif',
              fontSize: '22px',
              fontStyle: 'bold',
              fill: '#ff3344',
              stroke: '#000000',
              strokeThickness: 4,
              shadow: { offsetX: 0, offsetY: 2, color: '#ffcc00', blur: 4, stroke: true, fill: true }
            }
          : {
              fontFamily: 'Arial Black, sans-serif',
              fontSize: '15px',
              fontStyle: 'bold',
              fill: '#ffcc22',
              stroke: '#000000',
              strokeThickness: 3
            };
        const style = Object.assign(baseStyle, styleOverride || {});
        const displayTxt = isCrit ? `CRIT! ${text}` : `${text}`;
        const txt = scene.add.text(x, y - 10, displayTxt, style).setOrigin(0.5).setDepth(200);

        const targetY = y - (isCrit ? 55 : 35);
        const randX = x + (Math.random() * 30 - 15);

        scene.tweens.add({
          targets: txt,
          x: randX,
          y: targetY,
          scale: isCrit ? { from: 1.6, to: 1.0 } : { from: 1.2, to: 1.0 },
          alpha: { from: 1, to: 0 },
          ease: 'Back.Out',
          duration: isCrit ? 900 : 650,
          onComplete: () => {
            try { txt.destroy(); } catch (e) {}
          }
        });
      } catch (e) {}
    },

    spawnSparks: function (scene, x, y, count = 8, color = 0xffeedd) {
      ensureProceduralTextures(scene);
      if (!scene || !scene.add) return;
      try {
        for (let i = 0; i < count; i++) {
          const spark = scene.add.image(x, y, 'vfx_spark').setDepth(150);
          spark.setTint(color);
          const angle = Math.random() * Math.PI * 2;
          const speed = 40 + Math.random() * 120;
          const destX = x + Math.cos(angle) * speed;
          const destY = y + Math.sin(angle) * speed;
          scene.tweens.add({
            targets: spark,
            x: destX,
            y: destY,
            alpha: 0,
            scale: { from: 1.2, to: 0.2 },
            duration: 250 + Math.random() * 200,
            ease: 'Cubic.Out',
            onComplete: () => { try { spark.destroy(); } catch (e) {} }
          });
        }
      } catch (e) {}
    },

    spawnShockwave: function (scene, x, y, maxScale = 1.8) {
      ensureProceduralTextures(scene);
      if (!scene || !scene.add) return;
      try {
        const ring = scene.add.image(x, y, 'vfx_shockwave').setDepth(140).setScale(0.2).setAlpha(0.9);
        scene.tweens.add({
          targets: ring,
          scale: maxScale,
          alpha: 0,
          duration: 320,
          ease: 'Quad.Out',
          onComplete: () => { try { ring.destroy(); } catch (e) {} }
        });
      } catch (e) {}
    },

    spawnBlood: function (scene, x, y, arg4, arg5, arg6) {
      ensureProceduralTextures(scene);
      if (!scene || !scene.add) return;
      try {
        let count = 8;
        let dir = 0;
        let color = 0xcc1122;

        if (typeof arg6 === 'number') {
          dir = arg4 || 0;
          color = arg5 || color;
          count = arg6;
        } else if (typeof arg4 === 'number' && (arg4 === 1 || arg4 === -1)) {
          dir = arg4;
          if (arg5) color = arg5;
          count = 8;
        } else if (typeof arg4 === 'number') {
          count = arg4;
          if (arg5) color = arg5;
        }

        for (let i = 0; i < count; i++) {
          const drop = scene.add.image(x, y, 'vfx_blood').setDepth(145);
          if (color) drop.setTint(color);
          const angle = dir !== 0 
            ? (dir > 0 ? (Math.random() * 0.8 - 0.4) : (Math.PI - (Math.random() * 0.8 - 0.4)))
            : (Math.random() * Math.PI * 2);
          const dist = 15 + Math.random() * 45;
          scene.tweens.add({
            targets: drop,
            x: x + Math.cos(angle) * dist,
            y: y + Math.sin(angle) * dist + 15,
            alpha: 0,
            scale: { from: 1.1, to: 0.4 },
            duration: 350 + Math.random() * 200,
            ease: 'Quad.Out',
            onComplete: () => { try { drop.destroy(); } catch (e) {} }
          });
        }
      } catch (e) {}
    },

    spawnDust: function (scene, x, y, count = 5) {
      ensureProceduralTextures(scene);
      if (!scene || !scene.add) return;
      try {
        for (let i = 0; i < count; i++) {
          const dust = scene.add.image(x, y, 'vfx_dust').setDepth(120).setScale(0.5);
          const angle = -Math.PI / 2 + (Math.random() * 1.4 - 0.7);
          const dist = 10 + Math.random() * 25;
          scene.tweens.add({
            targets: dust,
            x: x + Math.cos(angle) * dist,
            y: y + Math.sin(angle) * dist,
            alpha: 0,
            scale: { from: 0.6, to: 1.4 },
            duration: 300 + Math.random() * 200,
            ease: 'Sine.Out',
            onComplete: () => { try { dust.destroy(); } catch (e) {} }
          });
        }
      } catch (e) {}
    },

    spawnCasing: function (scene, x, y, dir = 1) {
      ensureProceduralTextures(scene);
      if (!scene || !scene.add) return;
      try {
        const casing = scene.add.image(x, y, 'vfx_casing').setDepth(110);
        const vx = (dir * (40 + Math.random() * 50));
        const vy = -(60 + Math.random() * 50);
        scene.tweens.add({
          targets: casing,
          x: x + vx,
          y: y + vy + 120,
          rotation: Math.PI * 4 * (Math.random() > 0.5 ? 1 : -1),
          alpha: { from: 1, to: 0 },
          duration: 450 + Math.random() * 150,
          ease: 'Cubic.In',
          onComplete: () => { try { casing.destroy(); } catch (e) {} }
        });
      } catch (e) {}
    }
  };

  window.IndieJuice = IndieJuice;

  // --- COMBO STREAK TRACKER ---
  class ComboTracker {
    constructor(scene) {
      this.scene = scene;
      this.streak = 0;
      this.lastHitTime = 0;
      this.timeout = 2200;
    }

    hit(x, y) {
      const now = Date.now();
      if (now - this.lastHitTime > this.timeout) {
        this.streak = 0;
      }
      this.streak++;
      this.lastHitTime = now;

      audioSynth.playGemChime(this.streak);

      const targetX = (typeof x === 'number' && !isNaN(x)) ? x : (this.scene && this.scene.player ? this.scene.player.x : 400);
      const targetY = (typeof y === 'number' && !isNaN(y)) ? y : (this.scene && this.scene.player ? this.scene.player.y - 25 : 300);

      if (this.streak >= 2) {
        this.showPopup(targetX, targetY);
      }
    }

    update() {
      if (this.streak > 0 && Date.now() - this.lastHitTime > this.timeout) {
        this.streak = 0;
      }
    }

    showPopup(x, y) {
      if (!this.scene || !this.scene.add) return;
      let label = `${this.streak}x COMBO!`;
      let color = '#ffbb33';
      if (this.streak >= 12) {
        label = `GODLIKE ${this.streak}x!`;
        color = '#ff1155';
        IndieJuice.screenShake(this.scene, 180, 0.015);
      } else if (this.streak >= 8) {
        label = `UNSTOPPABLE ${this.streak}x!`;
        color = '#ee33ff';
      } else if (this.streak >= 5) {
        label = `SAVAGE ${this.streak}x!`;
        color = '#ff4422';
      }

      try {
        const txt = this.scene.add.text(x, y - 40, label, {
          fontFamily: 'Arial Black, Impact, sans-serif',
          fontSize: this.streak >= 8 ? '24px' : '18px',
          fontStyle: 'bold',
          fill: color,
          stroke: '#000000',
          strokeThickness: 5
        }).setOrigin(0.5).setDepth(210);

        this.scene.tweens.add({
          targets: txt,
          y: y - 80,
          scale: { from: 1.4, to: 1.0 },
          alpha: { from: 1, to: 0 },
          ease: 'Back.Out',
          duration: 900,
          onComplete: () => { try { txt.destroy(); } catch (e) {} }
        });
      } catch (e) {}
    }
  }

  window.ComboTracker = ComboTracker;

  // 3. Class-based VFXLibrary
  class VFXLibrary {
    constructor(scene) {
      this.scene = scene;
      ensureProceduralTextures(scene);
    }

    createEmitter(config) {
      const scene = this.scene;
      ensureProceduralTextures(scene);
      return {
        explode: function (count, x, y) {
          const cfg = config || {};
          const px = typeof x === 'number' ? x : (cfg.x || 0);
          const py = typeof y === 'number' ? y : (cfg.y || 0);
          IndieJuice.spawnSparks(scene, px, py, count || 10);
        },
        start: function () {},
        stop: function () {},
        setPosition: function (x, y) {
          if (config) { config.x = x; config.y = y; }
        },
        destroy: function () {}
      };
    }

    createFloatingText(x, y, text, style) {
      IndieJuice.floatingText(this.scene, x, y, text, false, style);
    }

    screenShake(duration, intensity) {
      IndieJuice.screenShake(this.scene, duration, intensity);
    }

    static createEmitter(scene, config) {
      ensureProceduralTextures(scene);
      return {
        explode: function (count, x, y) {
          const cfg = config || {};
          const px = typeof x === 'number' ? x : (cfg.x || 0);
          const py = typeof y === 'number' ? y : (cfg.y || 0);
          IndieJuice.spawnSparks(scene, px, py, count || 10);
        },
        start: function () {},
        stop: function () {},
        setPosition: function (x, y) {
          if (config) { config.x = x; config.y = y; }
        },
        destroy: function () {}
      };
    }

    static createFloatingText(scene, x, y, text, style) {
      IndieJuice.floatingText(scene, x, y, text, false, style);
    }

    static screenShake(scene, duration, intensity) {
      IndieJuice.screenShake(scene, duration, intensity);
    }
  }

  VFXLibrary.sparks = IndieJuice.spawnSparks;
  VFXLibrary.shockwave = IndieJuice.spawnShockwave;
  VFXLibrary.blood = IndieJuice.spawnBlood;
  VFXLibrary.dust = IndieJuice.spawnDust;
  VFXLibrary.hitStop = IndieJuice.hitStop;
  VFXLibrary.ensureTextures = ensureProceduralTextures;

  window.VFXLibrary = VFXLibrary;

  // 4. Warning Deduplicator to Eliminate Hot-Loop Console Overhead
  const warnedSet = new Set();
  function warnOnce(msg) {
    if (!warnedSet.has(msg)) {
      warnedSet.add(msg);
      // Suppress console spam completely in production to maintain 60 FPS
    }
  }

  // 5. Dummy Sound Constructor
  function createDummySound(key) {
    return {
      key: key || 'dummy',
      isPlaying: false,
      isPaused: false,
      totalRate: 1,
      duration: 0,
      totalDuration: 0,
      volume: 0,
      markers: {},
      currentMarker: null,
      play: function () { return this; },
      pause: function () { return this; },
      resume: function () { return this; },
      stop: function () { return this; },
      destroy: function () { return this; },
      setVolume: function () { return this; },
      setRate: function () { return this; },
      setSeek: function () { return this; },
      setLoop: function () { return this; },
      setMute: function () { return this; },
      on: function () { return this; },
      once: function () { return this; },
      off: function () { return this; },
      emit: function () { return this; },
      addListener: function () { return this; },
      removeListener: function () { return this; },
      removeAllListeners: function () { return this; }
    };
  }

  // 6. High-Performance Phaser Patching & Game Wrapper
  let phaserPatched = false;

  function patchPhaser() {
    if (!window.Phaser || phaserPatched) return;

    // A. Wrap Phaser.Game to automatically inject hardware acceleration & smooth FPS
    const OriginalPhaserGame = window.Phaser.Game;
    if (OriginalPhaserGame && !OriginalPhaserGame.__patchedPerformance) {
      const PatchedGame = function (userConfig) {
        const cfg = userConfig || {};

        // Force hardware WebGL renderer with high performance preferences
        cfg.type = window.Phaser.AUTO;
        cfg.render = Object.assign({
          powerPreference: 'high-performance',
          desynchronized: true,
          antialias: false,
          pixelArt: true,
          roundPixels: true,
          batchSize: 4096,
          clearBeforeRender: true
        }, cfg.render || {});

        // Enforce rock-solid 60 FPS loop with smooth stepping
        cfg.fps = Object.assign({
          target: 60,
          min: 30,
          forceSetTimeOut: false,
          smoothStep: true,
          deltaHistory: 10,
          panicMax: 60
        }, cfg.fps || {});

        // Physics step tuning to eliminate lag cascades
        if (cfg.physics) {
          if (cfg.physics.arcade) {
            cfg.physics.arcade.fps = 60;
            cfg.physics.arcade.fixedStep = true;
          }
          if (cfg.physics.matter) {
            cfg.physics.matter.runner = Object.assign({
              isFixed: true,
              fps: 60
            }, cfg.physics.matter.runner || {});
          }
        }

        const gameInstance = new OriginalPhaserGame(cfg);

        // Anti-Spiral-of-Death: Clamp delta times to prevent physics catch-up lag spikes
        gameInstance.events.once('boot', function () {
          const loop = gameInstance.loop;
          if (loop) {
            const origStep = loop.step;
            loop.step = function (time) {
              if (this.delta > 33.33) {
                this.delta = 33.33; // Never exceed ~30fps step duration to prevent freeze
              }
              return origStep.call(this, time);
            };
          }
        });

        return gameInstance;
      };

      PatchedGame.prototype = OriginalPhaserGame.prototype;
      PatchedGame.__patchedPerformance = true;
      window.Phaser.Game = PatchedGame;
    }

    // B. Sound Safety Guards (silently fallback without CPU stalls)
    if (window.Phaser.Sound) {
      const soundClasses = [
        window.Phaser.Sound.WebAudioSoundManager,
        window.Phaser.Sound.HTML5AudioSoundManager,
        window.Phaser.Sound.BaseSoundManager,
        window.Phaser.Sound.NoAudioSoundManager
      ].filter(Boolean);

      soundClasses.forEach(cls => {
        const Proto = cls.prototype;
        if (!Proto) return;

        if (!Proto.__patchedAudioAdd) {
          const origAdd = Proto.add;
          Proto.add = function (key, config) {
            const hasCache = (this.game && this.game.cache && this.game.cache.audio && this.game.cache.audio.has(key)) ||
                             (this.cache && this.cache.audio && this.cache.audio.has(key));
            if (!hasCache) {
              warnOnce('Missing sound: ' + key);
              return createDummySound(key);
            }
            const safeConfig = config ? Object.assign({}, config) : {};
            safeConfig.volume = typeof safeConfig.volume === 'number' ? Math.min(safeConfig.volume, 0.25) : 0.25;
            try {
              const snd = origAdd.call(this, key, safeConfig);
              if (snd && typeof snd.volume === 'number') snd.volume = Math.min(snd.volume, 0.25);
              return snd;
            } catch (err) {
              return createDummySound(key);
            }
          };
          Proto.__patchedAudioAdd = true;
        }

        if (!Proto.__patchedAudioPlay) {
          const origPlay = Proto.play;
          Proto.play = function (key, extra) {
            const hasCache = (this.game && this.game.cache && this.game.cache.audio && this.game.cache.audio.has(key)) ||
                             (this.cache && this.cache.audio && this.cache.audio.has(key));
            if (!hasCache) {
              return false;
            }
            try {
              const safeExtra = extra ? Object.assign({}, extra) : {};
              if (typeof safeExtra.volume === 'number') safeExtra.volume = Math.min(safeExtra.volume, 0.25);
              return origPlay.call(this, key, safeExtra);
            } catch (err) {
              return false;
            }
          };
          Proto.__patchedAudioPlay = true;
        }
      });
    }

    // C. Animation Frame Safety Guard (fast-path without spam)
    if (window.Phaser.Animations && window.Phaser.Animations.AnimationState) {
      const AnimProto = window.Phaser.Animations.AnimationState.prototype;
      if (!AnimProto.__patchedAnimPlay) {
        const origPlay = AnimProto.play;
        AnimProto.play = function (key, ignoreIfPlaying) {
          try {
            const animKey = typeof key === 'string' ? key : (key && key.key);
            const anim = this.animationManager ? this.animationManager.get(animKey) : null;
            if (!anim || !anim.frames || anim.frames.length === 0) {
              return this.parent || this;
            }
            return origPlay.call(this, key, ignoreIfPlaying);
          } catch (err) {
            return this.parent || this;
          }
        };
        AnimProto.__patchedAnimPlay = true;
      }
    }

    phaserPatched = true;
  }

  // Hook patching into load events
  patchPhaser();
  window.addEventListener('DOMContentLoaded', patchPhaser);
  window.addEventListener('load', patchPhaser);

  // Poll briefly until Phaser is loaded, then cease polling immediately
  let pollCount = 0;
  const pollTimer = setInterval(() => {
    pollCount++;
    if (window.Phaser) {
      patchPhaser();
      clearInterval(pollTimer);
    } else if (pollCount > 30) {
      clearInterval(pollTimer);
    }
  }, 100);

  // 7. Parent Portfolio Window Event Messaging
  window.addEventListenersPhaser = function (game) {
    window.addEventListener('message', (event) => {
      if (!event.data || !game) return;
      if (event.data.type === 'PAUSE_GAME') {
        game.isPaused = true;
        if (game.sound) game.sound.pauseAll();
      } else if (event.data.type === 'RESUME_GAME') {
        game.isPaused = false;
        if (game.sound) game.sound.resumeAll();
      } else if (event.data.type === 'MUTE_AUDIO') {
        if (game.sound) game.sound.mute = event.data.value;
      }
    });
  };

  window.initiateGameOver = function (data) {
    try {
      window.parent.postMessage({ type: 'AICADE_GAME_OVER', data: data }, '*');
    } catch (e) {}
  };

  window.handlePauseGame = function (isPaused) {
    try {
      window.parent.postMessage({ type: 'AICADE_GAME_PAUSED', isPaused: isPaused }, '*');
    } catch (e) {}
  };

  // Safe global fallback for BraincadeSDK
  window.BraincadeSDK = window.BraincadeSDK || {
    init: function () { return Promise.resolve(); },
    ready: function () { return Promise.resolve(); }
  };

})(window);
