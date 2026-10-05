// Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });

        // --- CHANGE: Moved this.THEME inside the constructor ---
        
        this.THEME = {
            RED: '#e74c3c',
            BROWN: '#6d4c41',
            WHITE: '#ffffff',
            BLACK: '#000000',
            PANEL_BG: 0x2c3e50,
            PANEL_BORDER: 0x000000,
            TEXT_LIGHT: '#ffffff',
            TEXT_DARK: '#2c3e50',
            SUCCESS: '#2ecc71',
                TITLE_TEXT_STYLE: {
        fontFamily: 'Arial Black', // Or a similar bold font
        fontSize: '72px',          // Larger size
        color: '#ffffff',          // White text
        stroke: '#000000',         // Black stroke
        strokeThickness: 10,       // Thick stroke
        align: 'center'
    },
    BUTTON_TEXT_STYLE: { // For any text ON the play button (if needed, otherwise remove)
        fontFamily: 'Arial Black',
        fontSize: '36px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
    }
        };
    }

init() {
    this.clearAllActiveWeapons(); // Use the new cleanup function
    
    // Clean up old ragdoll parts
    if (this.buddyParts && this.buddyParts.length > 0) {
        this.buddyParts.forEach(part => {
            if (part.sprite) part.sprite.destroy();
            if (part.body) this.matter.world.remove(part.body);
        });
    }
    if (this.constraints && this.constraints.length > 0) {
        this.matter.world.remove(this.constraints);
    }

    if (this.chainConstraints && this.chainConstraints.length > 0) {
    this.matter.world.remove(this.chainConstraints);
}
if (this.chainLines && this.chainLines.length > 0) {
    this.chainLines.forEach(line => line.destroy());
}



// In your init() function
this.tauntSubtitles = {
    'taunt1': "I bet you're the type to blame the mouse for your bad aim... it's never your own fault, is it?",
    'taunt2': "You click like my grandma trying to close a pop-up ad... is this your first time using a computer?",
    'taunt3': "I hit your mom better, loser.",
    'taunt4': "I've seen toddlers throw better tantrums... and toys. Maybe you should go get lessons from one.",
    'taunt5': "I've felt more impact from a gentle breeze. Try actually hitting me.",
    'taunt6': "You have the same weak grip as your dad holding onto his hair... it's no wonder you both keep failing."
};

// In your init() function
// This holds all possible taunts
this.allTauntKeys = ['taunt1', 'taunt2', 'taunt3', 'taunt4', 'taunt5', 'taunt6'];
this.unplayedTaunts = [...this.allTauntKeys];
// NEW: Shuffle the list of unplayed taunts at the start of each game
Phaser.Utils.Array.Shuffle(this.unplayedTaunts);

this.lastTauntTime = 0;
    // Reset game state
    this.score = 0;
    this.koMeter = 0;
    this.buddyParts = [];
    this.constraints = [];

this.displayScore = 0;
this.lastShownScore = 0;
    

    this.activeWeapons = [];

    this.weaponHitCounter = 0;

    // Reset other variables...
    this.koMeterMax = 1000;
    this.isGameOver = false;
    this.hitCounter = 0;
    this.lastBloodEffectTime = 0;
    this.comboCount = 0;
    this.phase = null;
    this.uiElements = [];

    if (!this.weapons) {
        this.weapons = [
            { name: 'Pistol', price: 100, key: 'pistol', unlocked: true, equipped: false, damage: 100, fireRate: 800 },
            { name: 'Shotgun', price: 20, key: 'shotgun', unlocked: false, equipped: false, damage: 10, fireRate: 1000 },
            { name: 'Crossbow', price: 30, key: 'crossbow', unlocked: false, equipped: false, damage: 40, fireRate: 1200 },
            { name: 'Rifle', price: 40, key: 'rifle', unlocked: false, equipped: false, damage: 20, fireRate: 300 },
            { name: 'Launcher', price: 50, key: 'grenade_launcher', unlocked: false, equipped: false, damage: 80, fireRate: 2000 }
        ];
    }
}

    preload() {
        // Load assets strictly from the _CONFIG object [cite: 522, 541]
        for (const key in _CONFIG.imageLoader) {
            this.load.image(key, _CONFIG.imageLoader[key]);
        }
        for (const key in _CONFIG.soundsLoader) {
            this.load.audio(key, [_CONFIG.soundsLoader[key]]);
        }
                for (const key in _CONFIG.libLoader) {
            this.load.image(key, _CONFIG.libLoader[key]);
        }

        // In your preload() function
        // Catbox.moe can timeout on some networks, guarded safely

        // Load bitmap font as per SOP [cite: 389]
        const fontName = 'pix';
        const fontBaseURL = "https://aicade-ui-assets.s3.amazonaws.com/GameAssets/fonts/";
        this.load.bitmapFont('pixelfont', fontBaseURL + fontName + '.png', fontBaseURL + fontName + '.xml');

        displayProgressLoader.call(this);
    }

create() {
    this.vfx = new VFXLibrary(this);
    this.coins = 0;
    // In your create() function
    if (this.textures.exists('blood_splat_atlas')) {
        const bloodFrames = this.anims.generateFrameNames('blood_splat_atlas', {
            start: 0, 
            end: 20, 
            zeroPad: 3, 
            prefix: 'tile', 
            suffix: '.png' 
        });

        this.anims.create({
            key: 'blood_splat_anim',
            frames: bloodFrames,
            frameRate: 24,
            hideOnComplete: true
        });
    }


    this.sounds = {};
    for (const key in _CONFIG.soundsLoader) {
        this.sounds[key] = this.sound.add(key, { loop: false, volume: 0.5 });
    }

    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.game.config.width, this.game.config.height).setDepth(-1);
    this.matter.world.setBounds(0, 0, this.game.config.width, this.game.config.height, 64, true, true, true, true, { restitution: 0.5 });

    this.startPhase('title', this.buildTitleScreen);

    // âœ… NEW: Add this code to listen for the ESC key to pause the game.
    this.input.keyboard.on('keydown-ESC', () => {
        this.pauseGame();
    });

        // âœ… ADD THESE LINES to define physics categories
    this.BODY_CATEGORY = this.matter.world.nextCategory();
    this.WALL_CATEGORY = this.matter.world.nextCategory();
}

update() {
    // This check ensures logic only runs in the correct game phases.
    if (this.phase !== 'gameplay' && this.phase !== 'ko_transition' && this.phase !== 'ko') {
        return;
    }

    // Ease score text toward the true score (smaller factor = slower)
if (this.scoreText && !this.scoreText.destroyed) { // <-- This check is crucial
    if (this.displayScore !== this.score) {
        this.displayScore += (this.score - this.displayScore) * 0.05;

        const shown = Math.floor(this.displayScore);
        if (shown !== this.lastShownScore) {
            this.lastShownScore = shown;
            this.scoreText.setText(`SCORE: ${shown}`);
        }
    }
}


// WEAPON AIMING LOGIC (FIXED CODE)
if (this.activeWeapons && this.activeWeapons.length > 0) {
    const target = this.buddyParts[1]; // The torso is target [1]
    if (target && target.body) {
        this.activeWeapons.forEach(weapon => {
            if (weapon.sprite && !weapon.sprite.destroyed) { // Added a safety check here too
                const startPos = { x: weapon.sprite.x, y: weapon.sprite.y };
                const endPos = { x: target.body.position.x, y: target.body.position.y };

                // Calculate the base angle
                let angle = Phaser.Math.Angle.BetweenPoints(startPos, endPos);

                // If the sprite is flipped, compensate by adding 180 degrees
                if (weapon.sprite.flipX) {
                    angle += Math.PI;
                }

                // Apply the final, correct angle
                weapon.sprite.rotation = angle;
            }
        });
    }
}

    this.updateBuddyFacialExpression();
    // Sync ragdoll sprite positions with their physics bodies.
if (this.buddyParts && this.buddyParts.length) {
  this.buddyParts.forEach(part => {
    if (part.sprite && part.body) {
      part.sprite.setPosition(part.body.position.x, part.body.position.y);
      if (part.body.inertia !== Infinity) {
        part.sprite.setRotation(part.body.angle);
      }
    }
  });
}

if (this.chainConstraints && this.chainConstraints.length > 0) {
    for (let i = 0; i < this.chainConstraints.length; i++) {
        const constraint = this.chainConstraints[i];
        const line = this.chainLines[i]; // This is our TileSprite

        if (constraint && line) {
            const startPoint = constraint.pointA;
            const endPoint = constraint.bodyB.position;
            
            const currentLength = Phaser.Math.Distance.BetweenPoints(startPoint, endPoint);
            const stretchThreshold = constraint.length * 3;

            // Make sure the sprite is visible and set its default color to white
            line.setVisible(true).setTint(0xffffff);

            if (currentLength > stretchThreshold) {
                // When stretched, tint the chain red
                line.setTint(0xff0000); 
                
                const ms = this.matter && this.matter.mouseSpring;
                if (ms && ms.body && ms.body === constraint.bodyB) {
                    this.koMeter = Math.min(this.koMeter + 0.007, this.koMeterMax);
                    this.updateKoBar();
                    this.createBloodEffect(constraint.bodyB);
                }

                // Snap chains when pulled with tension so the buddy can be freely thrown
                if (currentLength > stretchThreshold * 1.35) {
                    this.breakChain();
                    if (window.IndieAudioSynth) window.IndieAudioSynth.playBladeClash(1.0);
                    break;
                }
            }
            
            const length = Phaser.Math.Distance.BetweenPoints(startPoint, endPoint);
            const angle = Phaser.Math.Angle.BetweenPoints(startPoint, endPoint);

            line.width = length;
            line.setRotation(angle);
            line.setPosition(
                startPoint.x + (endPoint.x - startPoint.x) / 2,
                startPoint.y + (endPoint.y - startPoint.y) / 2
            );
            line.tilePositionX = 0;
        }
    }
}
}
    
    // -- CUSTOM GAME FUNCTIONS START HERE -- [cite: 349, 572]d
breakChain() {
    // Check if there are physics constraints to break
    if (this.chainConstraints && this.chainConstraints.length > 0) {
        this.matter.world.remove(this.chainConstraints);
        this.chainConstraints = [];
    }

    // Check if there are visual lines to remove
    if (this.chainLines && this.chainLines.length > 0) {
        this.chainLines.forEach(chain => {
            // âœ… NEW: Create a particle burst at the chain's last position
            const emitter = this.add.particles(chain.x, chain.y, 'chain_link', {
                speed: { min: 100, max: 250 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                lifespan: 600,
                gravityY: 300,
                blendMode: 'NORMAL'
            });
            emitter.explode(5); // Explode 5 particles
            
            chain.destroy(); // Destroy the original chain sprite
        });
        this.chainLines = []; // Clear the array
    }
}

    /**
 * Toggles the game's paused state, managing physics and timers.
 * @param {boolean} isPaused - True to pause, false to resume.
 */
togglePause(isPaused) {
    // Pause or resume the Matter.js physics engine
    if (isPaused) {
        this.matter.world.pause();
    } else {
        this.matter.world.resume();
    }

    // Pause or resume the timers for all active weapons
    if (this.activeWeapons && this.activeWeapons.length > 0) {
        this.activeWeapons.forEach(weapon => {
            if (weapon.timer) {
                weapon.timer.paused = isPaused;
            }
        });
    }
}

/**
 * Builds a custom pause screen UI.
 */
buildPauseScreen() {
    // Immediately pause the game state using our controller
    this.togglePause(true);

    const pauseContainer = this.add.container(0, 0).setDepth(200);

    // Dark overlay
    const overlay = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, this.game.config.width, this.game.config.height, 0x000000, 0.8)
        .setInteractive(); // Makes it block clicks to the game below

    const title = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 100, "PAUSED", {
        fontFamily: 'Arial Black', fontSize: '96px', color: this.THEME.WHITE,
        stroke: this.THEME.BLACK, strokeThickness: 8
    }).setOrigin(0.5);

    // Create a "RESUME" button
    const resumeBtn = this.createButton(this.game.config.width / 2, this.game.config.height / 2 + 50, 'RESUME', () => {
        // Un-pause the game state using our controller
        this.togglePause(false);
        // Destroy the pause menu
        pauseContainer.destroy();
    });

    pauseContainer.add([overlay, title, resumeBtn]);
}

/**
 * Shows a temporary, non-blocking popup message in the center of the screen.
 * @param {string} message - The text to display.
 */
showGamePopup(message) {
    const popupContainer = this.add.container(this.game.config.width / 2, this.game.config.height / 2).setDepth(200);
    const background = this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(-250, -60, 500, 120, 16);
    const popupText = this.add.text(0, 0, message, {
        fontFamily: 'Arial Black', fontSize: '32px', color: '#ff4d4d',
        align: 'center',
        wordWrap: { width: 480 }
    }).setOrigin(0.5);

    popupContainer.add([background, popupText]);
    popupContainer.setAlpha(0).setScale(0.8);

    // âœ… FIX: Replaced timeline with a sequence of tweens.
    // First, fade the popup in.
    this.tweens.add({
        targets: popupContainer,
        alpha: 1,
        scale: 1,
        duration: 150,
        ease: 'Power1',
        onComplete: () => {
            // After it's visible, create a second tween to fade it out.
            this.tweens.add({
                targets: popupContainer,
                alpha: 0,
                scale: 0.8,
                duration: 150,
                delay: 1500, // This is the 'hold' duration
                ease: 'Power1',
                onComplete: () => {
                    popupContainer.destroy(); // Clean up
                }
            });
        }
    });
}

startPhase(name, buildFn) {
    // Immediately destroy all current UI elements
    if (this.uiElements && this.uiElements.length > 0) {
        this.uiElements.forEach(el => el.destroy());
    }

    // Reset the UI array and any direct UI references
    this.uiElements = [];
    this.scoreText = null;
    this.koBar = null;
    this.coinText = null;

    // Immediately build the new UI for the next phase
    buildFn.call(this);

    // Update the phase state
    this.phase = name;
}

// Add this entire new function to your GameScene class
clearUI() {
    this.uiElements.forEach(element => element.destroy());
    this.uiElements = [];
}

/**
 * Shows a temporary popup message.
 * @param {string} message - The text to display.
 * @param {function} onComplete - Callback function to run after the popup disappears.
 */
showUnlockPopup(message, onComplete) {
    const popupContainer = this.add.container(this.game.config.width / 2, this.game.config.height / 2).setDepth(200);
    const background = this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(-200, -60, 400, 120, 16);
    const popupText = this.add.text(0, 0, message, {
        fontFamily: 'Arial Black', fontSize: '32px', color: '#00ff00',
        align: 'center',
        stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);

    popupContainer.add([background, popupText]);
    popupContainer.setAlpha(0);

    // âœ… FIX: Replaced timeline with a modern tween using 'hold' and 'yoyo'.
    this.tweens.add({
        targets: popupContainer,
        alpha: 1,          // Fade in
        duration: 300,
        ease: 'Power1',
        hold: 1000,        // Hold for 1 second
        yoyo: true,        // Fade out automatically
        onComplete: () => {
            popupContainer.destroy();
            if (onComplete) {
                onComplete();
            }
        }
    });
}

/**
 * Spawns a static blood splatter on the title screen.
 */
spawnTitleBloodSplatter() {
    const x = Phaser.Math.Between(80, this.game.config.width - 80);
    const y = Phaser.Math.Between(80, this.game.config.height - 80);
    const container = this.add.container(x, y).setDepth(-5);
    const clusterSize = Phaser.Math.Between(5, 9);
    for (let i = 0; i < clusterSize; i++) {
        const r = Phaser.Math.Between(8, 26);
        const ox = Phaser.Math.Between(-30, 30);
        const oy = Phaser.Math.Between(-30, 30);
        const alpha = Phaser.Math.FloatBetween(0.4, 0.7);
        const color = Phaser.Utils.Array.GetRandom([0x780606, 0x8b0000, 0x5a0000]);
        const circ = this.add.circle(ox, oy, r, color, alpha);
        container.add(circ);
    }
    this.uiElements.push(container);
}

buildTitleScreen() {
    // Start the background music if it's not already playing
    if (this.sounds.background && !this.sounds.background.isPlaying) {
        this.sounds.background.setLoop(true).setVolume(0.15).play();
    }

    this.phase = 'title';
    this.init(); // <-- FIX: This replaces the broken call to resetGameVariables()

    // --- NEW: Dynamic Background ---
    const bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'title_background');
    bg.setDisplaySize(this.game.config.width, this.game.config.height);
    this.uiElements.push(bg);

    // --- NEW: Random Blood Splatters on Title Screen ---
    for (let i = 0; i < 5; i++) {
        this.spawnTitleBloodSplatter(); // Spawn 5 random splatters
    }

    // --- NEW: Title Text with Custom Style ---
    const title = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 100, " ", {
        fontFamily: 'Arial Black',
        fontSize: '96px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        shadow: { color: this.THEME.RED, fill: true, blur: 15, offsetY: 0 }
    }).setOrigin(0.5);
    
    // --- NEW: Image Play Button ---
    const playBtn = this.add.image(this.game.config.width / 2, this.game.config.height / 2 + 90, 'play_button')
        .setScale(0.3) // Adjust scale as needed
        .setInteractive({ cursor: 'pointer' });
    
    // Add a simple hover effect
    playBtn.on('pointerover', () => this.tweens.add({ targets: playBtn, scale: 0.35, duration: 150 }));
    playBtn.on('pointerout', () => this.tweens.add({ targets: playBtn, scale: 0.3, duration: 150 }));
    
    // Set the button's action
    playBtn.on('pointerdown', () => {
        if (this.sounds.button_click) { this.sounds.button_click.play(); }
        // This will transition to the instructions screen
        this.startPhase('instructions', this.buildInstructionsScreen);
    });
    
    this.tweens.add({ targets: title, y: title.y - 20, duration: 2000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });

    this.uiElements.push(title, playBtn);
}


/**
 * Builds a visually rich instructions screen.
 */
buildInstructionsScreen() {
    this.phase = 'instructions';
    const centerX = this.game.config.width / 2;

    // --- Background & Title ---
    const overlay = this.add.rectangle(centerX, this.game.config.height / 2, this.game.config.width, this.game.config.height, 0x000000, 0.85);
    const title = this.add.text(centerX, 80, "HOW TO PLAY", {
        fontFamily: 'Arial Black', fontSize: '80px', color: this.THEME.WHITE,
        stroke: this.THEME.BLACK, strokeThickness: 8
    }).setOrigin(0.5);

    this.uiElements.push(overlay, title);

    // --- Instruction Panels ---
    const panelY = 250;
    const panelSpacing = 380;

    // Panel 1: Hit & Throw
    const panel1 = this.add.container(centerX - panelSpacing, panelY);
    const text1 = this.add.text(0, 100, 'Click, drag, and throw the buddy to earn score & coins!', {
        fontFamily: 'Arial', fontSize: '24px', color: this.THEME.WHITE, align: 'center', wordWrap: { width: 300 }
    }).setOrigin(0.5);
    // Simple mouse icon using text
    const mouseIcon = this.add.text(0, -20, '▶', { fontSize: '100px' }).setOrigin(0.5);
    panel1.add([text1, mouseIcon]);
    this.uiElements.push(panel1);

    // Panel 2: Fill the KO Bar
    const panel2 = this.add.container(centerX, panelY);
    const text2 = this.add.text(0, 100, 'Damage fills the K.O. Bar. A full bar kills the ragdoll!', {
        fontFamily: 'Arial', fontSize: '24px', color: this.THEME.WHITE, align: 'center', wordWrap: { width: 300 }
    }).setOrigin(0.5);
    const koBarBg = this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(-150, -30, 300, 40, 20);
    const koBarFill = this.add.graphics().fillStyle(this.THEME.WHITE).fillRoundedRect(-148, -28, 296, 36, 18);
    const koText = this.add.text(170, -10, 'K.O.', { fontFamily: 'Arial Black', fontSize: '24px', color: this.THEME.WHITE });
    panel2.add([text2, koBarBg, koBarFill, koText]);
    this.uiElements.push(panel2);

    // Panel 3: Unlock Weapons
    const panel3 = this.add.container(centerX + panelSpacing, panelY);
    const text3 = this.add.text(0, 100, 'Use coins to buy and equip automatic weapons in the shop!', {
        fontFamily: 'Arial', fontSize: '24px', color: this.THEME.WHITE, align: 'center', wordWrap: { width: 300 }
    }).setOrigin(0.5);
    const pistolIcon = this.add.image(-50, -10, 'pistol').setScale(0.8).setFlipX(true);
    const rifleIcon = this.add.image(50, -10, 'rifle').setScale(0.8).setFlipX(true);
    panel3.add([text3, pistolIcon, rifleIcon]);
    this.uiElements.push(panel3);

    // --- Continue Button ---
    const continueBtn = this.createButton(centerX, this.game.config.height - 100, 'CONTINUE', () => {
        this.startPhase('gameplay', this.buildGameplayScreen);
    });
    this.uiElements.push(continueBtn);
}


  createProceduralExpressionsAndCracks() {
    // 1. Expression Decals on Head
    if (!this.textures.exists('buddy_face_panicked')) {
        const cvs = this.textures.createCanvas('buddy_face_panicked', 120, 120);
        const ctx = cvs.context;
        // Big wide shocked eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(42, 50, 16, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 50, 16, 0, Math.PI * 2); ctx.fill();
        // Dilated pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(42, 50, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(78, 50, 7, 0, Math.PI * 2); ctx.fill();
        // O-shaped mouth
        ctx.fillStyle = '#111111';
        ctx.beginPath(); ctx.arc(60, 85, 14, 0, Math.PI * 2); ctx.fill();
        cvs.refresh();
    }

    if (!this.textures.exists('buddy_face_bruised')) {
        const cvs = this.textures.createCanvas('buddy_face_bruised', 120, 120);
        const ctx = cvs.context;
        // Swollen purple eye
        ctx.fillStyle = '#7e22ce';
        ctx.beginPath(); ctx.arc(42, 50, 20, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(42, 50, 5, 0, Math.PI * 2); ctx.fill();
        // Normal eye squinted
        ctx.lineWidth = 4; ctx.strokeStyle = '#000000';
        ctx.beginPath(); ctx.moveTo(68, 50); ctx.lineTo(88, 50); ctx.stroke();
        // Cross Band-aid on forehead
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(50, 15, 24, 8); ctx.fillRect(58, 7, 8, 24);
        cvs.refresh();
    }

    if (!this.textures.exists('buddy_face_ko')) {
        const cvs = this.textures.createCanvas('buddy_face_ko', 120, 120);
        const ctx = cvs.context;
        // X X cartoon eyes
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 5;
        // Left X
        ctx.beginPath(); ctx.moveTo(32, 40); ctx.lineTo(52, 60); ctx.moveTo(52, 40); ctx.lineTo(32, 60); ctx.stroke();
        // Right X
        ctx.beginPath(); ctx.moveTo(68, 40); ctx.lineTo(88, 60); ctx.moveTo(88, 40); ctx.lineTo(68, 60); ctx.stroke();
        // Squiggly mouth
        ctx.beginPath(); ctx.moveTo(40, 90); ctx.lineTo(50, 85); ctx.lineTo(65, 95); ctx.lineTo(80, 88); ctx.stroke();
        cvs.refresh();
    }

    // Wall cracks graphic layer
    this.wallCracksGraphics = this.add.graphics().setDepth(2);
  }

  spawnWallCrack(x, y, intensity = 1) {
    if (!this.wallCracksGraphics) return;
    this.wallCracksGraphics.lineStyle(2 * intensity, 0x111111, 0.75);
    const numSpokes = Phaser.Math.Between(4, 7);
    for (let i = 0; i < numSpokes; i++) {
        const angle = (i / numSpokes) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const len = Phaser.Math.Between(20, 55) * intensity;
        const midX = x + Math.cos(angle) * (len * 0.5) + Phaser.Math.Between(-5, 5);
        const midY = y + Math.sin(angle) * (len * 0.5) + Phaser.Math.Between(-5, 5);
        const endX = x + Math.cos(angle) * len;
        const endY = y + Math.sin(angle) * len;
        this.wallCracksGraphics.beginPath();
        this.wallCracksGraphics.moveTo(x, y);
        this.wallCracksGraphics.lineTo(midX, midY);
        this.wallCracksGraphics.lineTo(endX, endY);
        this.wallCracksGraphics.stroke();
    }
  }

  updateBuddyFacialExpression() {
    const headPart = this.buddyParts && this.buddyParts[0];
    if (!headPart || !headPart.body || !headPart.sprite) return;

    if (!this.faceDecal) {
        this.faceDecal = this.add.image(headPart.sprite.x, headPart.sprite.y, 'buddy_face_panicked')
            .setDisplaySize(140, 140)
            .setDepth(15)
            .setAlpha(0);
    }

    this.faceDecal.setPosition(headPart.sprite.x, headPart.sprite.y);
    this.faceDecal.setRotation(headPart.sprite.rotation);

    if (this.isGameOver || this.phase === 'ko') {
        this.faceDecal.setTexture('buddy_face_ko').setAlpha(1);
    } else {
        const vel = Math.hypot(headPart.body.velocity.x, headPart.body.velocity.y);
        if (vel > 8) {
            this.faceDecal.setTexture('buddy_face_panicked').setAlpha(0.95);
        } else if (this.koMeter > this.koMeterMax * 0.4) {
            this.faceDecal.setTexture('buddy_face_bruised').setAlpha(0.9);
        } else {
            this.faceDecal.setAlpha(0);
        }
    }
  }

buildGameplayScreen() {
    this.init(); 
    this.phase = 'gameplay';

if (this.sounds.background && this.sounds.background.isPlaying) {
    this.sounds.background.stop();
}
    
    const wallOptions = { 
        isStatic: true, 
        label: 'wall',
        collisionFilter: { category: this.WALL_CATEGORY },
        friction: 0.8
    };
    const wallThickness = 500;

    // âœ… NEW: Define the ground's position.
    const groundY = this.game.config.height - 20;

    // // âœ… NEW: Add a visible ground graphic (a simple black line).
    // this.add.graphics().fillStyle(0x000000).fillRect(0, groundY, this.game.config.width, 10);

    // âœ… NEW: Add a thin, invisible physics ground that matches the graphic.
        this.matter.add.rectangle(this.game.config.width / 2, groundY + 5, this.game.config.width, 10, { 
        ...wallOptions, // Keep other options like friction
        label: 'ground' // âœ… CHANGE THIS from 'wall' to 'ground'
    });
    
    // âœ… REMOVED: The old, thick bottom wall rectangle.
    
    // Side and Top walls remain the same
    this.matter.add.rectangle(-(wallThickness / 2) + 5, this.game.config.height / 2, wallThickness, this.game.config.height, wallOptions);
    this.matter.add.rectangle(this.game.config.width + (wallThickness / 2) - 5, this.game.config.height / 2, wallThickness, this.game.config.height, wallOptions);
    this.matter.add.rectangle(this.game.config.width / 2, -(wallThickness / 2) + 5, this.game.config.width, wallThickness, wallOptions);
    
    this.matter.world.timeScale = 1; 

    this.createUI();

    // In your buildGameplayScreen() function
// Create the text object for subtitles
this.subtitleText = this.add.text(this.game.config.width / 2, this.game.config.height - 80, '', {
    fontFamily: 'Arial Black',
    fontSize: '32px',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 6,
    align: 'center',
    wordWrap: { width: this.game.config.width - 100 },
    padding: { x: 20, y: 10 }           // <-- AND THIS
}).setOrigin(0.5).setDepth(100).setAlpha(0);


// Add it to the UI elements so it gets cleaned up automatically
    this.createBuddy();
    this.createProceduralExpressionsAndCracks();
    this.mouseSpringConstraint = this.matter.add.mouseSpring({
        length: 1,
        stiffness: 0.7,
        damping: 0.1
    });

    // Ensure dragging works: wake all buddy parts immediately on any pointer interaction
    this.input.on('pointerdown', () => {
        if (this.buddyParts) {
            this.buddyParts.forEach(p => {
                if (p.body) Phaser.Physics.Matter.Matter.Sleeping.set(p.body, false);
            });
        }
    });

    if (window.ComboTracker) {
        this.comboTracker = new window.ComboTracker(this);
    }

    // Keyboard quick-swap hotkeys [1] - [5]
    this.input.keyboard.on('keydown-ONE', () => this.equipWeaponByKey('pistol'));
    this.input.keyboard.on('keydown-TWO', () => this.equipWeaponByKey('shotgun'));
    this.input.keyboard.on('keydown-THREE', () => this.equipWeaponByKey('crossbow'));
    this.input.keyboard.on('keydown-FOUR', () => this.equipWeaponByKey('rifle'));
    this.input.keyboard.on('keydown-FIVE', () => this.equipWeaponByKey('grenade_launcher'));

    this.matter.world.on('collisionstart', (event) => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            const isBuddyInPair = this.buddyParts.some(part => part.body === bodyA || part.body === bodyB);
            const isWallInPair = bodyA.label === 'wall' || bodyB.label === 'wall';
            if (isBuddyInPair && isWallInPair) {
                const buddyBody = this.buddyParts.some(part => part.body === bodyA) ? bodyA : bodyB;
                this.handleWallCollision(buddyBody);
            }
        });
    });

// --- Create the breakable chains for all four limbs ---
// --- Create the breakable chains for all four limbs ---
this.chainConstraints = [];
this.chainLines = [];

const anchors = [
    { x: 300, y: 350 }, // Top-left
    { x: this.game.config.width - 300, y: 350 }, // Top-right
    { x: 300, y: this.game.config.height - 50 }, // Bottom-left
    { x: this.game.config.width - 300, y: this.game.config.height - 50 }  // Bottom-right
];
const limbs = [
    this.buddyParts[2].body, // Left Arm
    this.buddyParts[3].body, // Right Arm
    this.buddyParts[4].body, // Left Leg
    this.buddyParts[5].body  // Right Leg
];

// Create a constraint and a visual TileSprite for each limb
for (let i = 0; i < 4; i++) {
    const constraint = this.matter.constraint.create({
        pointA: anchors[i],
        bodyB: limbs[i],
        length: 50,
        stiffness: 0.01
    });
    this.chainConstraints.push(constraint);
    
    // This creates the visual chain from your image.
    const chainSprite = this.add.tileSprite(0, 0, 0, 24, 'chain_link')
        .setDepth(-1)
        .setTint(0xffffff); // Tint it white to ensure it's visible

    this.chainLines.push(chainSprite);
}

this.matter.world.add(this.chainConstraints);
}

/**
 * Handles the logic when a buddy part collides with a wall.
 * @param {Matter.Body} buddyPartBody - The body of the buddy part that hit the wall.
 */
handleWallCollision(buddyPartBody) {
    if (this.isGameOver) return;

    const speed = Math.hypot(buddyPartBody.velocity.x, buddyPartBody.velocity.y);
    const wallHitDamage = Math.max(0.5, speed * 0.35);
    this.koMeter = Math.min(this.koMeter + wallHitDamage, this.koMeterMax);
    this.updateKoBar();

    this.updateScore(Math.max(1, Math.round(speed * 0.5)));

    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playFleshHit(Math.max(0.6, 1.2 - speed * 0.04));
    } else if (this.sounds.damage) {
        this.sounds.damage.play({ volume: 0.05, detune: 200 });
    }

    if (window.IndieJuice) {
        if (speed > 2) {
            window.IndieJuice.spawnShockwave(this, buddyPartBody.position.x, buddyPartBody.position.y, Math.min(2.5, 0.6 + speed * 0.09));
            window.IndieJuice.spawnDust(this, buddyPartBody.position.x, buddyPartBody.position.y, Math.min(16, 4 + Math.floor(speed * 0.6)));
            window.IndieJuice.screenShake(this, Math.min(0.02, 0.004 + speed * 0.001), 100);
            if (speed > 6) {
                this.spawnWallCrack(buddyPartBody.position.x, buddyPartBody.position.y, Math.min(2.0, 0.8 + speed * 0.1));
            }
            window.IndieJuice.floatingText(this, buddyPartBody.position.x, buddyPartBody.position.y - 25, Math.round(speed * 3), speed > 8);
        }
    }

    if (this.comboTracker) {
        this.comboTracker.hit(buddyPartBody.position.x, buddyPartBody.position.y);
    }

    this.createBloodEffect(buddyPartBody);

    if (speed > 7) {
        this.triggerComedicTaunt();
        this.triggerDazedStars();
    }

    if (this.koMeter >= this.koMeterMax) {
        this.handleKO();
    }
}


triggerComedicTaunt() {
    const quotes = [
        "Is that all you've got?!",
        "My spleen!",
        "Who gave you that weapon?!",
        "Time out! Time out!",
        "That barely tickled!",
        "Ouch! Watch the stitches!",
        "I need an ice pack!",
        "You click like a snail!",
        "Nice shot, rookie!"
    ];
    const quote = Phaser.Utils.Array.GetRandom(quotes);
    const head = this.buddyParts && this.buddyParts[0] && this.buddyParts[0].sprite;
    const x = head ? head.x : this.game.config.width / 2;
    const y = head ? head.y - 70 : 300;

    if (window.IndieJuice) {
        window.IndieJuice.floatingText(this, x, y, quote, false, {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            padding: { x: 10, y: 5 }
        });
    }
}

triggerDazedStars() {
    const head = this.buddyParts && this.buddyParts[0] && this.buddyParts[0].body;
    if (!head || !head.position) return;
    const x = head.position.x;
    const y = head.position.y - 50;

    for (let i = 0; i < 4; i++) {
        const star = this.add.text(x, y, '⭐', { fontSize: '18px' }).setOrigin(0.5).setDepth(210);
        const startAngle = (i / 4) * Math.PI * 2;
        const radius = 35;
        let elapsed = 0;

        const timer = this.time.addEvent({
            delay: 16,
            repeat: 60,
            callback: () => {
                elapsed += 0.08;
                if (!head || !head.position) {
                    star.destroy();
                    timer.remove();
                    return;
                }
                const curAngle = startAngle + elapsed;
                star.setPosition(
                    head.position.x + Math.cos(curAngle) * radius,
                    head.position.y - 50 + Math.sin(curAngle) * (radius * 0.4)
                );
            }
        });

        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: star,
                alpha: 0,
                duration: 200,
                onComplete: () => star.destroy()
            });
        });
    }
}

equipWeaponByKey(keyName) {
    if (!this.weapons) return;
    const weapon = this.weapons.find(w => w.key === keyName);
    if (!weapon) return;
    
    weapon.unlocked = true;
    if (weapon.equipped) {
        this.showGamePopup(`${weapon.name} active!`);
        return;
    }
    
    weapon.equipped = true;
    this.setupEquippedWeapon(weapon);
    this.showGamePopup(`[EQUIPPED] ${weapon.name}!`);

    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playBladeClash(1.4);
    }
}

createButton(x, y, text, callback) {
    const buttonContainer = this.add.container(x, y);
    const w = 240, h = 60;
    const panel = this.add.graphics();

    panel.fillStyle(Phaser.Display.Color.HexStringToColor(this.THEME.BROWN).color);
    panel.fillRoundedRect(-w / 2, -h / 2, w, h, 30);
    panel.lineStyle(4, this.THEME.BLACK, 1);
    panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 30);

    const buttonText = this.add.text(0, 0, text, {
        fontFamily: 'Arial Black', fontSize: '28px', color: this.THEME.WHITE,
    }).setOrigin(0.5);

    const hitZone = this.add.zone(0, 0, w, h).setInteractive({ cursor: 'pointer' });
    buttonContainer.add([panel, buttonText, hitZone]);

    // Click event
    hitZone.on('pointerdown', () => {
        if (this.sounds.button_click) { this.sounds.button_click.play({volume: 0.1}); }
        this.tweens.add({ targets: buttonContainer, scale: 0.95, duration: 100, yoyo: true, onComplete: callback });
    });

    // NEW: Hover effects
    hitZone.on('pointerover', () => {
        panel.clear().fillStyle(0x9d7769).fillRoundedRect(-w / 2, -h / 2, w, h, 30); // Lighter brown
        panel.lineStyle(4, this.THEME.BLACK, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 30);
    });
    hitZone.on('pointerout', () => {
        panel.clear().fillStyle(Phaser.Display.Color.HexStringToColor(this.THEME.BROWN).color).fillRoundedRect(-w / 2, -h / 2, w, h, 30);
        panel.lineStyle(4, this.THEME.BLACK, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 30);
    });
    
    return buttonContainer;
}


/**
 * Creates the main gameplay UI and adds all elements to the cleanup list.
 */
createUI() {
    const topY = 60;
    const panelBG = 0x000000; // Use a solid black for high contrast

    // --- Score Display ---
    const scoreContainer = this.add.container(this.game.config.width / 2, topY);
    const scoreBg = this.add.graphics().fillStyle(panelBG, 0.5).fillRoundedRect(-150, -28, 300, 56, 28).lineStyle(2, this.THEME.RED).strokeRoundedRect(-150, -28, 300, 56, 28);
this.scoreText = this.add.text(0, 0, `SCORE: 0`, { fontFamily: 'Arial Black', fontSize: '32px', color: this.THEME.WHITE }).setOrigin(0.5);
scoreContainer.add([scoreBg, this.scoreText]);


    // --- KO Bar ---
    const koBarY = 120;
    const koBarContainer = this.add.container(this.game.config.width / 2, koBarY);
    const koBarBg = this.add.graphics().fillStyle(panelBG, 0.5).fillRoundedRect(-204, -17, 408, 34, 17).lineStyle(2, this.THEME.RED).strokeRoundedRect(-204, -17, 408, 34, 17);
    this.koBar = this.add.graphics();
    const koText = this.add.text(235, 0, 'KO', { fontFamily: 'Arial Black', fontSize: '28px', color: this.THEME.WHITE }).setOrigin(0, 0.5);
    koBarContainer.add([koBarBg, this.koBar, koText]);
    this.updateKoBar();

    // --- Coin Display ---
    const coinContainer = this.add.container(this.game.config.width - 180, topY);
    const coinBg = this.add.graphics().fillStyle(panelBG, 0.5).fillRoundedRect(-70, -28, 140, 56, 28).lineStyle(2, this.THEME.RED).strokeRoundedRect(-70, -28, 140, 56, 28);
    const coinIcon = this.add.image(-35, 0, 'coin').setScale(0.5);
    this.coinText = this.add.text(25, 0, this.coins, { 
        fontFamily: 'Arial Black', fontSize: '32px', color: this.THEME.WHITE,
        shadow: { color: '#000000', fill: true, blur: 5, offsetY: 2 }
    }).setOrigin(0.5);
    coinContainer.add([coinBg, coinIcon, this.coinText]);
    
    const weaponsBtn = this.createButton(150, topY, 'WEAPONS', () => {
        this.buildInGameWeaponsMenu();
    });

    // --- Neon Hotkey Dock Bar ---
    const dockContainer = this.add.container(this.game.config.width / 2, this.game.config.height - 40).setDepth(80);
    const dockBg = this.add.graphics()
        .fillStyle(0x000000, 0.8)
        .fillRoundedRect(-320, -18, 640, 36, 18)
        .lineStyle(2, 0x00d2ff, 0.9)
        .strokeRoundedRect(-320, -18, 640, 36, 18);
    const dockText = this.add.text(0, 0, 'HOTKEYS: [1] Pistol   [2] Shotgun   [3] Crossbow   [4] Rifle   [5] Launcher', {
        fontFamily: 'Arial Black, sans-serif',
        fontSize: '15px',
        color: '#00d2ff'
    }).setOrigin(0.5);
    dockContainer.add([dockBg, dockText]);

    this.uiElements.push(scoreContainer, koBarContainer, coinContainer, weaponsBtn, dockContainer);
}

/**
 * Safely removes all currently active weapons and their timers.
 */
clearAllActiveWeapons() {
    if (this.activeWeapons && this.activeWeapons.length > 0) {
        this.activeWeapons.forEach(weapon => {
            if (weapon.sprite) weapon.sprite.destroy();
            if (weapon.timer) weapon.timer.remove();
        });
    }
    this.activeWeapons = [];
    if(this.weapons) {
        this.weapons.forEach(w => w.equipped = false);
    }
}

/**
 * Creates a new weapon instance, places it on screen, and starts its timer.
 * Handles positioning for multiple weapons based on a predefined layout.
 * @param {object} weaponData - The data object for the weapon to equip.
 */
setupEquippedWeapon(weaponData) {
const positions = [
    { x: 150, y: 180, flip: false },                            // Top-left (Lowered)
    { x: this.game.config.width - 150, y: 180, flip: true },   // Top-right (Lowered)
    { x: 150, y: 280, flip: false },                            // Middle-left
    { x: this.game.config.width - 150, y: 280, flip: true },   // Middle-right
    { x: 150, y: 380, flip: false }                             // Bottom-left (Moved from center)
];

    const weaponIndex = this.activeWeapons.length;

    // Do not equip more than 5 weapons
    if (weaponIndex >= positions.length) {
        this.showGamePopup("Maximum weapons equipped!");
        weaponData.equipped = false; // Un-equip the data model
        return;
    }

    const position = positions[weaponIndex];
    const sprite = this.add.image(position.x, position.y, weaponData.key).setDepth(5);
    
    // Flip sprite if the position requires it (for right-side weapons)
    if (position.flip) {
        sprite.flipX = true;
    }

    // The callback needs to know which weapon and sprite to use
    const shootCallback = () => {
        switch (weaponData.key) {
            case 'pistol': this.firePistol(weaponData, sprite); break;
            case 'shotgun': this.fireShotgun(weaponData, sprite); break;
            case 'crossbow': this.fireCrossbow(weaponData, sprite); break;
            case 'rifle': this.fireRifle(weaponData, sprite); break;
            case 'grenade_launcher': this.fireGrenadeLauncher(weaponData, sprite); break;
        }
    };
    
    const timer = this.time.addEvent({
        delay: weaponData.fireRate,
        callback: shootCallback,
        loop: true
    });

    this.activeWeapons.push({
        data: weaponData,
        sprite: sprite,
        timer: timer
    });
}


buildInGameWeaponsMenu() {
    this.matter.world.pause();
    this.activeWeapons.forEach(w => w.timer.paused = true);

    const menuContainer = this.add.container(0, 0).setDepth(150);
    const overlay = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000, 0.7).setOrigin(0).setInteractive();
    
    const title = this.add.text(this.game.config.width / 2, 100, "EQUIP WEAPON", {
        fontFamily: 'Arial Black', fontSize: '64px', color: '#ffffff', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5);
    
    menuContainer.add([overlay, title]);
    this.showGamePopup("Click on a weapon to equip");

    const unlockedWeapons = this.weapons.filter(w => w.unlocked);
    const centerX = this.game.config.width / 2;
    const startY = 250;
    const colOffset = 160; // Horizontal distance from center
    const rowHeight = 100; // Vertical distance between rows

    // Arrange unlocked weapons in a two-column grid
    unlockedWeapons.forEach((weapon, index) => {
        const col = index % 2; // 0 for left column, 1 for right
        const row = Math.floor(index / 2);
        
        const x = centerX + (col === 0 ? -colOffset : colOffset);
        const y = startY + row * rowHeight;
        
        const weaponButton = this.createButton(x, y, weapon.name.toUpperCase(), () => {
            if (weapon.equipped) {
                this.showGamePopup("Already equipped!");
                return;
            }
            
            weapon.equipped = true;
            this.setupEquippedWeapon(weapon);
            this.showGamePopup(`${weapon.name} equipped!`);
            
            menuContainer.destroy();
            this.matter.world.resume();
            this.activeWeapons.forEach(w => w.timer.paused = false);
        });
        menuContainer.add(weaponButton);
    });

    // Position the CLOSE button below the grid
    const lastRow = Math.floor((unlockedWeapons.length -1) / 2);
    const closeBtnY = startY + (lastRow * rowHeight) + 120;
    
    const closeBtn = this.createButton(centerX, closeBtnY, 'CLOSE', () => {
        menuContainer.destroy();
        this.matter.world.resume();
        this.activeWeapons.forEach(w => w.timer.paused = false);
    });
    menuContainer.add(closeBtn);
}

/**
 * Safely toggles the game's background music on and off.
 */
handleToggleGameSounds() {
    if (this.sounds && this.sounds.background) {
        if (this.sounds.background.isPaused) {
            this.sounds.background.resume();
        } else if (this.sounds.background.isPlaying) {
            this.sounds.background.pause();
        } else {
            // If it's not playing or paused, start it.
            this.sounds.background.play();
        }
    } else {
        console.warn("Background sound is not available to toggle.");
    }
}


/**
 * Creates a ragdoll buddy using multiple Matter.js bodies and constraints.
 */
createBuddy() {
    // âœ… CHANGE: This function is updated to use the new collision categories.
    // This explicitly tells the buddy to collide with itself and the walls.

    // This defines what the buddy parts can collide with:
    // 0x0001 is the default category (for the mouse),
    // then we add our own BODY and WALL categories.
    const collisionMask = 0x0001 | this.BODY_CATEGORY | this.WALL_CATEGORY;

    const partOptions = {
        collisionFilter: {
            category: this.BODY_CATEGORY,
            mask: collisionMask
        },
        frictionAir: 0.05,
        restitution: 0.1,
        friction: 0.5
    };

const head = this.matter.bodies.circle(640, 400, 100, partOptions);
const torso = this.matter.bodies.rectangle(640, 550, 100, 150, { ...partOptions, chamfer: { radius: 20 } });

const leftArm = this.matter.bodies.rectangle(550, 530, 40, 120, partOptions);
const rightArm = this.matter.bodies.rectangle(730, 530, 40, 120, partOptions);
const leftLeg = this.matter.bodies.rectangle(600, 700, 40, 120, partOptions);
const rightLeg = this.matter.bodies.rectangle(680, 700, 40, 120, partOptions);

    const allBodies = [head, torso, leftArm, rightArm, leftLeg, rightLeg];
    this.matter.world.add(allBodies);

    this.buddyParts = [
        { body: head, sprite: this.add.sprite(0, 0, 'buddy_head').setDisplaySize(200,200) },
        { body: torso, sprite: this.add.sprite(0, 0, 'buddy_torso') },
        { body: leftArm, sprite: this.add.sprite(0, 0, 'buddy_arm') },
        { body: rightArm, sprite: this.add.sprite(0, 0, 'buddy_arm') },
        { body: leftLeg, sprite: this.add.sprite(0, 0, 'buddy_leg') },
        { body: rightLeg, sprite: this.add.sprite(0, 0, 'buddy_leg').setFlipX(true) }
    ];

    
    this.buddyParts.forEach(part => {
        part.sprite.setInteractive({ cursor: 'pointer' });
        part.sprite.on('pointerdown', () => this.handleHit(part.body));
    });

    this.constraints = [
// Left side of the neck
this.matter.constraint.create({ bodyA: head, bodyB: torso, pointA: { x: -20, y: 45 }, pointB: { x: -20, y: -70 }, length: 0, stiffness: 0.1, damping: 0.1 }),
// Right side of the neck
this.matter.constraint.create({ bodyA: head, bodyB: torso, pointA: { x: 20, y: 45 }, pointB: { x: 20, y: -70 }, length: 0, stiffness: 0.1, damping: 0.1 }),
        this.matter.constraint.create({ bodyA: torso, bodyB: leftArm, pointA: { x: -60, y: -50 }, pointB: { x: 0, y: -50 }, length: 0, stiffness: 1, damping: 0.1 }),
        this.matter.constraint.create({ bodyA: torso, bodyB: rightArm, pointA: { x: 60, y: -50 }, pointB: { x: 0, y: -50 }, length: 0, stiffness: 1, damping: 0.1 }),
        this.matter.constraint.create({ bodyA: torso, bodyB: leftLeg, pointA: { x: -30, y: 70 }, pointB: { x: 0, y: -50 }, length: 0, stiffness: 1, damping: 0.1 }),
        this.matter.constraint.create({ bodyA: torso, bodyB: rightLeg, pointA: { x: 30, y: 70 }, pointB: { x: 0, y: -50 }, length: 0, stiffness: 1, damping: 0.1 }),
    ];
    this.matter.world.add(this.constraints);

        // This puts all ragdoll parts to sleep so they start completely still.
    this.buddyParts.forEach(part => {
        Phaser.Physics.Matter.Matter.Sleeping.set(part.body, true);
    });
}

/**
 * Handles the logic when the buddy is hit.
 */
handleHit(body) {
    if (this.isGameOver) return;
    
    // Break initial chain anchors so player can pull and throw the buddy around freely
    this.breakChain();

    // Ensure all bodies are awake
    this.buddyParts.forEach(p => {
        if (p.body) Phaser.Physics.Matter.Matter.Sleeping.set(p.body, false);
    });
    
    this.comboCount++;
    //if (this.comboCount > 10) { this.comboCount = 1; }

    if (this.comboCount > 0 && this.comboCount % 15 === 0) {
        this.coins += 10;
        this.updateCoinText();
        this.showBonusCashText();
        this.comboCount = 0; // âœ… ADD THIS LINE to reset the streak
    }

this.hitCounter++;

// First, check if the KO bar is at least 25% full
if (this.koMeter >= this.koMeterMax * 0.25) {
    // If it is, then check if it's the right hit count to play a taunt
    if (this.hitCounter > 0 && this.hitCounter % 4 === 0) {
        this.playRandomTaunt();
    }
}
    this.koMeter = Math.min(this.koMeter + 5, this.koMeterMax);
    this.updateKoBar();
    this.updateScore(this.comboCount);

    // âœ… NEW: Trigger blood effect every two hits
for (let i = 0; i < 5; i++) {
    this.createBloodEffect(body);
}

    // Gentle tactile nudge that does not break mouse dragging constraint
    const force = new Phaser.Math.Vector2(Phaser.Math.FloatBetween(-0.04, 0.04), -0.05);
    this.matter.body.applyForce(body, body.position, force);

    const hitPart = this.buddyParts.find(p => p.body.id === body.id);
    if (hitPart) {
        hitPart.sprite.setTint(0xffffff);
        this.time.delayedCall(100, () => hitPart.sprite.clearTint());
        this.time.delayedCall(100, () => hitPart.sprite.clearTint());

        // **CHANGE:** Call the new floating combo text function.
        this.showFloatingComboText();
        
const emitter = this.add.particles(body.position.x, body.position.y, 'coin', {
    speed: { min: -100, max: 100 }, angle: { min: 0, max: 360 }, scale: { start: 0.2, end: 0 },
    blendMode: 'NORMAL', lifespan: 300, tint: 0xbb0a1e, gravityY: 200
});
        emitter.explode(20);
    }

    if (this.hitCounter % 2 === 0) {
        const coinsToSpawn = Phaser.Math.Between(1, 2);
        for (let i = 0; i < coinsToSpawn; i++) {
            this.spawnCoin(body.position.x, body.position.y);
            this.showPlusOneText();
        }
    }

    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playFleshHit(1.2);
    } else if (this.sounds.damage) {
        this.sounds.damage.play({ volume: 0.05 });
    }
    
    if (window.IndieJuice) {
        window.IndieJuice.spawnSparks(this, body.position.x, body.position.y, 8, 0xffcc00);
        window.IndieJuice.spawnShockwave(this, body.position.x, body.position.y, 0.9);
        window.IndieJuice.screenShake(this, 0.006, 80);
    } else {
        this.vfx.shakeGameObject(this.cameras.main, 100, 0.005);
    }

    if (this.comboTracker) {
        this.comboTracker.hit(body.position.x, body.position.y);
    }
    
    if (this.koMeter >= this.koMeterMax) {
        this.handleKO();
    }
}



/**
 * Creates a small, minimal floating combo text at the hit location.
 */
showFloatingComboText() {
    if (this.comboCount < 2) return;

    const comboMessage = `x${this.comboCount}`;
    const startY = 60; // Align with the score UI's y-position

    // âœ… CHANGE: Position is now fixed next to the score bar.
    const text = this.add.text(this.game.config.width / 2 + 170, startY, comboMessage, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: this.THEME.WHITE,
        stroke: this.THEME.BLACK,
        strokeThickness: 2
    }).setOrigin(0.5);

    // Animate the text to float up and fade out
    this.tweens.add({
        targets: text,
        y: startY - 80, // Move up
        alpha: 0,
        duration: 1200,
        ease: 'Power1.easeOut',
        onComplete: () => {
            text.destroy();
        }
    });
}

/**
 * Creates a floating "+1" text with the minimal style.
 * @param {number} x - The starting x position.
 * @param {number} y - The starting y position.
 */
showPlusOneText() {
    // âœ… CHANGE: Position is now fixed below the coin UI.
    const startY = 110;
    const text = this.add.text(this.game.config.width - 180, startY, '+1', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#FFD700', // Gold color for coins
        stroke: this.THEME.BLACK,
        strokeThickness: 2
    }).setOrigin(0.5);

    // Animate the text to float up and fade out
    this.tweens.add({
        targets: text,
        y: startY - 80, // Move up from its new starting position
        alpha: 0,
        duration: 800,
        ease: 'Power1',
        onComplete: () => {
            text.destroy();
        }
    });
}

/**
 * Creates a floating "+10" text for combo bonuses.
 */
showBonusCashText() {
    const startY = 110; // Below the coin UI
    const text = this.add.text(this.game.config.width - 180, startY, '+10', {
        fontFamily: 'Arial Black', // Bolder font
        fontSize: '32px',          // Larger size
        color: '#2ecc71',          // Success green color
        stroke: this.THEME.BLACK,
        strokeThickness: 4
    }).setOrigin(0.5);

    // Animate the text
    this.tweens.add({
        targets: text,
        y: startY - 90, // Move up further
        alpha: 0,
        duration: 1200,
        ease: 'Power1',
        onComplete: () => {
            text.destroy();
        }
    });
}

/**
 * Spawns a collectible coin.
 * @param {number} x - The x position to spawn the coin.
 * @param {number} y - The y position to spawn the coin.
 */
spawnCoin(x, y) {
    // Play the coin spawn sound
    if (this.sounds.coin_spawn) {
        this.sounds.coin_spawn.play({ volume: 0.06, detune: Phaser.Math.Between(-200, 200) });
    }

    const coin = this.matter.add.image(
        x + Phaser.Math.Between(-20, 20),
        y - 50,
        'coin',
        null,
        { restitution: 0.5, friction: 0.8 }
    ).setScale(0.4);
    
    this.time.delayedCall(500, () => {
         coin.setSensor(true);
         coin.setStatic(true);
         this.tweens.add({
             targets: coin,
             x: this.game.config.width - 180,
             y: 60,
             duration: 600,
             ease: 'Power2',
             onComplete: () => {
                this.coins += 1;
                if (this.coinText && !this.coinText.destroyed) this.coinText.setText(this.coins);

                if (this.sounds.collect) {
                    this.sounds.collect.play({ volume: 0.05 });
                }
                this.tweens.add({ targets: this.coinText.parentContainer, scale: 1.2, duration: 100, yoyo: true, ease: 'Power1' });
                coin.destroy();
             }
         });
    });
}


/**
 * Updates the visual display of the KO bar.
 */
updateKoBar() {
    if (!this.koBar || this.koBar.destroyed) return;

    const percentage = this.koMeter / this.koMeterMax;
    this.koBar.clear();
    this.koBar.fillStyle(Phaser.Display.Color.HexStringToColor(this.THEME.WHITE).color, 1);

    if (percentage > 0) {
        const fullWidth = 404;
        const barWidth = fullWidth * percentage;
        const barHeight = 30;
        const barRadius = 15;
        const startX = -202;
        const startY = -15;

        // If the bar is too small to form a proper rounded rectangle,
        // draw a small circle instead to avoid visual glitches.
        if (barWidth < barHeight) {
            this.koBar.fillCircle(startX + barRadius, startY + barRadius, barWidth / 2);
        } else {
            // Once it's wide enough, draw the normal pill shape
            this.koBar.fillRoundedRect(startX, startY, barWidth, barHeight, barRadius);
        }
    }
}

/**
 * Shows a temporary, non-blocking informational popup.
 * @param {string} message - The text to display.
 */
showInfoPopup(message) {
    const infoContainer = this.add.container(this.game.config.width / 2, this.game.config.height - 100).setDepth(200).setAlpha(0);
    const background = this.add.graphics().fillStyle(0x2980b9, 0.9).fillRoundedRect(-250, -40, 500, 80, 10);
    const infoText = this.add.text(0, 0, message, {
        fontFamily: 'Arial', fontSize: '24px', color: '#ecf0f1', align: 'center'
    }).setOrigin(0.5);

    infoContainer.add([background, infoText]);

    // Fade in, hold, and fade out
    this.tweens.add({
        targets: infoContainer,
        alpha: 1,
        duration: 400,
        yoyo: true,
        hold: 2500,
        onComplete: () => infoContainer.destroy()
    });
}
    
/**
 * Triggers an explosive KO sequence without slow motion.
 */
handleKO() {
    if (this.phase !== 'gameplay') return;
    
    // âœ… FIX: Set the game over flag immediately to stop further hits.
    this.isGameOver = true;
    
    this.clearAllActiveWeapons(); // Also clear all weapons
    
    this.phase = 'ko_transition';

    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playExplosion();
    } else if (this.sounds.ko_sound) {
        this.sounds.ko_sound.play({ volume: 0.8 });
    }

    if (window.IndieJuice) {
        window.IndieJuice.screenShake(this, 0.03, 500);
        window.IndieJuice.flash(this, 0xffffff, 250);
        window.IndieJuice.spawnShockwave(this, this.game.config.width / 2, this.game.config.height / 2, 4.0);
        window.IndieJuice.spawnSparks(this, this.game.config.width / 2, this.game.config.height / 2, 30, 0xff2200);
        window.IndieJuice.spawnDust(this, this.game.config.width / 2, this.game.config.height / 2, 20);
    } else {
        // Visual Effects
        const flash = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, this.game.config.width, this.game.config.height, 0xffffff, 0.8).setDepth(100);
        this.tweens.add({ targets: flash, alpha: 0, duration: 400, onComplete: () => flash.destroy() });
        this.vfx.shakeGameObject(this.cameras.main, 400, 0.01);
    }

    // This splits the body parts
    this.matter.world.remove(this.constraints);
    
    // --- EXPLOSION LOGIC ---
    const explosionCenter = this.buddyParts[1].body.position; // Explode from the torso
    const explosionStrength = 0.12;

    this.buddyParts.forEach(part => {
        const direction = Phaser.Physics.Matter.Matter.Vector.sub(part.body.position, explosionCenter);
        const normalizedDirection = Phaser.Physics.Matter.Matter.Vector.normalise(direction);
        const force = Phaser.Physics.Matter.Matter.Vector.mult(normalizedDirection, explosionStrength);
        
        // Apply the outward force to each part
        this.matter.body.applyForce(part.body, part.body.position, force);
    });
    
    // Transition to the KO screen after the explosion
    this.time.delayedCall(1500, () => {
        this.startPhase('ko', this.buildKoScreen);
    }, [], this);
}

/**
 * Builds the KO screen and adds its elements to the cleanup list.
 */
buildKoScreen() {
    this.phase = 'ko';
    if (this.sounds.background && this.sounds.background.isPlaying) {
        this.sounds.background.stop();
    }

    const centerX = this.game.config.width / 2;
    const centerY = this.game.config.height / 2;
    const container = this.add.container(0, 0);

    const overlay = this.add.rectangle(centerX, centerY, this.game.config.width, this.game.config.height, 0x000000, 0.7);

    const koContainer = this.add.container(centerX, centerY).setScale(0);
    // NEW: Styled panel with a border for more depth
    const panel = this.add.graphics()
        .fillStyle(Phaser.Display.Color.HexStringToColor(this.THEME.BROWN).color)
        .fillRoundedRect(-300, -220, 600, 440, 30)
        .lineStyle(4, this.THEME.BLACK, 1)
        .strokeRoundedRect(-300, -220, 600, 440, 30);

    // NEW: Added a shadow to the K.O. text to make it pop
    const koText = this.add.text(0, -140, 'K.O.!', {
        fontFamily: 'Arial Black', fontSize: '150px', color: this.THEME.RED,
        stroke: this.THEME.BLACK, strokeThickness: 10,
        shadow: { color: '#000000', fill: true, blur: 10, offsetY: 5 }
    }).setOrigin(0.5);

    // --- NEW: Using the 'score' asset and a counting animation ---
// --- REVISED: Score & Money Earned Display ---
    const finalScoreText = this.add.text(0, -50, `SCORE: ${this.score}`, {
        fontFamily: 'Arial Black', fontSize: '40px', color: this.THEME.WHITE
    }).setOrigin(0.5);

const moneyEarned = this.coins;
    const moneyIcon = this.add.image(-60, 35, 'coin').setScale(0.8);
    const moneyValueText = this.add.text(25, 35, '0', {
        fontFamily: 'Arial Black', fontSize: '48px', color: '#FFD700'
    }).setOrigin(0, 0.5);

    // Animate the money value counting up
    let moneyCounter = { value: 0 };
    this.tweens.add({
        targets: moneyCounter,
        value: moneyEarned,
        duration: 1000,
        ease: 'Power1',
        onUpdate: () => {
            moneyValueText.setText(Math.floor(moneyCounter.value));
        }
    });
    
    // --- Buttons ---
    const weaponsBtn = this.createButton(-140, 150, 'WEAPONS', () => {
        this.startPhase('weapons', this.buildWeaponsScreen);
    });
    const playBtn = this.createButton(140, 150, 'PLAY AGAIN', () => {
        this.startPhase('gameplay', this.buildGameplayScreen);
    });

    // Add the new, revised elements to the container
    koContainer.add([panel, koText, finalScoreText, moneyIcon, moneyValueText, weaponsBtn, playBtn]);
    
    // âœ… ADD THIS LINE to put the visible elements inside the main container
    container.add([overlay, koContainer]); 

    this.uiElements.push(container);
    
    // Animate the whole panel into view
    this.tweens.add({ targets: koContainer, scale: 1, duration: 400, ease: 'Back.easeOut' });
}

/**
 * Builds the Weapons shop screen.
 */
buildWeaponsScreen() {
    this.phase = 'weapons';
    const centerX = this.game.config.width / 2;
    const startX = centerX - 300;
    const startY = 250;
    const itemWidth = 150;
    const itemHeight = 150;

    // --- Background & Title (Dark Theme) ---
    const background = this.add.rectangle(centerX, this.game.config.height / 2, this.game.config.width, this.game.config.height, 0x000000, 0.85);
    const title = this.add.text(centerX, 80, "WEAPONS", {
        fontFamily: 'Arial Black', fontSize: '100px', color: this.THEME.WHITE,
        stroke: this.THEME.BLACK, strokeThickness: 8
    }).setOrigin(0.5);

    // --- Coin Display (Styled like Score UI) ---
    const coinContainer = this.add.container(150, 80);
    const coinBg = this.add.graphics().fillStyle(Phaser.Display.Color.HexStringToColor(this.THEME.BROWN).color).fillRoundedRect(-100, -40, 200, 80, 40).lineStyle(4, this.THEME.BLACK).strokeRoundedRect(-100, -40, 200, 80, 40);
    const coinIcon = this.add.image(-50, 0, 'coin').setScale(0.8);
    const coinText = this.add.text(20, 0, this.coins, { fontFamily: 'Arial Black', fontSize: '48px', color: this.THEME.WHITE }).setOrigin(0.5);
    coinContainer.add([coinBg, coinIcon, coinText]);

    // --- CORRECTED: This button now correctly starts a new game ---
    const playAgainBtn = this.createButton(this.game.config.width - 150, 80, 'PLAY AGAIN', () => {
        this.startPhase('gameplay', this.buildGameplayScreen);
    });
    this.uiElements.push(background, title, coinContainer, playAgainBtn);

    // --- Weapon Grid (Styled Slots) ---
    this.weapons.forEach((weapon, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const x = startX + col * itemWidth;
        const y = startY + row * itemHeight;

        const slotContainer = this.add.container(x, y);
        const slotBg = this.add.graphics().fillStyle(this.THEME.PANEL_BG, 0.8).fillRoundedRect(-60, -60, 120, 120, 10).lineStyle(2, this.THEME.BLACK).strokeRoundedRect(-60, -60, 120, 120, 10);
        slotContainer.add(slotBg);

        if (weapon.unlocked) {
            const weaponIcon = this.add.image(0, 0, weapon.key).setScale(0.8);
            slotContainer.add(weaponIcon); // <-- ADD THIS LINE
        } else {
            // --- Locked State with Styled "BUY" Button ---
            const lockIcon = this.add.image(0, -10, 'lock').setScale(1.5);
            
            const buyBtn = this.add.container(0, 40);
            const buyBg = this.add.graphics().fillStyle(this.THEME.RED).fillRoundedRect(-45, -15, 90, 30, 8);
            const buyText = this.add.text(0, 0, `BUY ${weapon.price}`, { fontFamily: 'Arial Black', fontSize: '16px', color: this.THEME.WHITE }).setOrigin(0.5);
            buyBtn.add([buyBg, buyText]).setSize(90, 30).setInteractive({ cursor: 'pointer' });

            buyBtn.on('pointerdown', () => {
                if (this.coins >= weapon.price) {
                    this.coins -= weapon.price;
                    weapon.unlocked = true;
                    this.showUnlockPopup(`${weapon.name} unlocked!`, () => {
                        this.startPhase('weapons', this.buildWeaponsScreen);
                    });
                } else {
                    this.showGamePopup('Not enough coins!');
                }
            });
            slotContainer.add([lockIcon, buyBtn]);
        }
        this.uiElements.push(slotContainer);
    });
}

/**
 * Updates the coin text display and plays a small animation.
 */
// In the updateCoinText() function

updateCoinText() {
    if (this.coinText) {
        // ADD a check for 'destroyed' here
        if (this.coinText && !this.coinText.destroyed) {
            this.coinText.setText(this.coins);
        }

        this.tweens.add({ 
            targets: this.coinText.parentContainer, 
            scale: 1.2, 
            duration: 100, 
            yoyo: true, 
            ease: 'Power1' 
        });
    }
}


firePistol(weaponData, weaponSprite) {
    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playGunshot(false);
    } else if (this.sounds.weapon_shoot) {
        this.sounds.weapon_shoot.play({ volume: 0.03 });
    }
    const target = this.buddyParts[1];
    if (!target || !target.body) return;
    const startPos = { x: weaponSprite.x, y: weaponSprite.y };
    const endPos = { x: target.body.position.x, y: target.body.position.y };
    const angle = weaponSprite.rotation;
    
    if (window.IndieJuice) {
        window.IndieJuice.spawnCasing(this, startPos.x, startPos.y, weaponSprite.flipX ? -1 : 1);
        window.IndieJuice.spawnSparks(this, startPos.x, startPos.y, 4, 0xffd700);
    }

    const muzzleOffset = 50;
    const bulletStartPos = {
        x: startPos.x + muzzleOffset * Math.cos(angle),
        y: startPos.y + muzzleOffset * Math.sin(angle)
    };

    const bullet = this.add.rectangle(bulletStartPos.x, bulletStartPos.y, 14, 4, 0xffeb3b).setRotation(angle);
    this.tweens.add({
        targets: bullet, x: endPos.x, y: endPos.y, duration: 250, ease: 'Linear',
        onComplete: () => {
            bullet.destroy();
            this.handleWeaponHit(target.body, weaponData.damage, angle);
        }
    });
}

fireShotgun(weaponData, weaponSprite) {
    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playGunshot(true);
    } else if (this.sounds.weapon_shoot) {
        this.sounds.weapon_shoot.play({ volume: 0.04 });
    }
    const target = this.buddyParts[1];
    if (!target || !target.body) return;
    const startPos = { x: weaponSprite.x, y: weaponSprite.y };
    const baseAngle = weaponSprite.rotation;

    if (window.IndieJuice) {
        window.IndieJuice.screenShake(this, 0.01, 100);
        window.IndieJuice.spawnDust(this, startPos.x, startPos.y, 8);
        window.IndieJuice.spawnCasing(this, startPos.x, startPos.y, weaponSprite.flipX ? -1 : 1);
    }

    for (let i = 0; i < 5; i++) {
        const spread = Phaser.Math.DegToRad(Phaser.Math.Between(-16, 16));
        const pelletAngle = baseAngle + spread;
        const endPos = { x: target.body.position.x + Phaser.Math.Between(-60, 60), y: target.body.position.y + Phaser.Math.Between(-60, 60) };
        
        const pellet = this.add.circle(startPos.x, startPos.y, 4, 0xffa500);
        this.tweens.add({
            targets: pellet, x: endPos.x, y: endPos.y, duration: 150, ease: 'Linear',
            onComplete: () => {
                pellet.destroy();
                this.handleWeaponHit(target.body, weaponData.damage / 5, pelletAngle);
            }
        });
    }
}

fireCrossbow(weaponData, weaponSprite) {
    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playSwordSwing(1.6);
    } else if (this.sounds.weapon_shoot) {
        this.sounds.weapon_shoot.play({ volume: 0.03 });
    }
    const target = this.buddyParts[1];
    if (!target || !target.body) return;
    const startPos = { x: weaponSprite.x, y: weaponSprite.y };
    const endPos = { x: target.body.position.x, y: target.body.position.y };
    const angle = weaponSprite.rotation;
    const bolt = this.add.rectangle(startPos.x, startPos.y, 30, 5, 0x8B4513).setRotation(angle);
    this.tweens.add({
        targets: bolt, x: endPos.x, y: endPos.y, duration: 80, ease: 'Linear',
        onComplete: () => {
            this.time.delayedCall(200, () => bolt.destroy());
            this.handleWeaponHit(target.body, weaponData.damage, angle);
        }
    });
}

fireRifle(weaponData, weaponSprite) {
    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playGunshot(false);
    } else if (this.sounds.weapon_shoot) {
        this.sounds.weapon_shoot.play({ volume: 0.03 });
    }
    this.breakChain();
    const target = this.buddyParts[1];
    if (!target || !target.body) return;
    const startPos = { x: weaponSprite.x, y: weaponSprite.y };
    const endPos = { x: target.body.position.x, y: target.body.position.y };
    const angle = weaponSprite.rotation;
    
    if (window.IndieJuice) {
        window.IndieJuice.spawnCasing(this, startPos.x, startPos.y, weaponSprite.flipX ? -1 : 1);
        window.IndieJuice.spawnSparks(this, startPos.x, startPos.y, 4, 0xffcc00);
    }

    const bullet = this.add.rectangle(startPos.x, startPos.y, 16, 3, 0xffffff).setRotation(angle);
    this.tweens.add({
        targets: bullet, x: endPos.x, y: endPos.y, duration: 70, ease: 'Linear',
        onComplete: () => {
            bullet.destroy();
            this.handleWeaponHit(target.body, weaponData.damage, angle);
        }
    });
}

fireGrenadeLauncher(weaponData, weaponSprite) {
    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playGunshot(true);
    } else if (this.sounds.weapon_shoot) {
        this.sounds.weapon_shoot.play({ volume: 0.03 });
    }
    this.breakChain();
    const target = this.buddyParts[1];
    if (!target || !target.body) return;
    const startPos = { x: weaponSprite.x, y: weaponSprite.y };
    const endPos = { x: target.body.position.x + Phaser.Math.Between(-30, 30), y: target.body.position.y };
    const grenade = this.add.circle(startPos.x, startPos.y, 8, 0x228B22);
    this.tweens.add({
        targets: grenade, x: endPos.x, y: endPos.y, duration: 400, ease: 'Cubic.easeIn',
        onComplete: () => {
            grenade.destroy();
            this.handleExplosionHit(endPos, 120, weaponData.damage);
        }
    });
}

handleWeaponHit(body, damage, angle) {
    if (this.isGameOver || !body) return;
    this.koMeter = Math.min(this.koMeter + (damage * 0.25), this.koMeterMax); 
    this.updateKoBar();
    this.updateScore(Math.max(1, Math.round(damage * 0.2)));

    if (angle !== undefined) {
        const forceMagnitude = 0.08;
        const force = new Phaser.Math.Vector2(Math.cos(angle) * forceMagnitude, Math.sin(angle) * forceMagnitude);
        this.matter.body.applyForce(body, body.position, force);
    }
    
    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playFleshHit(1.0);
    } else if (this.sounds.damage) {
        this.sounds.damage.play({ volume: 0.05 });
    }

    if (window.IndieJuice) {
        window.IndieJuice.spawnSparks(this, body.position.x, body.position.y, 7, 0xffea00);
        window.IndieJuice.floatingText(this, body.position.x, body.position.y - 20, Math.round(damage), damage > 30);
    }

    if (this.comboTracker) {
        this.comboTracker.hit(body.position.x, body.position.y);
    }
    
    this.weaponHitCounter++;
    
    for (let i = 0; i < 4; i++) {
        this.createBloodEffect(body);
    }
    
    if (this.weaponHitCounter > 0 && this.weaponHitCounter % 3 === 0) {
        this.spawnCoin(body.position.x, body.position.y);
    }
    
    const emitter = this.add.particles(body.position.x, body.position.y, 'coin', {
        speed: 50, scale: { start: 0.1, end: 0 }, lifespan: 200, blendMode: 'NORMAL', tint: 0xbb0a1e
    });
    emitter.explode(15);
    
    if (this.koMeter >= this.koMeterMax) {
        this.handleKO();
    }
}

handleExplosionHit(position, radius, damage) {
    if (window.IndieAudioSynth) {
        window.IndieAudioSynth.playExplosion();
    }
    if (window.IndieJuice) {
        window.IndieJuice.spawnShockwave(this, position.x, position.y, 3.2);
        window.IndieJuice.screenShake(this, 0.022, 350);
        window.IndieJuice.flash(this, 0xff7700, 150);
        window.IndieJuice.spawnSparks(this, position.x, position.y, 20, 0xffaa00);
        window.IndieJuice.spawnDust(this, position.x, position.y, 12);
    }
    const explosionFX = this.add.circle(position.x, position.y, radius, 0xffa500, 0.5);
    this.tweens.add({ targets: explosionFX, scale: 0, duration: 300, onComplete: () => explosionFX.destroy() });

    this.buddyParts.forEach(part => {
        if (!part.body) return;
        const distance = Phaser.Math.Distance.Between(position.x, position.y, part.body.position.x, part.body.position.y);
        if (distance <= radius) {
            const direction = new Phaser.Math.Vector2(part.body.position.x - position.x, part.body.position.y - position.y).normalize();
            const forceMagnitude = 0.18;
            const force = direction.scale(forceMagnitude);
            this.matter.body.applyForce(part.body, part.body.position, force);
            this.handleWeaponHit(part.body, damage);
        }
    });
}

/**
 * Shows the instructional popup for the pistol.
 */
showInstructionsPopup() {
    const popupContainer = this.add.container(this.game.config.width / 2, 150).setDepth(100).setAlpha(0);
    const bg = this.add.graphics().fillStyle(0x000000, 0.75).fillRoundedRect(-280, -80, 560, 160, 15);
    
    const text1 = this.add.text(-20, -45, "Pistol will shoot automatically\ndont need to touch", {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'left'
    }).setOrigin(0, 0.5);

    const text2 = this.add.text(-20, 35, "Keep the pistol away\nfor better aim!", {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', align: 'left'
    }).setOrigin(0, 0.5);

    // Placeholder icons
    const icon1 = this.add.text(-220, -45, 'ğŸ”«', { fontSize: '40px' }).setOrigin(0.5);
    const icon2 = this.add.text(-220, 35, 'ğŸ‘†', { fontSize: '40px' }).setOrigin(0.5);

    popupContainer.add([bg, text1, text2, icon1, icon2]);
    
    // Fade the popup in, show it for 4 seconds, then fade it out
    this.tweens.add({
        targets: popupContainer,
        alpha: 1,
        duration: 500,
        yoyo: true,
        hold: 4000,
        onComplete: () => popupContainer.destroy()
    });
}

createButton(x, y, text, callback) {
    const buttonContainer = this.add.container(x, y);
    const w = 240, h = 60;

    const panel = this.add.graphics();

    // âœ… CHANGE: Use a solid brown fill instead of a gradient.
    panel.fillStyle(Phaser.Display.Color.HexStringToColor(this.THEME.BROWN).color);
    
    // âœ… CHANGE: Increased corner radius to 30 to create the "pill" shape.
    panel.fillRoundedRect(-w / 2, -h / 2, w, h, 30);
    
    // âœ… CHANGE: Made the black border solid and thicker.
    panel.lineStyle(4, this.THEME.BLACK, 1);
    panel.strokeRoundedRect(-w / 2, -h / 2, w, h, 30);

    const buttonText = this.add.text(0, 0, text, {
        fontFamily: 'Arial Black', fontSize: '28px', color: this.THEME.WHITE,
    }).setOrigin(0.5);

    const hitZone = this.add.zone(0, 0, w, h).setInteractive({ cursor: 'pointer' });
    buttonContainer.add([panel, buttonText, hitZone]);

    hitZone.on('pointerdown', () => {
        this.tweens.add({
            targets: buttonContainer,
            scale: 0.95,
            duration: 100,
            yoyo: true,
            onComplete: callback
        });
    });
    
    return buttonContainer;
}

/**
 * Creates an animated blood splat effect at the hit location.
 */
createBloodEffect(body) {
    if (!body || !body.position) return;
    const cooldown = 40;
    const now = this.time.now;
    if (now - this.lastBloodEffectTime < cooldown) {
        return;
    }
    this.lastBloodEffectTime = now;

    const count = Phaser.Math.Between(5, 10);
    for (let i = 0; i < count; i++) {
        const drop = this.add.circle(
            body.position.x + Phaser.Math.Between(-12, 12),
            body.position.y + Phaser.Math.Between(-12, 12),
            Phaser.Math.FloatBetween(4, 9),
            Phaser.Utils.Array.GetRandom([0x8a0303, 0x990000, 0xbb0a1e, 0x660000])
        ).setDepth(15);

        const targetX = drop.x + Phaser.Math.Between(-70, 70);
        const targetY = drop.y + Phaser.Math.Between(-50, 90);

        this.tweens.add({
            targets: drop,
            x: targetX,
            y: targetY,
            scaleX: Phaser.Math.FloatBetween(0.5, 1.6),
            scaleY: Phaser.Math.FloatBetween(0.5, 1.6),
            alpha: 0,
            duration: Phaser.Math.Between(400, 750),
            ease: 'Quad.easeOut',
            onComplete: () => {
                try { drop.destroy(); } catch (e) {}
            }
        });
    }
}  

/**
 * Plays a unique taunt until all have been heard, then plays randomly.
 */
playRandomTaunt() {
    const cooldown = 9000;
    const now = this.time.now;

    if (now - this.lastTauntTime < cooldown) {
        return;
    }
    this.lastTauntTime = now;

    let tauntToPlayKey;
if (this.unplayedTaunts.length > 0) {
    // Just take the next taunt from our pre-shuffled list
    tauntToPlayKey = this.unplayedTaunts.pop();
} else {
        tauntToPlayKey = Phaser.Utils.Array.GetRandom(this.allTauntKeys);
    }

    const soundObject = this.sounds[tauntToPlayKey];
    if (soundObject) {
        soundObject.play({ volume: 0.9 });
    }

    const subtitle = this.tauntSubtitles[tauntToPlayKey];
    if (this.subtitleText && subtitle && soundObject) {
        this.tweens.killTweensOf(this.subtitleText);
        this.subtitleText.setText(subtitle);

        // NEW: Duration is now based on the audio clip's length
        const audioDurationMs = soundObject.duration * 1000;

        this.tweens.add({
            targets: this.subtitleText,
            alpha: 1,
            duration: 400,
            ease: 'Power1',
            hold: audioDurationMs, // Use the dynamic duration
            yoyo: true,
        });
    }
}

/**
 * Displays the final KO screen using the polished UI from the reference code.
 */
showKoScreen() {
    const koScreenContainer = this.add.container(this.width / 2, this.height / 2).setAlpha(0);
    koScreenContainer.setDepth(100);

    const overlay = this.add.graphics()
        .fillStyle(0x000000, 0.9)
        .fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    const koText = this.add.text(0, -80, 'K.O.!', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '96px',
        fontWeight: 'bold',
        fill: '#e74c3c',
        stroke: '#000000',
        strokeThickness: 4,
        shadow: { color: '#c0392b', blur: 25, fill: true }
    }).setOrigin(0.5);

    const reward = Phaser.Math.Between(200, 300);
    const finalScoreText = this.add.text(0, 40, `REWARD: ${reward}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        fill: '#ecf0f1'
    }).setOrigin(0.5);
    
    const weaponBtn = this.createButton(-140, 120, 'WEAPONS', () => {
        console.log('Weapons button clicked!');
    });
    const playBtn = this.createButton(140, 120, 'PLAY AGAIN', () => {
        this.gameOver();
    });

    koScreenContainer.add([overlay, koText, finalScoreText, weaponBtn, playBtn]);

    this.tweens.add({
        targets: koScreenContainer,
        alpha: 1,
        duration: 1200,
        ease: 'Power1'
    });
}

    // -- STANDARD AICADE FUNCTIONS -- [cite: 349]

updateScore(points) {
    this.score += points;
    this.updateScoreText();
}

updateScoreText() {
  if (!this.scoreText || this.scoreText.destroyed) return;
  this.tweens.killTweensOf(this.scoreText);
  this.tweens.add({ targets: this.scoreText, scale: 1.3, duration: 100, ease: 'Power1', yoyo: true });
}

    gameOver() {
        // Use the predefined Aicade game over function [cite: 599, 600]
        initiateGameOver.bind(this)({
            "score": this.score
        });
    }

pauseGame() {
    // âœ… CHANGE: Replace the old Aicade function with a call to our new custom pause screen.
    this.buildPauseScreen();
}
}

/* ===== Progress Loader (platform) ===== */
function displayProgressLoader() {
    let width = 400; 
    let height = 60; 
    let x = (this.game.config.width / 2) - 200; 
    let y = (this.game.config.height / 2) - 30;
    
    // Background with gradient
    const progressBox = this.add.graphics();
    progressBox.fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 0.9);
    progressBox.fillRoundedRect(x, y, width, height, 15);
    progressBox.lineStyle(3, 0x3498db, 1);
    progressBox.strokeRoundedRect(x, y, width, height, 15);
    
    // Loading text with fallback font
    const loadingText = this.add.text(
        this.game.config.width / 2, 
        this.game.config.height / 2 + 50,
        'Loading Amazing Experience...', 
        {
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            fontWeight: 'bold',
            fill: '#ecf0f1',
            stroke: '#2c3e50',
            strokeThickness: 2
        }
    ).setOrigin(0.5, 0.5);
    
    // Animated progress bar with gradient
    const progressBar = this.add.graphics();
    
    // Store reference to scene for closures
    const scene = this;
    
    // Pulsing animation for loading text (only if tweens is available)
    if (this.tweens) {
        this.tweens.add({
            targets: loadingText,
            alpha: { from: 1, to: 0.5 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    this.load.on('progress', (value) => {
        progressBar.clear();
        progressBar.fillGradientStyle(0x27ae60, 0x2ecc71, 0x27ae60, 0x2ecc71);
        progressBar.fillRoundedRect(x + 5, y + 5, (width - 10) * value, height - 10, 10);
        
        // Add shimmer effect (simplified)
        if (value > 0) {
            const shimmer = scene.add.graphics();
            shimmer.fillGradientStyle(0xffffff, 0xffffff, 0xffffff, 0xffffff, 0.3);
            shimmer.fillRect(x + (width * value) - 20, y, 40, height);
            
            scene.time.delayedCall(100, () => {
                if (shimmer && shimmer.destroy) {
                    shimmer.destroy();
                }
            });
        }
    });
    
    this.load.on('complete', function () {
        // Completion animation
        progressBar.clear();
        progressBar.fillGradientStyle(0x27ae60, 0x2ecc71, 0x27ae60, 0x2ecc71);
        progressBar.fillRoundedRect(x + 5, y + 5, width - 10, height - 10, 10);
        
        // Fade out all loading elements (with fallback)
        if (scene.tweens) {
            scene.tweens.add({
                targets: [progressBar, progressBox, loadingText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    progressBar.destroy();
                    progressBox.destroy();
                    loadingText.destroy();
                }
            });
        } else {
            // Fallback without animation
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        }
    });
}

const config = {
    type: Phaser.AUTO,
    width: _CONFIG.orientationSizes[_CONFIG.deviceOrientation].width,
    height: _CONFIG.orientationSizes[_CONFIG.deviceOrientation].height,
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'matter',
        matter: {
            // --- CHANGE: Increased gravity for a heavier, bouncier feel ---
            gravity: { y: 0.5 },
            debug: false // <-- CHANGE THIS
        }
    },
    pixelArt: true,
    dataObject: {
        name: _CONFIG.title,
        description: _CONFIG.description,
        instructions: _CONFIG.instructions,
    },
    deviceOrientation: _CONFIG.deviceOrientation
};