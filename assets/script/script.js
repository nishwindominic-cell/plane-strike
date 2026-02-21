// Your original JavaScript code remains exactly the same
// ────────────────────────────────────────────────────────────────
// FIRST: Define all variables and functions in correct order
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const successMenu = document.getElementById('success-menu');
const homeMenu = document.getElementById('home-menu');
const loadingPage = document.getElementById('loading-page');
const hud = document.getElementById('hud');
const radar = document.getElementById('radar-container');
const gsCont = document.getElementById('gs-container');
const gsDia = document.getElementById('gs-diamond');
const locCont = document.getElementById('loc-container');
const locDia = document.getElementById('loc-diamond');
const hudToggle = document.getElementById('hud-toggle');
const settingsPanel = document.getElementById('settings-panel');
const soundToggle = document.getElementById('sound-toggle');
const levelStage = document.getElementById('level-stage');
const bossWarning = document.getElementById('boss-warning');
const bossHealthContainer = document.getElementById('boss-health-container');
const bossHealthFill = document.getElementById('boss-health-fill');
const bossHealthText = document.getElementById('boss-health-text');
const continueBtn = document.getElementById('continue-btn');
const stageCompleteMenu = document.getElementById('stage-complete-menu');
const stageCompleteText = document.getElementById('stage-complete-text');
const nextStageNumber = document.getElementById('next-stage-number');
const powerShopMenu = document.getElementById('power-shop-menu');
const shopCoins = document.getElementById('shop-coins-amount');
const shopItemsContainer = document.getElementById('shop-items-container');
const coinDisplay = document.getElementById('coin-display');
const shopBtn = document.getElementById('shop-btn');

// Settings state
let soundEnabled = true;
let musicVolume = 70;
let sfxVolume = 80;

// Sensitivity and Difficulty settings
let sensitivityLevel = 'Normal'; // Low, Normal, High
let difficultyLevel = 'Normal'; // Easy, Normal, Hard

// Difficulty multipliers
let enemySpeedMultiplier = 1.0;
let enemyAccuracyMultiplier = 1.0;
let enemyCountMultiplier = 1.0;
let enemyHealthMultiplier = 1.0;

// Missile counter for HUD display
let missileCount = 6;

// ===== NEW INFINITE LEVEL SYSTEM =====
let currentLevel = 1;
let currentStage = 1;
let totalScore = 0;
let totalKills = 0;
let coins = 0; // NEW: Coin system
const STAGES_PER_LEVEL = 5;

// Boss variables
let boss = null;
let bossActive = false;
let bossHealth = 0;
let bossMaxHealth = 0;
let bossSpawned = false;

// Stage completion tracking
let stageJustCompleted = false;

// Level themes
const levelThemes = [
    { name: "Training", color: "#4a5568", enemyTypes: ["scout"], bossType: "trainer" },
    { name: "Desert Storm", color: "#b45309", enemyTypes: ["scout", "fighter"], bossType: "sandstorm" },
    { name: "Arctic", color: "#60a5fa", enemyTypes: ["fighter", "interceptor"], bossType: "frost" },
    { name: "Jungle", color: "#059669", enemyTypes: ["gunship", "fighter"], bossType: "predator" },
    { name: "Night Ops", color: "#1e293b", enemyTypes: ["interceptor", "ace"], bossType: "shadow" },
    { name: "Volcano", color: "#dc2626", enemyTypes: ["gunship", "interceptor"], bossType: "inferno" },
    { name: "Storm", color: "#7c3aed", enemyTypes: ["ace", "gunship"], bossType: "tempest" },
    { name: "Space", color: "#312e81", enemyTypes: ["ace", "interceptor"], bossType: "cosmic" }
];

// Enemy type definitions
const enemyTypes = {
    scout: {
        name: "SCOUT",
        baseThrust: 3.5,
        health: 1,
        color: "#94a3b8",
        shootSpeed: 120,
        bulletSpeed: 15,
        shape: "small",
        points: 50,
        coins: 10
    },
    fighter: {
        name: "FIGHTER",
        baseThrust: 4.2,
        health: 2,
        color: "#ef4444",
        shootSpeed: 90,
        bulletSpeed: 18,
        shape: "standard",
        points: 100,
        coins: 20
    },
    interceptor: {
        name: "INTERCEPTOR",
        baseThrust: 5.0,
        health: 1,
        color: "#f97316",
        shootSpeed: 70,
        bulletSpeed: 22,
        shape: "sleek",
        points: 150,
        coins: 30
    },
    gunship: {
        name: "GUNSHIP",
        baseThrust: 3.0,
        health: 4,
        color: "#64748b",
        shootSpeed: 50,
        bulletSpeed: 14,
        shape: "heavy",
        points: 200,
        coins: 40
    },
    ace: {
        name: "ACE",
        baseThrust: 4.8,
        health: 3,
        color: "#fbbf24",
        shootSpeed: 60,
        bulletSpeed: 20,
        shape: "elite",
        points: 250,
        coins: 50
    }
};

// FIXED: Boss type definitions with proper 5 seconds shooting, 15 seconds cooldown
const bossTypes = {
    trainer: {
        name: "TRAINER BOSS",
        health: 20,
        thrust: 3.0,
        shootSpeed: 40,
        bulletSpeed: 12,
        color: "#6b7280",
        size: 2.0,
        pattern: "basic",
        points: 500,
        coins: 100,
        shootDuration: 300, // 5 seconds at 60fps
        shootCooldown: 900 // 15 seconds at 60fps
    },
    sandstorm: {
        name: "SANDSTORM",
        health: 40,
        thrust: 4.0,
        shootSpeed: 30,
        bulletSpeed: 18,
        color: "#b45309",
        size: 2.2,
        pattern: "spread",
        points: 1000,
        coins: 150,
        shootDuration: 300,
        shootCooldown: 900
    },
    frost: {
        name: "FROST GIANT",
        health: 35,
        thrust: 3.5,
        shootSpeed: 35,
        bulletSpeed: 20,
        color: "#60a5fa",
        size: 2.1,
        pattern: "freeze",
        points: 1000,
        coins: 150,
        shootDuration: 300,
        shootCooldown: 900
    },
    predator: {
        name: "PREDATOR",
        health: 45,
        thrust: 4.5,
        shootSpeed: 25,
        bulletSpeed: 22,
        color: "#059669",
        size: 2.3,
        pattern: "hunting",
        points: 1200,
        coins: 180,
        shootDuration: 300,
        shootCooldown: 900
    },
    shadow: {
        name: "SHADOW",
        health: 30,
        thrust: 5.0,
        shootSpeed: 28,
        bulletSpeed: 25,
        color: "#1e293b",
        size: 2.0,
        pattern: "stealth",
        points: 1200,
        coins: 180,
        shootDuration: 300,
        shootCooldown: 900
    },
    inferno: {
        name: "INFERNO",
        health: 50,
        thrust: 4.2,
        shootSpeed: 22,
        bulletSpeed: 19,
        color: "#dc2626",
        size: 2.4,
        pattern: "fire",
        points: 1500,
        coins: 200,
        shootDuration: 300,
        shootCooldown: 900
    },
    tempest: {
        name: "TEMPEST",
        health: 55,
        thrust: 4.8,
        shootSpeed: 20,
        bulletSpeed: 21,
        color: "#7c3aed",
        size: 2.5,
        pattern: "storm",
        points: 1500,
        coins: 200,
        shootDuration: 300,
        shootCooldown: 900
    },
    cosmic: {
        name: "COSMIC",
        health: 60,
        thrust: 5.2,
        shootSpeed: 18,
        bulletSpeed: 24,
        color: "#312e81",
        size: 2.6,
        pattern: "cosmic",
        points: 2000,
        coins: 250,
        shootDuration: 300,
        shootCooldown: 900
    }
};

// Player stats
let playerMaxThrust = 12;
let playerAcceleration = 0.1;
let playerManeuverability = 0.035;
let playerBaseHealth = 50;
let playerBaseMissiles = 6;
let playerColor = "#475569";

// ===== NEW POWER SYSTEM =====
let activePower = null;
let powerDuration = 0;
let powerCooldown = 0;

const powerItems = [
    {
        id: 'rapidFire',
        name: 'RAPID FIRE',
        description: 'Gun fires 3x faster for 10 seconds',
        price: 50,
        levelReq: 1,
        icon: '🔥',
        duration: 600,
        effect: function () {
            activePower = 'rapidFire';
            powerDuration = 600;
        }
    },
    {
        id: 'shield',
        name: 'ENERGY SHIELD',
        description: 'Invulnerable for 8 seconds',
        price: 75,
        levelReq: 2,
        icon: '🛡️',
        duration: 480,
        effect: function () {
            activePower = 'shield';
            powerDuration = 480;
        }
    },
    {
        id: 'doubleDamage',
        name: 'DOUBLE DAMAGE',
        description: 'All weapons deal 2x damage for 12 seconds',
        price: 100,
        levelReq: 3,
        icon: '⚡',
        duration: 720,
        effect: function () {
            activePower = 'doubleDamage';
            powerDuration = 720;
        }
    },
    {
        id: 'timeSlow',
        name: 'TIME SLOW',
        description: 'Slows down enemies for 8 seconds',
        price: 120,
        levelReq: 4,
        icon: '⏱️',
        duration: 480,
        effect: function () {
            activePower = 'timeSlow';
            powerDuration = 480;
        }
    },
    {
        id: 'homingMissiles',
        name: 'HOMING MISSILES',
        description: 'Next 10 missiles are super homing',
        price: 150,
        levelReq: 5,
        icon: '🎯',
        duration: 0,
        effect: function () {
            activePower = 'homingMissiles';
            powerMissileCount = 10;
        }
    },
    {
        id: 'repairKit',
        name: 'REPAIR KIT',
        description: 'Instantly restore 50% health',
        price: 60,
        levelReq: 1,
        icon: '❤️',
        duration: 0,
        effect: function () {
            player.health = Math.min(player.health + playerBaseHealth * 0.5, playerBaseHealth);
            document.getElementById('p-health').innerText = player.health + "%";
        }
    },
    {
        id: 'missileRefill',
        name: 'MISSILE REFILL',
        description: 'Refill all missiles',
        price: 40,
        levelReq: 1,
        icon: '🚀',
        duration: 0,
        effect: function () {
            missileCount = playerBaseMissiles;
        }
    }
];

let powerMissileCount = 0;
let originalEnemySpeedMultiplier = 1.0;

// ─── NEW: Epic Background Music for Home Page ─────────────────────
let homeMusic = null;
let homeMusicInterval = null;
let audioCtx = null;

// Initialize audio context on user interaction
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function initHomeMusic() {
    if (!soundEnabled || !audioCtx) return;
    
    // Stop any existing music
    stopHomeMusic();
    
    try {
        const now = audioCtx.currentTime;

        // Create epic orchestral-style music
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const osc3 = audioCtx.createOscillator();
        const osc4 = audioCtx.createOscillator();

        osc1.type = 'triangle'; // Main melody
        osc2.type = 'sine';     // Bass
        osc3.type = 'sawtooth';  // Brass
        osc4.type = 'square';    // Percussion

        // Main melody - heroic theme
        osc1.frequency.setValueAtTime(261.63, now); // C4
        osc1.frequency.setValueAtTime(329.63, now + 0.5); // E4
        osc1.frequency.setValueAtTime(392.00, now + 1.0); // G4
        osc1.frequency.setValueAtTime(523.25, now + 1.5); // C5
        osc1.frequency.setValueAtTime(392.00, now + 2.0); // G4
        osc1.frequency.setValueAtTime(329.63, now + 2.5); // E4
        osc1.frequency.setValueAtTime(261.63, now + 3.0); // C4

        // Bass line
        osc2.frequency.setValueAtTime(130.81, now); // C3
        osc2.frequency.setValueAtTime(130.81, now + 2.0); // C3

        // Brass harmony
        osc3.frequency.setValueAtTime(196.00, now); // G3
        osc3.frequency.setValueAtTime(246.94, now + 1.0); // B3
        osc3.frequency.setValueAtTime(293.66, now + 2.0); // D4

        // Percussion effect
        osc4.frequency.setValueAtTime(60, now);
        osc4.frequency.setValueAtTime(120, now + 1.0);
        osc4.frequency.setValueAtTime(60, now + 2.0);

        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();
        const gain3 = audioCtx.createGain();
        const gain4 = audioCtx.createGain();

        gain1.gain.setValueAtTime(0.15 * (musicVolume / 100), now);
        gain2.gain.setValueAtTime(0.1 * (musicVolume / 100), now);
        gain3.gain.setValueAtTime(0.08 * (musicVolume / 100), now);
        gain4.gain.setValueAtTime(0.05 * (musicVolume / 100), now);

        // Add reverb effect with filter
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.5;

        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);
        osc4.connect(gain4);

        gain1.connect(filter);
        gain2.connect(filter);
        gain3.connect(filter);
        gain4.connect(filter);

        filter.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
        osc3.start();
        osc4.start();

        // Loop the melody
        homeMusicInterval = setInterval(() => {
            if (!soundEnabled || homeMenu.style.display === 'none' || !audioCtx) return;
            const loopNow = audioCtx.currentTime;
            osc1.frequency.setValueAtTime(261.63, loopNow);
            osc1.frequency.setValueAtTime(329.63, loopNow + 0.5);
            osc1.frequency.setValueAtTime(392.00, loopNow + 1.0);
            osc1.frequency.setValueAtTime(523.25, loopNow + 1.5);
            osc1.frequency.setValueAtTime(392.00, loopNow + 2.0);
            osc1.frequency.setValueAtTime(329.63, loopNow + 2.5);
            osc1.frequency.setValueAtTime(261.63, loopNow + 3.0);
        }, 3000);

        homeMusic = [osc1, osc2, osc3, osc4];

    } catch (e) {
        console.log('Home music not supported');
    }
}

function stopHomeMusic() {
    if (homeMusic) {
        homeMusic.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        homeMusic = null;
    }
    if (homeMusicInterval) {
        clearInterval(homeMusicInterval);
        homeMusicInterval = null;
    }
}

// ─── LOADING PAGE ───────────────────────────────────────────────
window.addEventListener('load', function() {
    // Simulate loading time
    setTimeout(() => {
        loadingPage.classList.add('hidden');
        homeMenu.classList.add('visible');
        
        // Initialize audio after user can interact
        initAudio();
        
        // Start home music if sound is enabled
        if (soundEnabled && audioCtx) {
            setTimeout(() => {
                initHomeMusic();
            }, 100);
        }
    }, 2000);
});

// ─── SAVE GAME SYSTEM ───────────────────────────────────────────
function saveGame() {
    const saveData = {
        currentLevel: currentLevel,
        currentStage: currentStage,
        totalScore: totalScore,
        totalKills: totalKills,
        coins: coins,
        soundEnabled: soundEnabled,
        musicVolume: musicVolume,
        sfxVolume: sfxVolume,
        sensitivityLevel: sensitivityLevel,
        difficultyLevel: difficultyLevel
    };
    localStorage.setItem('rfsSaveData', JSON.stringify(saveData));
}

function loadGame() {
    const savedData = localStorage.getItem('rfsSaveData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            currentLevel = data.currentLevel || 1;
            currentStage = data.currentStage || 1;
            totalScore = data.totalScore || 0;
            totalKills = data.totalKills || 0;
            coins = data.coins || 0;
            soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
            musicVolume = data.musicVolume || 70;
            sfxVolume = data.sfxVolume || 80;
            sensitivityLevel = data.sensitivityLevel || 'Normal';
            difficultyLevel = data.difficultyLevel || 'Normal';

            document.getElementById('sensitivity-value').innerText = sensitivityLevel;
            document.getElementById('difficulty-value').innerText = difficultyLevel;

            continueBtn.style.display = 'inline-block';

            updateCoinDisplay();
        } catch (e) {
            console.log('Failed to load save data');
        }
    }
}

function resetGame() {
    currentLevel = 1;
    currentStage = 1;
    totalScore = 0;
    totalKills = 0;
    coins = 0;
    lives = 3;
    updateCoinDisplay();
    document.getElementById('lives-val').innerText = "❤️".repeat(3);
    saveGame();
}

function updateCoinDisplay() {
    coinDisplay.innerHTML = `💰 ${coins}`;
    if (shopCoins) shopCoins.innerText = coins;
}

window.continueGame = function () {
    loadGame();
    startGame();
}

// ─── POWER SHOP FUNCTIONS ───────────────────────────────────────
window.openPowerShop = function () {
    if (isPaused) return;
    isPaused = true;

    let html = '';
    powerItems.forEach(item => {
        const canBuy = coins >= item.price && currentLevel >= item.levelReq;
        html += `
            <div class="shop-item ${canBuy ? '' : 'disabled'}" onclick="buyPower('${item.id}')">
                <h3>${item.icon} ${item.name}</h3>
                <div class="price">💰 ${item.price}</div>
                <div class="description">${item.description}</div>
                <div class="level-req">Level Req: ${item.levelReq}</div>
            </div>
        `;
    });

    shopItemsContainer.innerHTML = html;
    shopCoins.innerText = coins;
    powerShopMenu.style.display = 'block';
}

window.closePowerShop = function () {
    powerShopMenu.style.display = 'none';
    isPaused = false;
}

window.buyPower = function (powerId) {
    const power = powerItems.find(p => p.id === powerId);
    if (!power) return;

    if (coins >= power.price && currentLevel >= power.levelReq) {
        coins -= power.price;
        updateCoinDisplay();
        saveGame();

        power.effect();

        updatePowerDisplay();

        powerShopMenu.style.display = 'none';
        isPaused = false;
    }
}

function updatePowerDisplay() {
    const powerStat = document.getElementById('powerStat');
    if (activePower) {
        const power = powerItems.find(p => p.id === activePower);
        if (power) {
            powerStat.innerText = power.name;
        } else {
            powerStat.innerText = 'ACTIVE';
        }
    } else {
        powerStat.innerText = 'NONE';
    }
}

function updatePowers() {
    if (activePower) {
        if (powerDuration > 0) {
            powerDuration--;

            if (activePower === 'timeSlow') {
                enemySpeedMultiplier = 0.3;
            }
        } else {
            if (activePower === 'timeSlow') {
                enemySpeedMultiplier = originalEnemySpeedMultiplier;
            }
            if (activePower === 'homingMissiles') {
                powerMissileCount = 0;
            }
            activePower = null;
            updatePowerDisplay();
        }
    }
}

// ─── STAGE COMPLETE FUNCTIONS ───────────────────────────────────
function showStageComplete() {
    isPaused = true;

    player.health = player.baseHealth;
    missileCount = playerBaseMissiles;

    const stageBonus = 50 + (currentStage * 10);
    coins += stageBonus;
    updateCoinDisplay();

    document.getElementById('p-health').innerText = player.health + "%";

    const levelTheme = levelThemes[(currentLevel - 1) % levelThemes.length];
    stageCompleteText.innerHTML = `${levelTheme.name} - Stage ${currentStage} Complete! +${stageBonus}💰`;

    let nextStage = currentStage + 1;
    if (nextStage > STAGES_PER_LEVEL) {
        nextStage = 1;
    }
    nextStageNumber.innerText = nextStage;

    stageCompleteMenu.style.display = 'block';

    saveGame();
}

window.continueToNextStage = function () {
    stageCompleteMenu.style.display = 'none';

    currentStage++;

    if (currentStage > STAGES_PER_LEVEL) {
        currentLevel++;
        currentStage = 1;
    }

    updateStageDisplay();

    player.x = 1000;
    player.y = 1500;
    player.vx = 0;
    player.vy = 0;
    player.angle = 0;
    player.thrust = 4;
    player.gearDown = false;

    enemies = [];
    boss = null;
    bossActive = false;
    bossHealthContainer.style.display = 'none';

    activePower = null;
    powerDuration = 0;
    updatePowerDisplay();

    spawnEnemies();

    isPaused = false;

    saveGame();
}

window.returnToHome = function () {
    stageCompleteMenu.style.display = 'none';
    homeMenu.style.display = 'flex';
    homeMenu.style.opacity = '1';
    hud.style.display = 'none';
    radar.style.display = 'none';
    gsCont.style.display = 'none';
    locCont.style.display = 'none';
    levelStage.style.display = 'none';
    coinDisplay.style.display = 'none';
    shopBtn.style.display = 'none';
    isPaused = true;

    stopHomeMusic();
    if (soundEnabled) {
        initHomeMusic();
    }

    saveGame();
}

// ─── AUDIO ───────────────────────────────────────────────────────
function playRealisticCrash() {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        return;
    }

    const now = audioCtx.currentTime;
    const volumeMultiplier = sfxVolume / 100;

    const metalOsc1 = audioCtx.createOscillator();
    const metalOsc2 = audioCtx.createOscillator();
    const metalGain = audioCtx.createGain();

    metalOsc1.type = 'sawtooth';
    metalOsc2.type = 'triangle';

    metalOsc1.frequency.setValueAtTime(80, now);
    metalOsc1.frequency.exponentialRampToValueAtTime(30, now + 1.5);
    metalOsc2.frequency.setValueAtTime(160, now);
    metalOsc2.frequency.exponentialRampToValueAtTime(60, now + 1.5);

    metalOsc1.connect(metalGain);
    metalOsc2.connect(metalGain);
    metalGain.connect(audioCtx.destination);
    metalGain.gain.setValueAtTime(0.4 * volumeMultiplier, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    metalOsc1.start();
    metalOsc2.start();
    metalOsc1.stop(now + 1.5);
    metalOsc2.stop(now + 1.5);

    const explosionOsc = audioCtx.createOscillator();
    const explosionGain = audioCtx.createGain();
    explosionOsc.type = 'sine';
    explosionOsc.frequency.setValueAtTime(40, now);
    explosionOsc.frequency.exponentialRampToValueAtTime(15, now + 1.8);
    explosionOsc.connect(explosionGain);
    explosionGain.connect(audioCtx.destination);
    explosionGain.gain.setValueAtTime(0.6 * volumeMultiplier, now);
    explosionGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    explosionOsc.start();
    explosionOsc.stop(now + 1.8);

    const noiseDur = 2.0;
    const noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * noiseDur, audioCtx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
    const noiseSrc = audioCtx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 800;
    const noiseGain = audioCtx.createGain();
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noiseGain.gain.setValueAtTime(0.3 * volumeMultiplier, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur);
    noiseSrc.start();
    noiseSrc.stop(now + noiseDur);
}

function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        return;
    }

    const volumeMultiplier = sfxVolume / 100;
    const now = audioCtx.currentTime;

    if (type === 'explode') {
        const dur = 0.35;
        const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const g = audioCtx.createGain();
        src.connect(g);
        g.connect(audioCtx.destination);
        g.gain.setValueAtTime(0.45 * volumeMultiplier, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        src.start();
        return;
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    let baseGain = 0;
    switch (type) {
        case 'shoot': baseGain = 0.14; break;
        case 'enemyShoot': baseGain = 0.07; break;
        case 'stall': baseGain = 0.13; break;
        case 'repair': baseGain = 0.24; break;
        case 'land': baseGain = 0.25; break;
        case 'crash': baseGain = 0.35; break;
        case 'hit': baseGain = 0.22; break;
        case 'gear': baseGain = 0.18; break;
        case 'enginefail': baseGain = 0.28; break;
        case 'missile': baseGain = 0.3; break;
        case 'bossSpawn': baseGain = 0.5; break;
        case 'bossHit': baseGain = 0.4; break;
        case 'bossDie': baseGain = 0.6; break;
        case 'powerup': baseGain = 0.3; break;
        case 'coin': baseGain = 0.2; break;
        default: baseGain = 0.1;
    }

    gain.gain.setValueAtTime(baseGain * volumeMultiplier, now);

    if (type === 'shoot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start();
        osc.stop(now + 0.09);
    } else if (type === 'enemyShoot') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start();
        osc.stop(now + 0.14);
    } else if (type === 'stall') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start();
        osc.stop(now + 0.45);
    } else if (type === 'repair') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start();
        osc.stop(now + 0.22);
    } else if (type === 'land') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start();
        osc.stop(now + 0.6);
    } else if (type === 'crash') {
        playRealisticCrash();
        return;
    } else if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start();
        osc.stop(now + 0.25);
    } else if (type === 'gear') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(90, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start();
        osc.stop(now + 0.18);
    } else if (type === 'enginefail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.9);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.start();
        osc.stop(now + 0.9);
    } else if (type === 'missile') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start();
        osc.stop(now + 0.3);
    } else if (type === 'bossSpawn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.5);
        osc.frequency.exponentialRampToValueAtTime(440, now + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start();
        osc.stop(now + 1.2);
    } else if (type === 'bossHit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start();
        osc.stop(now + 0.3);
    } else if (type === 'bossDie') {
        const dur = 2.0;
        const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * dur, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const g = audioCtx.createGain();
        src.connect(g);
        g.connect(audioCtx.destination);
        g.gain.setValueAtTime(0.6 * volumeMultiplier, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);
        src.start();
        return;
    } else if (type === 'powerup') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start();
        osc.stop(now + 0.5);
    } else if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start();
        osc.stop(now + 0.15);
    }
}

// Settings functions
window.openSettings = function () {
    settingsPanel.style.display = 'block';
    homeMenu.style.opacity = '0.5';
}

window.closeSettings = function () {
    settingsPanel.style.display = 'none';
    homeMenu.style.opacity = '1';
}

window.toggleSound = function () {
    soundEnabled = !soundEnabled;
    soundToggle.className = soundEnabled ? 'setting-toggle active' : 'setting-toggle';
    
    if (audioCtx) {
        if (soundEnabled) {
            audioCtx.resume();
            if (homeMenu.style.display !== 'none' && homeMenu.classList.contains('visible')) {
                initHomeMusic();
            }
        } else {
            audioCtx.suspend();
            if (engineGain) engineGain.gain.value = 0;
            stopHomeMusic();
        }
    }
    saveGame();
}

window.updateVolume = function (val) {
    musicVolume = val;
    if (engineGain) {
        engineGain.gain.value = soundEnabled ? (0.03 + (player?.thrust || 4) * 0.015) * (musicVolume / 100) : 0;
    }
    saveGame();
}

window.updateSFXVolume = function (val) {
    sfxVolume = val;
    saveGame();
}

window.cycleSensitivity = function () {
    const sensitivities = ['Low', 'Normal', 'High'];
    let currentIndex = sensitivities.indexOf(sensitivityLevel);
    currentIndex = (currentIndex + 1) % sensitivities.length;
    sensitivityLevel = sensitivities[currentIndex];
    document.getElementById('sensitivity-value').innerText = sensitivityLevel;
    saveGame();
}

window.cycleDifficulty = function () {
    const difficulties = ['Easy', 'Normal', 'Hard'];
    let currentIndex = difficulties.indexOf(difficultyLevel);
    currentIndex = (currentIndex + 1) % difficulties.length;
    difficultyLevel = difficulties[currentIndex];
    document.getElementById('difficulty-value').innerText = difficultyLevel;

    switch (difficultyLevel) {
        case 'Easy':
            enemySpeedMultiplier = 0.7;
            enemyAccuracyMultiplier = 0.5;
            enemyCountMultiplier = 0.6;
            enemyHealthMultiplier = 0.7;
            break;
        case 'Normal':
            enemySpeedMultiplier = 1.0;
            enemyAccuracyMultiplier = 1.0;
            enemyCountMultiplier = 1.0;
            enemyHealthMultiplier = 1.0;
            break;
        case 'Hard':
            enemySpeedMultiplier = 1.5;
            enemyAccuracyMultiplier = 2.0;
            enemyCountMultiplier = 1.5;
            enemyHealthMultiplier = 1.5;
            break;
    }
    originalEnemySpeedMultiplier = enemySpeedMultiplier;
    saveGame();
}

// ─── GAME STATE ──────────────────────────────────────────────────
const WORLD_GROUND = 4500;
const GRAVITY = 0.12;
const RADAR_RADIUS = 75;
const RADAR_SCALE = 0.015;
let level = 1;
let lives = 3;
let frame = 0;
let camera = { x: 0, y: 0 };
let bullets = [], enemyBullets = [], enemies = [], particles = [], missiles = [];
// ===== NEW: Stars array for blinking effect =====
let stars = [];
const NUM_STARS = 300;

// ===== NEW: Generate stars =====
function generateStars() {
    for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
            x: Math.random() * 60000 - 10000,
            y: Math.random() * 3500,
            size: Math.random() * 3 + 0.5,
            brightness: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.03 + 0.005,
            phase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.7 ? '#ffe6b3' : '#ffffff'
        });
    }
}
generateStars();

let isPaused = true;
const keys = {};

const player = {
    x: 1000,
    y: 1500,
    vx: 0,
    vy: 0,
    angle: 0,
    thrust: 4,
    maxThrust: 12,
    engineOK: true,
    wingOK: true,
    gearDown: false,
    gearAnim: 0,
    dead: false,
    exploded: false,
    stalling: false,
    wasGearDown: false,
    health: 50,
    baseHealth: 50
};

const scenery = [];
// ===== NEW: Landing lights array =====
const landingLights = [];

const runwayStarts = [500, 11280, 22060, 32840, 43620];
const runwayRanges = [[400, 6100], [11180, 16880], [21960, 27660], [32740, 38440], [43520, 49220]];

// ===== MODIFIED: Generate scenery with water at center of land and trees only on land =====
function generateScenery() {
    scenery.length = 0;
    
    // Define land areas (between runways)
    const landAreas = [];
    for (let i = 0; i < runwayStarts.length - 1; i++) {
        const landStart = runwayStarts[i] + 5500 + 200;
        const landEnd = runwayStarts[i + 1] - 200;
        landAreas.push({ start: landStart, end: landEnd });
    }
    
    // Add water at the center of each land area
    landAreas.forEach(area => {
        const landCenter = (area.start + area.end) / 2;
        // Add a water body at the center (300px wide)
        scenery.push({ 
            x: landCenter - 150, 
            type: 'water', 
            width: 300,
            isCenterWater: true 
        });
    });
    
    // Add water before first runway
    scenery.push({ 
        x: -2000, 
        type: 'water', 
        width: 2500 
    });
    
    // Add water after last runway
    scenery.push({ 
        x: 48000, 
        type: 'water', 
        width: 3000 
    });
    
    // Generate dense forests ONLY on land (not in water areas)
    for (let x = -10000; x < 50000; x += 150) {
        let skip = false;
        
        // Skip runway areas
        for (let range of runwayRanges) {
            if (x > range[0] && x < range[1]) { 
                skip = true; 
                break; 
            }
        }
        
        // Skip water areas at runway centers
        for (let start of runwayStarts) {
            const waterStart = start + 2750 - 300;
            const waterEnd = start + 2750 + 300;
            if (x > waterStart && x < waterEnd) {
                skip = true;
                break;
            }
        }
        
        // Skip water areas at land centers
        landAreas.forEach(area => {
            const landCenter = (area.start + area.end) / 2;
            const waterStart = landCenter - 150;
            const waterEnd = landCenter + 150;
            if (x > waterStart && x < waterEnd) {
                skip = true;
            }
        });
        
        // Skip large water bodies
        if (x > -2000 && x < 500) skip = true; // Before first runway water
        if (x > 48000 && x < 51000) skip = true; // After last runway water
        
        if (skip) continue;
        
        // Add trees (95% chance for dense forests) ONLY on land
        if (Math.random() > 0.05) {
            // Vary tree sizes and colors for variety
            const treeType = Math.random();
            if (treeType < 0.6) {
                // Pine trees
                scenery.push({ 
                    x: x + Math.random() * 100, 
                    type: 'pine', 
                    width: 0,
                    height: 50 + Math.random() * 40,
                    trunkColor: '#4a2e1e',
                    leafColor: '#1e4d3a'
                });
            } else if (treeType < 0.85) {
                // Oak trees
                scenery.push({ 
                    x: x + Math.random() * 100, 
                    type: 'oak', 
                    width: 0,
                    height: 45 + Math.random() * 35,
                    trunkColor: '#5d3a1a',
                    leafColor: '#2d6a4f'
                });
            } else {
                // Palm trees (for tropical feel)
                scenery.push({ 
                    x: x + Math.random() * 100, 
                    type: 'palm', 
                    width: 0,
                    height: 60 + Math.random() * 30,
                    trunkColor: '#8b5a2b',
                    leafColor: '#2e7d32'
                });
            }
        } else {
            // Add bushes and small plants
            scenery.push({ 
                x: x + Math.random() * 100, 
                type: 'bush', 
                width: 0,
                height: 15 + Math.random() * 15,
                color: '#2d6a4f'
            });
        }
    }
}

// ===== NEW: Generate 4 additional landing lights =====
function generateLandingLights() {
    landingLights.length = 0;
    
    // Add 4 landing lights at strategic positions
    const lightPositions = [
        { x: 8000, y: WORLD_GROUND - 30 },   // Between runway 1 and 2
        { x: 18000, y: WORLD_GROUND - 30 },  // Between runway 2 and 3
        { x: 28000, y: WORLD_GROUND - 30 },  // Between runway 3 and 4
        { x: 38000, y: WORLD_GROUND - 30 }   // Between runway 4 and 5
    ];
    
    lightPositions.forEach(pos => {
        landingLights.push({
            x: pos.x,
            y: pos.y,
            intensity: 0.8,
            pulseSpeed: 0.02 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2
        });
    });
}

generateScenery();
generateLandingLights();

function updatePlayerStatsForLevel() {
    const levelTheme = levelThemes[(currentLevel - 1) % levelThemes.length];
    playerColor = levelTheme.color;

    playerMaxThrust = 12 + Math.floor(currentLevel / 2);
    playerAcceleration = 0.1 + (currentLevel * 0.005);
    playerManeuverability = 0.035 + (currentLevel * 0.001);
    playerBaseHealth = 50 + (currentLevel * 5);
    playerBaseMissiles = 6 + Math.floor(currentLevel / 2);

    player.maxThrust = playerMaxThrust;
    if (!player.dead) {
        player.health = playerBaseHealth;
    }
    player.baseHealth = playerBaseHealth;
    missileCount = playerBaseMissiles;
}

function spawnStageEnemies() {
    enemies = [];

    const levelTheme = levelThemes[(currentLevel - 1) % levelThemes.length];

    let numEnemies = 0;
    if (currentStage === 1) numEnemies = 3;
    else if (currentStage === 2) numEnemies = 5;
    else if (currentStage === 3) numEnemies = 7;
    else if (currentStage === 4) numEnemies = 9;
    else if (currentStage === 5) numEnemies = 0;

    for (let i = 0; i < numEnemies; i++) {
        const typeKey = levelTheme.enemyTypes[Math.floor(Math.random() * levelTheme.enemyTypes.length)];
        const enemyType = enemyTypes[typeKey];

        let baseThrust = enemyType.baseThrust;
        let adjustedThrust = baseThrust * enemySpeedMultiplier * (1 + (currentLevel - 1) * 0.1);

        let health = Math.max(1, Math.floor(enemyType.health * enemyHealthMultiplier * (1 + (currentLevel - 1) * 0.2)));

        enemies.push({
            x: player.x + 2000 + Math.random() * 4000,
            y: 500 + Math.random() * 2000,
            angle: Math.PI,
            thrust: adjustedThrust,
            vy: 0,
            vx: 0,
            engineOK: true,
            wingOK: true,
            alive: true,
            crashing: false,
            exploded: false,
            shootTimer: Math.random() * 60,
            health: health,
            maxHealth: health,
            type: enemyType.name,
            color: enemyType.color,
            shootSpeed: Math.max(30, enemyType.shootSpeed / enemyAccuracyMultiplier),
            bulletSpeed: enemyType.bulletSpeed,
            shape: enemyType.shape,
            points: enemyType.points * currentLevel,
            coins: enemyType.coins * currentLevel
        });
    }

    updateStageDisplay();
}

function spawnBoss() {
    if (bossActive) return;

    const levelTheme = levelThemes[(currentLevel - 1) % levelThemes.length];
    const bossType = bossTypes[levelTheme.bossType];

    bossHealth = bossType.health * enemyHealthMultiplier * (1 + (currentLevel - 1) * 0.3);
    bossMaxHealth = bossHealth;

    boss = {
        x: player.x + 3000,
        y: 1500,
        angle: Math.PI,
        thrust: bossType.thrust * enemySpeedMultiplier * (1 + (currentLevel - 1) * 0.1),
        vy: 0,
        vx: 0,
        engineOK: true,
        wingOK: true,
        alive: true,
        crashing: false,
        exploded: false,
        shootTimer: 0,
        health: bossHealth,
        maxHealth: bossHealth,
        name: bossType.name,
        color: bossType.color,
        shootSpeed: bossType.shootSpeed / enemyAccuracyMultiplier,
        bulletSpeed: bossType.bulletSpeed,
        size: bossType.size,
        pattern: bossType.pattern,
        points: bossType.points * currentLevel,
        coins: bossType.coins * currentLevel,
        attackPattern: 0,
        patternTimer: 0,
        damageCooldown: 0,
        // FIXED: Proper 5 seconds shooting, 15 seconds cooldown
        shootDuration: bossType.shootDuration,
        shootCooldown: bossType.shootCooldown,
        shootState: 'cooldown',
        shootStateTimer: 0
    };

    bossActive = true;
    bossSpawned = true;

    bossWarning.style.display = 'block';
    bossHealthContainer.style.display = 'block';
    updateBossHealthBar();

    playSound('bossSpawn');

    setTimeout(() => {
        bossWarning.style.display = 'none';
    }, 3000);
}

function updateBossHealthBar() {
    if (bossActive && boss) {
        const percent = (boss.health / bossMaxHealth) * 100;
        bossHealthFill.style.width = percent + '%';
        bossHealthText.innerText = `BOSS HEALTH ${Math.floor(percent)}%`;
    }
}

function updateStageDisplay() {
    levelStage.style.display = 'block';
    const levelTheme = levelThemes[(currentLevel - 1) % levelThemes.length];
    levelStage.innerHTML = `🌍 ${levelTheme.name} | LVL ${currentLevel} | STAGE ${currentStage}/5`;
    document.getElementById('lvl').innerText = currentLevel;
}

function spawnEnemies() {
    if (currentStage === 5) {
        spawnBoss();
    } else {
        spawnStageEnemies();
    }
}

// Audio engine variables
let engineSound = null;
let engineGain = null;
let engineFilter = null;

function createNoiseBuffer() {
    if (!audioCtx) return null;
    const length = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
}

window.startGame = function () {
    initAudio();
    if (audioCtx?.state === 'suspended' && soundEnabled) audioCtx.resume();

    stopHomeMusic();

    updatePlayerStatsForLevel();

    homeMenu.style.display = 'none';
    hud.style.display = 'block';
    radar.style.display = 'block';
    gsCont.style.display = 'flex';
    locCont.style.display = 'flex';
    levelStage.style.display = 'block';
    coinDisplay.style.display = 'block';
    shopBtn.style.display = 'block';

    gsDia.style.height = '2px';
    gsDia.style.width = '12px';
    gsDia.style.transform = 'none';
    locDia.style.width = '2px';
    locDia.style.height = '12px';
    locDia.style.transform = 'none';

    player.x = 1000;
    player.y = 1500;
    player.vx = 0;
    player.vy = 0;
    player.angle = 0;
    player.thrust = 4;
    player.gearDown = false;
    player.wasGearDown = false;
    player.dead = false;
    player.exploded = false;
    player.engineOK = true;
    player.wingOK = true;
    player.stalling = false;
    player.health = playerBaseHealth;

    bullets = [];
    enemyBullets = [];
    enemies = [];
    missiles = [];
    particles = [];
    boss = null;
    bossActive = false;

    missileCount = playerBaseMissiles;
    activePower = null;
    powerDuration = 0;
    powerMissileCount = 0;
    updatePowerDisplay();

    isPaused = false;
    frame = 0;

    bossHealthContainer.style.display = 'none';
    bossWarning.style.display = 'none';
    stageCompleteMenu.style.display = 'none';
    powerShopMenu.style.display = 'none';

    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => { });
    }

    if (window.innerWidth <= 768) hud.style.display = 'none';

    spawnEnemies();

    try {
        if (engineSound) engineSound.stop();
        if (audioCtx) {
            const noiseBuffer = createNoiseBuffer();
            if (noiseBuffer) {
                engineSound = audioCtx.createBufferSource();
                engineSound.buffer = noiseBuffer;
                engineSound.loop = true;
                engineFilter = audioCtx.createBiquadFilter();
                engineFilter.type = 'lowpass';
                engineFilter.frequency.value = 250;
                engineFilter.Q.value = 0.7;
                const engineFilter2 = audioCtx.createBiquadFilter();
                engineFilter2.type = 'bandpass';
                engineFilter2.frequency.value = 800;
                engineFilter2.Q.value = 0.3;
                engineGain = audioCtx.createGain();
                engineGain.gain.value = 0;
                engineSound.connect(engineFilter);
                engineFilter.connect(engineFilter2);
                engineFilter2.connect(engineGain);
                engineGain.connect(audioCtx.destination);
                engineSound.start();
            }
        }
    } catch (e) {
        console.log('Audio not supported');
    }
}

function createBlast(x, y, color, count = 20) {
    playSound('explode');
    for (let i = 0; i < count; i++) {
        particles.push({ x, y, vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15, life: 1, color: color || "#ff4500" });
    }
}

function triggerCrashSequence() {
    if (player.exploded) return;

    player.exploded = true;
    player.dead = true;

    playRealisticCrash();

    createBlast(player.x, player.y, "#ffaa00", 60);
    lives--;
    document.getElementById('lives-val').innerText = "❤️".repeat(Math.max(0, lives));
    setTimeout(() => {
        if (lives <= 0) {
            resetGame();
            location.reload();
        } else {
            respawnPlayer();
        }
    }, 2500);
}

function respawnPlayer() {
    player.dead = false;
    player.exploded = false;
    player.engineOK = true;
    player.wingOK = true;
    player.stalling = false;
    player.x = 1000;
    player.y = 1500;
    player.vx = 0;
    player.vy = 0;
    player.angle = 0;
    player.thrust = 4;
    player.gearDown = false;
    player.wasGearDown = false;
    player.health = playerBaseHealth;
    bullets = [];
    enemyBullets = [];
    missiles = [];
    missileCount = playerBaseMissiles;
    activePower = null;
    powerDuration = 0;
    updatePowerDisplay();
    bossActive = false;
    boss = null;
    bossHealthContainer.style.display = 'none';
    spawnEnemies();
}

window.keyDown = function (code) {
    // Prevent multiple simultaneous key presses
    if (keys[code]) return;
    keys[code] = true;
    if (code === 'KeyG') {
        player.gearDown = !player.gearDown;
        playSound('gear');
    }
}

window.keyUp = function (code) {
    keys[code] = false;
}

window.toggleHUD = function () {
    hud.style.display = hud.style.display === 'block' ? 'none' : 'block';
}

window.onkeydown = e => {
    if (isPaused && homeMenu.style.display === 'none') return;
    // Prevent default for game controls
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyG', 'KeyM'].includes(e.code)) {
        e.preventDefault();
    }
    keys[e.code] = true;
    if (e.code === 'KeyG') {
        player.gearDown = !player.gearDown;
        playSound('gear');
    }
};

window.onkeyup = e => {
    keys[e.code] = false;
};

// ─── MAIN UPDATE ─────────────────────────────────────────────────
function update() {
    if (player.dead || isPaused) {
        if (engineGain) engineGain.gain.value = 0;
        return;
    }

    updatePowers();

    if (player.gearDown !== player.wasGearDown) {
        player.wasGearDown = player.gearDown;
    }

    let pitch = Math.sin(player.angle);
    if (player.engineOK) {
        let thrustChange = playerAcceleration;
        if (sensitivityLevel === 'Low') thrustChange = 0.05;
        else if (sensitivityLevel === 'High') thrustChange = 0.15;

        if (keys['ArrowRight']) player.thrust = Math.min(player.thrust + thrustChange, playerMaxThrust);
        if (keys['ArrowLeft']) player.thrust = Math.max(player.thrust - thrustChange, 0);
        if (pitch < -0.8) player.thrust -= 0.05;
    } else {
        player.thrust *= 0.99;
    }

    const stallingNow = player.thrust < 2.2 && pitch < -0.4;
    if (stallingNow && !player.stalling) playSound('stall');
    player.stalling = stallingNow;

    let pitchChange = playerManeuverability;
    if (sensitivityLevel === 'Low') pitchChange = 0.02;
    else if (sensitivityLevel === 'High') pitchChange = 0.05;

    if (keys['ArrowUp']) player.angle -= pitchChange;
    if (keys['ArrowDown']) player.angle += pitchChange;
    if (!player.wingOK) player.angle += 0.04;

    let lift = player.stalling ? 0.05 : 0.24;
    player.vy += GRAVITY - Math.sin(-player.angle) * player.thrust * lift;
    if (player.stalling) {
        player.vy += 0.3;
        player.thrust *= 0.98;
    }

    player.vx = Math.cos(player.angle) * player.thrust;
    player.vy = player.vy;

    player.x += player.vx;
    player.y += player.vy;
    player.vy *= 0.98;

    camera.x = player.x - canvas.width / 3;
    camera.y = player.y - canvas.height / 2.5;

    const vsFPM = Math.floor(player.vy * 600);
    const speedKn = Math.floor(player.thrust * 18);
    const overRunway = runwayStarts.some(start => player.x > start && player.x < start + 5500);
    const noseDeg = player.angle * 180 / Math.PI;
    const activeEnms = enemies.filter(e => e.alive && !e.exploded).length;
    const bossAlive = bossActive && boss && !boss.exploded ? 1 : 0;

    document.getElementById('spd').innerText = speedKn;
    document.getElementById('alt').innerText = Math.max(0, Math.floor(WORLD_GROUND - player.y));
    document.getElementById('enmCount').innerText = activeEnms + bossAlive;
    document.getElementById('lvl').innerText = currentLevel;

    const sink = document.getElementById('sink');
    const sinkC = document.getElementById('sink-container');
    sink.innerText = Math.abs(vsFPM);
    sinkC.className = vsFPM > 1200 ? "value warning" : "value";

    const eng = document.getElementById('p-eng');
    if (player.stalling) {
        eng.innerText = "STALL";
        eng.className = "value warning";
    } else if (overRunway && (activeEnms + bossAlive) > 0) {
        eng.innerText = "CLEAR AIRSPACE!";
        eng.className = "value warning";
    } else {
        eng.innerText = player.engineOK ? "OK" : "FAIL";
        eng.className = player.engineOK ? "value" : "value warning";
    }

    document.getElementById('p-health').innerText = player.health + "%";
    document.getElementById('gearStat').innerText = player.gearDown ? "DOWN" : "UP";

    player.gearAnim += player.gearDown ? 0.05 : -0.05;
    player.gearAnim = Math.max(0, Math.min(1, player.gearAnim));

    // ILS
    let closestTarget = null;
    let minDist = Infinity;
    runwayStarts.forEach(start => {
        const dist = start - player.x;
        if (dist > -12000 && dist < 5500) {
            let d = Math.abs(dist);
            if (d < minDist) {
                minDist = d;
                closestTarget = start;
            }
        }
    });

    if (closestTarget !== null) {
        const dist = closestTarget - player.x;
        const ideal = Math.abs(dist) * Math.tan(3 * Math.PI / 180);
        const curr = WORLD_GROUND - player.y - 28;
        const gsD = curr - ideal;
        let gsP = 50 + gsD * 0.2;
        gsP = Math.max(0, Math.min(100, gsP));
        gsDia.style.top = (100 - gsP) + "%";
        gsDia.style.background = Math.abs(gsD) < 50 ? "#22c55e" : "#fbbf24";
        const locD = dist + 3000;
        let locP = 50 + locD * 0.02;
        locP = Math.max(0, Math.min(100, locP));
        locDia.style.left = locP + "%";
        locDia.style.background = Math.abs(locD) < 500 ? "#22c55e" : "#fbbf24";
    } else {
        gsDia.style.top = '50%';
        locDia.style.left = '50%';
        gsDia.style.background = '#fbbf24';
        locDia.style.background = '#fbbf24';
    }

    let shootDelay = activePower === 'rapidFire' ? 3 : 8;
    if (keys['Space'] && frame % shootDelay === 0) {
        playSound('shoot');

        let damageMultiplier = activePower === 'doubleDamage' ? 2 : 1;

        bullets.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(player.angle) * 90 + player.vx,
            vy: Math.sin(player.angle) * 90 + player.vy,
            angle: player.angle,
            damage: 10 * damageMultiplier
        });
    }

    if (keys['KeyM'] && frame % 20 === 0 && missileCount > 0) {
        playSound('missile');

        const launchOffsetX = -15;
        const launchOffsetY = 30;
        const cos = Math.cos(player.angle);
        const sin = Math.sin(player.angle);
        const launchX = player.x + (launchOffsetX * cos - launchOffsetY * sin);
        const launchY = player.y + (launchOffsetX * sin + launchOffsetY * cos);

        let target = null;
        let minD = Infinity;

        if (bossActive && boss && boss.alive && !boss.exploded) {
            let d = Math.hypot(boss.x - player.x, boss.y - player.y);
            minD = d;
            target = boss;
        }

        enemies.forEach(e => {
            if (e.alive && !e.exploded) {
                let d = Math.hypot(e.x - player.x, e.y - player.y);
                if (d < minD) {
                    minD = d;
                    target = e;
                }
            }
        });

        if (target) {
            missiles.push({
                x: launchX,
                y: launchY,
                angle: player.angle,
                target: target,
                speed: 18,
                vx: Math.cos(player.angle) * 18 + player.vx,
                vy: Math.sin(player.angle) * 18 + player.vy,
                smokeTrail: [],
                age: 0,
                isHoming: activePower === 'homingMissiles' || powerMissileCount > 0
            });

            for (let i = 0; i < 8; i++) {
                particles.push({
                    x: launchX,
                    y: launchY,
                    vx: (Math.random() - 0.5) * 8 - Math.cos(player.angle) * 5,
                    vy: (Math.random() - 0.5) * 8 - Math.sin(player.angle) * 5,
                    life: 0.8,
                    color: "#94a3b8"
                });
            }

            missileCount--;

            if (powerMissileCount > 0) {
                powerMissileCount--;
                if (powerMissileCount === 0) {
                    activePower = null;
                    updatePowerDisplay();
                }
            }
        }
    }

    missiles.forEach((m, mi) => {
        if (frame % 3 === 0) {
            m.smokeTrail.push({ x: m.x, y: m.y, life: 1.0 });
            if (m.smokeTrail.length > 15) m.smokeTrail.shift();
        }

        m.age++;

        if (m.target && m.target.alive && !m.target.exploded) {
            const dx = m.target.x - m.x;
            const dy = m.target.y - m.y;
            const distance = Math.hypot(dx, dy);

            if (m.isHoming) {
                m.angle = Math.atan2(dy, dx);
                m.vx = Math.cos(m.angle) * m.speed;
                m.vy = Math.sin(m.angle) * m.speed;
            } else {
                const targetSpeed = Math.hypot(m.target.vx || 0, m.target.vy || 0);
                const timeToTarget = distance / m.speed;
                const leadX = (m.target.vx || 0) * timeToTarget * 0.5;
                const leadY = (m.target.vy || 0) * timeToTarget * 0.5;
                m.angle = Math.atan2(dy + leadY, dx + leadX);
                if (m.age > 10) m.angle += (Math.random() - 0.5) * 0.03;

                m.vx = Math.cos(m.angle) * m.speed;
                m.vy = Math.sin(m.angle) * m.speed;
            }
        }

        m.x += m.vx;
        m.y += m.vy;

        if (bossActive && boss && boss.alive && !boss.exploded && Math.hypot(m.x - boss.x, m.y - boss.y) < 60 * boss.size) {
            createBlast(m.x, m.y, boss.color, 30);

            let damage = (activePower === 'doubleDamage' ? 4 : 2);
            boss.health -= damage;
            playSound('bossHit');
            updateBossHealthBar();

            if (boss.health <= 0) {
                boss.exploded = true;
                createBlast(boss.x, boss.y, "#ffaa00", 80);
                playSound('bossDie');

                totalScore += boss.points;
                coins += boss.coins;
                updateCoinDisplay();
                playSound('coin');

                currentStage = 1;
                currentLevel++;

                bossActive = false;
                bossHealthContainer.style.display = 'none';

                updateStageDisplay();
                spawnEnemies();
                saveGame();
            }

            missiles.splice(mi, 1);
            return;
        }

        enemies.forEach(e => {
            if (e.alive && !e.exploded && Math.hypot(m.x - e.x, m.y - e.y) < 60) {
                createBlast(e.x, e.y, "#ff4500", 50);
                e.exploded = true;
                missiles.splice(mi, 1);
            }
        });

        if (m.age > 300) missiles.splice(mi, 1);
    });

    missiles.forEach(m => {
        m.smokeTrail.forEach(smoke => smoke.life -= 0.02);
        m.smokeTrail = m.smokeTrail.filter(s => s.life > 0);
    });

    if (bossActive && boss) {
        if (boss.damageCooldown > 0) {
            boss.damageCooldown--;
        }
    }

    // FIXED: Boss shooting with proper 5 seconds shooting, 15 seconds cooldown
    if (bossActive && boss && boss.alive && !boss.exploded) {
        boss.patternTimer++;

        if (boss.shootState === 'cooldown') {
            boss.shootStateTimer++;
            if (boss.shootStateTimer >= boss.shootCooldown) {
                boss.shootState = 'shooting';
                boss.shootStateTimer = 0;
            }
        } else if (boss.shootState === 'shooting') {
            boss.shootStateTimer++;

            boss.shootTimer++;
            if (boss.shootTimer > boss.shootSpeed) {
                playSound('enemyShoot');

                if (boss.pattern === "spread") {
                    for (let i = -2; i <= 2; i++) {
                        const angle = boss.angle + (i * 0.2);
                        enemyBullets.push({
                            x: boss.x,
                            y: boss.y,
                            vx: Math.cos(angle) * boss.bulletSpeed,
                            vy: Math.sin(angle) * boss.bulletSpeed,
                            angle: angle
                        });
                    }
                } else {
                    enemyBullets.push({
                        x: boss.x,
                        y: boss.y,
                        vx: Math.cos(boss.angle) * boss.bulletSpeed,
                        vy: Math.sin(boss.angle) * boss.bulletSpeed,
                        angle: boss.angle
                    });
                }

                boss.shootTimer = 0;
            }

            if (boss.shootStateTimer >= boss.shootDuration) {
                boss.shootState = 'cooldown';
                boss.shootStateTimer = 0;
            }
        }

        const dx = player.x - boss.x;
        const dy = player.y - boss.y;

        if (boss.pattern === "basic") {
            boss.angle = Math.atan2(dy, dx);
            boss.x += Math.cos(boss.angle) * boss.thrust;
            boss.y += Math.sin(boss.angle) * boss.thrust;
        } else if (boss.pattern === "spread") {
            boss.angle = Math.atan2(dy, dx);
            boss.x += Math.cos(boss.angle) * boss.thrust;
            boss.y += Math.sin(boss.angle) * boss.thrust + Math.sin(boss.patternTimer * 0.1) * 2;
        } else if (boss.pattern === "hunting") {
            const leadX = player.vx * 0.5;
            const leadY = player.vy * 0.5;
            boss.angle = Math.atan2(dy + leadY, dx + leadX);
            boss.x += Math.cos(boss.angle) * boss.thrust;
            boss.y += Math.sin(boss.angle) * boss.thrust;
        }
    }

    if (player.y > WORLD_GROUND - 28) {
        if (overRunway && player.gearDown) {
            if ((activeEnms + (bossActive ? 1 : 0)) > 0) {
                showFailedMenu("HOSTILES REMAINING", "You cannot land while enemy aircraft are in the area! Level restarting...");
                playSound('crash');
                triggerCrashSequence();
            } else if (Math.abs(vsFPM) > 1200 || Math.abs(noseDeg) > 35) {
                playSound('crash');
                triggerCrashSequence();
            } else {
                player.y = WORLD_GROUND - 28;
                player.vy *= 0.1;
                player.thrust *= 0.94;
                player.angle *= 0.5;
                playSound('land');
                if (speedKn < 3) {
                    player.thrust = 0;

                    if (currentStage < 5) {
                        showStageComplete();
                    } else {
                        showSuccessMenu(Math.abs(vsFPM));
                    }
                }
            }
        } else {
            playSound('crash');
            triggerCrashSequence();
        }
    } else if (overRunway && player.gearDown && player.y > WORLD_GROUND - 100) {
        player.vy *= 0.95;
        player.angle *= 0.98;
    }

    enemies.forEach(e => {
        if (!e.alive || e.exploded) return;
        if (e.crashing) {
            e.angle += 0.15;
            e.vy += GRAVITY;
            e.x += e.vx;
            e.y += e.vy;
            if (e.y >= WORLD_GROUND) {
                e.exploded = true;
                createBlast(e.x, e.y, "#ffaa00", 40);
            }
        } else {
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            e.angle = Math.atan2(dy, dx);
            e.x += Math.cos(e.angle) * e.thrust;
            e.y += Math.sin(e.angle) * e.thrust;

            e.shootTimer++;

            let shootThreshold = e.shootSpeed || 100;
            if (difficultyLevel === 'Easy') shootThreshold *= 1.5;
            else if (difficultyLevel === 'Hard') shootThreshold *= 0.6;

            if (e.shootTimer > shootThreshold) {
                playSound('enemyShoot');

                let bulletSpeed = e.bulletSpeed || 18;
                if (difficultyLevel === 'Easy') bulletSpeed *= 0.7;
                else if (difficultyLevel === 'Hard') bulletSpeed *= 1.3;

                enemyBullets.push({
                    x: e.x,
                    y: e.y,
                    vx: Math.cos(e.angle) * bulletSpeed,
                    vy: Math.sin(e.angle) * bulletSpeed,
                    angle: e.angle
                });
                e.shootTimer = 0;
            }
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (Math.hypot(b.x - e.x, b.y - e.y) < 60) {
                const relX = (b.x - e.x) * Math.cos(-e.angle) - (b.y - e.y) * Math.sin(-e.angle);

                if (activePower === 'shield') {
                    bullets.splice(i, 1);
                    continue;
                }

                if (relX < -25) {
                    e.exploded = true;
                    createBlast(e.x, e.y, "#ff4500", 50);
                    totalScore += e.points || 50;
                    coins += e.coins || 10;
                    totalKills++;
                    playSound('coin');

                    const remainingEnemies = enemies.filter(en => en.alive && !en.exploded).length;
                    if (remainingEnemies === 0 && currentStage < 5) {
                        stageJustCompleted = true;
                    }
                } else {
                    if (e.health) {
                        let damage = b.damage || 10;
                        e.health -= damage;
                        if (e.health <= 0) {
                            e.exploded = true;
                            createBlast(e.x, e.y, "#ff4500", 50);
                            totalScore += e.points || 50;
                            coins += e.coins || 10;
                            totalKills++;
                            playSound('coin');

                            const remainingEnemies = enemies.filter(en => en.alive && !en.exploded).length;
                            if (remainingEnemies === 0 && currentStage < 5) {
                                stageJustCompleted = true;
                            }
                        } else {
                            if (!e.crashing) {
                                e.crashing = true;
                                e.vx = b.vx * 0.2;
                                playSound('hit');
                            }
                        }
                    } else {
                        const wasOk = e.engineOK && e.wingOK;
                        if (Math.random() > 0.5) e.engineOK = false;
                        else e.wingOK = false;
                        e.crashing = true;
                        e.vx = b.vx * 0.2;
                        if (wasOk && (!e.engineOK || !e.wingOK)) playSound('hit');
                    }
                }
                bullets.splice(i, 1);
            }
        }
    });

    if (bossActive && boss && boss.alive && !boss.exploded) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (Math.hypot(b.x - boss.x, b.y - boss.y) < 60 * boss.size) {
                createBlast(b.x, b.y, boss.color, 20);

                let damage = b.damage || 10;
                boss.health -= damage;
                playSound('bossHit');
                updateBossHealthBar();

                if (boss.health <= 0) {
                    boss.exploded = true;
                    createBlast(boss.x, boss.y, "#ffaa00", 80);
                    playSound('bossDie');

                    totalScore += boss.points;
                    coins += boss.coins;
                    updateCoinDisplay();
                    playSound('coin');

                    currentStage = 1;
                    currentLevel++;

                    bossActive = false;
                    bossHealthContainer.style.display = 'none';

                    updateStageDisplay();
                    spawnEnemies();
                    saveGame();
                }

                bullets.splice(i, 1);
            }
        }
    }

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const b = enemyBullets[i];
        if (Math.hypot(b.x - player.x, b.y - player.y) < 50) {

            if (activePower === 'shield') {
                enemyBullets.splice(i, 1);
                continue;
            }

            playSound('hit');

            let damage = 10;
            if (difficultyLevel === 'Easy') damage = 5;
            else if (difficultyLevel === 'Hard') damage = 15;

            player.health -= damage;
            if (player.health <= 0) triggerCrashSequence();
            enemyBullets.splice(i, 1);
        }
    }

    bullets.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
    });

    enemyBullets.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
    });

    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        return p.life > 0;
    });

    if (player.engineOK && soundEnabled && engineGain && engineFilter) {
        engineFilter.frequency.value = 250 + player.thrust * 60;
        const stressFactor = Math.abs(Math.sin(player.angle)) * 50;
        engineFilter.frequency.value += stressFactor;
        engineGain.gain.value = (0.03 + player.thrust * 0.02) * (musicVolume / 100);
        if (frame % 10 === 0) engineFilter.frequency.value += (Math.random() - 0.5) * 10;
    } else if (engineGain) {
        engineGain.gain.value = 0;
    }
}

function showSuccessMenu(vs) {
    isPaused = true;
    if (engineGain) engineGain.gain.value = 0;

    const remaining = enemies.filter(e => e.alive && !e.exploded).length;
    const bossRemaining = bossActive && boss && !boss.exploded ? 1 : 0;

    if (remaining + bossRemaining > 0) {
        document.getElementById('success-title').innerText = "MISSION FAILED";
        document.getElementById('success-title').style.color = "#f87171";
        document.getElementById('success-stats').innerText = `Hostiles still in airspace: ${remaining + bossRemaining}\nEliminate all targets before landing.`;
        document.getElementById('next-btn').style.display = 'none';
        successMenu.style.borderColor = "#f87171";
        successMenu.style.display = 'block';
        playSound('stall');
    } else {
        const rating = vs < 300 ? "PERFECT TOUCHDOWN!" : "LANDING SUCCESSFUL";
        document.getElementById('success-title').innerText = rating;
        document.getElementById('success-title').style.color = "#22c55e";

        const levelTheme = levelThemes[(currentLevel - 1) % levelThemes.length];
        document.getElementById('success-stats').innerText = `Final Sink Rate: -${vs} FPM\n${levelTheme.name} Complete!\nScore: ${totalScore}\nKills: ${totalKills}\nCoins: ${coins}\nAirframe inspected. Systems Refueled.`;
        document.getElementById('next-btn').style.display = 'inline-block';
        successMenu.style.borderColor = "#fbbf24";
        successMenu.style.display = 'block';
        playSound('repair');

        saveGame();
    }
}

function showFailedMenu(title, text) {
    isPaused = true;
    if (engineGain) engineGain.gain.value = 0;
    document.getElementById('success-title').innerText = title;
    document.getElementById('success-title').style.color = "#ef4444";
    document.getElementById('success-stats').innerText = text;
    document.getElementById('next-btn').style.display = 'none';
    successMenu.style.borderColor = "#ef4444";
    successMenu.style.display = 'block';
}

window.resetAndStart = function () {
    isPaused = false;
    successMenu.style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';
    successMenu.style.borderColor = "#fbbf24";
    player.engineOK = true;
    player.wingOK = true;
    player.stalling = false;
    player.x = 1000;
    player.y = 1500;
    player.vx = 0;
    player.vy = 0;
    player.angle = 0;
    player.thrust = 4;
    player.gearDown = false;
    player.wasGearDown = false;
    player.dead = false;
    player.exploded = false;
    player.health = playerBaseHealth;
    bullets = [];
    enemyBullets = [];
    missiles = [];
    missileCount = playerBaseMissiles;

    currentStage = 1;
    bossActive = false;
    boss = null;
    bossHealthContainer.style.display = 'none';
    stageCompleteMenu.style.display = 'none';
    activePower = null;
    powerDuration = 0;
    updatePowerDisplay();
    updatePlayerStatsForLevel();
    spawnEnemies();
    saveGame();
}

window.nextLevel = function () {
    currentLevel++;
    currentStage = 1;
    bossActive = false;
    boss = null;
    bossHealthContainer.style.display = 'none';
    updatePlayerStatsForLevel();
    player.health = playerBaseHealth;
    missileCount = playerBaseMissiles;
    isPaused = false;
    successMenu.style.display = 'none';
    player.x = 1000;
    player.y = 1500;
    player.vx = 0;
    player.vy = 0;
    player.angle = 0;
    player.thrust = 4;
    bullets = [];
    enemyBullets = [];
    missiles = [];
    activePower = null;
    powerDuration = 0;
    updatePowerDisplay();
    spawnEnemies();
    saveGame();
}

window.retryLevel = function () {
    isPaused = false;
    successMenu.style.display = 'none';
    document.getElementById('next-btn').style.display = 'inline-block';
    successMenu.style.borderColor = "#fbbf24";
    player.engineOK = true;
    player.wingOK = true;
    player.stalling = false;
    player.x = 1000;
    player.y = 1500;
    player.vx = 0;
    player.vy = 0;
    player.angle = 0;
    player.thrust = 4;
    player.gearDown = false;
    player.wasGearDown = false;
    player.dead = false;
    player.exploded = false;
    player.health = playerBaseHealth;
    bullets = [];
    enemyBullets = [];
    missiles = [];
    missileCount = playerBaseMissiles;

    currentStage = 1;
    bossActive = false;
    boss = null;
    bossHealthContainer.style.display = 'none';
    activePower = null;
    powerDuration = 0;
    updatePowerDisplay();
    spawnEnemies();
}

// ─── RENDER HELPERS ──────────────────────────────────────────────
function drawPlane(p, isPlayer) {
    if (p.exploded) return;
    ctx.save();
    ctx.translate(p.x - camera.x, p.y - camera.y);
    ctx.rotate(p.angle);

    let scale = 1;
    if (!isPlayer && p.size) {
        scale = p.size;
        ctx.scale(scale, scale);
    }

    const bank = Math.min(Math.max(p.vy * 0.1, -0.5), 0.5);
    const alt = WORLD_GROUND - p.y;

    if (alt < 800 && alt > 0) {
        ctx.save();
        ctx.rotate(-p.angle);
        ctx.fillStyle = `rgba(0,0,0,${0.2 * (1 - alt / 800)})`;
        ctx.beginPath();
        ctx.ellipse(0, alt / scale, 40, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    if (p.engineOK && !p.crashing) {
        const f = Math.random() * 5;
        const g = ctx.createRadialGradient(-55, 0, 0, -55, 0, 15 + f);
        g.addColorStop(0, "rgba(255,255,255,0.8)");
        g.addColorStop(0.4, "rgba(56,189,248,0.6)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(-55, 0, 15 + f, 0, Math.PI * 2);
        ctx.fill();
    }

    if (isPlayer) {
        ctx.fillStyle = playerColor;
    } else {
        ctx.fillStyle = p.color || (p.thrust > 4.2 ? "#b91c1c" : "#0f172a");
    }
    ctx.beginPath();
    ctx.ellipse(-5, -20, 8, 16 * (1 - bank), 0, 0, Math.PI * 2);
    ctx.fill();

    if (isPlayer) {
        ctx.fillStyle = playerColor;
    } else {
        ctx.fillStyle = p.thrust > 4.2 ? "#b91c1c" : "#1e293b";
    }
    ctx.beginPath();
    ctx.moveTo(-45, 0);
    ctx.lineTo(-60, -25);
    ctx.lineTo(-40, -25);
    ctx.lineTo(-30, 0);
    ctx.fill();

    let bodyG;
    if (isPlayer) {
        bodyG = ctx.createLinearGradient(0, -15, 0, 15);
        bodyG.addColorStop(0, "#cbd5e1");
        bodyG.addColorStop(0.5, "#94a3b8");
        bodyG.addColorStop(1, playerColor);
    } else {
        bodyG = ctx.createLinearGradient(0, -15, 0, 15);
        bodyG.addColorStop(0, "#475569");
        bodyG.addColorStop(0.5, "#334155");
        bodyG.addColorStop(1, "#0f172a");
    }
    ctx.fillStyle = bodyG;
    ctx.beginPath();
    ctx.moveTo(-55, -5);
    ctx.bezierCurveTo(20, -18, 40, -15, 60, 0);
    ctx.bezierCurveTo(40, 15, 20, 18, -55, 5);
    ctx.closePath();
    ctx.fill();

    if (p.wingOK) {
        let wingG;
        if (isPlayer) {
            wingG = ctx.createLinearGradient(0, -20, 0, 20);
            wingG.addColorStop(0, "#94a3b8");
            wingG.addColorStop(1, playerColor);
        } else {
            wingG = ctx.createLinearGradient(0, -20, 0, 20);
            wingG.addColorStop(0, "#475569");
            wingG.addColorStop(1, "#1e293b");
        }
        ctx.fillStyle = wingG;
        ctx.beginPath();
        ctx.ellipse(-5, 20, 8, 16 * (1 + bank), 0, 0, Math.PI * 2);
        ctx.fill();
    }

    let glassG = ctx.createLinearGradient(10, -10, 30, 5);
    glassG.addColorStop(0, "#0ea5e9");
    glassG.addColorStop(1, "#0284c7");
    ctx.fillStyle = glassG;
    ctx.beginPath();
    ctx.ellipse(20, -4, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isPlayer && player.gearAnim > 0) {
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 3;
        [[30, 12], [-15, 15]].forEach(([x, len]) => {
            ctx.beginPath();
            ctx.moveTo(x, 5);
            ctx.lineTo(x, 5 + len * player.gearAnim);
            ctx.stroke();
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(x, 5 + len * player.gearAnim, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    if (isPlayer && activePower === 'shield') {
        ctx.save();
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    if (!isPlayer && p.name) {
        ctx.save();
        ctx.rotate(-p.angle);
        ctx.font = "bold 16px 'Courier New'";
        ctx.fillStyle = "#ef4444";
        ctx.textAlign = "center";
        ctx.fillText(p.name, 0, -40);
        ctx.restore();
    }

    if (!p.engineOK || p.crashing) {
        if (frame % 2 === 0) {
            particles.push({ x: p.x - 50, y: p.y, vx: -2, vy: -1, life: 0.6, color: "#334155" });
        }
    }
    ctx.restore();
}

function drawThreatArrows() {
    enemies.forEach(e => {
        if (!e.alive || e.exploded) return;
        const sx = e.x - camera.x;
        const sy = e.y - camera.y;
        if (sx < 0 || sx > canvas.width || sy < 0 || sy > canvas.height) {
            const ang = Math.atan2(sy - canvas.height / 2, sx - canvas.width / 2);
            const ex = Math.max(20, Math.min(canvas.width - 20, canvas.width / 2 + Math.cos(ang) * (canvas.width / 2 - 40)));
            const ey = Math.max(20, Math.min(canvas.height - 20, canvas.height / 2 + Math.sin(ang) * (canvas.height / 2 - 40)));
            ctx.save();
            ctx.translate(ex, ey);
            ctx.rotate(ang);
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-10, -8);
            ctx.lineTo(-10, 8);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    });

    if (bossActive && boss && boss.alive && !boss.exploded) {
        const sx = boss.x - camera.x;
        const sy = boss.y - camera.y;
        if (sx < 0 || sx > canvas.width || sy < 0 || sy > canvas.height) {
            const ang = Math.atan2(sy - canvas.height / 2, sx - canvas.width / 2);
            const ex = Math.max(20, Math.min(canvas.width - 20, canvas.width / 2 + Math.cos(ang) * (canvas.width / 2 - 40)));
            const ey = Math.max(20, Math.min(canvas.height - 20, canvas.height / 2 + Math.sin(ang) * (canvas.height / 2 - 40)));
            ctx.save();
            ctx.translate(ex, ey);
            ctx.rotate(ang);
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(-15, -12);
            ctx.lineTo(-15, 12);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }
}

function drawRadar() {
    const rx = canvas.width - 105;
    const ry = canvas.height - 105;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.strokeStyle = "rgba(34,197,94,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-RADAR_RADIUS, 0);
    ctx.lineTo(RADAR_RADIUS, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -RADAR_RADIUS);
    ctx.lineTo(0, RADAR_RADIUS);
    ctx.stroke();
    const ay = (WORLD_GROUND - player.y) * RADAR_SCALE;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    runwayStarts.forEach(start => {
        const as = (start - player.x) * RADAR_SCALE;
        const ae = (start + 5500 - player.x) * RADAR_SCALE;
        if (Math.max(as, ae) > -RADAR_RADIUS && Math.min(as, ae) < RADAR_RADIUS) {
            ctx.beginPath();
            ctx.moveTo(Math.max(-RADAR_RADIUS, Math.min(RADAR_RADIUS, as)), ay);
            ctx.lineTo(Math.max(-RADAR_RADIUS, Math.min(RADAR_RADIUS, ae)), ay);
            ctx.stroke();
        }
    });

    enemies.forEach(e => {
        if (!e.alive || e.exploded) return;
        const dx = (e.x - player.x) * RADAR_SCALE;
        const dy = (e.y - player.y) * RADAR_SCALE;
        if (Math.hypot(dx, dy) < RADAR_RADIUS) {
            ctx.fillStyle = e.thrust > 4.2 ? "#ff0000" : "#ef4444";
            ctx.beginPath();
            ctx.arc(dx, dy, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    if (bossActive && boss && boss.alive && !boss.exploded) {
        const dx = (boss.x - player.x) * RADAR_SCALE;
        const dy = (boss.y - player.y) * RADAR_SCALE;
        if (Math.hypot(dx, dy) < RADAR_RADIUS) {
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(dx, dy, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.font = "bold 16px 'Courier New'";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`🚀 ${missileCount}`, canvas.width - 150, 50);

    if (activePower) {
        const power = powerItems.find(p => p.id === activePower);
        if (power) {
            ctx.fillStyle = "#fbbf24";
            ctx.fillText(`${power.icon} ${power.name}`, canvas.width - 150, 80);
        }
    }
    ctx.restore();
}

function loop() {
    ctx.fillStyle = "#010409";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const zoom = 0.5;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // ===== Draw blinking stars =====
    stars.forEach(star => {
        const sx = star.x - camera.x;
        const sy = star.y - camera.y;
        if (sx > -100 && sx < canvas.width + 100 && sy > -100 && sy < canvas.height + 100) {
            const blink = Math.sin(frame * star.speed + star.phase) * 0.4 + 0.6;
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.brightness * blink;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#fff";
    for (let i = 0; i < 30; i++) {
        let x = (i * 900 - camera.x * 0.05) % canvas.width;
        let y = (i * 700 - camera.y * 0.05) % canvas.height;
        if (x < 0) x += canvas.width;
        if (y < 0) y += canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }

    ctx.fillStyle = "#0d1117";
    ctx.fillRect(-20000 - camera.x, WORLD_GROUND - camera.y, 60000, 1000);

    // ===== Draw landing lights =====
    landingLights.forEach(light => {
        const sx = light.x - camera.x;
        if (sx > -500 && sx < canvas.width + 500) {
            const pulse = Math.sin(frame * light.pulseSpeed + light.phase) * 0.3 + 0.7;
            ctx.save();
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 20 * pulse;
            ctx.fillStyle = `rgba(251, 191, 36, ${pulse * light.intensity})`;
            ctx.beginPath();
            ctx.arc(sx, light.y - camera.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner glow
            ctx.shadowBlur = 30;
            ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.5})`;
            ctx.beginPath();
            ctx.arc(sx, light.y - camera.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    scenery.forEach(it => {
        const sx = it.x - camera.x;
        if (sx > -500 && sx < canvas.width + 500) {
            const sy = WORLD_GROUND - camera.y;
            
            // Water bodies
            if (it.type === 'water') {
                ctx.fillStyle = "#1e3a8a";
                ctx.globalAlpha = 0.8;
                ctx.fillRect(sx, sy, it.width, 40);
                
                // Add wave effect
                ctx.strokeStyle = "#60a5fa";
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                for (let i = 0; i < it.width; i += 40) {
                    const waveY = sy + 15 + Math.sin((sx + i + frame) * 0.03) * 6;
                    ctx.moveTo(sx + i, waveY);
                    ctx.lineTo(sx + i + 20, waveY + 3);
                }
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            
            // Pine trees
            else if (it.type === 'pine') {
                ctx.fillStyle = it.trunkColor || "#4a2e1e";
                ctx.fillRect(sx - 3, sy - 20, 6, 20);
                
                ctx.fillStyle = it.leafColor || "#1e4d3a";
                
                ctx.beginPath();
                ctx.moveTo(sx, sy - 50);
                ctx.lineTo(sx - 15, sy - 25);
                ctx.lineTo(sx + 15, sy - 25);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(sx, sy - 65);
                ctx.lineTo(sx - 12, sy - 40);
                ctx.lineTo(sx + 12, sy - 40);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(sx, sy - 75);
                ctx.lineTo(sx - 8, sy - 55);
                ctx.lineTo(sx + 8, sy - 55);
                ctx.fill();
            }
            
            // Oak trees
            else if (it.type === 'oak') {
                ctx.fillStyle = it.trunkColor || "#5d3a1a";
                ctx.fillRect(sx - 4, sy - 20, 8, 20);
                
                ctx.fillStyle = it.leafColor || "#2d6a4f";
                ctx.beginPath();
                ctx.arc(sx, sy - 50, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(sx - 12, sy - 40, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(sx + 12, sy - 40, 12, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Palm trees
            else if (it.type === 'palm') {
                ctx.fillStyle = it.trunkColor || "#8b5a2b";
                ctx.fillRect(sx - 3, sy - 30, 6, 30);
                
                ctx.strokeStyle = it.leafColor || "#2e7d32";
                ctx.lineWidth = 3;
                
                for (let angle = -30; angle <= 30; angle += 15) {
                    const rad = angle * Math.PI / 180;
                    const endX = sx + Math.sin(rad) * 20;
                    const endY = sy - 55 + Math.cos(rad) * 10;
                    
                    ctx.beginPath();
                    ctx.moveTo(sx, sy - 45);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }
            }
            
            // Bushes
            else if (it.type === 'bush') {
                ctx.fillStyle = it.color || "#2d6a4f";
                ctx.beginPath();
                ctx.arc(sx, sy - 15, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(sx - 8, sy - 10, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(sx + 8, sy - 10, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    ctx.fillStyle = "#161b22";
    ctx.fillRect(500 - camera.x, WORLD_GROUND - camera.y, 5500, 40);
    ctx.fillStyle = "#30363d";
    for (let i = 0; i < 40; i++) {
        ctx.fillRect(600 + i * 140 - camera.x, WORLD_GROUND + 15 - camera.y, 50, 5);
    }
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(500 - camera.x, WORLD_GROUND - camera.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6000 - camera.x, WORLD_GROUND - camera.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    [11280, 22060, 32840, 43620].forEach(start => {
        ctx.fillStyle = "#161b22";
        ctx.fillRect(start - camera.x, WORLD_GROUND - camera.y, 5500, 40);
        ctx.fillStyle = "#30363d";
        for (let i = 0; i < 40; i++) {
            ctx.fillRect(start + 100 + i * 140 - camera.x, WORLD_GROUND + 15 - camera.y, 50, 5);
        }
        ctx.save();
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(start - camera.x, WORLD_GROUND - camera.y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(start + 5500 - camera.x, WORLD_GROUND - camera.y + 20, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    update();
    drawPlane(player, true);
    enemies.forEach(e => drawPlane(e, false));
    if (bossActive && boss && boss.alive && !boss.exploded) {
        drawPlane(boss, false);
    }
    drawThreatArrows();

    missiles.forEach(m => {
        m.smokeTrail.forEach(smoke => {
            ctx.globalAlpha = smoke.life * 0.5;
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.arc(smoke.x - camera.x, smoke.y - camera.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    });

    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - camera.x, p.y - camera.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#22c55e";
    bullets.forEach(b => {
        ctx.save();
        ctx.translate(b.x - camera.x, b.y - camera.y);
        ctx.rotate(b.angle);
        ctx.fillRect(0, -1.5, 15, 3);
        ctx.restore();
    });

    ctx.fillStyle = "#ef4444";
    enemyBullets.forEach(b => {
        ctx.save();
        ctx.translate(b.x - camera.x, b.y - camera.y);
        ctx.rotate(b.angle);
        ctx.fillRect(0, -1.5, 10, 3);
        ctx.restore();
    });

    ctx.fillStyle = "#ff4500";
    missiles.forEach(m => {
        ctx.save();
        ctx.translate(m.x - camera.x, m.y - camera.y);
        ctx.rotate(m.angle);

        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-5, -3, 25, 6);

        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.moveTo(20, -4);
        ctx.lineTo(30, 0);
        ctx.lineTo(20, 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(-3, -8, 4, 5);
        ctx.fillRect(-3, 3, 4, 5);

        ctx.restore();
    });

    ctx.restore();
    drawRadar();
    frame++;
    requestAnimationFrame(loop);
}

loop();

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth > window.innerHeight) {
        document.body.style.overflow = 'hidden';
    }
});

document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
});

// Initialize
loadGame();
document.getElementById('sensitivity-value').innerText = sensitivityLevel;
document.getElementById('difficulty-value').innerText = difficultyLevel;
updateCoinDisplay();
// ===== AUTO SCREEN SIZE DETECTOR =====
// This detects screen size changes and updates the UI without affecting gameplay

// Store the last screen width to detect changes
let lastScreenWidth = window.innerWidth;
let resizeTimeout;

// Function to check and apply mobile/desktop mode
function checkScreenSize() {
    const currentWidth = window.innerWidth;
    
    // Check if we're in game (not in home menu)
    const isInGame = homeMenu && homeMenu.style.display === 'none';
    
    // Update HUD visibility based on screen size
    if (hud) {
        if (currentWidth <= 768) {
            // Mobile mode
            if (isInGame) {
                hud.style.display = 'none';
            }
            if (radar) radar.style.display = 'none';
            if (hudToggle) hudToggle.style.display = 'block';
            if (gsCont) gsCont.style.display = 'none';
            if (locCont) locCont.style.display = 'none';
            if (coinDisplay) coinDisplay.style.display = 'block';
            if (shopBtn) shopBtn.style.display = 'block';
        } else {
            // Desktop mode
            if (isInGame) {
                hud.style.display = 'block';
            }
            if (radar) radar.style.display = 'block';
            if (hudToggle) hudToggle.style.display = 'none';
            if (gsCont && isInGame) gsCont.style.display = 'flex';
            if (locCont && isInGame) locCont.style.display = 'flex';
            if (coinDisplay) coinDisplay.style.display = 'block';
            if (shopBtn) shopBtn.style.display = 'block';
        }
    }
    
    // Update level stage position
    if (levelStage) {
        if (currentWidth <= 768) {
            levelStage.style.top = '10px';
            levelStage.style.left = '10px';
            levelStage.style.transform = 'none';
        } else {
            levelStage.style.top = '20px';
            levelStage.style.left = '50%';
            levelStage.style.transform = 'translateX(-50%)';
        }
    }
    
    // Update boss health bar position
    if (bossHealthContainer) {
        if (currentWidth <= 768) {
            bossHealthContainer.style.top = '60px';
        } else {
            bossHealthContainer.style.top = '100px';
        }
    }
    
    // Update settings button position on home menu
    if (settingsBtn && homeMenu && homeMenu.style.display !== 'none') {
        if (currentWidth <= 768) {
            settingsBtn.style.top = '10px';
            settingsBtn.style.right = '10px';
        } else {
            settingsBtn.style.top = '20px';
            settingsBtn.style.right = '20px';
        }
    }
}

// Throttled resize handler
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        
        // Only update if width changed significantly
        if (Math.abs(currentWidth - lastScreenWidth) > 10) {
            lastScreenWidth = currentWidth;
            
            // Update canvas size
            canvas.width = currentWidth;
            canvas.height = window.innerHeight;
            
            // Update camera position
            if (!isPaused && player) {
                camera.x = player.x - canvas.width / 3;
                camera.y = player.y - canvas.height / 2.5;
            }
            
            // Apply screen size changes
            checkScreenSize();
        }
    }, 100);
}

// Listen for resize events
window.addEventListener('resize', handleResize);

// Listen for orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        checkScreenSize();
    }, 50);
});

// Initial check
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkScreenSize, 100);
});

// Override startGame to include screen check
const originalStartGame = window.startGame;
window.startGame = function() {
    if (originalStartGame) originalStartGame();
    setTimeout(checkScreenSize, 100);
};

// Override continueGame to include screen check
const originalContinueGame = window.continueGame;
window.continueGame = function() {
    if (originalContinueGame) originalContinueGame();
    setTimeout(checkScreenSize, 100);
};

// Override returnToHome to include screen check
const originalReturnToHome = window.returnToHome;
window.returnToHome = function() {
    if (originalReturnToHome) originalReturnToHome();
    setTimeout(checkScreenSize, 100);
};

// Also check when any menu closes
const originalCloseSettings = window.closeSettings;
window.closeSettings = function() {
    if (originalCloseSettings) originalCloseSettings();
    setTimeout(checkScreenSize, 100);
};

console.log('Auto screen size detector initialized');