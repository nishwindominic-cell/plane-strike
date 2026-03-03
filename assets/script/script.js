// ===== ULTIMATE EDITION - with COMPLETE ORIGINAL SOUNDS (no copyright) =====

// Auto-refresh function to ensure sound settings are applied
function refreshGameState() {
    console.log('Game state refreshed - sound enabled:', soundEnabled);
    // Update sound toggle UI
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.className = soundEnabled ? 'setting-toggle active' : 'setting-toggle';
    }
    
    // Update volume displays
    const musicSlider = document.getElementById('music-volume');
    const sfxSlider = document.getElementById('sfx-volume');
    if (musicSlider) musicSlider.value = musicVolume;
    if (sfxSlider) sfxSlider.value = sfxVolume;
    
    // Update difficulty and sensitivity displays
    document.getElementById('sensitivity-value').innerText = sensitivityLevel;
    document.getElementById('difficulty-value').innerText = difficultyLevel;
    
    // Update auto-shoot toggle in settings only
    const autoShootSetting = document.getElementById('auto-shoot-setting');
    if (autoShootSetting) {
        autoShootSetting.className = autoShootEnabled ? 'setting-toggle active' : 'setting-toggle';
    }
    
    // Ensure auto-shoot button is hidden in game
    const autoShootToggle = document.getElementById('auto-shoot-toggle');
    if (autoShootToggle) {
        autoShootToggle.style.display = 'none';
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// DOM Elements
const successMenu = document.getElementById('success-menu');
const homeMenu = document.getElementById('home-menu');
const loadingPage = document.getElementById('loading-page');
const gameoverMenu = document.getElementById('gameover-menu');
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
const achievementsMenu = document.getElementById('achievements-menu');
const planesMenu = document.getElementById('planes-menu');
const achievementsList = document.getElementById('achievements-list');
const planesList = document.getElementById('planes-list');
const dailyRewardBtn = document.getElementById('daily-reward-btn');
const menuScore = document.getElementById('menu-score');
const totalCoinsDisplay = document.getElementById('total-coins-display');
const targetRunwaySpan = document.getElementById('target-runway');
const orientationWarning = document.getElementById('orientation-warning');
const clearedToLand = document.getElementById('cleared-to-land');

const gameoverScore = document.getElementById('gameover-score');
const gameoverKills = document.getElementById('gameover-kills');
const gameoverCombo = document.getElementById('gameover-combo');
const gameoverCoins = document.getElementById('gameover-coins');
const gameoverLevel = document.getElementById('gameover-level');

// Settings state
let soundEnabled = true;
let musicVolume = 70;
let sfxVolume = 80;
let sensitivityLevel = 'Normal';
let difficultyLevel = 'Normal';
let enemySpeedMultiplier = 1.0;
let enemyAccuracyMultiplier = 1.0;
let enemyCountMultiplier = 1.0;
let enemyHealthMultiplier = 1.0;
let missileCount = 6;
let autoShootEnabled = false;

// Game variables
let currentLevel = 1;
let currentStage = 1;
let totalScore = 0;
let totalKills = 0;
let coins = 0;
const STAGES_PER_LEVEL = 5;
let currentCombo = 0;
let maxCombo = 0;
let comboMultiplier = 1;
let comboDecayTimer = 0;
const COMBO_DECAY_TIME = 180;

// Cleared to land message timer
let clearedToLandTimer = 0;
const CLEARED_TO_LAND_DURATION = 240; // 4 seconds at 60fps

const achievements = [
    { id: 'firstKill', name: 'FIRST BLOOD', desc: 'Destroy your first enemy', reward: 50, icon: '🎯', completed: false, progress: 0, target: 1 },
    { id: 'acePilot', name: 'ACE PILOT', desc: 'Destroy 100 enemies', reward: 500, icon: '🏅', completed: false, progress: 0, target: 100 },
    { id: 'perfectLanding', name: 'PERFECT LANDING', desc: 'Land with sink rate < 100 FPM', reward: 200, icon: '🛬', completed: false, progress: 0, target: 1 },
    { id: 'bossSlayer', name: 'BOSS SLAYER', desc: 'Defeat 5 bosses', reward: 1000, icon: '👑', completed: false, progress: 0, target: 5 },
    { id: 'collector', name: 'COLLECTOR', desc: 'Earn 1000 coins', reward: 200, icon: '💰', completed: false, progress: 0, target: 1000 },
    { id: 'survivor', name: 'SURVIVOR', desc: 'Complete 10 stages', reward: 500, icon: '⭐', completed: false, progress: 0, target: 10 }
];

const planes = [
    { id: 'trainer', name: 'TRAINER', icon: '✈️', speed: 12, handling: 0.035, health: 100, color: '#475569', unlocked: true, price: 0 },
    { id: 'fighter', name: 'FIGHTER', icon: '⚡', speed: 15, handling: 0.04, health: 120, color: '#ef4444', unlocked: false, price: 500 },
    { id: 'interceptor', name: 'INTERCEPTOR', icon: '🚀', speed: 18, handling: 0.045, health: 110, color: '#f97316', unlocked: false, price: 1000 },
    { id: 'gunship', name: 'GUNSHIP', icon: '💪', speed: 10, handling: 0.03, health: 200, color: '#64748b', unlocked: false, price: 1500 },
    { id: 'ace', name: 'ACE', icon: '👑', speed: 16, handling: 0.05, health: 150, color: '#fbbf24', unlocked: false, price: 2000 },
    { id: 'stealth', name: 'STEALTH', icon: '🌑', speed: 20, handling: 0.055, health: 130, color: '#1e293b', unlocked: false, price: 2500 }
];

let selectedPlane = 'trainer';
let lastDailyReward = null;
const DAILY_REWARD_AMOUNT = 100;

let boss = null;
let bossActive = false;
let bossHealth = 0;
let bossMaxHealth = 0;
let bossSpawned = false;
let stageJustCompleted = false;
let hasSaveData = false;
let targetRunway = 0;
const runwayNumbers = [27, 9, 18, 36, 22];
const ENEMY_MAX_HEALTH = 30;
const ENEMY_TARGET_ALTITUDE = 5000;

// ===== REALISTIC CLOUD SYSTEM =====
let clouds = [];
const CLOUD_COUNT = 15;

function generateClouds() {
    clouds.length = 0;
    for (let i = 0; i < CLOUD_COUNT; i++) {
        clouds.push({
            x: Math.random() * 60000 - 10000,
            y: 500 + Math.random() * 2500,
            width: 150 + Math.random() * 300,
            height: 40 + Math.random() * 60,
            speed: 0.1 + Math.random() * 0.3,
            opacity: 0.4 + Math.random() * 0.4,
            puffCount: 3 + Math.floor(Math.random() * 5),
            drift: Math.random() * Math.PI * 2,
            driftSpeed: 0.001 + Math.random() * 0.003
        });
    }
}

function drawClouds() {
    clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > 60000) cloud.x = -5000;
        cloud.drift += cloud.driftSpeed;
        
        const sx = cloud.x - camera.x * 0.3;
        const sy = cloud.y - camera.y * 0.2;
        
        if (sx > -500 && sx < canvas.width + 500 && sy > -200 && sy < canvas.height + 200) {
            ctx.save();
            ctx.globalAlpha = cloud.opacity * (0.8 + 0.2 * Math.sin(cloud.drift));
            
            for (let p = 0; p < cloud.puffCount; p++) {
                const puffX = sx + (p - cloud.puffCount/2) * cloud.width * 0.4;
                const puffY = sy + Math.sin(cloud.drift + p) * 10;
                
                const gradient = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, cloud.height);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.5, 'rgba(240, 240, 240, 0.7)');
                gradient.addColorStop(1, 'rgba(220, 220, 220, 0.3)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(puffX, puffY, cloud.width * 0.3, cloud.height * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    });
}

// ===== WEATHER EFFECTS =====
let weatherParticles = [];
let weatherType = 'clear';

function updateWeather() {
    if (Math.random() < 0.001) {
        const rand = Math.random();
        if (rand < 0.6) weatherType = 'clear';
        else if (rand < 0.85) weatherType = 'rain';
        else weatherType = 'snow';
    }
    
    if (weatherType === 'rain') {
        for (let i = 0; i < 3; i++) {
            weatherParticles.push({
                x: Math.random() * canvas.width,
                y: -10,
                speed: 5 + Math.random() * 5,
                type: 'rain'
            });
        }
    } else if (weatherType === 'snow') {
        for (let i = 0; i < 1; i++) {
            weatherParticles.push({
                x: Math.random() * canvas.width,
                y: -10,
                speed: 1 + Math.random() * 2,
                drift: (Math.random() - 0.5) * 0.5,
                size: 2 + Math.random() * 3,
                type: 'snow'
            });
        }
    }
    
    for (let i = weatherParticles.length - 1; i >= 0; i--) {
        const p = weatherParticles[i];
        if (p.type === 'rain') {
            p.y += p.speed;
            if (p.y > canvas.height + 10) weatherParticles.splice(i, 1);
        } else if (p.type === 'snow') {
            p.x += p.drift;
            p.y += p.speed;
            if (p.y > canvas.height + 10 || p.x < -10 || p.x > canvas.width + 10) weatherParticles.splice(i, 1);
        }
    }
}

function drawWeather() {
    weatherParticles.forEach(p => {
        if (p.type === 'rain') {
            ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - 2, p.y + 8);
            ctx.stroke();
        } else if (p.type === 'snow') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    });
}

// ===== BIRDS =====
function generateBirds() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const bird = document.createElement('div');
            bird.className = 'bird';
            bird.innerHTML = '🕊️';
            bird.style.left = '-100px';
            bird.style.top = Math.random() * 200 + 'px';
            bird.style.animationDelay = (i * 3) + 's';
            document.body.appendChild(bird);
            
            setTimeout(() => {
                bird.remove();
            }, 20000);
        }, i * 2000);
    }
}

// ===== ENHANCED ENEMY SHAPES WITH REALISTIC PLANE APPEARANCE =====
const enemyShapes = {
    scout: {
        name: "SCOUT",
        baseThrust: 3.5,
        health: 15,
        color: "#94a3b8",
        radarColor: "#a0a0a0",
        shootSpeed: 90,
        bulletSpeed: 15,
        points: 50,
        coins: 10,
        aggressiveness: 0.8,
        drawShape: function(ctx, x, y, angle, scale, wingAngle) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale * 0.8, scale * 0.8);
            
            // Main fuselage
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(45, -4);
            ctx.lineTo(45, 4);
            ctx.lineTo(0, 8);
            ctx.lineTo(-15, 4);
            ctx.lineTo(-15, -4);
            ctx.closePath();
            ctx.fill();
            
            // Left wing with dynamic movement based on wingAngle
            ctx.fillStyle = this.color;
            ctx.save();
            ctx.translate(15, -2);
            ctx.rotate(wingAngle * 0.3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, -25);
            ctx.lineTo(35, -22);
            ctx.lineTo(10, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Right wing with dynamic movement based on wingAngle
            ctx.save();
            ctx.translate(15, 2);
            ctx.rotate(-wingAngle * 0.3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, 25);
            ctx.lineTo(35, 22);
            ctx.lineTo(10, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Tail
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-10, -3);
            ctx.lineTo(-25, -18);
            ctx.lineTo(-15, -18);
            ctx.lineTo(-5, -3);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(-10, 3);
            ctx.lineTo(-25, 18);
            ctx.lineTo(-15, 18);
            ctx.lineTo(-5, 3);
            ctx.closePath();
            ctx.fill();
            
            // Cockpit
            ctx.fillStyle = "#60a5fa";
            ctx.beginPath();
            ctx.arc(25, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    },
    fighter: {
        name: "FIGHTER",
        baseThrust: 4.5,
        health: 15,
        color: "#ef4444",
        radarColor: "#ff3333",
        shootSpeed: 70,
        bulletSpeed: 18,
        points: 100,
        coins: 20,
        aggressiveness: 1.2,
        drawShape: function(ctx, x, y, angle, scale, wingAngle) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale * 0.8, scale * 0.8);
            
            // Sleek fuselage
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(50, -3);
            ctx.lineTo(50, 3);
            ctx.lineTo(0, 6);
            ctx.lineTo(-20, 3);
            ctx.lineTo(-20, -3);
            ctx.closePath();
            ctx.fill();
            
            // Left swept wing with dynamic movement
            ctx.save();
            ctx.translate(20, -2);
            ctx.rotate(wingAngle * 0.4);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, -30);
            ctx.lineTo(40, -27);
            ctx.lineTo(15, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Right swept wing with dynamic movement
            ctx.save();
            ctx.translate(20, 2);
            ctx.rotate(-wingAngle * 0.4);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, 30);
            ctx.lineTo(40, 27);
            ctx.lineTo(15, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Twin tails
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-5, -2);
            ctx.lineTo(-20, -25);
            ctx.lineTo(-10, -22);
            ctx.lineTo(0, -2);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(-5, 2);
            ctx.lineTo(-20, 25);
            ctx.lineTo(-10, 22);
            ctx.lineTo(0, 2);
            ctx.closePath();
            ctx.fill();
            
            // Aggressive cockpit
            ctx.fillStyle = "#b91c1c";
            ctx.beginPath();
            ctx.arc(30, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    },
    interceptor: {
        name: "INTERCEPTOR",
        baseThrust: 5.5,
        health: 15,
        color: "#f97316",
        radarColor: "#ff9900",
        shootSpeed: 55,
        bulletSpeed: 22,
        points: 150,
        coins: 30,
        aggressiveness: 1.5,
        drawShape: function(ctx, x, y, angle, scale, wingAngle) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale * 0.8, scale * 0.8);
            
            // Long fuselage
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(60, -2.5);
            ctx.lineTo(60, 2.5);
            ctx.lineTo(0, 5);
            ctx.lineTo(-25, 2.5);
            ctx.lineTo(-25, -2.5);
            ctx.closePath();
            ctx.fill();
            
            // Delta wings with dynamic movement
            ctx.save();
            ctx.translate(25, 0);
            ctx.rotate(wingAngle * 0.5);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, -35);
            ctx.lineTo(45, -30);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.translate(25, 0);
            ctx.rotate(-wingAngle * 0.5);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, 35);
            ctx.lineTo(45, 30);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Vertical stabilizer
            ctx.beginPath();
            ctx.moveTo(-5, -2);
            ctx.lineTo(-25, -30);
            ctx.lineTo(-15, -25);
            ctx.lineTo(0, -2);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(-5, 2);
            ctx.lineTo(-25, 30);
            ctx.lineTo(-15, 25);
            ctx.lineTo(0, 2);
            ctx.closePath();
            ctx.fill();
            
            // Pointed cockpit
            ctx.fillStyle = "#c2410c";
            ctx.beginPath();
            ctx.arc(35, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    },
    gunship: {
        name: "GUNSHIP",
        baseThrust: 3.0,
        health: 15,
        color: "#64748b",
        radarColor: "#808080",
        shootSpeed: 45,
        bulletSpeed: 14,
        points: 200,
        coins: 40,
        aggressiveness: 0.9,
        drawShape: function(ctx, x, y, angle, scale, wingAngle) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale * 0.8, scale * 0.8);
            
            // Wide fuselage
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(40, -8);
            ctx.lineTo(40, 8);
            ctx.lineTo(0, 15);
            ctx.lineTo(-25, 8);
            ctx.lineTo(-25, -8);
            ctx.closePath();
            ctx.fill();
            
            // Large wings with dynamic movement
            ctx.save();
            ctx.translate(15, -5);
            ctx.rotate(wingAngle * 0.3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(30, -40);
            ctx.lineTo(45, -35);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.translate(15, 5);
            ctx.rotate(-wingAngle * 0.3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(30, 40);
            ctx.lineTo(45, 35);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Dual tail
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-15, -5);
            ctx.lineTo(-40, -30);
            ctx.lineTo(-25, -25);
            ctx.lineTo(-5, -5);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(-15, 5);
            ctx.lineTo(-40, 30);
            ctx.lineTo(-25, 25);
            ctx.lineTo(-5, 5);
            ctx.closePath();
            ctx.fill();
            
            // Armored cockpit
            ctx.fillStyle = "#4b5563";
            ctx.beginPath();
            ctx.arc(20, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Gun turrets
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.arc(0, -5, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 5, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    },
    ace: {
        name: "ACE",
        baseThrust: 5.0,
        health: 15,
        color: "#fbbf24",
        radarColor: "#ffdd44",
        shootSpeed: 50,
        bulletSpeed: 20,
        points: 250,
        coins: 50,
        aggressiveness: 1.8,
        drawShape: function(ctx, x, y, angle, scale, wingAngle) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale * 0.8, scale * 0.8);
            
            // Elite fuselage
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.lineTo(55, -3.5);
            ctx.lineTo(55, 3.5);
            ctx.lineTo(0, 7);
            ctx.lineTo(-20, 3.5);
            ctx.lineTo(-20, -3.5);
            ctx.closePath();
            ctx.fill();
            
            // Swept wings with aggressive movement
            ctx.save();
            ctx.translate(20, -2);
            ctx.rotate(wingAngle * 0.5);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(30, -35);
            ctx.lineTo(45, -32);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.translate(20, 2);
            ctx.rotate(-wingAngle * 0.5);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(30, 35);
            ctx.lineTo(45, 32);
            ctx.lineTo(20, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            
            // Advanced tail
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-10, -2);
            ctx.lineTo(-30, -28);
            ctx.lineTo(-20, -25);
            ctx.lineTo(-5, -2);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(-10, 2);
            ctx.lineTo(-30, 28);
            ctx.lineTo(-20, 25);
            ctx.lineTo(-5, 2);
            ctx.closePath();
            ctx.fill();
            
            // Elite cockpit
            ctx.fillStyle = "#b45309";
            ctx.beginPath();
            ctx.arc(30, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(30, 0, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
};

const bossTypes = {
    trainer: { name: "TRAINER BOSS", health: 200, thrust: 3.0, shootSpeed: 40, bulletSpeed: 12, color: "#6b7280", size: 2.0, pattern: "basic", points: 500, coins: 100, shootDuration: 300, shootCooldown: 900 }
};

// Player stats
let playerMaxThrust = 12;
let playerAcceleration = 0.1;
let playerManeuverability = 0.035;
let playerBaseHealth = 100;
let playerBaseMissiles = 6;
let playerColor = "#475569";

// Variable for engine sound pitch change
let previousThrust = 4;
// Variable for wing animation
let wingFlapPhase = 0;

function updatePlayerStatsFromPlane() {
    const plane = planes.find(p => p.id === selectedPlane);
    if (plane) {
        playerMaxThrust = plane.speed;
        playerManeuverability = plane.handling;
        playerBaseHealth = plane.health;
        playerColor = plane.color;
        if (player) {
            player.maxThrust = playerMaxThrust;
            player.baseHealth = playerBaseHealth;
            player.health = playerBaseHealth;
        }
    }
}

// Power system
let activePower = null;
let powerDuration = 0;
let powerCooldown = 0;
let powerMissileCount = 0;
let originalEnemySpeedMultiplier = 1.0;

const powerItems = [
    { id: 'rapidFire', name: 'RAPID FIRE', description: 'Gun fires 3x faster for 10 seconds', price: 50, levelReq: 1, icon: '🔥', duration: 600, effect: function() { activePower = 'rapidFire'; powerDuration = 600; } },
    { id: 'shield', name: 'ENERGY SHIELD', description: 'Invulnerable for 8 seconds', price: 75, levelReq: 2, icon: '🛡️', duration: 480, effect: function() { activePower = 'shield'; powerDuration = 480; } },
    { id: 'doubleDamage', name: 'DOUBLE DAMAGE', description: 'All weapons deal 2x damage for 12 seconds', price: 100, levelReq: 3, icon: '⚡', duration: 720, effect: function() { activePower = 'doubleDamage'; powerDuration = 720; } },
    { id: 'timeSlow', name: 'TIME SLOW', description: 'Slows down enemies for 8 seconds', price: 120, levelReq: 4, icon: '⏱️', duration: 480, effect: function() { activePower = 'timeSlow'; powerDuration = 480; } },
    { id: 'homingMissiles', name: 'HOMING MISSILES', description: 'Next 10 missiles are super homing', price: 150, levelReq: 5, icon: '🎯', duration: 0, effect: function() { activePower = 'homingMissiles'; powerMissileCount = 10; } },
    { id: 'repairKit', name: 'REPAIR KIT', description: 'Instantly restore 50% health', price: 60, levelReq: 1, icon: '❤️', duration: 0, effect: function() { player.health = Math.min(player.health + playerBaseHealth * 0.5, playerBaseHealth); document.getElementById('p-health').innerText = player.health + "%"; } },
    { id: 'missileRefill', name: 'MISSILE REFILL', description: 'Refill all missiles', price: 40, levelReq: 1, icon: '🚀', duration: 0, effect: function() { missileCount = playerBaseMissiles; } }
];

// ========== ORIGINAL, COPYRIGHT-FREE SOUND SYSTEM ==========
let audioCtx = null;
let homeMusic = null;
let homeMusicInterval = null;
let engineSound = null;
let engineGain = null;
let engineFilter = null;
let homeMusicStarted = false;
let homeMusicRetryCount = 0;
const MAX_HOME_MUSIC_RETRIES = 3;

function initAudio() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            return;
        }
    }
    
    if (audioCtx.state === 'suspended' && soundEnabled) {
        audioCtx.resume().then(() => {
            console.log('Audio context resumed');
            // Try to start home music after resume
            if (homeMenu.style.display !== 'none' && homeMenu.classList.contains('visible')) {
                setTimeout(() => initHomeMusic(), 100);
            }
        }).catch(e => console.log('Failed to resume audio context:', e));
    }
}

// Pleasant, copyright-free home screen music (calm arpeggio) - ENHANCED for automatic playback
function initHomeMusic() {
    if (!soundEnabled || !audioCtx) {
        console.log('Sound disabled or no audio context');
        return;
    }
    
    if (homeMusicStarted) {
        console.log('Home music already started');
        return;
    }
    
    // Don't start if game is active
    if (homeMenu.style.display === 'none') {
        console.log('Game is active, not starting home music');
        return;
    }
    
    homeMusicStarted = true;
    homeMusicRetryCount = 0;
    
    stopHomeMusic();
    try {
        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const osc3 = audioCtx.createOscillator();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc3.type = 'sine';

        // Simple, pleasant melody loop
        osc1.frequency.setValueAtTime(440, now); // A
        osc1.frequency.setValueAtTime(494, now + 0.5); // B
        osc1.frequency.setValueAtTime(523, now + 1.0); // C
        osc1.frequency.setValueAtTime(587, now + 1.5); // D
        osc1.frequency.setValueAtTime(523, now + 2.0);
        osc1.frequency.setValueAtTime(494, now + 2.5);
        osc1.frequency.setValueAtTime(440, now + 3.0);

        osc2.frequency.setValueAtTime(220, now); // bass A
        osc2.frequency.setValueAtTime(220, now + 2.0);
        osc2.frequency.setValueAtTime(220, now + 4.0);

        osc3.frequency.setValueAtTime(330, now); // E
        osc3.frequency.setValueAtTime(330, now + 2.0);

        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();
        const gain3 = audioCtx.createGain();

        gain1.gain.setValueAtTime(0.1 * (musicVolume / 100), now);
        gain2.gain.setValueAtTime(0.05 * (musicVolume / 100), now);
        gain3.gain.setValueAtTime(0.05 * (musicVolume / 100), now);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);

        gain1.connect(filter);
        gain2.connect(filter);
        gain3.connect(filter);

        filter.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
        osc3.start();

        // Loop the melody
        homeMusicInterval = setInterval(() => {
            if (!soundEnabled || homeMenu.style.display === 'none' || !audioCtx) return;
            const loopNow = audioCtx.currentTime;
            osc1.frequency.setValueAtTime(440, loopNow);
            osc1.frequency.setValueAtTime(494, loopNow + 0.5);
            osc1.frequency.setValueAtTime(523, loopNow + 1.0);
            osc1.frequency.setValueAtTime(587, loopNow + 1.5);
            osc1.frequency.setValueAtTime(523, loopNow + 2.0);
            osc1.frequency.setValueAtTime(494, loopNow + 2.5);
            osc1.frequency.setValueAtTime(440, loopNow + 3.0);
        }, 3000);

        homeMusic = [osc1, osc2, osc3];
        console.log('Home music started successfully');
    } catch (e) {
        console.log('Home music not supported:', e);
        homeMusicStarted = false;
        
        // Retry if failed
        if (homeMusicRetryCount < MAX_HOME_MUSIC_RETRIES) {
            homeMusicRetryCount++;
            console.log(`Retrying home music (${homeMusicRetryCount}/${MAX_HOME_MUSIC_RETRIES})...`);
            setTimeout(() => initHomeMusic(), 500);
        }
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
    homeMusicStarted = false;
}

function createNoiseBuffer() {
    if (!audioCtx) return null;
    const length = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
}

// Realistic crash sound (metal+explosion)
function playRealisticCrash() {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const vol = sfxVolume / 100;

    // metal screech
    const metalOsc = audioCtx.createOscillator();
    const metalGain = audioCtx.createGain();
    metalOsc.type = 'sawtooth';
    metalOsc.frequency.setValueAtTime(120, now);
    metalOsc.frequency.exponentialRampToValueAtTime(40, now + 0.8);
    metalGain.gain.setValueAtTime(0.3 * vol, now);
    metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    metalOsc.connect(metalGain);
    metalGain.connect(audioCtx.destination);
    metalOsc.start();
    metalOsc.stop(now + 0.8);

    // explosion thud
    const expOsc = audioCtx.createOscillator();
    const expGain = audioCtx.createGain();
    expOsc.type = 'sine';
    expOsc.frequency.setValueAtTime(60, now);
    expOsc.frequency.exponentialRampToValueAtTime(20, now + 1.0);
    expGain.gain.setValueAtTime(0.5 * vol, now);
    expGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
    expOsc.connect(expGain);
    expGain.connect(audioCtx.destination);
    expOsc.start();
    expOsc.stop(now + 1.0);
}

// Engine sound for speed changes - ENHANCED and ALWAYS PLAYING DURING GAMEPLAY
function updateEngineSound() {
    if (!engineGain || !engineFilter || !soundEnabled || !audioCtx || player.dead) {
        if (engineGain) engineGain.gain.value = 0;
        return;
    }
    
    // Calculate thrust percentage for sound pitch
    const thrustPercent = player.thrust / playerMaxThrust;
    
    // Base frequency ranges from 200Hz to 800Hz based on thrust (more dramatic)
    const baseFreq = 200 + (thrustPercent * 600);
    engineFilter.frequency.value = baseFreq;
    
    // Volume increases with thrust - ALWAYS ON during gameplay
    engineGain.gain.value = (0.05 + thrustPercent * 0.08) * (musicVolume / 100);
    
    // Add more modulation for realism
    engineFilter.Q.value = 0.5 + (thrustPercent * 0.5) + (Math.sin(frame * 0.1) * 0.1);
}

// ENHANCED BLAST ANIMATION FUNCTION
function createBlast(x, y, color, count = 25) {
    if (!soundEnabled) {
        // Still create visual blast even if sound is off
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 8;
            particles.push({ 
                x, y, 
                vx: Math.cos(angle) * speed, 
                vy: Math.sin(angle) * speed, 
                life: 0.8 + Math.random() * 0.4, 
                color: color || "#ff4500",
                size: 3 + Math.random() * 5
            });
        }
        
        for (let i = 0; i < 15; i++) {
            particles.push({ 
                x, y, 
                vx: (Math.random() - 0.5) * 4, 
                vy: (Math.random() - 0.5) * 4 - 2, 
                life: 1.0 + Math.random() * 0.5, 
                color: "#333333",
                size: 4 + Math.random() * 8
            });
        }
        
        for (let i = 0; i < 10; i++) {
            particles.push({ 
                x, y, 
                vx: (Math.random() - 0.5) * 12, 
                vy: (Math.random() - 0.5) * 12, 
                life: 0.4 + Math.random() * 0.3, 
                color: "#ffff00",
                size: 2 + Math.random() * 3
            });
        }
        return;
    }
    
    playSound('explode');
    // Create main explosion particles
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        particles.push({ 
            x, y, 
            vx: Math.cos(angle) * speed, 
            vy: Math.sin(angle) * speed, 
            life: 0.8 + Math.random() * 0.4, 
            color: color || "#ff4500",
            size: 3 + Math.random() * 5
        });
    }
    
    // Create secondary smoke particles
    for (let i = 0; i < 15; i++) {
        particles.push({ 
            x, y, 
            vx: (Math.random() - 0.5) * 4, 
            vy: (Math.random() - 0.5) * 4 - 2, 
            life: 1.0 + Math.random() * 0.5, 
            color: "#333333",
            size: 4 + Math.random() * 8
        });
    }
    
    // Create spark particles
    for (let i = 0; i < 10; i++) {
        particles.push({ 
            x, y, 
            vx: (Math.random() - 0.5) * 12, 
            vy: (Math.random() - 0.5) * 12, 
            life: 0.4 + Math.random() * 0.3, 
            color: "#ffff00",
            size: 2 + Math.random() * 3
        });
    }
}

// Master sound function – covers all game actions
function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const vol = sfxVolume / 100;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // Defaults
    osc.type = 'sine';
    let freqStart = 400;
    let freqEnd = 200;
    let dur = 0.2;
    let gainVal = 0.2 * vol;

    switch (type) {
        case 'shoot':
            osc.type = 'square';
            freqStart = 680;
            freqEnd = 120;
            dur = 0.09;
            gainVal = 0.14 * vol;
            break;
        case 'enemyShoot':
            osc.type = 'sine';
            freqStart = 340;
            freqEnd = 60;
            dur = 0.14;
            gainVal = 0.07 * vol;
            break;
        case 'repair':
            osc.type = 'triangle';
            freqStart = 420;
            freqEnd = 840;
            dur = 0.22;
            gainVal = 0.24 * vol;
            break;
        case 'land':
            osc.type = 'sine';
            freqStart = 180;
            freqEnd = 60;
            dur = 0.6;
            gainVal = 0.25 * vol;
            break;
        case 'crash':
            playRealisticCrash();
            return;
        case 'hit':
            osc.type = 'triangle';
            freqStart = 320;
            freqEnd = 80;
            dur = 0.25;
            gainVal = 0.22 * vol;
            break;
        case 'gear':
            osc.type = 'square';
            freqStart = 180;
            freqEnd = 90;
            dur = 0.18;
            gainVal = 0.18 * vol;
            break;
        case 'enginefail':
            osc.type = 'sawtooth';
            freqStart = 380;
            freqEnd = 60;
            dur = 0.9;
            gainVal = 0.28 * vol;
            break;
        case 'missile':
            osc.type = 'sawtooth';
            freqStart = 220;
            freqEnd = 880;
            dur = 0.3;
            gainVal = 0.3 * vol;
            break;
        case 'bossSpawn':
            osc.type = 'sawtooth';
            freqStart = 110;
            freqEnd = 440;
            dur = 1.2;
            gainVal = 0.5 * vol;
            break;
        case 'bossHit':
            osc.type = 'square';
            freqStart = 220;
            freqEnd = 110;
            dur = 0.3;
            gainVal = 0.4 * vol;
            break;
        case 'bossDie':
            // special longer explosion
            const buf = createNoiseBuffer();
            if (buf) {
                const src = audioCtx.createBufferSource();
                src.buffer = buf;
                const g = audioCtx.createGain();
                src.connect(g);
                g.connect(audioCtx.destination);
                g.gain.setValueAtTime(0.6 * vol, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
                src.start();
                src.stop(now + 2.0);
            }
            return;
        case 'powerup':
            osc.type = 'triangle';
            freqStart = 330;
            freqEnd = 1320;
            dur = 0.5;
            gainVal = 0.3 * vol;
            break;
        case 'coin':
            osc.type = 'sine';
            freqStart = 880;
            freqEnd = 1320;
            dur = 0.15;
            gainVal = 0.2 * vol;
            break;
        case 'explode':
            // short noise burst
            const noiseDur = 0.35;
            const noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * noiseDur, audioCtx.sampleRate);
            const noiseData = noiseBuf.getChannelData(0);
            for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
            const noiseSrc = audioCtx.createBufferSource();
            noiseSrc.buffer = noiseBuf;
            const noiseGain = audioCtx.createGain();
            noiseSrc.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noiseGain.gain.setValueAtTime(0.45 * vol, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDur);
            noiseSrc.start();
            return;
        default: return;
    }

    gain.gain.setValueAtTime(gainVal, now);
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.start();
    osc.stop(now + dur);
}

// World constants
const WORLD_GROUND = 4500;
const GRAVITY = 0.12;
const RADAR_RADIUS = 75;
const RADAR_SCALE = 0.015;

// Mountains
let mountains = [];
function generateRealisticMountains() {
    mountains.length = 0;
    const mountainColors = [
        { base: '#6b4f3c', highlight: '#8b5a2b', shadow: '#4a2e1e' },
        { base: '#2d6a4f', highlight: '#40916c', shadow: '#1e4d3a' },
        { base: '#b85e3a', highlight: '#d97852', shadow: '#9d4b2e' }
    ];

    for (let x = -2000; x < 60000; x += 600) {
        if (Math.random() < 0.5) {
            const mountainSet = mountainColors[Math.floor(Math.random() * mountainColors.length)];
            const height = 200 + Math.random() * 400;
            const width = 300 + Math.random() * 500;

            mountains.push({
                x: x + Math.random() * 300,
                height: height,
                width: width,
                baseY: WORLD_GROUND,
                color: mountainSet.base,
                highlight: mountainSet.highlight,
                shadow: mountainSet.shadow,
                snowLine: Math.random() < 0.3 ? 200 : 0,
                peakX: Math.random() * 100 - 50,
                layers: 3 + Math.floor(Math.random() * 3)
            });
        }
    }
}

function drawRealisticMountains() {
    const groundY = WORLD_GROUND - camera.y;
    mountains.forEach(m => {
        const sx = m.x - camera.x;
        if (sx > -m.width - 200 && sx < canvas.width + m.width + 200) {
            const mountainBaseY = groundY;
            const mountainTopY = mountainBaseY - m.height;

            for (let layer = 0; layer < m.layers; layer++) {
                const layerOffset = layer * 20;
                const layerY = mountainBaseY - layerOffset;
                const layerHeight = m.height - layerOffset;
                if (layerHeight <= 0) continue;

                const alpha = 0.9 - (layer * 0.1);
                
                ctx.beginPath();
                ctx.moveTo(sx - m.width * 0.4, layerY);
                
                for (let i = 0; i < 5; i++) {
                    const t = i / 4;
                    const xOffset = (t - 0.5) * m.width * 1.2;
                    const yOffset = Math.sin(t * Math.PI) * m.height * 0.2;
                    const peakX = sx + m.peakX + xOffset;
                    const peakY = mountainTopY + layer * 5 + yOffset;
                    
                    if (i === 0) ctx.lineTo(peakX, peakY);
                    else ctx.quadraticCurveTo(sx + xOffset/2, peakY - layerHeight * 0.3, peakX, peakY);
                }
                
                ctx.lineTo(sx + m.width * 0.4, layerY);
                ctx.closePath();

                const gradient = ctx.createLinearGradient(sx - 150, layerY - 150, sx + 150, layerY);
                gradient.addColorStop(0, m.shadow);
                gradient.addColorStop(0.4, m.color);
                gradient.addColorStop(0.7, m.highlight);
                gradient.addColorStop(1, m.color);

                ctx.fillStyle = gradient;
                ctx.globalAlpha = alpha;
                ctx.fill();
            }

            if (m.snowLine > 0) {
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(sx + m.peakX - 40, mountainTopY);
                ctx.lineTo(sx + m.peakX, mountainTopY - 25);
                ctx.lineTo(sx + m.peakX + 40, mountainTopY);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    });
    ctx.globalAlpha = 1;
}

// ===== ENHANCED 2D CONTROL TOWER WITH REALISTIC DETAILS =====
function drawDetailedControlTower(tower) {
    const sx = tower.x - camera.x;
    if (sx > -200 && sx < canvas.width + 200) {
        const groundY = WORLD_GROUND - camera.y;
        ctx.save();
        
        // Tower base (concrete structure)
        ctx.fillStyle = tower.baseColor;
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
        
        // Main tower shaft with gradient
        const gradient = ctx.createLinearGradient(sx - 20, groundY - 120, sx + 20, groundY - 20);
        gradient.addColorStop(0, '#64748b');
        gradient.addColorStop(0.5, '#475569');
        gradient.addColorStop(1, '#334155');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(sx - 20, groundY - 120, 40, 100);
        
        // Control cab (glass top)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(sx - 25, groundY - 150, 50, 30);
        
        // Glass windows with reflection
        ctx.fillStyle = '#60a5fa';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(sx - 20, groundY - 145, 15, 20);
        ctx.fillRect(sx + 5, groundY - 145, 15, 20);
        
        // Window frames
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx - 20, groundY - 145, 15, 20);
        ctx.strokeRect(sx + 5, groundY - 145, 15, 20);
        
        // Radar dish on top with animation
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(sx, groundY - 165, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Rotating radar antenna
        ctx.save();
        ctx.translate(sx, groundY - 168);
        ctx.rotate(frame * 0.02);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-20, -2, 40, 4);
        ctx.fillRect(-2, -10, 4, 20);
        ctx.restore();
        
        // Runway number display
        ctx.font = "bold 16px 'Courier New'";
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#22c55e';
        ctx.fillText(tower.runwayNumber, sx - 15, groundY - 180);
        
        // Base details
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#2d4a2d';
        ctx.fillRect(sx - 30, groundY - 10, 60, 10);
        
        ctx.restore();
    }
}

// Ponds and boats
let ponds = [];
let boats = [];

function generatePondsAndBoats() {
    ponds.length = 0;
    boats.length = 0;
    const numPonds = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numPonds; i++) {
        let pondX, validPosition = false;
        let attempts = 0;
        
        while (!validPosition && attempts < 50) {
            pondX = 2000 + Math.random() * 45000;
            validPosition = true;
            
            for (let j = 0; j < runwayStarts.length; j++) {
                if (Math.abs(pondX - runwayStarts[j]) < 3000) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }
        
        if (validPosition) {
            const pondWidth = 200 + Math.random() * 300;
            const pondDepth = 20 + Math.random() * 30;
            
            ponds.push({ x: pondX, width: pondWidth, depth: pondDepth, color: '#1e4b6e' });
            
            const numBoats = 1 + Math.floor(Math.random() * 3);
            for (let b = 0; b < numBoats; b++) {
                boats.push({
                    x: pondX - pondWidth/2 + 50 + Math.random() * (pondWidth - 100),
                    y: WORLD_GROUND - 5,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    speed: 0.2 + Math.random() * 0.3,
                    color: '#8b5a2b',
                    sailColor: '#ef4444',
                    size: 8 + Math.random() * 6
                });
            }
        }
    }
}

function drawPondsAndBoats() {
    const groundY = WORLD_GROUND - camera.y;
    
    ponds.forEach(pond => {
        const sx = pond.x - camera.x;
        if (sx > -pond.width - 100 && sx < canvas.width + pond.width + 100) {
            ctx.fillStyle = pond.color;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.ellipse(sx, groundY - pond.depth/2, pond.width/2, pond.depth/2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    });
    
    boats.forEach(boat => {
        boat.x += boat.direction * boat.speed;
        if (Math.random() < 0.005) boat.direction *= -1;
        
        const sx = boat.x - camera.x;
        if (sx > -50 && sx < canvas.width + 50) {
            ctx.save();
            ctx.fillStyle = boat.color;
            ctx.fillRect(sx - boat.size, groundY - 10, boat.size * 2, 5);
            ctx.fillStyle = boat.sailColor;
            ctx.fillRect(sx - 2, groundY - 25, 4, 15);
            ctx.restore();
        }
    });
}

// ===== ENHANCED SCENERY WITH HOUSES AND 2D NPCS =====
let scenery = [];
let npcs = [];
let controlTowers = [];
let stars = [];
const NUM_STARS = 100;

// ===== LANDING LIGHTS - 4 WHITE BULBS ON BOTH SIDES OF RUNWAY IN LANDING AREA =====
let landingLights = [];

function generateLandingLights() {
    landingLights.length = 0;
    runwayStarts.forEach(start => {
        // LEFT SIDE LIGHTS (4 white bulbs at the end of runway in landing area, 50 units apart)
        for (let i = 0; i < 4; i++) {
            landingLights.push({ 
                x: start + 5400 + 50 + i * 50, 
                y: WORLD_GROUND - 30,
                offsetX: -50, // Left side of runway
                intensity: 1.0, 
                pulseSpeed: 0.05, 
                phase: Math.random() * Math.PI * 2,
                color: '#ffffff'  // WHITE LIGHTS
            });
        }
        
        // RIGHT SIDE LIGHTS (4 white bulbs at the end of runway in landing area, 50 units apart)
        for (let i = 0; i < 4; i++) {
            landingLights.push({ 
                x: start + 5400 + 50 + i * 50, 
                y: WORLD_GROUND - 30,
                offsetX: 50, // Right side of runway
                intensity: 1.0, 
                pulseSpeed: 0.05, 
                phase: Math.random() * Math.PI * 2,
                color: '#ffffff'  // WHITE LIGHTS
            });
        }
    });
}

function generateStars() {
    for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
            x: Math.random() * 60000 - 10000,
            y: Math.random() * 3500,
            size: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.03 + 0.005,
            phase: Math.random() * Math.PI * 2,
            color: '#ffffff'
        });
    }
}

const runwayStarts = [500, 11280, 22060, 32840, 43620];
const runwayRanges = [[400, 6100], [11180, 16880], [21960, 27660], [32740, 38440], [43520, 49220]];

function generateScenery() {
    scenery.length = 0;
    controlTowers.length = 0;
    npcs.length = 0; // Reset NPCs

    for (let x = -5000; x < 50000; x += 50) {
        let skip = false;
        let isRunwayArea = false;
        let runwayIndex = -1;

        for (let i = 0; i < runwayRanges.length; i++) {
            const range = runwayRanges[i];
            if (x > range[0] - 300 && x < range[1] + 300) {
                skip = true;
                isRunwayArea = true;
                runwayIndex = i;
                break;
            }
        }

        if (isRunwayArea && runwayIndex >= 0) {
            if (Math.abs(x - runwayStarts[runwayIndex]) < 100) {
                controlTowers.push({ x: runwayStarts[runwayIndex] - 200, y: WORLD_GROUND, runwayNumber: runwayNumbers[runwayIndex], baseColor: '#4a5568', glassColor: '#60a5fa', roofColor: '#b45309' });
            }
            continue;
        }

        if (skip) continue;

        if (Math.random() < 0.8) { // Increased density
            const rand = Math.random();
            if (rand < 0.2) {
                scenery.push({ x: x + Math.random() * 40, type: 'tree', height: 15 + Math.random() * 15, trunkColor: '#4a2e1e', leafColor: '#2d6a4f' });
            } else if (rand < 0.4) {
                // Enhanced houses with more detail
                scenery.push({ 
                    x: x + Math.random() * 60, 
                    type: 'house', 
                    height: 20 + Math.random() * 20, 
                    width: 25 + Math.random() * 20, 
                    color: '#8b5a2b', 
                    roofColor: '#a52a2a',
                    doorColor: '#4a2e1e',
                    windowColor: '#60a5fa'
                });
            } else if (rand < 0.5) {
                scenery.push({ x: x + Math.random() * 80, type: 'hill', height: 10 + Math.random() * 30, width: 40 + Math.random() * 40, color: '#5d6d3b' });
            } else if (rand < 0.65) {
                scenery.push({ x: x + Math.random() * 30, type: 'bush', height: 5 + Math.random() * 8, color: '#2d6a4f' });
            } else if (rand < 0.8) {
                // Add small buildings
                scenery.push({ 
                    x: x + Math.random() * 50, 
                    type: 'building', 
                    height: 30 + Math.random() * 30, 
                    width: 20 + Math.random() * 20, 
                    color: '#64748b', 
                    roofColor: '#334155',
                    windows: Math.floor(Math.random() * 3) + 1
                });
            } else {
                // Add more variety with barns
                scenery.push({ 
                    x: x + Math.random() * 70, 
                    type: 'barn', 
                    height: 25 + Math.random() * 20, 
                    width: 35 + Math.random() * 25, 
                    color: '#b91c1c', 
                    roofColor: '#7f1d1d',
                    doorColor: '#451a1a'
                });
            }
        }
    }

    // Generate NPCs (people) throughout the world
    for (let i = 0; i < 50; i++) {
        npcs.push({
            x: 1000 + Math.random() * 45000,
            y: WORLD_GROUND,
            size: 5 + Math.random() * 3,
            color: ['#fbbf24', '#60a5fa', '#ef4444', '#a78bfa'][Math.floor(Math.random() * 4)],
            direction: Math.random() > 0.5 ? 1 : -1,
            speed: 0.1 + Math.random() * 0.2,
            animation: 0,
            type: ['person', 'dog', 'cat'][Math.floor(Math.random() * 3)]
        });
    }
}

// Initialize world
generateStars();
generateRealisticMountains();
generateScenery();
generateLandingLights();
generatePondsAndBoats();
generateClouds();
generateBirds();

// Player object - set initial thrust to 4 (72 speed in display)
const player = {
    x: 2000,
    y: 3000,
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
    wasGearDown: false,
    health: 100,
    baseHealth: 100
};

// Game state
let level = 1;
let lives = 3;
let frame = 0;
let camera = { x: 0, y: 0 };
let bullets = [], enemyBullets = [], enemies = [], particles = [], missiles = [];
let isPaused = true;
const keys = {};

updatePlayerStatsFromPlane();

// Check orientation on mobile
function checkOrientation() {
    if (window.innerWidth <= 768) {
        if (window.innerHeight > window.innerWidth) {
            // Portrait mode
            orientationWarning.style.display = 'flex';
        } else {
            // Landscape mode
            orientationWarning.style.display = 'none';
        }
    } else {
        orientationWarning.style.display = 'none';
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Auto-shoot toggle function - now only affects settings toggle
window.toggleAutoShoot = function() {
    autoShootEnabled = !autoShootEnabled;
    refreshGameState();
    playSound('gear');
}

// Key handlers
window.keyDown = function(code) {
    if (keys[code]) return;
    keys[code] = true;
    if (code === 'KeyG') {
        player.gearDown = !player.gearDown;
        playSound('gear');
    }
}

window.keyUp = function(code) {
    keys[code] = false;
}

window.toggleHUD = function() {
    hud.style.display = hud.style.display === 'block' ? 'none' : 'block';
}

window.onkeydown = e => {
    if (isPaused && homeMenu.style.display === 'none' && gameoverMenu.style.display === 'none') return;
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

// Achievement functions
function checkAchievement(id, value) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.completed) {
        achievement.progress += value;
        if (achievement.progress >= achievement.target) {
            completeAchievement(achievement);
        }
    }
}

function completeAchievement(achievement) {
    if (achievement.completed) return;
    achievement.completed = true;
    coins += achievement.reward;
    showAchievementPopup(achievement);
    updateAchievementsDisplay();
    updateCoinDisplay();
    saveGame();
}

function showAchievementPopup(achievement) {
    const popup = document.createElement('div');
    popup.className = 'radio-effect';
    popup.innerHTML = `🏆 ${achievement.name} +${achievement.reward}💰`;
    popup.style.position = 'fixed';
    popup.style.top = '30%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'rgba(34, 197, 94, 0.9)';
    popup.style.color = 'white';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.zIndex = '1000';
    popup.style.animation = 'radioFade 3s ease-out';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

function updateAchievementsDisplay() {
    if (!achievementsList) return;
    let html = '';
    achievements.forEach(ach => {
        const progressPercent = (ach.progress / ach.target) * 100;
        html += `<div class="achievement-item ${ach.completed ? 'completed' : ''}">
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
                <div class="achievement-reward">Reward: ${ach.reward}💰</div>
                <div class="achievement-progress"><div class="progress-bar" style="width: ${progressPercent}%"></div></div>
            </div>
        </div>`;
    });
    achievementsList.innerHTML = html;
}

function showAchievements() {
    updateAchievementsDisplay();
    achievementsMenu.style.display = 'block';
    homeMenu.style.opacity = '0.5';
}

function closeAchievements() {
    achievementsMenu.style.display = 'none';
    homeMenu.style.opacity = '1';
}

function updatePlanesDisplay() {
    if (!planesList) return;
    let html = '';
    planes.forEach(plane => {
        const unlocked = plane.unlocked;
        const selected = plane.id === selectedPlane ? 'selected' : '';
        const lockedClass = !unlocked ? 'locked' : '';
        html += `<div class="plane-item ${selected} ${lockedClass}" onclick="${unlocked ? `selectPlane('${plane.id}')` : `unlockPlane('${plane.id}')`}">
            <div class="plane-icon">${plane.icon}</div>
            <div class="plane-info">
                <div class="plane-name">${plane.name}</div>
                <div class="plane-stats">Speed: ${plane.speed} | Handling: ${plane.handling} | Health: ${plane.health}</div>
                <div class="plane-unlock">${unlocked ? '✓ UNLOCKED' : `🔒 Unlock: ${plane.price}💰`}</div>
            </div>
        </div>`;
    });
    planesList.innerHTML = html;
}

function selectPlane(planeId) {
    const plane = planes.find(p => p.id === planeId);
    if (plane && plane.unlocked) {
        selectedPlane = planeId;
        updatePlayerStatsFromPlane();
        updatePlanesDisplay();
        saveGame();
    }
}

function unlockPlane(planeId) {
    const plane = planes.find(p => p.id === planeId);
    if (plane && !plane.unlocked && coins >= plane.price) {
        coins -= plane.price;
        plane.unlocked = true;
        updatePlanesDisplay();
        updateCoinDisplay();
        saveGame();
    }
}

function showPlanes() {
    updatePlanesDisplay();
    planesMenu.style.display = 'block';
    homeMenu.style.opacity = '0.5';
}

function closePlanes() {
    planesMenu.style.display = 'none';
    homeMenu.style.opacity = '1';
}

function claimDailyReward() {
    const today = new Date().toDateString();
    if (lastDailyReward !== today) {
        lastDailyReward = today;
        coins += DAILY_REWARD_AMOUNT;
        dailyRewardBtn.classList.add('claimed');
        updateCoinDisplay();
        saveGame();
        playSound('coin');
    } else {
        alert('Daily reward already claimed today!');
    }
}

function enemyKilled(enemy) {
    const basePoints = enemy.points || 50;
    totalScore += basePoints;
    coins += (enemy.coins || 10);
    totalKills++;
    updateMenuScore();
    checkAchievement('firstKill', 1);
    checkAchievement('acePilot', 1);
    checkAchievement('collector', enemy.coins || 10);
    updateCoinDisplay();
    checkAllEnemiesDead();
    playSound('coin');
}

function checkAllEnemiesDead() {
    const activeEnms = enemies.filter(e => e.alive && !e.exploded).length;
    const bossAlive = bossActive && boss && !boss.exploded ? 1 : 0;
    
    // Show "Cleared to Land" message for 4 seconds if all enemies are dead
    if (activeEnms + bossAlive === 0) {
        clearedToLandTimer = CLEARED_TO_LAND_DURATION;
        clearedToLand.style.display = 'block';
    }
}

function updateTargetRunway() {
    const runwayIndex = (currentLevel - 1) % runwayNumbers.length;
    targetRunway = runwayNumbers[runwayIndex];
    if (targetRunwaySpan) targetRunwaySpan.innerText = targetRunway;
}

function addToCombo() {
    currentCombo++;
    if (currentCombo > maxCombo) maxCombo = currentCombo;
    comboMultiplier = 1 + Math.floor(currentCombo / 5) * 0.5;
    comboDecayTimer = COMBO_DECAY_TIME;
}

function resetCombo() {
    currentCombo = 0;
    comboMultiplier = 1;
}

function updateMenuScore() {
    if (menuScore) menuScore.innerText = totalScore;
    if (totalCoinsDisplay) totalCoinsDisplay.innerText = coins;
}

function updateCoinDisplay() {
    coinDisplay.innerHTML = `💰 ${coins}`;
    if (shopCoins) shopCoins.innerText = coins;
    if (totalCoinsDisplay) totalCoinsDisplay.innerText = coins;
}

function showGameOverMenu() {
    isPaused = true;
    if (gameoverScore) gameoverScore.innerText = totalScore;
    if (gameoverKills) gameoverKills.innerText = totalKills;
    if (gameoverCombo) gameoverCombo.innerText = `x${maxCombo}`;
    if (gameoverCoins) gameoverCoins.innerText = coins;
    if (gameoverLevel) gameoverLevel.innerText = currentLevel;

    hud.style.display = 'none';
    radar.style.display = 'none';
    levelStage.style.display = 'none';
    coinDisplay.style.display = 'none';
    shopBtn.style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
    gameoverMenu.style.display = 'block';
    hasSaveData = false;
    continueBtn.style.display = 'none';
    playSound('enginefail');
}

window.restartFromGameOver = function() {
    gameoverMenu.style.display = 'none';
    currentLevel = 1; currentStage = 1; totalScore = 0; totalKills = 0; coins = 0; lives = 3;
    currentCombo = 0; maxCombo = 0;
    player.dead = false; player.exploded = false; player.engineOK = true; player.wingOK = true;
    player.x = 2000; player.y = 3000; player.vx = 0; player.vy = 0;
    player.angle = 0; player.thrust = 4;
    player.gearDown = false; player.wasGearDown = false;
    player.health = playerBaseHealth;
    bullets = []; enemyBullets = []; enemies = []; missiles = []; particles = []; boss = null; bossActive = false;
    missileCount = playerBaseMissiles; activePower = null; powerDuration = 0;
    updateCoinDisplay(); updateMenuScore(); document.getElementById('lives-val').innerText = "❤️".repeat(3);
    hasSaveData = false; continueBtn.style.display = 'none';
    homeMenu.style.display = 'none';
    startGame(false);
}

window.goToHomeFromGameOver = function() {
    gameoverMenu.style.display = 'none';
    homeMenu.style.display = 'flex';
    homeMenu.style.opacity = '1';
    updateMenuScore();
    hasSaveData = false;
    continueBtn.style.display = 'none';
    stopHomeMusic();
    if (soundEnabled) initHomeMusic();
}

function spawnStageEnemies() {
    enemies = [];
    let numEnemies = currentStage === 1 ? 3 : currentStage === 2 ? 4 : currentStage === 3 ? 5 : 6;
    
    // Apply difficulty multiplier to enemy count
    numEnemies = Math.floor(numEnemies * enemyCountMultiplier);
    
    for (let i = 0; i < numEnemies; i++) {
        const typeKeys = ['scout', 'fighter', 'interceptor', 'gunship', 'ace'];
        const typeKey = typeKeys[Math.floor(Math.random() * (currentLevel + 2)) % typeKeys.length];
        const enemyType = enemyShapes[typeKey];

        // Apply difficulty modifiers
        let health = enemyType.health * enemyHealthMultiplier;
        let shootSpeed = enemyType.shootSpeed / enemyAccuracyMultiplier;
        let thrust = enemyType.baseThrust * enemySpeedMultiplier;
        let bulletSpeed = enemyType.bulletSpeed * (difficultyLevel === 'Hard' ? 1.3 : difficultyLevel === 'Easy' ? 0.7 : 1.0);

        enemies.push({
            id: `enemy_${Date.now()}_${i}`,
            x: player.x + 1000 + Math.random() * 2000,
            y: WORLD_GROUND - ENEMY_TARGET_ALTITUDE + (Math.random() * 200 - 100),
            angle: Math.PI,
            thrust: thrust,
            vy: 0, vx: 0,
            engineOK: true, wingOK: true,
            alive: true, crashing: false, exploded: false,
            shootTimer: Math.random() * 60,
            health: health,
            maxHealth: health,
            type: enemyType.name,
            color: enemyType.color,
            radarColor: enemyType.radarColor,
            shootSpeed: shootSpeed,
            bulletSpeed: bulletSpeed,
            points: enemyType.points,
            coins: enemyType.coins,
            hitCount: 0,
            aggressiveness: enemyType.aggressiveness * (difficultyLevel === 'Hard' ? 1.5 : difficultyLevel === 'Easy' ? 0.7 : 1.0),
            drawFunc: enemyType.drawShape,
            typeKey: typeKey,
            wingAngle: 0
        });
    }
    updateStageDisplay();
}

function spawnBoss() {
    if (bossActive) return;
    boss = {
        x: player.x + 3000, y: 2000, angle: Math.PI, thrust: 3.0 * enemySpeedMultiplier,
        vy: 0, vx: 0, engineOK: true, wingOK: true,
        alive: true, crashing: false, exploded: false,
        shootTimer: 0, health: 200 * enemyHealthMultiplier, maxHealth: 200 * enemyHealthMultiplier,
        name: "TRAINER BOSS", color: "#6b7280", size: 2.0,
        shootSpeed: 40 / enemyAccuracyMultiplier, bulletSpeed: 12 * (difficultyLevel === 'Hard' ? 1.3 : difficultyLevel === 'Easy' ? 0.7 : 1.0),
        points: 500, coins: 100,
        shootState: 'cooldown', shootStateTimer: 0,
        wingAngle: 0
    };
    bossActive = true;
    bossSpawned = true;
    bossWarning.style.display = 'block';
    bossHealthContainer.style.display = 'block';
    updateBossHealthBar();
    playSound('bossSpawn');
    setTimeout(() => { bossWarning.style.display = 'none'; }, 3000);
}

function spawnEnemies() {
    if (currentStage === 5) spawnBoss();
    else spawnStageEnemies();
}

function updateBossHealthBar() {
    if (bossActive && boss) {
        const percent = (boss.health / boss.maxHealth) * 100;
        bossHealthFill.style.width = percent + '%';
        bossHealthText.innerText = `BOSS HEALTH ${Math.floor(percent)}%`;
    }
}

function updateStageDisplay() {
    levelStage.style.display = 'block';
    levelStage.innerHTML = `🌍 LEVEL ${currentLevel} | STAGE ${currentStage}/5`;
    document.getElementById('lvl').innerText = currentLevel;
}

window.openPowerShop = function() {
    if (isPaused) return;
    isPaused = true;
    let html = '';
    powerItems.forEach(item => {
        const canBuy = coins >= item.price && currentLevel >= item.levelReq;
        html += `<div class="shop-item ${canBuy ? '' : 'disabled'}" onclick="buyPower('${item.id}')">
            <h3>${item.icon} ${item.name}</h3>
            <div class="price">💰 ${item.price}</div>
            <div class="description">${item.description}</div>
            <div class="level-req">Level Req: ${item.levelReq}</div>
        </div>`;
    });
    shopItemsContainer.innerHTML = html;
    shopCoins.innerText = coins;
    powerShopMenu.style.display = 'block';
}

window.closePowerShop = function() {
    powerShopMenu.style.display = 'none';
    isPaused = false;
}

window.buyPower = function(powerId) {
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
        playSound('powerup');
    }
}

function updatePowerDisplay() {
    const powerStat = document.getElementById('powerStat');
    if (activePower) {
        const power = powerItems.find(p => p.id === activePower);
        powerStat.innerText = power ? power.name : 'ACTIVE';
    } else powerStat.innerText = 'NONE';
}

function updatePowers() {
    if (activePower && powerDuration > 0) {
        powerDuration--;
        if (activePower === 'timeSlow') enemySpeedMultiplier = 0.3;
    } else if (activePower) {
        if (activePower === 'timeSlow') enemySpeedMultiplier = originalEnemySpeedMultiplier;
        if (activePower === 'homingMissiles') powerMissileCount = 0;
        activePower = null;
        updatePowerDisplay();
    }
}

function showStageComplete() {
    isPaused = true;
    player.health = player.baseHealth;
    missileCount = playerBaseMissiles;
    const stageBonus = 50 + (currentStage * 10);
    coins += stageBonus;
    checkAchievement('survivor', 1);
    updateCoinDisplay();
    updateMenuScore();
    document.getElementById('p-health').innerText = player.health + "%";
    stageCompleteText.innerHTML = `Stage ${currentStage} Complete! +${stageBonus}💰`;
    let nextStage = currentStage + 1;
    if (nextStage > STAGES_PER_LEVEL) nextStage = 1;
    nextStageNumber.innerText = nextStage;
    stageCompleteMenu.style.display = 'block';
    saveGame();
    playSound('repair');
}

window.continueToNextStage = function() {
    stageCompleteMenu.style.display = 'none';
    currentStage++;
    if (currentStage > STAGES_PER_LEVEL) { currentLevel++; currentStage = 1; }
    updateStageDisplay();
    player.x = 2000; player.y = 3000; player.vx = 0; player.vy = 0;
    player.angle = 0; player.thrust = 4;
    player.gearDown = false;
    enemies = []; boss = null; bossActive = false; bossHealthContainer.style.display = 'none';
    activePower = null; powerDuration = 0; updatePowerDisplay();
    updateTargetRunway();
    spawnEnemies();
    isPaused = false;
    saveGame();
}

window.returnToHome = function() {
    stageCompleteMenu.style.display = 'none';
    homeMenu.style.display = 'flex';
    homeMenu.style.opacity = '1';
    hud.style.display = 'none'; radar.style.display = 'none'; levelStage.style.display = 'none';
    coinDisplay.style.display = 'none'; shopBtn.style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
    isPaused = true;
    stopHomeMusic();
    if (soundEnabled) initHomeMusic();
    saveGame();
}

function saveGame() {
    const saveData = {
        currentLevel, currentStage, totalScore, totalKills, coins, maxCombo, lives,
        lastDailyReward, selectedPlane, planes: planes.map(p => p.unlocked),
        achievements, soundEnabled, musicVolume, sfxVolume, sensitivityLevel, difficultyLevel,
        playerX: player.x, playerY: player.y, playerHealth: player.health,
        playerThrust: player.thrust, missileCount, autoShootEnabled
    };
    localStorage.setItem('rfsSaveData', JSON.stringify(saveData));
    if (!player.dead && lives > 0 && homeMenu.style.display === 'none') {
        hasSaveData = true;
        continueBtn.style.display = 'inline-block';
    }
}

function loadGame() {
    const savedData = localStorage.getItem('rfsSaveData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.lives <= 0) return false;
            currentLevel = data.currentLevel || 1;
            currentStage = data.currentStage || 1;
            totalScore = data.totalScore || 0;
            totalKills = data.totalKills || 0;
            coins = data.coins || 0;
            maxCombo = data.maxCombo || 0;
            lives = data.lives || 3;
            lastDailyReward = data.lastDailyReward || null;
            selectedPlane = data.selectedPlane || 'trainer';
            soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
            musicVolume = data.musicVolume || 70;
            sfxVolume = data.sfxVolume || 80;
            sensitivityLevel = data.sensitivityLevel || 'Normal';
            difficultyLevel = data.difficultyLevel || 'Normal';
            autoShootEnabled = data.autoShootEnabled || false;

            if (data.planes) {
                data.planes.forEach((unlocked, index) => { if (index < planes.length) planes[index].unlocked = unlocked; });
            }
            if (data.achievements) {
                data.achievements.forEach((ach, index) => { if (index < achievements.length) achievements[index] = ach; });
            }

            document.getElementById('sensitivity-value').innerText = sensitivityLevel;
            document.getElementById('difficulty-value').innerText = difficultyLevel;

            updateCoinDisplay();
            updateMenuScore();
            updatePlayerStatsFromPlane();

            if (player) {
                player.x = data.playerX || 2000;
                player.y = data.playerY || 3000;
                player.health = data.playerHealth || playerBaseHealth;
                player.thrust = data.playerThrust || 4;
                missileCount = data.missileCount || 6;
            }

            if (lastDailyReward === new Date().toDateString()) dailyRewardBtn.classList.add('claimed');
            document.getElementById('lives-val').innerText = "❤️".repeat(lives);
            
            // Refresh UI with loaded settings
            refreshGameState();
            return true;
        } catch (e) { return false; }
    }
    return false;
}

window.continueGame = function() {
    const loaded = loadGame();
    if (loaded) startGame(true);
    else { alert('No saved game found. Starting new game.'); startGame(false); }
};

window.startGame = function(isContinue = false) {
    initAudio();
    if (audioCtx?.state === 'suspended' && soundEnabled) audioCtx.resume();
    stopHomeMusic();
    updatePlayerStatsFromPlane();

    homeMenu.style.display = 'none';
    gameoverMenu.style.display = 'none';
    hud.style.display = 'block';
    radar.style.display = 'block';
    levelStage.style.display = 'block';
    coinDisplay.style.display = 'block';
    shopBtn.style.display = 'block';
    
    // Auto-shoot button is hidden - only in settings
    document.getElementById('auto-shoot-toggle').style.display = 'none';
    
    // Mobile controls only on small screens
    if (window.innerWidth <= 768) {
        document.getElementById('mobile-controls').style.display = 'block';
    } else {
        document.getElementById('mobile-controls').style.display = 'none';
    }

    if (!isContinue) {
        player.x = 2000; player.y = 3000; player.vx = 0; player.vy = 0; player.angle = 0;
        player.thrust = 4;
        player.gearDown = false; player.wasGearDown = false; player.dead = false;
        player.exploded = false; player.engineOK = true; player.wingOK = true;
        player.health = playerBaseHealth;

        bullets = []; enemyBullets = []; enemies = []; missiles = []; particles = []; boss = null; bossActive = false;
        missileCount = playerBaseMissiles; activePower = null; powerDuration = 0; powerMissileCount = 0;
        currentStage = 1; currentCombo = 0;
        hasSaveData = false; continueBtn.style.display = 'none';
        localStorage.removeItem('rfsSaveData');
        updateTargetRunway();
    } else {
        if (!player) { /* already set */ }
        if (player.health <= 0) player.health = playerBaseHealth;
        bullets = []; enemyBullets = []; enemies = []; missiles = [];
        if (missileCount === undefined || missileCount < 0) missileCount = playerBaseMissiles;
        updateTargetRunway();
    }

    updatePowerDisplay();
    updateMenuScore();

    isPaused = false;
    frame = 0;

    bossHealthContainer.style.display = 'none';
    bossWarning.style.display = 'none';
    stageCompleteMenu.style.display = 'none';
    powerShopMenu.style.display = 'none';
    clearedToLand.style.display = 'none';
    clearedToLandTimer = 0;

    if (window.innerWidth <= 768) hud.style.display = 'none';

    spawnEnemies();

    // Initialize engine sound
    try {
        if (engineSound) engineSound.stop();
        if (audioCtx && soundEnabled) {
            const noiseBuffer = createNoiseBuffer();
            if (noiseBuffer) {
                engineSound = audioCtx.createBufferSource();
                engineSound.buffer = noiseBuffer;
                engineSound.loop = true;
                engineFilter = audioCtx.createBiquadFilter();
                engineFilter.type = 'lowpass';
                engineFilter.frequency.value = 250;
                engineFilter.Q.value = 0.7;
                engineGain = audioCtx.createGain();
                engineGain.gain.value = 0.05;
                engineSound.connect(engineFilter);
                engineFilter.connect(engineGain);
                engineGain.connect(audioCtx.destination);
                engineSound.start();
            }
        }
    } catch (e) { console.log('Audio not supported'); }
    
    // Refresh game state
    refreshGameState();
};

// Main update function
function update() {
    if (player.dead || isPaused) {
        if (engineGain) engineGain.gain.value = 0;
        return;
    }

    updateWeather();

    // Update cleared to land message timer
    if (clearedToLandTimer > 0) {
        clearedToLandTimer--;
        if (clearedToLandTimer <= 0) {
            clearedToLand.style.display = 'none';
        }
    }

    // Update wing animation phase
    wingFlapPhase += 0.05;
    
    // Store previous thrust for engine sound change detection
    previousThrust = player.thrust;

    if (currentCombo > 0) {
        comboDecayTimer--;
        if (comboDecayTimer <= 0) resetCombo();
    }

    updatePowers();

    if (player.gearDown !== player.wasGearDown) player.wasGearDown = player.gearDown;

    let pitch = Math.sin(player.angle);
    if (player.engineOK) {
        let thrustChange = playerAcceleration;
        if (sensitivityLevel === 'Low') thrustChange = 0.05;
        else if (sensitivityLevel === 'High') thrustChange = 0.15;

        if (keys['ArrowRight']) {
            player.thrust = Math.min(player.thrust + thrustChange, playerMaxThrust);
        }
        if (keys['ArrowLeft']) {
            player.thrust = Math.max(player.thrust - thrustChange, 0);
        }
    } else player.thrust *= 0.99;

    // Update engine sound based on current thrust
    updateEngineSound();

    let pitchChange = playerManeuverability;
    if (sensitivityLevel === 'Low') pitchChange = 0.02;
    else if (sensitivityLevel === 'High') pitchChange = 0.05;

    if (keys['ArrowUp']) player.angle -= pitchChange;
    if (keys['ArrowDown']) player.angle += pitchChange;
    if (!player.wingOK) player.angle += 0.04;

    // FIXED: 360 DEGREE ROTATION - removed angle limits for full rotation
    // Allow full 360-degree rotation by removing the maxAngle constraints
    // Keep angle within -PI to PI range for proper physics
    if (player.angle > Math.PI) player.angle -= Math.PI * 2;
    if (player.angle < -Math.PI) player.angle += Math.PI * 2;

    let lift = 0.24;
    if (player.gearDown) lift *= 0.7;

    player.vy += GRAVITY - Math.sin(-player.angle) * player.thrust * lift;

    player.vx = Math.cos(player.angle) * player.thrust;
    player.vy = player.vy;

    player.x += player.vx;
    player.y += player.vy;
    player.vy *= 0.98;

    camera.x = player.x - canvas.width / 2.8;
    camera.y = player.y - canvas.height / 2.5;

    const vsFPM = Math.floor(player.vy * 600);
    const speedKn = Math.floor(player.thrust * 18);
    const onRunway = runwayRanges.some(range => player.x > range[0] && player.x < range[1]);
    const overRunway = onRunway;
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
    if (overRunway && (activeEnms + bossAlive) > 0) { 
        eng.innerText = "CLEAR AIRSPACE!"; 
        eng.className = "value warning"; 
    } else { 
        eng.innerText = player.engineOK ? "OK" : "FAIL"; 
        eng.className = player.engineOK ? "value" : "value warning"; 
    }

    document.getElementById('p-health').innerText = player.health + "%";
    document.getElementById('gearStat').innerText = player.gearDown ? "DOWN" : "UP";
    
    // FIXED: Gear animation - ensure smooth transition
    if (player.gearDown) {
        player.gearAnim = Math.min(1, player.gearAnim + 0.02);
    } else {
        player.gearAnim = Math.max(0, player.gearAnim - 0.02);
    }

    // ILS
    let closestTarget = null;
    let minDist = Infinity;
    runwayStarts.forEach(start => {
        const dist = start - player.x;
        if (dist > -12000 && dist < 5500) {
            let d = Math.abs(dist);
            if (d < minDist) { minDist = d; closestTarget = start; }
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

    // Shooting - with auto-shoot support (mobile only)
    let shootDelay = activePower === 'rapidFire' ? 3 : 8;
    
    // Auto-shoot only works on mobile and is controlled by settings
    let shouldShoot = false;
    if (window.innerWidth <= 768) {
        shouldShoot = (keys['Space'] || autoShootEnabled) && frame % shootDelay === 0;
    } else {
        shouldShoot = keys['Space'] && frame % shootDelay === 0;
    }
    
    if (shouldShoot) {
        playSound('shoot');
        let damageMultiplier = activePower === 'doubleDamage' ? 2 : 1;
        let damage = 15 * damageMultiplier;
        bullets.push({
            x: player.x, y: player.y,
            vx: Math.cos(player.angle) * 90 + player.vx,
            vy: Math.sin(player.angle) * 90 + player.vy,
            angle: player.angle, damage: damage, life: 30, tracer: true
        });
    }

    // Missiles
    if (keys['KeyM'] && frame % 20 === 0 && missileCount > 0) {
        playSound('missile');
        const launchOffsetX = -15; const launchOffsetY = 30;
        const cos = Math.cos(player.angle); const sin = Math.sin(player.angle);
        const launchX = player.x + (launchOffsetX * cos - launchOffsetY * sin);
        const launchY = player.y + (launchOffsetX * sin + launchOffsetY * cos);

        let target = null; let minD = Infinity;
        if (bossActive && boss && boss.alive && !boss.exploded) { minD = Math.hypot(boss.x - player.x, boss.y - player.y); target = boss; }
        enemies.forEach(e => {
            if (e.alive && !e.exploded) {
                let d = Math.hypot(e.x - player.x, e.y - player.y);
                if (d < minD) { minD = d; target = e; }
            }
        });

        if (target) {
            missiles.push({
                x: launchX, y: launchY, angle: player.angle, target: target,
                speed: 22, vx: Math.cos(player.angle) * 22 + player.vx,
                vy: Math.sin(player.angle) * 22 + player.vy, smokeTrail: [],
                age: 0, isHoming: activePower === 'homingMissiles' || powerMissileCount > 0
            });
            for (let i = 0; i < 8; i++) {
                particles.push({ x: launchX, y: launchY, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 0.8, color: "#94a3b8" });
            }
            missileCount--;
            if (powerMissileCount > 0) {
                powerMissileCount--;
                if (powerMissileCount === 0) { activePower = null; updatePowerDisplay(); }
            }
        }
    }

    // Update missiles
    missiles.forEach((m, mi) => {
        if (frame % 3 === 0) {
            m.smokeTrail.push({ x: m.x, y: m.y, life: 1.0 });
            if (m.smokeTrail.length > 15) m.smokeTrail.shift();
        }
        m.age++;

        if (m.target && m.target.alive && !m.target.exploded) {
            const dx = m.target.x - m.x; const dy = m.target.y - m.y;
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

        m.x += m.vx; m.y += m.vy;

        // Missile hit detection
        if (bossActive && boss && boss.alive && !boss.exploded && Math.hypot(m.x - boss.x, m.y - boss.y) < 60) {
            createBlast(m.x, m.y, boss.color, 30);
            let damage = (activePower === 'doubleDamage' ? 50 : 35);
            boss.health -= damage; playSound('bossHit'); updateBossHealthBar();
            if (boss.health <= 0) {
                createBlast(boss.x, boss.y, "#ffaa00", 80);
                playSound('bossDie');
                totalScore += boss.points; coins += boss.coins;
                updateCoinDisplay(); updateMenuScore(); playSound('coin');
                checkAchievement('bossSlayer', 1);
                currentStage = 1; currentLevel++;
                bossActive = false; bossHealthContainer.style.display = 'none';
                updateStageDisplay(); spawnEnemies(); saveGame();
                checkAllEnemiesDead();
            }
            missiles.splice(mi, 1); return;
        }

        enemies.forEach(e => {
            if (e.alive && !e.exploded && Math.hypot(m.x - e.x, m.y - e.y) < 40) {
                createBlast(m.x, m.y, "#ff4500", 25);
                let damage = (activePower === 'doubleDamage' ? 50 : 35);
                e.health -= damage; e.hitCount++;
                if (e.health <= 0) { e.exploded = true; enemyKilled(e); }
                else { playSound('hit'); }
                missiles.splice(mi, 1);
            }
        });

        if (m.age > 300) missiles.splice(mi, 1);
    });

    missiles.forEach(m => {
        m.smokeTrail.forEach(smoke => smoke.life -= 0.02);
        m.smokeTrail = m.smokeTrail.filter(s => s.life > 0);
    });

    // ENHANCED ENEMY AI - with difficulty modifiers
    enemies.forEach(e => {
        if (!e.alive || e.exploded) return;
        
        // Update wing animation for this enemy
        e.wingAngle = Math.sin(wingFlapPhase * 2 + e.id) * 0.3;
        
        if (e.crashing) {
            e.angle += 0.15; e.vy += GRAVITY; e.x += e.vx; e.y += e.vy;
            if (e.y >= WORLD_GROUND) { e.exploded = true; createBlast(e.x, e.y, "#ffaa00", 40); }
        } else {
            // Calculate distance to player
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const distance = Math.hypot(dx, dy);
            
            // Aggressive pursuit - enemies will chase player relentlessly
            const targetAngle = Math.atan2(dy, dx);
            
            // Add some randomness based on enemy type aggressiveness and difficulty
            const aggressiveness = e.aggressiveness || 1.0;
            const randomFactor = 0.1 * (1 - aggressiveness);
            
            e.angle += (targetAngle - e.angle) * 0.03 * aggressiveness + (Math.random() - 0.5) * randomFactor;
            
            // Move towards player
            e.x += Math.cos(e.angle) * e.thrust;
            e.y += Math.sin(e.angle) * e.thrust;
            
            // Maintain altitude preference
            const targetAlt = WORLD_GROUND - ENEMY_TARGET_ALTITUDE;
            const altDiff = targetAlt - e.y;
            if (Math.abs(altDiff) > 200) {
                e.y += Math.sign(altDiff) * 0.8;
            }
            
            // Shooting - more aggressive when closer
            e.shootTimer++;
            let shootThreshold = e.shootSpeed;
            
            // Adjust shooting based on distance - shoot more often when closer
            if (distance < 800) {
                shootThreshold *= 0.5;
            } else if (distance < 1500) {
                shootThreshold *= 0.8;
            }
            
            if (e.shootTimer > shootThreshold) {
                playSound('enemyShoot');
                let bulletSpeed = e.bulletSpeed;
                
                // Lead the target slightly
                const predictedX = player.x + player.vx * 10;
                const predictedY = player.y + player.vy * 10;
                const bulletAngle = Math.atan2(predictedY - e.y, predictedX - e.x);
                
                enemyBullets.push({ 
                    x: e.x, y: e.y, 
                    vx: Math.cos(bulletAngle) * bulletSpeed, 
                    vy: Math.sin(bulletAngle) * bulletSpeed, 
                    angle: bulletAngle 
                });
                e.shootTimer = 0;
            }
        }

        // Bullet hit detection
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (Math.hypot(b.x - e.x, b.y - e.y) < 30) {
                if (activePower === 'shield') { bullets.splice(i, 1); continue; }
                let damage = b.damage || 15;
                e.health -= damage; e.hitCount++;
                
                // Small hit spark particles
                for (let j = 0; j < 5; j++) {
                    particles.push({ 
                        x: e.x, y: e.y, 
                        vx: (Math.random() - 0.5) * 5, 
                        vy: (Math.random() - 0.5) * 5, 
                        life: 0.3, 
                        color: '#ffaa00',
                        size: 2 
                    });
                }
                
                if (e.health <= 0) { 
                    e.exploded = true; 
                    createBlast(e.x, e.y, e.color, 30);
                    enemyKilled(e); 
                } else {
                    playSound('hit');
                }
                bullets.splice(i, 1);
            }
        }
    });

    // Boss AI
    if (bossActive && boss) {
        boss.wingAngle = Math.sin(wingFlapPhase) * 0.4;
        boss.shootTimer++;
        if (boss.shootTimer > boss.shootSpeed) {
            playSound('enemyShoot');
            // Boss shoots multiple bullets based on difficulty
            let bulletCount = difficultyLevel === 'Hard' ? 3 : difficultyLevel === 'Easy' ? 1 : 2;
            for (let i = 0; i < bulletCount; i++) {
                const spreadAngle = boss.angle + (i - (bulletCount-1)/2) * 0.15;
                enemyBullets.push({ 
                    x: boss.x, y: boss.y, 
                    vx: Math.cos(spreadAngle) * boss.bulletSpeed, 
                    vy: Math.sin(spreadAngle) * boss.bulletSpeed, 
                    angle: spreadAngle 
                });
            }
            boss.shootTimer = 0;
        }
        const dx = player.x - boss.x; const dy = player.y - boss.y;
        boss.angle = Math.atan2(dy, dx);
        boss.x += Math.cos(boss.angle) * boss.thrust;
        boss.y += Math.sin(boss.angle) * boss.thrust;
    }

    // FIXED: Landing logic with smooth angle return
    if (player.y > WORLD_GROUND - 28) {
        if (overRunway && player.gearDown) {
            if ((activeEnms + (bossActive ? 1 : 0)) > 0) {
                showFailedMenu("HOSTILES REMAINING", "You cannot land while enemy aircraft are in the area!");
                playSound('crash'); triggerCrashSequence();
            } else if (Math.abs(vsFPM) > 1200 || Math.abs(noseDeg) > 35) {
                playSound('crash'); triggerCrashSequence();
            } else {
                player.y = WORLD_GROUND - 28; 
                player.vy *= 0.1;
                if (player.thrust > 2) player.thrust *= 0.98;
                
                // Smoothly return angle to level
                player.angle = player.angle * 0.95;
                if (Math.abs(player.angle) < 0.05) player.angle = 0;
                
                if (frame % 5 === 0) {
                    for (let i = 0; i < 3; i++) {
                        particles.push({ x: player.x - 50 + Math.random() * 100, y: player.y + 10, vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2, life: 0.8, color: '#fbbf24', size: 2 + Math.random() * 3 });
                    }
                }
                playSound('land');
                if (speedKn < 3) {
                    player.thrust = 0;
                    player.angle = 0; // Set angle to zero on complete stop
                    if (currentStage < 5) showStageComplete();
                    else { checkPerfectLanding(); showSuccessMenu(Math.abs(vsFPM)); }
                }
            }
        } else { playSound('crash'); triggerCrashSequence(); }
    } else if (overRunway && player.gearDown && player.y > WORLD_GROUND - 100) {
        player.vy *= 0.95; 
        player.angle *= 0.98;
    }

    // Boss bullet hit detection
    if (bossActive && boss && boss.alive && !boss.exploded) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (Math.hypot(b.x - boss.x, b.y - boss.y) < 60) {
                createBlast(b.x, b.y, boss.color, 15);
                let damage = b.damage || 15;
                boss.health -= damage; playSound('bossHit'); updateBossHealthBar();
                if (boss.health <= 0) {
                    createBlast(boss.x, boss.y, "#ffaa00", 80);
                    playSound('bossDie');
                    totalScore += boss.points; coins += boss.coins;
                    updateCoinDisplay(); updateMenuScore(); playSound('coin');
                    checkAchievement('bossSlayer', 1);
                    currentStage = 1; currentLevel++;
                    bossActive = false; bossHealthContainer.style.display = 'none';
                    updateStageDisplay(); spawnEnemies(); saveGame();
                    checkAllEnemiesDead();
                }
                bullets.splice(i, 1);
            }
        }
    }

    // Player hit detection
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const b = enemyBullets[i];
        if (Math.hypot(b.x - player.x, b.y - player.y) < 30) {
            if (activePower === 'shield') { enemyBullets.splice(i, 1); continue; }
            playSound('hit');
            let damage = 10;
            if (difficultyLevel === 'Easy') damage = 5;
            else if (difficultyLevel === 'Hard') damage = 15;
            player.health -= damage;
            for (let j = 0; j < 5; j++) { particles.push({ x: player.x, y: player.y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 0.5, color: '#ff0000' }); }
            if (player.health <= 0) triggerCrashSequence();
            enemyBullets.splice(i, 1);
        }
    }

    // Update bullets
    bullets.forEach(b => { b.x += b.vx; b.y += b.vy; if (b.life) b.life--; });
    bullets = bullets.filter(b => !b.life || b.life > 0);
    enemyBullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
    particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.02; return p.life > 0; });

    if (player.engineOK && soundEnabled && engineGain && engineFilter) {
        engineFilter.frequency.value = 250 + player.thrust * 60;
        engineGain.gain.value = (0.05 + player.thrust * 0.02) * (musicVolume / 100);
    } else if (engineGain) engineGain.gain.value = 0;
}

function checkPerfectLanding() {
    if (player.y > WORLD_GROUND - 28) {
        const sinkRate = Math.abs(player.vy * 600);
        if (sinkRate < 100) checkAchievement('perfectLanding', 1);
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
        document.getElementById('success-stats').innerText = `Hostiles still in airspace: ${remaining + bossRemaining}`;
        document.getElementById('next-btn').style.display = 'none';
        successMenu.style.borderColor = "#f87171";
        successMenu.style.display = 'block';
    } else {
        const rating = vs < 300 ? "PERFECT TOUCHDOWN!" : "LANDING SUCCESSFUL";
        document.getElementById('success-title').innerText = rating;
        document.getElementById('success-title').style.color = "#22c55e";
        const levelBonus = 100 * currentLevel;
        coins += levelBonus;
        document.getElementById('success-stats').innerHTML = `Final Sink Rate: -${vs} FPM\nComplete!\nScore: ${totalScore}\nKills: ${totalKills}\nCoins: ${coins}\n+${levelBonus} Level Bonus!`;
        document.getElementById('next-btn').style.display = 'inline-block';
        successMenu.style.borderColor = "#fbbf24";
        successMenu.style.display = 'block';
        playSound('repair');
        updateMenuScore();
        updateCoinDisplay();
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

function triggerCrashSequence() {
    if (player.exploded) return;
    player.exploded = true; player.dead = true;
    playRealisticCrash();
    createBlast(player.x, player.y, "#ffaa00", 60);
    lives--;
    document.getElementById('lives-val').innerText = "❤️".repeat(Math.max(0, lives));
    if (lives <= 0) setTimeout(() => { showGameOverMenu(); }, 2500);
    else setTimeout(() => { respawnPlayer(); }, 2500);
}

function respawnPlayer() {
    player.dead = false; player.exploded = false; player.engineOK = true; player.wingOK = true;
    player.x = 2000; player.y = 3000; player.vx = 0; player.vy = 0;
    player.angle = 0; player.thrust = 4;
    player.gearDown = false; player.wasGearDown = false;
    player.health = playerBaseHealth;
    bullets = []; enemyBullets = []; missiles = []; missileCount = playerBaseMissiles;
    activePower = null; powerDuration = 0; updatePowerDisplay();
    bossActive = false; boss = null; bossHealthContainer.style.display = 'none';
    spawnEnemies();
}

// ===== ENHANCED 2D PLANE DRAWING - WITH EXTRA LARGE LANDING GEAR WHEELS (FRONT AND BACK) =====
// AND MORE REALISTIC PLANE APPEARANCE WITH AUTHENTIC WINGS
function drawPlane(p, isPlayer) {
    if (p.exploded) return;
    
    if (!isPlayer && p.drawFunc) {
        // For enemies, use the enhanced draw function with wing angle
        const wingAngle = p.wingAngle || 0;
        p.drawFunc(ctx, p.x - camera.x, p.y - camera.y, p.angle, 0.8, wingAngle);
        return;
    }
    
    ctx.save();
    ctx.translate(p.x - camera.x, p.y - camera.y);
    ctx.rotate(p.angle);

    let scale = 1;
    if (!isPlayer && p.size) scale = p.size;

    const planeScale = isPlayer ? 0.5 : 0.8;
    const alt = WORLD_GROUND - p.y;

    if (alt < 800 && alt > 0) {
        ctx.save();
        ctx.rotate(-p.angle);
        ctx.fillStyle = `rgba(0,0,0,${0.2 * (1 - alt / 800)})`;
        ctx.beginPath();
        ctx.ellipse(0, alt / scale, 40 * planeScale, 10 * planeScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // engine glow
    if (p.engineOK && !p.crashing) {
        const f = Math.random() * 5;
        const g = ctx.createRadialGradient(-55 * planeScale, 0, 0, -55 * planeScale, 0, (15 + f) * planeScale);
        g.addColorStop(0, "rgba(255,255,255,0.8)");
        g.addColorStop(0.4, "rgba(56,189,248,0.6)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(-55 * planeScale, 0, (15 + f) * planeScale, 0, Math.PI * 2);
        ctx.fill();
    }

    // REALISTIC 2D PLANE DRAWING - More authentic aircraft appearance
    
    // Main fuselage - sleeker and more realistic
    ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
    ctx.beginPath();
    ctx.moveTo(-55 * planeScale, -6 * planeScale);
    ctx.lineTo(25 * planeScale, -6 * planeScale);
    ctx.quadraticCurveTo(45 * planeScale, -6 * planeScale, 60 * planeScale, 0);
    ctx.quadraticCurveTo(45 * planeScale, 6 * planeScale, 25 * planeScale, 6 * planeScale);
    ctx.lineTo(-55 * planeScale, 6 * planeScale);
    ctx.quadraticCurveTo(-65 * planeScale, 4 * planeScale, -65 * planeScale, 0);
    ctx.quadraticCurveTo(-65 * planeScale, -4 * planeScale, -55 * planeScale, -6 * planeScale);
    ctx.closePath();
    ctx.fill();

    // Wing root fairing (where wing meets fuselage)
    ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
    ctx.beginPath();
    ctx.ellipse(15 * planeScale, 0, 15 * planeScale, 5 * planeScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Calculate wing movement based on pitch for more realistic animation
    const wingMovement = isPlayer ? Math.sin(player.angle) * 0.5 : (p.wingAngle || 0);
    
    // REALISTIC LEFT WING (main wing) - more authentic shape with dihedral
    ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
    ctx.save();
    ctx.translate(20 * planeScale, -2 * planeScale);
    ctx.rotate(wingMovement * 0.3); // Slight flex for realism
    
    // Main wing with proper taper
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(35 * planeScale, -30 * planeScale); // Leading edge
    ctx.lineTo(45 * planeScale, -28 * planeScale); // Wingtip
    ctx.lineTo(25 * planeScale, 0); // Trailing edge
    ctx.closePath();
    ctx.fill();
    
    // Wing details (flaps/ailerons)
    ctx.fillStyle = isPlayer ? "#334155" : "#1e293b";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(10 * planeScale, -10 * planeScale);
    ctx.lineTo(30 * planeScale, -20 * planeScale);
    ctx.lineTo(32 * planeScale, -18 * planeScale);
    ctx.lineTo(12 * planeScale, -8 * planeScale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // REALISTIC RIGHT WING (main wing) - more authentic shape with dihedral
    ctx.save();
    ctx.translate(20 * planeScale, 2 * planeScale);
    ctx.rotate(-wingMovement * 0.3); // Opposite flex for realism
    
    ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(35 * planeScale, 30 * planeScale); // Leading edge
    ctx.lineTo(45 * planeScale, 28 * planeScale); // Wingtip
    ctx.lineTo(25 * planeScale, 0); // Trailing edge
    ctx.closePath();
    ctx.fill();
    
    // Wing details (flaps/ailerons)
    ctx.fillStyle = isPlayer ? "#334155" : "#1e293b";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(10 * planeScale, 10 * planeScale);
    ctx.lineTo(30 * planeScale, 20 * planeScale);
    ctx.lineTo(32 * planeScale, 18 * planeScale);
    ctx.lineTo(12 * planeScale, 8 * planeScale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    ctx.globalAlpha = 1;

    // Cockpit - more realistic with framing
    ctx.fillStyle = "#0ea5e9";
    ctx.beginPath();
    ctx.ellipse(30 * planeScale, -3 * planeScale, 10 * planeScale, 5 * planeScale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cockpit frame
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5 * planeScale;
    ctx.beginPath();
    ctx.ellipse(30 * planeScale, -3 * planeScale, 10 * planeScale, 5 * planeScale, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Windshield divider
    ctx.beginPath();
    ctx.moveTo(30 * planeScale, -8 * planeScale);
    ctx.lineTo(30 * planeScale, 2 * planeScale);
    ctx.stroke();

    // REALISTIC HORIZONTAL STABILIZERS (tail wings) - more authentic
    ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
    
    // Left horizontal stabilizer
    ctx.save();
    ctx.translate(-25 * planeScale, -2 * planeScale);
    ctx.rotate(wingMovement * 0.2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15 * planeScale, -15 * planeScale);
    ctx.lineTo(-5 * planeScale, -15 * planeScale);
    ctx.lineTo(5 * planeScale, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Right horizontal stabilizer
    ctx.save();
    ctx.translate(-25 * planeScale, 2 * planeScale);
    ctx.rotate(-wingMovement * 0.2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15 * planeScale, 15 * planeScale);
    ctx.lineTo(-5 * planeScale, 15 * planeScale);
    ctx.lineTo(5 * planeScale, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Vertical stabilizer (tail fin) - more realistic
    ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
    ctx.beginPath();
    ctx.moveTo(-20 * planeScale, -2 * planeScale);
    ctx.lineTo(-40 * planeScale, -18 * planeScale);
    ctx.lineTo(-25 * planeScale, -16 * planeScale);
    ctx.lineTo(-15 * planeScale, -2 * planeScale);
    ctx.closePath();
    ctx.fill();

    // FIXED: EXTRA LARGE LANDING GEAR WITH WHEELS (front and back)
    if (isPlayer) {
        // Always draw gear when gearAnim > 0 (gear is down or in transition)
        // This makes the gear visible even during animation
        const gearExtend = player.gearAnim;
        
        if (gearExtend > 0) {
            // FRONT LANDING GEAR (under cockpit/nose) - EXTRA LARGE
            ctx.save();
            ctx.translate(25 * planeScale, 5 * planeScale);
            
            // Thick strut
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 4 * planeScale;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 15 * planeScale * gearExtend);
            ctx.stroke();
            
            // Large wheel - extra large
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.ellipse(0, 15 * planeScale * gearExtend, 7 * planeScale, 4 * planeScale, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Bright wheel hub
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.arc(0, 15 * planeScale * gearExtend, 3.5 * planeScale, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            
            // BACK LANDING GEAR (under tail) - EXTRA LARGE
            ctx.save();
            ctx.translate(-35 * planeScale, 5 * planeScale);
            
            // Thick strut
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 4 * planeScale;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 15 * planeScale * gearExtend);
            ctx.stroke();
            
            // Large wheel - extra large
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.ellipse(0, 15 * planeScale * gearExtend, 7 * planeScale, 4 * planeScale, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Bright wheel hub
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.arc(0, 15 * planeScale * gearExtend, 3.5 * planeScale, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    ctx.restore();
}

function drawScenery() {
    const groundY = WORLD_GROUND - camera.y;
    scenery.forEach(s => {
        const sx = s.x - camera.x;
        if (sx > -200 && sx < canvas.width + 200) {
            const baseY = groundY - s.height;
            if (s.type === 'tree') {
                ctx.fillStyle = s.trunkColor;
                ctx.fillRect(sx - 2, baseY + s.height * 0.3, 4, s.height * 0.7);
                ctx.fillStyle = s.leafColor;
                ctx.beginPath();
                ctx.arc(sx, baseY, s.height * 0.2, 0, Math.PI * 2);
                ctx.fill();
            } else if (s.type === 'house') {
                // Draw house body
                ctx.fillStyle = s.color;
                ctx.fillRect(sx - s.width/2, baseY + s.height * 0.3, s.width, s.height * 0.7);
                
                // Draw roof
                ctx.fillStyle = s.roofColor;
                ctx.beginPath();
                ctx.moveTo(sx - s.width/2 - 5, baseY + s.height * 0.3);
                ctx.lineTo(sx, baseY);
                ctx.lineTo(sx + s.width/2 + 5, baseY + s.height * 0.3);
                ctx.closePath();
                ctx.fill();
                
                // Draw door
                ctx.fillStyle = s.doorColor || '#4a2e1e';
                ctx.fillRect(sx - 5, baseY + s.height * 0.6, 10, s.height * 0.4);
                
                // Draw window
                ctx.fillStyle = s.windowColor || '#60a5fa';
                ctx.fillRect(sx - 12, baseY + s.height * 0.4, 8, 8);
                ctx.fillRect(sx + 4, baseY + s.height * 0.4, 8, 8);
            } else if (s.type === 'building') {
                // Draw building
                ctx.fillStyle = s.color;
                ctx.fillRect(sx - s.width/2, baseY + s.height * 0.2, s.width, s.height * 0.8);
                
                // Draw roof
                ctx.fillStyle = s.roofColor;
                ctx.beginPath();
                ctx.moveTo(sx - s.width/2 - 3, baseY + s.height * 0.2);
                ctx.lineTo(sx, baseY);
                ctx.lineTo(sx + s.width/2 + 3, baseY + s.height * 0.2);
                ctx.closePath();
                ctx.fill();
                
                // Draw windows
                ctx.fillStyle = '#60a5fa';
                for (let w = 0; w < s.windows; w++) {
                    ctx.fillRect(sx - 15 + w * 20, baseY + s.height * 0.4, 8, 8);
                }
            } else if (s.type === 'barn') {
                // Draw barn
                ctx.fillStyle = s.color;
                ctx.fillRect(sx - s.width/2, baseY + s.height * 0.3, s.width, s.height * 0.7);
                
                // Draw roof
                ctx.fillStyle = s.roofColor;
                ctx.beginPath();
                ctx.moveTo(sx - s.width/2 - 8, baseY + s.height * 0.3);
                ctx.lineTo(sx, baseY - 10);
                ctx.lineTo(sx + s.width/2 + 8, baseY + s.height * 0.3);
                ctx.closePath();
                ctx.fill();
                
                // Draw door
                ctx.fillStyle = s.doorColor || '#451a1a';
                ctx.fillRect(sx - 8, baseY + s.height * 0.6, 16, s.height * 0.4);
            } else if (s.type === 'bush') {
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(sx, baseY + s.height/2, s.height/2, 0, Math.PI * 2);
                ctx.fill();
            } else if (s.type === 'hill') {
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.ellipse(sx, baseY + s.height/2, s.width/2, s.height/2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

function drawNPCs() {
    const groundY = WORLD_GROUND - camera.y;
    npcs.forEach(npc => {
        // Animate NPC movement
        npc.animation += 0.1;
        npc.x += npc.direction * npc.speed;
        
        // Reverse direction occasionally
        if (Math.random() < 0.001) npc.direction *= -1;
        
        const sx = npc.x - camera.x;
        if (sx > -50 && sx < canvas.width + 50) {
            ctx.save();
            ctx.translate(sx, groundY - npc.size * 2);
            
            if (npc.type === 'person') {
                // Draw person
                ctx.fillStyle = npc.color;
                ctx.fillRect(-2, -npc.size * 2, 4, npc.size * 2); // Body
                ctx.beginPath();
                ctx.arc(0, -npc.size * 3, npc.size, 0, Math.PI * 2); // Head
                ctx.fill();
                
                // Animate arms
                const armAngle = Math.sin(npc.animation) * 0.3;
                ctx.strokeStyle = npc.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-3, -npc.size * 2);
                ctx.lineTo(-6 + Math.sin(npc.animation) * 3, -npc.size * 2.5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(3, -npc.size * 2);
                ctx.lineTo(6 + Math.cos(npc.animation) * 3, -npc.size * 2.5);
                ctx.stroke();
            } else if (npc.type === 'dog') {
                // Draw dog
                ctx.fillStyle = npc.color;
                ctx.fillRect(-3, -npc.size * 1.5, 6, npc.size * 1.5); // Body
                ctx.beginPath();
                ctx.arc(-2, -npc.size * 2, npc.size * 0.7, 0, Math.PI * 2); // Head
                ctx.fill();
                ctx.beginPath();
                ctx.arc(2, -npc.size * 2, npc.size * 0.7, 0, Math.PI * 2); // Head
                ctx.fill();
            } else if (npc.type === 'cat') {
                // Draw cat
                ctx.fillStyle = npc.color;
                ctx.fillRect(-2, -npc.size * 1.5, 4, npc.size * 1.5); // Body
                ctx.beginPath();
                ctx.arc(0, -npc.size * 2.5, npc.size, 0, Math.PI * 2); // Head
                ctx.fill();
                // Ears
                ctx.beginPath();
                ctx.moveTo(-3, -npc.size * 3);
                ctx.lineTo(-5, -npc.size * 3.5);
                ctx.lineTo(-1, -npc.size * 3);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(3, -npc.size * 3);
                ctx.lineTo(5, -npc.size * 3.5);
                ctx.lineTo(1, -npc.size * 3);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.restore();
        }
    });
}

// ===== FUNCTION TO DRAW LANDING LIGHTS (4 WHITE BULBS ON BOTH SIDES AT THE END OF RUNWAY IN LANDING AREA) =====
function drawLandingLights() {
    const groundY = WORLD_GROUND - camera.y;
    landingLights.forEach(light => {
        let sx = light.x - camera.x;
        if (light.offsetX) {
            sx = light.x - camera.x + light.offsetX;
        }
        
        if (sx > -50 && sx < canvas.width + 50) {
            // Pulse the light intensity
            const pulse = 0.5 + 0.5 * Math.sin(frame * light.pulseSpeed + light.phase);
            const intensity = light.intensity * (0.7 + 0.3 * pulse);
            
            // Draw light beam
            ctx.save();
            
            // Main light glow - ALL WHITE
            const gradient = ctx.createRadialGradient(sx, groundY - 5, 0, sx, groundY - 5, 25);
            gradient.addColorStop(0, light.color); // white
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${intensity * 0.3})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(sx, groundY - 5, 25, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw light source
            ctx.fillStyle = light.color;
            ctx.shadowColor = light.color;
            ctx.shadowBlur = 15 * intensity;
            ctx.beginPath();
            ctx.arc(sx, groundY - 5, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    });
}

function drawThreatArrows() {
    enemies.forEach(e => {
        if (!e.alive || e.exploded) return;
        const sx = e.x - camera.x; const sy = e.y - camera.y;
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
}

// ENHANCED RADAR WITH ALTITUDE-BASED RUNWAY DISPLAY - RUNWAYS DESCEND AND CLIMB WITH ALTITUDE
function drawRadar() {
    const rx = canvas.width - 105; const ry = canvas.height - 105;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.fillStyle = 'rgba(0, 20, 0, 0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, RADAR_RADIUS + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(34, 197, 94, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (RADAR_RADIUS / 3) * i, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-RADAR_RADIUS, 0); ctx.lineTo(RADAR_RADIUS, 0); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -RADAR_RADIUS); ctx.lineTo(0, RADAR_RADIUS); ctx.stroke();
    
    ctx.save();
    ctx.rotate(frame * 0.02);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(RADAR_RADIUS, 0);
    ctx.stroke();
    ctx.restore();

    const altitude = WORLD_GROUND - player.y;
    
    // Calculate runway opacity based on altitude
    let runwayAlpha = 1.0;
    if (altitude > 2000) {
        runwayAlpha = 0.2;
    } else if (altitude > 1000) {
        runwayAlpha = 0.5;
    } else if (altitude > 500) {
        runwayAlpha = 0.8;
    } else {
        runwayAlpha = 1.0;
    }
    
    // Calculate vertical offset based on altitude for realistic radar behavior
    // When altitude increases, runways descend (move down)
    // When altitude decreases, runways climb (move up)
    // This creates a realistic radar effect
    const baseY = 20; // Base Y position
    const maxOffset = 25; // Maximum offset in pixels
    
    // Normalize altitude to 0-3000 range
    const normalizedAlt = Math.min(altitude, 3000) / 3000;
    
    // Calculate vertical offset:
    // At altitude 0: offset = +maxOffset (runways at bottom - climbed up from center)
    // At altitude 1500: offset = 0 (runways at center)
    // At altitude 3000: offset = -maxOffset (runways at top - descended from center)
    // FIXED: Inverted the logic - now when altitude increases, runways descend (move down)
    // and when altitude decreases, runways climb (move up)
    const verticalOffset = (normalizedAlt - 0.5) * maxOffset * 2;
    
    // Apply offset to Y position
    const yPos = baseY + verticalOffset;
    
    // Draw runways with altitude-based visibility and vertical movement
    if (altitude < 3000) {
        runwayStarts.forEach((start, index) => {
            const dx = (start - player.x) * RADAR_SCALE;
            const runwayLength = 5500 * RADAR_SCALE;
            
            // Calculate start and end positions
            const runwayStart = dx;
            const runwayEnd = dx + runwayLength;
            
            // Check if the runway would cross the center (0,0)
            // If it would, we split it into two segments or clamp it
            if (Math.abs(dx) < RADAR_RADIUS + runwayLength) {
                ctx.globalAlpha = runwayAlpha;
                
                const isTarget = runwayNumbers[index] === targetRunway;
                ctx.strokeStyle = isTarget ? "#fbbf24" : "#38bdf8";
                ctx.lineWidth = isTarget ? 4 : 2;
                
                // Check if runway would cross the center (y-axis at x=0)
                if (runwayStart < 0 && runwayEnd > 0) {
                    // Draw left segment (from start to 0)
                    ctx.beginPath();
                    ctx.moveTo(runwayStart, yPos);
                    ctx.lineTo(0, yPos);
                    ctx.stroke();
                    
                    // Draw right segment (from 0 to end)
                    ctx.beginPath();
                    ctx.moveTo(0, yPos);
                    ctx.lineTo(runwayEnd, yPos);
                    ctx.stroke();
                } else {
                    // Draw normally if it doesn't cross
                    ctx.beginPath();
                    ctx.moveTo(runwayStart, yPos);
                    ctx.lineTo(runwayEnd, yPos);
                    ctx.stroke();
                }
                
                // Draw runway number - offset to avoid center
                let textX = dx + runwayLength / 2;
                if (Math.abs(textX) < 10) {
                    textX = 15; // Push it to the right if it would be at center
                }
                
                ctx.font = `bold ${isTarget ? 10 : 8}px 'Courier New'`;
                ctx.fillStyle = isTarget ? "#fbbf24" : "#ffffff";
                ctx.globalAlpha = runwayAlpha * (isTarget ? 1.0 : 0.8);
                ctx.fillText(runwayNumbers[index], textX, yPos - 5);
            }
        });
    }
    
    ctx.globalAlpha = 1;

    // Draw enemies on radar
    enemies.forEach(e => {
        if (!e.alive || e.exploded) return;
        const dx = (e.x - player.x) * RADAR_SCALE;
        const dy = (e.y - player.y) * RADAR_SCALE;
        if (Math.hypot(dx, dy) < RADAR_RADIUS) {
            ctx.fillStyle = e.radarColor || e.color || "#ef4444";
            ctx.beginPath();
            ctx.arc(dx, dy, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Draw boss on radar
    if (bossActive && boss && boss.alive && !boss.exploded) {
        const dx = (boss.x - player.x) * RADAR_SCALE;
        const dy = (boss.y - player.y) * RADAR_SCALE;
        if (Math.hypot(dx, dy) < RADAR_RADIUS) {
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(dx, dy, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw player position
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw missile count and active power
    ctx.save();
    ctx.font = "bold 14px 'Courier New'";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`🚀 ${missileCount}`, canvas.width - 150, 50);
    if (activePower) {
        const power = powerItems.find(p => p.id === activePower);
        if (power) ctx.fillText(`${power.icon} ${power.name}`, canvas.width - 150, 75);
    }
    ctx.restore();
}

function draw() {
    ctx.fillStyle = '#010409';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        const sx = star.x - camera.x * 0.1;
        const sy = star.y - camera.y * 0.1;
        if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
            ctx.globalAlpha = star.brightness * (0.5 + 0.5 * Math.sin(frame * star.speed + star.phase));
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.globalAlpha = 1;

    drawClouds();
    drawRealisticMountains();

    const groundY = WORLD_GROUND - camera.y;
    ctx.fillStyle = '#2d5a2d';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY + 10);

    drawPondsAndBoats();
    drawScenery();
    controlTowers.forEach(tower => drawDetailedControlTower(tower));
    drawNPCs();

    runwayStarts.forEach((start, index) => {
        const sx = start - camera.x;
        if (sx > -10000 && sx < canvas.width + 10000) {
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(sx, groundY - 20, 5500, 30);
            ctx.fillStyle = '#4a5568';
            ctx.fillRect(sx + 10, groundY - 17, 5480, 25);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 6;
            ctx.setLineDash([30, 40]);
            ctx.beginPath();
            ctx.moveTo(sx + 20, groundY - 5);
            ctx.lineTo(sx + 5480, groundY - 5);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.font = "bold 32px Arial";
            ctx.fillStyle = '#ffffff';
            ctx.fillText(runwayNumbers[index], sx + 300, groundY - 50);
        }
    });

    // Draw landing lights (4 white bulbs on both sides at the end of runway in landing area)
    drawLandingLights();

    bullets.forEach(b => {
        const sx = b.x - camera.x; const sy = b.y - camera.y;
        if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(b.angle);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(-8, -1, 16, 2);
            ctx.restore();
        }
    });

    enemyBullets.forEach(b => {
        const sx = b.x - camera.x; const sy = b.y - camera.y;
        if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(b.angle);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-6, -1, 12, 2);
            ctx.restore();
        }
    });

    missiles.forEach(m => {
        m.smokeTrail.forEach((smoke, index) => {
            const sx = smoke.x - camera.x; const sy = smoke.y - camera.y;
            if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
                ctx.globalAlpha = smoke.life * 0.4;
                ctx.fillStyle = '#64748b';
                ctx.beginPath();
                ctx.arc(sx, sy, 3 + index * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;
        const sx = m.x - camera.x; const sy = m.y - camera.y;
        if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(m.angle);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(-12, -3, 24, 6);
            ctx.restore();
        }
    });

    enemies.forEach(e => { if (e.alive && !e.exploded) drawPlane(e, false); });
    if (bossActive && boss && boss.alive && !boss.exploded) drawPlane(boss, false);
    if (!player.exploded) drawPlane(player, true);

    particles.forEach(p => {
        const sx = p.x - camera.x; const sy = p.y - camera.y;
        if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color || '#ffaa00';
            ctx.beginPath();
            ctx.arc(sx, sy, p.size || 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.globalAlpha = 1;

    drawWeather();
    drawThreatArrows();
    drawRadar();
}

function gameLoop() {
    if (!isPaused && !player.dead) {
        update();
        frame++;
    }
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!isPaused && player) {
        camera.x = player.x - canvas.width / 2.8;
        camera.y = player.y - canvas.height / 2.5;
    }
    if (window.innerWidth <= 768) {
        hud.style.display = 'none';
        document.getElementById('mobile-controls').style.display = 'block';
        document.getElementById('auto-shoot-toggle').style.display = 'none';
        checkOrientation();
    } else {
        if (homeMenu.style.display === 'none' && gameoverMenu.style.display === 'none') hud.style.display = 'block';
        document.getElementById('mobile-controls').style.display = 'none';
        document.getElementById('auto-shoot-toggle').style.display = 'none';
        orientationWarning.style.display = 'none';
    }
});

window.addEventListener('load', function() {
    setTimeout(() => {
        loadingPage.classList.add('hidden');
        homeMenu.classList.add('visible');
        initAudio();
        checkOrientation();
        
        // FIXED: Start home music automatically after loading screen disappears
        // This ensures the home screen sound plays immediately
        if (soundEnabled && audioCtx) {
            // First ensure audio context is running
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().then(() => {
                    console.log('Audio context resumed, starting home music...');
                    // Small delay to ensure everything is ready
                    setTimeout(() => { 
                        initHomeMusic(); 
                        console.log('Home music started automatically');
                    }, 200);
                }).catch(e => {
                    console.log('Failed to resume audio context:', e);
                    // Try anyway after a delay
                    setTimeout(() => initHomeMusic(), 500);
                });
            } else {
                console.log('Audio context ready, starting home music...');
                setTimeout(() => { 
                    initHomeMusic(); 
                    console.log('Home music started automatically');
                }, 200);
            }
        }

        const savedData = localStorage.getItem('rfsSaveData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.currentLevel > 0 && data.lives > 0) {
                    hasSaveData = true;
                    continueBtn.style.display = 'inline-block';
                } else continueBtn.style.display = 'none';
            } catch (e) { continueBtn.style.display = 'none'; }
        }

        const today = new Date().toDateString();
        if (lastDailyReward === today) dailyRewardBtn.classList.add('claimed');
        
        // Refresh game state
        refreshGameState();
    }, 2000);
});

window.openSettings = function() {
    settingsPanel.style.display = 'block';
    homeMenu.style.opacity = '0.5';
}

window.closeSettings = function() {
    settingsPanel.style.display = 'none';
    homeMenu.style.opacity = '1';
}

window.toggleSound = function() {
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
    refreshGameState();
}

window.updateVolume = function(val) {
    musicVolume = val;
    if (engineGain) engineGain.gain.value = soundEnabled ? (0.05 + (player?.thrust || 4) * 0.015) * (musicVolume / 100) : 0;
    saveGame();
    refreshGameState();
}

window.updateSFXVolume = function(val) {
    sfxVolume = val;
    saveGame();
    refreshGameState();
}

window.cycleSensitivity = function() {
    const sensitivities = ['Low', 'Normal', 'High'];
    let currentIndex = sensitivities.indexOf(sensitivityLevel);
    currentIndex = (currentIndex + 1) % sensitivities.length;
    sensitivityLevel = sensitivities[currentIndex];
    document.getElementById('sensitivity-value').innerText = sensitivityLevel;
    saveGame();
    refreshGameState();
}

window.cycleDifficulty = function() {
    const difficulties = ['Easy', 'Normal', 'Hard'];
    let currentIndex = difficulties.indexOf(difficultyLevel);
    currentIndex = (currentIndex + 1) % difficulties.length;
    difficultyLevel = difficulties[currentIndex];
    document.getElementById('difficulty-value').innerText = difficultyLevel;
    
    // Update difficulty multipliers
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
    refreshGameState();
}

window.nextLevel = function() {
    currentLevel++; currentStage = 1; bossActive = false; boss = null; bossHealthContainer.style.display = 'none';
    updatePlayerStatsFromPlane(); player.health = playerBaseHealth; missileCount = playerBaseMissiles;
    isPaused = false; successMenu.style.display = 'none';
    player.x = 2000; player.y = 3000; player.vx = 0; player.vy = 0; player.angle = 0; player.thrust = 4;
    bullets = []; enemyBullets = []; missiles = []; activePower = null; powerDuration = 0; updatePowerDisplay();
    spawnEnemies(); saveGame(); updateTargetRunway();
    refreshGameState();
}

window.retryLevel = function() {
    isPaused = false; successMenu.style.display = 'none'; document.getElementById('next-btn').style.display = 'inline-block';
    successMenu.style.borderColor = "#fbbf24";
    player.engineOK = true; player.wingOK = true;
    player.x = 2000; player.y = 3000; player.vx = 0; player.vy = 0; player.angle = 0; player.thrust = 4;
    player.gearDown = false; player.wasGearDown = false; player.dead = false; player.exploded = false; player.health = playerBaseHealth;
    bullets = []; enemyBullets = []; missiles = []; missileCount = playerBaseMissiles;
    currentStage = 1; bossActive = false; boss = null; bossHealthContainer.style.display = 'none';
    activePower = null; powerDuration = 0; updatePowerDisplay(); spawnEnemies(); updateTargetRunway();
    refreshGameState();
}

console.log('ULTIMATE EDITION - 360° ROTATION, EXTRA LARGE LANDING GEAR, HOUSES, 2D NPCS, ENLARGED SETTINGS, 4 WHITE BULBS ON BOTH SIDES AT THE END OF EACH RUNWAY IN LANDING AREA WITH 50 UNITS SPACING, REALISTIC 2D CONTROL TOWER WITH ANIMATED RADAR, RADAR RUNWAYS DESCEND AND CLIMB WITH ALTITUDE, CLEARED TO LAND MESSAGE FOR 4 SECONDS AFTER ALL ENEMIES DESTROYED, AUTO-SHOOT ONLY IN SETTINGS!');