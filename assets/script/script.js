     // ===== NOTIFICATION LOG SYSTEM =====
        let notifications = [];
        
        // Load notifications from localStorage
        function loadNotifications() {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                try {
                    notifications = JSON.parse(saved);
                } catch (e) {
                    notifications = [];
                }
            }
            updateNotificationDisplay();
        }

        // Save notifications to localStorage
        function saveNotifications() {
            localStorage.setItem('notifications', JSON.stringify(notifications));
            updateNotificationDisplay();
        }

        // Add a notification
        function addNotification(title, message, icon = '📌') {
            const notification = {
                id: Date.now() + Math.random(),
                title: title,
                message: message,
                icon: icon,
                time: new Date().toLocaleTimeString()
            };
            notifications.unshift(notification);
            if (notifications.length > 50) {
                notifications = notifications.slice(0, 50);
            }
            saveNotifications();
            
            // Play sound for important notifications
            if (icon === '🎁' || icon === '👑' || icon === '☄️') {
                playSound('coin');
            }
        }

        // Delete a notification
        function deleteNotification(id) {
            notifications = notifications.filter(n => n.id !== id);
            saveNotifications();
        }

        // Clear all notifications
        function clearAllNotifications() {
            notifications = [];
            saveNotifications();
        }

        // Update notification display in log page
        function updateNotificationDisplay() {
            const container = document.getElementById('notifications-container');
            const countSpan = document.getElementById('notification-count');
            
            if (!container || !countSpan) return;
            
            // Update count
            countSpan.innerText = notifications.length;
            
            if (notifications.length === 0) {
                container.innerHTML = '<div class="notification-item" style="justify-content: center; text-align: center; color: #87CEEB;">No notifications yet</div>';
                return;
            }
            
            let html = '';
            notifications.forEach(notif => {
                html += `<div class="notification-item">
                    <div class="notification-icon">${notif.icon}</div>
                    <div class="notification-content">
                        <div class="notification-title">${notif.title}</div>
                        <div class="notification-message">${notif.message}</div>
                        <div class="notification-time">${notif.time}</div>
                    </div>
                    <button class="notification-delete" onclick="deleteNotification(${notif.id})">×</button>
                </div>`;
            });
            container.innerHTML = html;
        }

        // Open notification log
        function openNotificationLog() {
            document.getElementById('notification-log-page').style.display = 'flex';
            document.getElementById('home-menu').style.opacity = '0.5';
            updateNotificationDisplay();
        }

        // Close notification log
        function closeNotificationLog() {
            document.getElementById('notification-log-page').style.display = 'none';
            document.getElementById('home-menu').style.opacity = '1';
        }

        // ===== MYSTERY BOX SYSTEM =====
        let mysteryBoxes = 0; // Number of mystery boxes the player has
        
        // Track which bosses have already given a box (to prevent duplicates)
        let awardedMysteryBosses = new Set();
        
        // Mystery Boss definition
        const mysteryBoss = {
            name: "MYSTERY BOSS",
            health: 300,
            thrust: 4.5,
            shootSpeed: 40,
            bulletSpeed: 16,
            color: "#8b5cf6",
            size: 2.2,
            pattern: "mystery",
            points: 600,
            coins: 120,
            shootDuration: 250,
            shootCooldown: 700,
            bulletCount: 3,
            spreadAngle: 0.2,
            teleportTimer: 0,
            drawShape: function(ctx, x, y, angle, scale, wingAngle) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.scale(scale * 0.8, scale * 0.8);
                
                // Purple mystery boss with question marks
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(50, -5);
                ctx.lineTo(50, 5);
                ctx.lineTo(0, 10);
                ctx.lineTo(-20, 5);
                ctx.lineTo(-20, -5);
                ctx.closePath();
                ctx.fill();
                
                // Wings with purple gradient
                const gradient = ctx.createLinearGradient(20, -30, 30, 30);
                gradient.addColorStop(0, '#a78bfa');
                gradient.addColorStop(1, '#6b21a5');
                
                ctx.fillStyle = gradient;
                ctx.save();
                ctx.translate(20, -2);
                ctx.rotate(wingAngle * 0.4);
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
                ctx.rotate(-wingAngle * 0.4);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(30, 35);
                ctx.lineTo(45, 32);
                ctx.lineTo(20, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                
                // Question marks on boss
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('?', 25, -10);
                ctx.fillText('?', -5, -15);
                ctx.fillText('?', 10, 15);
                
                ctx.restore();
            }
        };

        // Load mystery boxes from localStorage
        function loadMysteryBoxes() {
            const saved = localStorage.getItem('mysteryBoxes');
            if (saved) {
                mysteryBoxes = parseInt(saved) || 0;
            }
            
            // Load awarded mystery bosses set
            const savedAwarded = localStorage.getItem('awardedMysteryBosses');
            if (savedAwarded) {
                try {
                    const awardedArray = JSON.parse(savedAwarded);
                    awardedMysteryBosses = new Set(awardedArray);
                } catch (e) {
                    awardedMysteryBosses = new Set();
                }
            }
            
            updateMysteryBoxDisplay();
        }

        // Save mystery boxes to localStorage
        function saveMysteryBoxes() {
            localStorage.setItem('mysteryBoxes', mysteryBoxes.toString());
            
            // Save awarded mystery bosses set
            const awardedArray = Array.from(awardedMysteryBosses);
            localStorage.setItem('awardedMysteryBosses', JSON.stringify(awardedArray));
            
            updateMysteryBoxDisplay();
        }

        // Update mystery box counter in home menu
        function updateMysteryBoxDisplay() {
            const homeCount = document.getElementById('home-mystery-count');
            const claimBtn = document.getElementById('mystery-claim-btn');
            
            if (homeCount) {
                homeCount.innerText = mysteryBoxes;
            }
            
            // Show/hide claim button based on whether there are boxes
            if (claimBtn) {
                if (mysteryBoxes > 0) {
                    claimBtn.classList.add('visible');
                } else {
                    claimBtn.classList.remove('visible');
                }
            }
            
            const counter = document.getElementById('mystery-box-counter');
            const countSpan = document.getElementById('mystery-box-count');
            if (counter && countSpan) {
                if (mysteryBoxes > 0) {
                    counter.style.display = 'flex';
                    countSpan.innerText = mysteryBoxes;
                } else {
                    counter.style.display = 'none';
                }
            }
        }

        // Add a mystery box (called when mystery boss is defeated)
        function addMysteryBox(bossId) {
            // Check if this boss has already given a box
            if (awardedMysteryBosses.has(bossId)) {
                console.log('This mystery boss already gave a box, skipping');
                return;
            }
            
            // Add boss to awarded set
            awardedMysteryBosses.add(bossId);
            
            // Add one box
            mysteryBoxes++;
            saveMysteryBoxes();
            addNotification('📦 Mystery Box Added!', 'Defeat Mystery Boss to collect more boxes!', '🎁');
        }

        // Open mystery box in game (when player clicks on it)
        function openMysteryBox() {
            const box = document.getElementById('mysteryBox');
            const container = document.getElementById('mystery-box-container');
            
            if (box.classList.contains('opening')) return;
            
            box.classList.add('opening');
            
            // Random reward: 65% chance for 25 coins, 35% chance for 50 coins
            const random = Math.random();
            let reward;
            if (random < 0.65) {
                reward = 25; // 65% chance
            } else {
                reward = 50; // 35% chance
            }
            
            // Add to home coins
            homeCoins += reward;
            updateHomeCoinDisplay();
            
            // Decrease mystery box count
            mysteryBoxes--;
            saveMysteryBoxes();
            
            addNotification('💰 Mystery Box Opened!', `You got ${reward} coins!`, '🎁');
            
            // Show reward
            const rewardDiv = document.createElement('div');
            rewardDiv.className = 'mystery-reward';
            rewardDiv.style.display = 'block';
            rewardDiv.innerText = `+${reward}💰`;
            container.appendChild(rewardDiv);
            
            playSound('coin');
            
            // Animate and remove box
            setTimeout(() => {
                container.style.display = 'none';
                box.classList.remove('opening');
                box.classList.remove('hover');
                setTimeout(() => rewardDiv.remove(), 500);
            }, 500);
        }

        // Claim mystery boxes from home menu
        function claimMysteryBoxes() {
            if (mysteryBoxes <= 0) {
                addNotification('❌ No Boxes', 'No mystery boxes to open!', '📦');
                return;
            }
            
            // Show mystery box modal
            const container = document.getElementById('mystery-box-container');
            container.style.display = 'block';
            
            // Pause game if playing
            if (homeMenu.style.display === 'none') {
                isPaused = true;
            }
        }

        // ===== PERSISTENT HOME COIN SYSTEM =====
        // Load home coins from localStorage
        function loadHomeCoins() {
            const savedCoins = localStorage.getItem('homeCoins');
            if (savedCoins) {
                homeCoins = parseInt(savedCoins) || 0;
            }
            updateHomeCoinDisplay();
        }

        // Save home coins to localStorage
        function saveHomeCoins() {
            localStorage.setItem('homeCoins', homeCoins.toString());
        }

        // Update home coin display and save
        function updateHomeCoinDisplay() {
            const homeCoinElement = document.getElementById('home-coins');
            if (homeCoinElement) {
                homeCoinElement.innerText = homeCoins;
            }
            saveHomeCoins();
        }

        // ===== HIGH SCORE SYSTEM =====
        let highScore = 0;

        // Load high score from localStorage
        function loadHighScore() {
            const saved = localStorage.getItem('highScore');
            if (saved) {
                highScore = parseInt(saved) || 0;
            }
            updateHighScoreDisplay();
        }

        // Save high score to localStorage
        function saveHighScore() {
            localStorage.setItem('highScore', highScore.toString());
        }

        // Update high score display in home menu
        function updateHighScoreDisplay() {
            const highScoreElement = document.getElementById('menu-highscore');
            const gameOverHighScoreElement = document.getElementById('gameover-highscore');
            
            if (highScoreElement) {
                highScoreElement.innerText = highScore;
            }
            
            if (gameOverHighScoreElement) {
                gameOverHighScoreElement.innerText = highScore;
            }
        }

        // Check and update high score when game ends
        function checkHighScore(score) {
            if (score > highScore) {
                highScore = score;
                saveHighScore();
                updateHighScoreDisplay();
                addNotification('🏆 New High Score!', `You scored ${score} points!`, '🏆');
            }
        }

        // ===== IN-GAME DOLLAR SYSTEM (SEPARATE FROM HOME COINS) =====
        let inGameDollars = 0;
        
        function loadInGameDollars() {
            // In-game dollars are not persistent between sessions
            // They reset when starting a new game
            inGameDollars = 0;
            updateDollarDisplay();
        }
        
        function saveInGameDollars() {
            // Not saving to localStorage - in-game dollars are temporary
            updateDollarDisplay();
        }
        
        function updateDollarDisplay() {
            const dollarElement = document.getElementById('dollar-display');
            if (dollarElement) {
                dollarElement.innerText = inGameDollars;
            }
            
            const shopDollars = document.getElementById('shop-dollars-amount');
            if (shopDollars) {
                shopDollars.innerText = inGameDollars;
            }
            
            const totalDollarsDisplay = document.getElementById('total-dollars-display');
            if (totalDollarsDisplay) {
                totalDollarsDisplay.innerText = inGameDollars;
            }
        }
        
        function addDollars(amount) {
            inGameDollars += amount;
            updateDollarDisplay();
        }
        
        function spendDollars(amount) {
            if (inGameDollars >= amount) {
                inGameDollars -= amount;
                updateDollarDisplay();
                return true;
            }
            return false;
        }

        // ===== NEW FEATURE: Realistic Galaxy Background =====
        // This creates a beautiful galaxy background that always stays visible
        
        // ===== NEW FEATURE: High Altitude Galaxy (10,000+ ft) =====
        function updateHighAltitudeGalaxy() {
            const galaxyElement = document.getElementById('high-altitude-galaxy');
            if (!galaxyElement) return;
            
            const altitude = Math.max(0, Math.floor(WORLD_GROUND - player.y));
            if (altitude >= 10000) {
                galaxyElement.classList.add('visible');
            } else {
                galaxyElement.classList.remove('visible');
            }
        }
        
        // ===== NEW FEATURE: High Altitude Damage System =====
        let highAltitudeDamageTimer = 0;
        const HIGH_ALTITUDE_THRESHOLD = 35000; // 35,000 feet
        const HIGH_ALTITUDE_DAMAGE_RATE = 60; // frames between damage (about 1 second at 60fps)
        const HIGH_ALTITUDE_DAMAGE_AMOUNT = 5; // 5% health loss
        
        // ===== NEW FEATURE: Boss Indicator =====
        function showBossIndicator() {
            const indicator = document.getElementById('boss-indicator');
            if (indicator) {
                indicator.style.display = 'flex';
                setTimeout(() => {
                    indicator.style.display = 'none';
                }, 5000);
            }
        }

        // ===== NEW FEATURE: High Altitude Warning =====
        function showHighAltitudeWarning(show) {
            const warning = document.getElementById('high-altitude-warning');
            if (warning) {
                warning.style.display = show ? 'flex' : 'none';
            }
        }

        // ===== IN-GAME HUD TOGGLE =====
        function toggleInGameHUD() {
            if (hud.style.display === 'block') {
                hud.style.display = 'none';
            } else {
                hud.style.display = 'block';
            }
        }

        // ===== MODIFIED: Enemy hit function with dollar rewards and FIXED MYSTERY BOX BUG =====
        function enemyKilled(enemy) {
            // Check if enemy is already dead
            if (enemy.exploded) return;
            
            const basePoints = enemy.points || 50;
            totalScore += basePoints;
            inGameDollars += (enemy.coins || 10); // Using dollars instead of coins
            totalKills++;
            
            // NEW: Random chance to reduce player health when enemy is hit
            // This simulates enemy debris or return fire
            if (Math.random() < 0.1 && activePower !== 'shield') { // 10% chance
                player.health -= 5; // Lose 5% health
                
                // Show hit effect
                createHitEffect(player.x, player.y);
                
                if (player.health <= 0) {
                    trackDeath(true);
                    triggerCrashSequence();
                }
            }
            
            // Check if this was a mystery boss and add ONLY ONE mystery box per boss
            if (enemy.isMysteryBoss && enemy.id) {
                addMysteryBox(enemy.id);
            }
            
            // Mark enemy as exploded and remove from game
            enemy.exploded = true;
            enemy.alive = false;
            
            // Remove from enemies array
            const index = enemies.indexOf(enemy);
            if (index > -1) {
                enemies.splice(index, 1);
            }
            
            // Update displays
            updateMenuScore();
            checkAchievement('firstKill', 1);
            checkAchievement('acePilot', 1);
            checkAchievement('collector', enemy.coins || 10);
            updateDollarDisplay();
            
            // Check if all enemies are dead
            checkAllEnemiesDead();
            
            playSound('coin');
            trackKill();
            
            // Create explosion effect
            createBlast(enemy.x, enemy.y, enemy.color, 30);
        }

        // ===== NEW FUNCTION: Create hit effect =====
        function createHitEffect(x, y) {
            const effect = document.createElement('div');
            effect.className = 'enemy-hit-effect';
            effect.style.left = (x - camera.x - 10) + 'px';
            effect.style.top = (y - camera.y - 10) + 'px';
            document.body.appendChild(effect);
            
            setTimeout(() => {
                if (effect.parentNode) {
                    effect.remove();
                }
            }, 300);
        }

        // ===== ENHANCED LOGIN SYSTEM - COLLECTS MORE PILOT INFO =====
        let pilotInfo = {
            name: "",
            age: "",
            country: "",
            experience: "",
            firstFlight: ""
        };

        // Home Coins (Separate from in-game dollars) - CHANGED DAILY REWARD TO 50
        let homeCoins = 0;
        
        // Check if user has logged in before
        function checkFirstTimeUser() {
            const savedPilotInfo = localStorage.getItem('pilotInfo');
            const loginBtn = document.getElementById('home-login-btn');
            
            if (savedPilotInfo) {
                // User has logged in before - hide login page and login button
                document.getElementById('login-page').style.display = 'none';
                loginBtn.style.display = 'none';
                pilotInfo = JSON.parse(savedPilotInfo);
                updatePilotWelcomeDisplay();
                updatePilotDataDisplay();
                addNotification('✈️ Welcome Back!', `Good to see you again, ${pilotInfo.name}!`, '👋');
            } else {
                // First time user - show login page and show login button
                document.getElementById('login-page').style.display = 'flex';
                loginBtn.style.display = 'flex';
            }
            
            // Load home coins
            loadHomeCoins();
            
            // Load mystery boxes
            loadMysteryBoxes();
            
            // Load notifications
            loadNotifications();
            
            // Load unlocked planes from saved data
            loadUnlockedPlanes();
            
            // Initialize in-game dollars
            loadInGameDollars();
            
            // Load high score
            loadHighScore();
        }

        // Load unlocked planes from localStorage
        function loadUnlockedPlanes() {
            // Load plane unlocks from dedicated storage
            const planeUnlocks = localStorage.getItem('planeUnlocks');
            if (planeUnlocks) {
                try {
                    const unlocks = JSON.parse(planeUnlocks);
                    for (let i = 0; i < unlocks.length && i < planes.length; i++) {
                        planes[i].unlocked = unlocks[i];
                    }
                } catch (e) {
                    console.log('Failed to load plane unlocks');
                }
            }
            
            // Load selected plane
            const selected = localStorage.getItem('selectedPlane');
            if (selected) {
                selectedPlane = selected;
                updatePlayerStatsFromPlane();
            }
            
            // Also check legacy save data for backward compatibility
            const savedData = localStorage.getItem('rfsSaveData');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    if (data.planes) {
                        data.planes.forEach((unlocked, index) => {
                            if (index < planes.length) {
                                planes[index].unlocked = unlocked;
                            }
                        });
                    }
                    if (data.selectedPlane) {
                        selectedPlane = data.selectedPlane;
                        updatePlayerStatsFromPlane();
                    }
                } catch (e) {
                    console.log('Failed to load legacy plane data');
                }
            }
            
            // Ensure trainer is always unlocked
            planes[0].unlocked = true;
            
            // Save to dedicated storage
            savePlaneUnlocks();
        }

        // Save all pilot information and hide login page
        function savePilotInfo() {
            // 🟢 ADDED: Show main ad when START MISSION is clicked
            if (window.Android) {
                Android.showMainAd();
            }
            
            const nameInput = document.getElementById('pilot-name-input');
            const ageInput = document.getElementById('pilot-age-input');
            const countryInput = document.getElementById('pilot-country-input');
            const experienceInput = document.getElementById('pilot-experience-input');
            const loginBtn = document.getElementById('home-login-btn');
            
            const name = nameInput.value.trim();
            const age = ageInput.value.trim();
            const country = countryInput.value.trim();
            const experience = experienceInput.value;
            
            if (name === "" || age === "" || country === "") {
                addNotification('❌ Error', 'Please fill in all fields, pilot!', '⚠️');
                return;
            }
            
            // Create first flight date
            const today = new Date();
            const firstFlight = today.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            pilotInfo = {
                name: name,
                age: age,
                country: country,
                experience: experience,
                firstFlight: firstFlight
            };
            
            localStorage.setItem('pilotInfo', JSON.stringify(pilotInfo));
            document.getElementById('login-page').style.display = 'none';
            loginBtn.style.display = 'none';
            updatePilotWelcomeDisplay();
            updatePilotDataDisplay();
            addNotification('✈️ Pilot Registered!', `Welcome, ${name}! Your journey begins.`, '🎉');
        }

        // Show login page from home button
        function showLoginPage() {
            document.getElementById('login-page').style.display = 'flex';
        }

        // Sign out function - clears pilot info and shows login
        function signOut() {
            // Clear pilot info from storage
            localStorage.removeItem('pilotInfo');
            
            // Reset pilot info object
            pilotInfo = {
                name: "",
                age: "",
                country: "",
                experience: "",
                firstFlight: ""
            };
            
            // Hide welcome banner
            document.getElementById('pilot-welcome').style.display = 'none';
            
            // Show login button
            document.getElementById('home-login-btn').style.display = 'flex';
            
            // Show login page
            document.getElementById('login-page').style.display = 'flex';
            
            // Clear pilot data display
            document.getElementById('data-pilot-name').innerText = "Not set";
            document.getElementById('data-pilot-age').innerText = "Not set";
            document.getElementById('data-pilot-country').innerText = "Not set";
            document.getElementById('data-pilot-experience').innerText = "Not set";
            document.getElementById('data-first-flight').innerText = "Not set";
            
            // Close settings if open
            closeSettings();
            
            addNotification('🚪 Signed Out', 'You have been signed out.', '👋');
            
            // Play sound effect
            playSound('gear');
        }

        // Update pilot welcome display in home screen only
        function updatePilotWelcomeDisplay() {
            const welcomeElement = document.getElementById('pilot-welcome');
            
            if (pilotInfo.name) {
                welcomeElement.style.display = 'flex';
                welcomeElement.innerHTML = `✈️ Welcome, ${pilotInfo.name} <span>(${pilotInfo.experience})</span>`;
            }
        }
        
        // Update pilot data display in settings
        function updatePilotDataDisplay() {
            document.getElementById('data-pilot-name').innerText = pilotInfo.name || "Not set";
            document.getElementById('data-pilot-age').innerText = pilotInfo.age || "Not set";
            document.getElementById('data-pilot-country').innerText = pilotInfo.country || "Not set";
            document.getElementById('data-pilot-experience').innerText = pilotInfo.experience || "Not set";
            document.getElementById('data-first-flight').innerText = pilotInfo.firstFlight || "Not set";
        }

        // ===== ENEMY COUNT SYSTEM - PROGRESSIVE ENEMY SPAWNING =====
        function calculateEnemyCountForStage() {
            // Base enemy counts per stage: Stage 1: 3, Stage 2: 6, Stage 3: 9, Stage 4: 4, Stage 5: 5 (boss)
            // With difficulty multiplier and level progression
            let baseCount;
            
            if (currentStage === 1) baseCount = 3;
            else if (currentStage === 2) baseCount = 6;
            else if (currentStage === 3) baseCount = 9;
            else if (currentStage === 4) baseCount = 4;
            else baseCount = 5; // Stage 5 (boss stage)
            
            // Apply level multiplier (more enemies at higher levels)
            const levelMultiplier = 1 + (currentLevel * 0.2);
            
            // Apply difficulty multiplier
            let diffMultiplier = 1.0;
            if (difficultyLevel === 'Easy') diffMultiplier = 0.7;
            else if (difficultyLevel === 'Hard') diffMultiplier = 1.5;
            
            // Calculate total enemies
            let totalEnemies = Math.floor(baseCount * levelMultiplier * diffMultiplier * enemyCountMultiplier);
            
            // Cap at maximum 27 enemies total
            return Math.min(totalEnemies, 27);
        }

        function calculateBossHealth() {
            // Boss health scales with level
            let baseHealth = 200;
            let levelMultiplier = 1 + (currentLevel * 0.5);
            let health = Math.floor(baseHealth * levelMultiplier * enemyHealthMultiplier);
            
            // Cap at reasonable maximum
            return Math.min(health, 1000);
        }

        // ===== NOTE MENU FUNCTIONS - NEW =====
        function openNoteMenu() {
            const noteMenu = document.getElementById('note-menu');
            const homeMenu = document.getElementById('home-menu');
            
            if (homeMenu.style.display === 'none') {
                addNotification('❌ Error', 'Note is only available in the home menu!', '📚');
                return;
            }
            
            noteMenu.style.display = 'block';
            homeMenu.style.opacity = '0.5';
        }
        
        function closeNoteMenu() {
            const noteMenu = document.getElementById('note-menu');
            const homeMenu = document.getElementById('home-menu');
            
            noteMenu.style.display = 'none';
            homeMenu.style.opacity = '1';
        }
        
        function switchNoteTab(tabName) {
            // Remove active class from all tabs and contents
            const tabs = document.querySelectorAll('.note-tab');
            const contents = document.querySelectorAll('.note-content');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab and content
            if (tabName === 'planes') {
                document.querySelector('.note-tab:nth-child(1)').classList.add('active');
                document.getElementById('note-planes').classList.add('active');
            } else if (tabName === 'enemies') {
                document.querySelector('.note-tab:nth-child(2)').classList.add('active');
                document.getElementById('note-enemies').classList.add('active');
            } else if (tabName === 'powers') {
                document.querySelector('.note-tab:nth-child(3)').classList.add('active');
                document.getElementById('note-powers').classList.add('active');
            } else if (tabName === 'bosses') {
                document.querySelector('.note-tab:nth-child(4)').classList.add('active');
                document.getElementById('note-bosses').classList.add('active');
            } else if (tabName === 'mystery') {
                document.querySelector('.note-tab:nth-child(5)').classList.add('active');
                document.getElementById('note-mystery').classList.add('active');
            }
        }

        // ===== FREE SPIN WHEEL SYSTEM (24 HOUR COOLDOWN, MAX 100 COINS) =====
        let freeSpinsRemaining = 1;
        let lastFreeSpinTime = null;
        let isSpinning = false;
        
        // ===== NEW FUNCTION TO ADD COIN TEXT TO WHEEL =====
        function enhanceSpinWheel() {
            const spinWheel = document.getElementById('spinWheel');
            if (!spinWheel) return;
            
            // Remove any existing segment texts
            const existingTexts = document.querySelectorAll('.wheel-segment-text');
            existingTexts.forEach(text => text.remove());
            
            // Coin values for each segment (10 segments)
            const coinValues = [100, 75, 50, 25, 10, 100, 75, 50, 25, 10];
            
            // Position text labels on each segment
            for (let i = 0; i < 10; i++) {
                const angle = (i * 36 + 18) * (Math.PI / 180); // Center of each segment
                const radius = 100; // Distance from center
                const x = 150 + radius * Math.cos(angle - Math.PI/2); // 150 is center of 300px wheel
                const y = 150 + radius * Math.sin(angle - Math.PI/2);
                
                const textElement = document.createElement('div');
                textElement.className = 'wheel-segment-text';
                textElement.innerText = coinValues[i] + '💰';
                textElement.style.left = x + 'px';
                textElement.style.top = y + 'px';
                textElement.style.position = 'absolute';
                textElement.style.fontSize = '14px';
                textElement.style.fontWeight = 'bold';
                textElement.style.color = '#ffffff';
                textElement.style.textShadow = '2px 2px 2px #000000';
                textElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
                textElement.style.padding = '2px 6px';
                textElement.style.borderRadius = '10px';
                textElement.style.border = '1px solid #fbbf24';
                textElement.style.transform = 'translate(-50%, -50%)';
                textElement.style.pointerEvents = 'none';
                textElement.style.zIndex = '30';
                
                spinWheel.appendChild(textElement);
            }
        }
        
        function openSpinWheelModal() {
            // Check if game is active (not in home menu)
            if (homeMenu.style.display === 'none') {
                addNotification('❌ Error', 'Free spin is only available in the home menu!', '🎰');
                return;
            }
            
            // Check 24-hour cooldown
            const now = new Date().getTime();
            const lastSpin = localStorage.getItem('lastFreeSpinTime');
            
            if (lastSpin) {
                const timeDiff = now - parseInt(lastSpin);
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    const hoursRemaining = Math.ceil(24 - hoursDiff);
                    addNotification('⏰ Cooldown', `Free spin available in ${hoursRemaining} hours!`, '🎰');
                    return;
                }
            }
            
            if (freeSpinsRemaining <= 0) {
                addNotification('❌ No Spins', 'No free spins available! Complete stages to earn more spins.', '🎰');
                return;
            }
            
            const modal = document.getElementById('spin-wheel-modal');
            const wheel = document.getElementById('spinWheel');
            const reward = document.getElementById('wheelReward');
            
            // Reset wheel
            wheel.style.transform = 'rotate(0deg)';
            reward.innerText = '';
            modal.style.display = 'flex';
            
            // Add coin text to wheel
            setTimeout(() => enhanceSpinWheel(), 100);
        }
        
        function spinWheel() {
            if (isSpinning) return;
            if (freeSpinsRemaining <= 0) {
                addNotification('❌ No Spins', 'No free spins available!', '🎰');
                return;
            }
            
            // Check if game is active
            if (homeMenu.style.display === 'none') {
                addNotification('❌ Error', 'Free spin is only available in the home menu!', '🎰');
                closeSpinWheel();
                return;
            }
            
            isSpinning = true;
            const wheel = document.getElementById('spinWheel');
            const reward = document.getElementById('wheelReward');
            
            // Random rotation (multiple full rotations + random angle)
            const rotations = 5; // Number of full rotations
            const randomAngle = Math.floor(Math.random() * 360);
            const totalRotation = (rotations * 360) + randomAngle;
            
            // Apply rotation
            wheel.style.transform = `rotate(${totalRotation}deg)`;
            
            // Determine reward based on final angle (max 100 coins)
            setTimeout(() => {
                // Normalize angle to 0-360
                const normalizedAngle = totalRotation % 360;
                
                // Determine reward segment (10 segments of 36 degrees each) - max 100
                const segment = Math.floor(normalizedAngle / 36);
                let rewardAmount = 0;
                
                switch(segment) {
                    case 0: rewardAmount = 100; break; // Jackpot (max 100)
                    case 1: rewardAmount = 75; break;  // Big win
                    case 2: rewardAmount = 50; break;  // Win
                    case 3: rewardAmount = 25; break;  // Medium
                    case 4: rewardAmount = 10; break;  // Small
                    case 5: rewardAmount = 100; break; // Jackpot
                    case 6: rewardAmount = 75; break;  // Big win
                    case 7: rewardAmount = 50; break;  // Win
                    case 8: rewardAmount = 25; break;  // Medium
                    case 9: rewardAmount = 10; break;  // Small
                }
                
                // Add reward to home coins
                homeCoins += rewardAmount;
                freeSpinsRemaining--;
                
                // Save last spin time
                const now = new Date().getTime();
                localStorage.setItem('lastFreeSpinTime', now.toString());
                
                // Update displays
                updateHomeCoinDisplay();
                updateFreeSpinDisplay();
                saveGame();
                playSound('coin');
                
                // Show reward
                reward.innerText = `+${rewardAmount} COINS!`;
                addNotification('🎰 Free Spin!', `You won ${rewardAmount} coins!`, '💰');
                
                // Trigger shooting stars effect
                triggerShootingStars();
                
                // Mark free spin as claimed
                document.getElementById('free-spin-btn').classList.add('claimed');
                
                isSpinning = false;
                
                // Re-add coin text after spin
                setTimeout(() => enhanceSpinWheel(), 500);
            }, 3000); // Match animation duration
        }
        
        function closeSpinWheel() {
            document.getElementById('spin-wheel-modal').style.display = 'none';
        }
        
        function checkFreeSpinCooldown() {
            const now = new Date().getTime();
            const lastSpin = localStorage.getItem('lastFreeSpinTime');
            const freeSpinBtn = document.getElementById('free-spin-btn');
            
            if (lastSpin) {
                const timeDiff = now - parseInt(lastSpin);
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    freeSpinBtn.classList.add('claimed');
                } else {
                    freeSpinBtn.classList.remove('claimed');
                }
            } else {
                freeSpinBtn.classList.remove('claimed');
            }
        }
        
        function updateFreeSpinDisplay() {
            const spinBtn = document.getElementById('free-spin-btn');
            const spinCount = document.getElementById('spin-count');
            if (spinBtn && spinCount) {
                spinCount.innerText = freeSpinsRemaining;
                if (freeSpinsRemaining <= 0) {
                    spinBtn.classList.add('disabled');
                } else {
                    spinBtn.classList.remove('disabled');
                }
            }
            checkFreeSpinCooldown();
        }

        // ===== SHOOTING STARS EFFECT (4 SECONDS) =====
        function triggerShootingStars() {
            const container = document.getElementById('shooting-star-container');
            container.innerHTML = ''; // Clear existing
            container.style.display = 'block';
            
            // Create 10 shooting stars
            for (let i = 0; i < 10; i++) {
                const star = document.createElement('div');
                star.className = 'shooting-star';
                
                // Random starting position
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                const delay = Math.random() * 2; // Random delay up to 2 seconds
                
                star.style.top = top + '%';
                star.style.left = left + '%';
                star.style.animationDelay = delay + 's';
                
                container.appendChild(star);
            }
            
            // Hide after 4 seconds
            setTimeout(() => {
                container.style.display = 'none';
                container.innerHTML = '';
            }, 4000);
        }

        // ===== MOBILE POWER SHOP FUNCTION =====
        function openPowerShopMobile() {
            if (!player.dead && !isPaused) {
                openPowerShop();
            }
        }

        // ===== UPDATE TOP LEFT ILS DISPLAY (DISABLED) =====
        function updateTopLeftILS() {
            // Function disabled - top left ILS hidden
            return;
        }

        // ===== UPDATE BOTTOM CENTER ILS DISPLAY =====
        function updateBottomCenterILS() {
            const gsDiamond = document.getElementById('ils-bottom-gs-diamond');
            const locDiamond = document.getElementById('ils-bottom-loc-diamond');
            const gsValue = document.getElementById('ils-bottom-gs-value');
            const locValue = document.getElementById('ils-bottom-loc-value');
            
            if (!gsDiamond || !locDiamond) return;
            
            // Get current GS and LOC positions from main diamonds
            const mainGsDia = document.getElementById('gs-diamond');
            const mainLocDia = document.getElementById('loc-diamond');
            
            if (mainGsDia && mainLocDia) {
                // Copy positions from main diamonds (approximate)
                const gsTop = mainGsDia.style.top;
                const locLeft = mainLocDia.style.left;
                
                gsDiamond.style.left = gsTop;
                locDiamond.style.left = locLeft;
                
                // Update percentage values
                if (gsValue) {
                    gsValue.innerText = gsTop;
                }
                if (locValue) {
                    locValue.innerText = locLeft;
                }
            }
        }

        // ===== IN-GAME PAUSE MENU FUNCTIONS =====
        function togglePauseMenu() {
            const pauseMenu = document.getElementById('pause-menu');
            if (pauseMenu.style.display === 'block') {
                pauseMenu.style.display = 'none';
                isPaused = false;
            } else {
                pauseMenu.style.display = 'block';
                isPaused = true;
            }
        }
        
        function resumeGame() {
            document.getElementById('pause-menu').style.display = 'none';
            isPaused = false;
        }
        
        function restartLevel() {
            document.getElementById('pause-menu').style.display = 'none';
            isPaused = false;
            // Reset current level completely
            resetGameState();
            spawnEnemies();
        }
        
        function quitToHome() {
            document.getElementById('pause-menu').style.display = 'none';
            isPaused = true;
            homeMenu.style.display = 'flex';
            homeMenu.style.opacity = '1';
            hud.style.display = 'none';
            radar.style.display = 'none';
            levelStage.style.display = 'none';
            document.getElementById('dollar-display').style.display = 'none';
            shopBtn.style.display = 'none';
            document.getElementById('mobile-controls').style.display = 'none';
            document.getElementById('pause-menu-btn').style.display = 'none';
            stopHomeMusic();
            if (soundEnabled) initHomeMusic();
            
            // Reset game state for next new game
            resetGameState();
        }
        
        // ===== AD INTEGRATION: REWARD AD FUNCTIONALITY =====
        // Called by Android when reward ad is completed
        window.onRewardAdCompleted = function() {
            console.log('Reward ad completed - respawning player');
            performRespawn();
            addNotification('🎬 Revived!', 'You watched an ad and returned to battle!', '🎬');
        }
        
        // Called by Android when reward ad is skipped/cancelled
        window.onRewardAdCancelled = function() {
            console.log('Reward ad cancelled - player remains dead');
            addNotification('❌ Revive Failed', 'Ad was cancelled. You remain dead.', '❌');
            // Show game over screen
            showGameOverMenu();
        }
        
        // Called by Android when main ad is closed
        window.onMainAdClosed = function() {
            console.log('Main ad closed - continuing action');
            // Continue with the action that was waiting (already handled by savePilotInfo and restartFromGameOver)
        }
        
        // Function to show reward ad for reviving
        function reviveWithAd() {
            if (window.Android) {
                console.log('Showing reward ad for revive');
                Android.showRewardAd();
                // Don't respawn here - wait for callback
            } else {
                // No ad support, just respawn directly
                console.log('No ad support - respawning directly');
                performRespawn();
            }
        }
        
        // Separate respawn logic for ad completion
        function performRespawn() {
            // Actual respawn logic
            player.dead = false;
            player.exploded = false;
            player.engineOK = true;
            player.wingOK = true;
            player.x = 2000;
            player.y = 3000;
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
        
        // Complete game state reset function
        function resetGameState() {
            // Reset player
            player.x = 2000;
            player.y = 3000;
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
            player.health = playerBaseHealth;
            
            // Reset game variables
            currentLevel = 1;
            currentStage = 1;
            totalScore = 0;
            totalKills = 0;
            inGameDollars = 0;
            currentCombo = 0;
            maxCombo = 0;
            comboMultiplier = 1;
            comboDecayTimer = 0;
            missileCount = playerBaseMissiles;
            activePower = null;
            powerDuration = 0;
            powerMissileCount = 0;
            boss = null;
            bossActive = false;
            bossSpawned = false;
            
            // Reset lives to 3
            lives = 3;
            
            // Clear all arrays
            bullets = [];
            enemyBullets = [];
            enemies = [];
            missiles = [];
            particles = [];
            meteoroids = [];
            shootingStars = [];
            weatherParticles = [];
            meteorExplosions = [];
            
            // Reset displays
            updateDollarDisplay();
            updateMenuScore();
            document.getElementById('lives-val').innerText = "❤️".repeat(lives);
            
            // Clear localStorage save
            localStorage.removeItem('rfsSaveData');
            hasSaveData = false;
            continueBtn.style.display = 'none';
        }
        
        // ===== MOBILE HUD TOGGLE (DISABLED) =====
        function toggleMobileHUD() {
            // Function disabled - mobile top HUD hidden
            return;
        }

        // ===== ULTIMATE EDITION WITH METEOR EXPLOSIONS AND SHOWERS =====
        // Player Statistics
        let playerStats = {
            totalKills: 0,
            totalDeaths: 0,
            totalEnemyDeaths: 0,
            totalLandings: 0,
            totalCrashes: 0
        };
        
        // Meteor explosion array
        let meteorExplosions = [];
        
        // Missile cooldown system
        let missileCooldown = 0;
        const MISSILE_COOLDOWN_FRAMES = 20;
        let missileKeyPressed = false;
        
        // Button Controls State
        let buttonControlsEnabled = true;

        // Tab switching function
        function switchTab(tabName) {
            const tabs = document.querySelectorAll('.settings-tab');
            const contents = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            
            if (tabName === 'settings') {
                document.querySelector('.settings-tab:nth-child(1)').classList.add('active');
                document.getElementById('settings-tab').classList.add('active');
            } else if (tabName === 'aboutgame') {
                document.querySelector('.settings-tab:nth-child(2)').classList.add('active');
                document.getElementById('aboutgame-tab').classList.add('active');
            } else if (tabName === 'pilotprofile') {
                document.querySelector('.settings-tab:nth-child(3)').classList.add('active');
                document.getElementById('pilotprofile-tab').classList.add('active');
                updateStatsDisplay();
            } else if (tabName === 'pilotdata') {
                document.querySelector('.settings-tab:nth-child(4)').classList.add('active');
                document.getElementById('pilotdata-tab').classList.add('active');
                updatePilotDataDisplay();
            }
        }

        // Save player statistics
        function savePlayerStats() {
            localStorage.setItem('playerStats', JSON.stringify(playerStats));
        }

        // Load player statistics
        function loadPlayerStats() {
            const saved = localStorage.getItem('playerStats');
            if (saved) {
                try {
                    playerStats = JSON.parse(saved);
                } catch (e) {
                    console.log('Failed to load player stats');
                }
            }
            updateStatsDisplay();
        }

        // Update statistics display (FIXED: win rate and landings now work)
        function updateStatsDisplay() {
            document.getElementById('stat-kills').innerText = playerStats.totalKills;
            document.getElementById('stat-enemy-deaths').innerText = playerStats.totalEnemyDeaths || 0;
            document.getElementById('stat-landings').innerText = playerStats.totalLandings;
            document.getElementById('stat-crashes').innerText = playerStats.totalCrashes;
            
            const totalAttempts = playerStats.totalLandings + playerStats.totalCrashes;
            let winRate = 0;
            if (totalAttempts > 0) {
                winRate = Math.round((playerStats.totalLandings / totalAttempts) * 100);
            }
            document.getElementById('stat-winrate').innerText = winRate + '%';
        }

        // Reset player statistics
        function resetStats() {
            playerStats = {
                totalKills: 0,
                totalDeaths: 0,
                totalEnemyDeaths: 0,
                totalLandings: 0,
                totalCrashes: 0
            };
            savePlayerStats();
            updateStatsDisplay();
            const resetBtn = document.querySelector('.stats-reset');
            resetBtn.classList.add('reset-indicator');
            resetBtn.innerText = '✅ Reset Complete!';
            setTimeout(() => {
                resetBtn.classList.remove('reset-indicator');
                resetBtn.innerText = '🔄 Reset Statistics';
            }, 1500);
        }

        // Track statistics
        function trackKill() {
            playerStats.totalKills++;
            savePlayerStats();
        }
        function trackDeath(byEnemy = false) {
            playerStats.totalDeaths++;
            if (byEnemy) {
                playerStats.totalEnemyDeaths = (playerStats.totalEnemyDeaths || 0) + 1;
            } else {
                playerStats.totalCrashes++;
            }
            savePlayerStats();
        }
        function trackLanding() {
            playerStats.totalLandings++;
            savePlayerStats();
            updateStatsDisplay();
        }

        // Auto-refresh function
        function refreshGameState() {
            console.log('Game state refreshed - sound enabled:', soundEnabled);
            const soundToggle = document.getElementById('sound-toggle');
            if (soundToggle) {
                soundToggle.className = soundEnabled ? 'setting-toggle active' : 'setting-toggle';
            }
            const musicSlider = document.getElementById('music-volume');
            const sfxSlider = document.getElementById('sfx-volume');
            if (musicSlider) musicSlider.value = musicVolume;
            if (sfxSlider) sfxSlider.value = sfxVolume;
            document.getElementById('sensitivity-value').innerText = sensitivityLevel;
            document.getElementById('difficulty-value').innerText = difficultyLevel;
            const autoShootSetting = document.getElementById('auto-shoot-setting');
            if (autoShootSetting) {
                autoShootSetting.className = autoShootEnabled ? 'setting-toggle active' : 'setting-toggle';
            }
            const buttonControlsToggle = document.getElementById('button-controls-toggle');
            if (buttonControlsToggle) {
                buttonControlsToggle.className = buttonControlsEnabled ? 'setting-toggle active' : 'setting-toggle';
            }
            const joystickToggle = document.getElementById('joystick-toggle');
            if (joystickToggle) {
                joystickToggle.className = joystickEnabled ? 'setting-toggle active' : 'setting-toggle';
            }
            const tiltToggle = document.getElementById('tilt-toggle');
            if (tiltToggle) {
                tiltToggle.className = tiltEnabled ? 'setting-toggle active' : 'setting-toggle';
            }
            const autoShootToggle = document.getElementById('auto-shoot-toggle');
            if (autoShootToggle) {
                autoShootToggle.style.display = 'none';
            }
            updateControlDisplay();
            updateMobileControlsDisplay();
            updatePilotDataDisplay();
            updatePilotWelcomeDisplay();
            updateFreeSpinDisplay();
            updateHomeCoinDisplay();
            updateDollarDisplay();
            updateHighScoreDisplay();
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
        const shopDollars = document.getElementById('shop-dollars-amount');
        const shopItemsContainer = document.getElementById('shop-items-container');
        const dollarDisplay = document.getElementById('dollar-display');
        const shopBtn = document.getElementById('shop-btn');
        const achievementsMenu = document.getElementById('achievements-menu');
        const planesMenu = document.getElementById('planes-menu');
        const achievementsList = document.getElementById('achievements-list');
        const planesList = document.getElementById('planes-list');
        const dailyRewardBtn = document.getElementById('daily-reward-btn');
        const freeSpinBtn = document.getElementById('free-spin-btn');
        const spinCount = document.getElementById('spin-count');
        const privacyMenu = document.getElementById('privacy-menu');
        const totalDollarsDisplay = document.getElementById('total-dollars-display');
        const clearedToLand = document.getElementById('cleared-to-land');
        const gameoverScore = document.getElementById('gameover-score');
        const gameoverKills = document.getElementById('gameover-kills');
        const gameoverCombo = document.getElementById('gameover-combo');
        const gameoverDollars = document.getElementById('gameover-dollars');
        const gameoverLevel = document.getElementById('gameover-level');
        const gameoverEnemyDeaths = document.getElementById('gameover-enemy-deaths');
        const moonElement = document.getElementById('moon');
        const pitchButtons = document.getElementById('pitch-buttons');
        const pauseMenuBtn = document.getElementById('pause-menu-btn');
        const pauseMenu = document.getElementById('pause-menu');
        const noteMenu = document.getElementById('note-menu');
        const noteBtn = document.getElementById('note-btn');

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
        let joystickEnabled = false;
        let tiltEnabled = false;

        // Game variables
        let currentLevel = 1;
        let currentStage = 1;
        let totalScore = 0;
        let totalKills = 0;
        const STAGES_PER_LEVEL = 5;
        let currentCombo = 0;
        let maxCombo = 0;
        let comboMultiplier = 1;
        let comboDecayTimer = 0;
        const COMBO_DECAY_TIME = 180;

        // Cleared to land message timer
        let clearedToLandTimer = 0;
        const CLEARED_TO_LAND_DURATION = 240;
        
        const achievements = [
            { id: 'firstKill', name: 'FIRST BLOOD', desc: 'Destroy your first enemy', reward: 50, icon: '🎯', completed: false, progress: 0, target: 1 },
            { id: 'acePilot', name: 'ACE PILOT', desc: 'Destroy 100 enemies', reward: 500, icon: '🏅', completed: false, progress: 0, target: 100 },
            { id: 'perfectLanding', name: 'PERFECT LANDING', desc: 'Land with sink rate < 100 FPM', reward: 200, icon: '🛬', completed: false, progress: 0, target: 1 },
            { id: 'bossSlayer', name: 'BOSS SLAYER', desc: 'Defeat 5 bosses', reward: 1000, icon: '👑', completed: false, progress: 0, target: 5 },
            { id: 'collector', name: 'COLLECTOR', desc: 'Earn 1000 in-game dollars', reward: 200, icon: '💰', completed: false, progress: 0, target: 1000 },
            { id: 'survivor', name: 'SURVIVOR', desc: 'Complete 10 stages', reward: 500, icon: '⭐', completed: false, progress: 0, target: 10 },
            { id: 'meteorHunter', name: 'METEOR HUNTER', desc: 'Destroy 50 meteoroids', reward: 300, icon: '☄️', completed: false, progress: 0, target: 50 },
            { id: 'mysteryCollector', name: 'MYSTERY COLLECTOR', desc: 'Open 10 mystery boxes', reward: 500, icon: '📦', completed: false, progress: 0, target: 10 }
        ];
        
        // UPDATED PLANES - 12 PLANES WITH HIGHER PRICES
        const planes = [
            { id: 'trainer', name: 'TRAINER', icon: '✈️', speed: 12, handling: 0.035, health: 100, color: '#475569', unlocked: true, price: 0 },
            { id: 'fighter', name: 'FIGHTER', icon: '⚡', speed: 15, handling: 0.04, health: 120, color: '#ef4444', unlocked: false, price: 1000 },
            { id: 'interceptor', name: 'INTERCEPTOR', icon: '🚀', speed: 18, handling: 0.045, health: 110, color: '#f97316', unlocked: false, price: 2000 },
            { id: 'gunship', name: 'GUNSHIP', icon: '💪', speed: 10, handling: 0.03, health: 200, color: '#64748b', unlocked: false, price: 3000 },
            { id: 'ace', name: 'ACE', icon: '👑', speed: 16, handling: 0.05, health: 150, color: '#fbbf24', unlocked: false, price: 4000 },
            { id: 'stealth', name: 'STEALTH', icon: '🌑', speed: 20, handling: 0.055, health: 130, color: '#1e293b', unlocked: false, price: 5000 },
            { id: 'phoenix', name: 'PHOENIX', icon: '🔥', speed: 22, handling: 0.06, health: 180, color: '#ff6b6b', unlocked: false, price: 8000 },
            { id: 'thunderbolt', name: 'THUNDERBOLT', icon: '⚡', speed: 25, handling: 0.065, health: 140, color: '#4ecdc4', unlocked: false, price: 12000 },
            { id: 'titan', name: 'TITAN', icon: '🛡️', speed: 14, handling: 0.025, health: 300, color: '#95a5a6', unlocked: false, price: 15000 },
            { id: 'vortex', name: 'VORTEX', icon: '🌀', speed: 19, handling: 0.07, health: 160, color: '#9b59b6', unlocked: false, price: 10000 },
            { id: 'nova', name: 'NOVA', icon: '💫', speed: 21, handling: 0.058, health: 170, color: '#f39c12', unlocked: false, price: 18000 },
            { id: 'legend', name: 'LEGEND', icon: '⭐', speed: 28, handling: 0.08, health: 200, color: '#f1c40f', unlocked: false, price: 25000 }
        ];
        
        let selectedPlane = 'trainer';
        let lastDailyReward = null;
        const DAILY_REWARD_AMOUNT = 50; // CHANGED FROM 100 TO 50
        const LEVEL_COMPLETION_REWARD = 5; // 5 coins for completing a level
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

        // ===== NEW BOSS TYPES - ADDED THREE UNIQUE BOSSES =====
        const bossTypes = {
            trainer: { 
                name: "TRAINER BOSS", 
                health: 200, 
                thrust: 3.0, 
                shootSpeed: 40, 
                bulletSpeed: 12, 
                color: "#6b7280", 
                size: 2.0, 
                pattern: "basic", 
                points: 500, 
                coins: 100, 
                shootDuration: 300, 
                shootCooldown: 900,
                bulletCount: 2,
                spreadAngle: 0.15
            },
            warlord: { 
                name: "WARLORD BOSS", 
                health: 350, 
                thrust: 4.0, 
                shootSpeed: 30, 
                bulletSpeed: 15, 
                color: "#ef4444", 
                size: 2.2, 
                pattern: "spread", 
                points: 800, 
                coins: 150, 
                shootDuration: 200, 
                shootCooldown: 600,
                bulletCount: 3,
                spreadAngle: 0.2
            },
            phantom: { 
                name: "PHANTOM BOSS", 
                health: 500, 
                thrust: 5.0, 
                shootSpeed: 20, 
                bulletSpeed: 18, 
                color: "#f97316", 
                size: 2.5, 
                pattern: "rapid", 
                points: 1200, 
                coins: 200, 
                shootDuration: 150, 
                shootCooldown: 400,
                bulletCount: 5,
                spreadAngle: 0.25,
                teleportTimer: 0
            }
        };

        // ===== JOYSTICK CONTROL SYSTEM - ENHANCED =====
        let joystickActive = false;
        let joystickData = { x: 0, y: 0 };
        const joystickContainer = document.getElementById('joystick-container');
        const joystickStick = document.getElementById('joystick-stick');
        const tiltIndicator = document.getElementById('tilt-indicator');
        const tiltBall = document.getElementById('tilt-ball');

        // Joystick touch handlers
        if (joystickContainer) {
            joystickContainer.addEventListener('touchstart', handleJoystickStart, { passive: false });
            joystickContainer.addEventListener('touchmove', handleJoystickMove, { passive: false });
            joystickContainer.addEventListener('touchend', handleJoystickEnd, { passive: false });
        }

        function handleJoystickStart(e) {
            if (!joystickEnabled) return;
            e.preventDefault();
            joystickActive = true;
            joystickStick.classList.add('active');
            handleJoystickMove(e);
        }

        function handleJoystickMove(e) {
            if (!joystickEnabled || !joystickActive) return;
            e.preventDefault();
            const touch = e.touches[0];
            const rect = joystickContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let deltaX = touch.clientX - centerX;
            let deltaY = touch.clientY - centerY;
            const maxDistance = rect.width / 2 - 30;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance > maxDistance) {
                deltaX = (deltaX / distance) * maxDistance;
                deltaY = (deltaY / distance) * maxDistance;
            }
            joystickStick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
            joystickData.x = deltaX / maxDistance;
            joystickData.y = deltaY / maxDistance;
            applyJoystickInput();
        }

        function handleJoystickEnd(e) {
            e.preventDefault();
            joystickActive = false;
            joystickStick.classList.remove('active');
            joystickStick.style.transform = 'translate(-50%, -50%)';
            joystickData = { x: 0, y: 0 };
            applyJoystickInput();
        }

        function applyJoystickInput() {
            if (!player || player.dead || isPaused) return;
            if (joystickData.y < -0.2) {
                keys['ArrowUp'] = true;
                keys['ArrowDown'] = false;
            } else if (joystickData.y > 0.2) {
                keys['ArrowDown'] = true;
                keys['ArrowUp'] = false;
            } else {
                keys['ArrowUp'] = false;
                keys['ArrowDown'] = false;
            }
        }

        // ===== TILT CONTROL SYSTEM - ENHANCED =====
        let tiltData = { beta: 0, gamma: 0 };
        function initTiltControls() {
            if (window.DeviceOrientationEvent && tiltEnabled) {
                window.addEventListener('deviceorientation', handleTilt, true);
                if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                    document.addEventListener('click', requestTiltPermission, { once: true });
                }
            }
        }

        function requestTiltPermission() {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleTilt, true);
                        }
                    })
                    .catch(console.error);
            }
        }

        function handleTilt(event) {
            if (!tiltEnabled || !player || player.dead || isPaused) return;
            if (joystickActive) return;
            tiltData.gamma = event.gamma || 0;
            tiltData.beta = event.beta || 0;
            updateTiltIndicator();
            applyTiltInput();
        }

        function updateTiltIndicator() {
            if (!tiltBall) return;
            const maxTilt = 45;
            const tiltX = Math.max(-maxTilt, Math.min(maxTilt, tiltData.gamma));
            const tiltY = Math.max(-maxTilt, Math.min(maxTilt, tiltData.beta));
            const scaleX = tiltX / maxTilt * 25;
            const scaleY = tiltY / maxTilt * 25;
            tiltBall.style.transform = `translate(calc(-50% + ${scaleX}px), calc(-50% + ${scaleY}px))`;
        }

        function applyTiltInput() {
            if (!player || player.dead || isPaused) return;
            const tiltThreshold = 5;
            if (tiltData.gamma < -tiltThreshold) {
                keys['ArrowUp'] = true;
                keys['ArrowDown'] = false;
            } else if (tiltData.gamma > tiltThreshold) {
                keys['ArrowDown'] = true;
                keys['ArrowUp'] = false;
            } else {
                keys['ArrowUp'] = false;
                keys['ArrowDown'] = false;
            }
        }

        // ===== BUTTON CONTROLS TOGGLE FUNCTIONS =====
        function toggleButtonControls() {
            buttonControlsEnabled = !buttonControlsEnabled;
            if (buttonControlsEnabled) {
                if (joystickEnabled) {
                    joystickEnabled = false;
                }
                if (tiltEnabled) {
                    tiltEnabled = false;
                }
                if (tiltIndicator) {
                    tiltIndicator.classList.remove('tilt-enabled');
                }
            }
            updateControlDisplay();
            saveGame();
            refreshGameState();
            updateMobileControlsDisplay();
        }

        function toggleTiltControls() {
            tiltEnabled = !tiltEnabled;
            if (tiltEnabled) {
                joystickEnabled = false;
                buttonControlsEnabled = false;
            }
            if (tiltEnabled) {
                initTiltControls();
                if (tiltIndicator) {
                    tiltIndicator.classList.add('tilt-enabled');
                }
            } else {
                if (tiltIndicator) {
                    tiltIndicator.classList.remove('tilt-enabled');
                }
            }
            saveGame();
            refreshGameState();
            updateMobileControlsDisplay();
        }

        function toggleJoystickControl() {
            joystickEnabled = !joystickEnabled;
            if (joystickEnabled) {
                tiltEnabled = false;
                buttonControlsEnabled = false;
                if (tiltIndicator) {
                    tiltIndicator.classList.remove('tilt-enabled');
                }
            }
            updateControlDisplay();
            saveGame();
            refreshGameState();
            updateMobileControlsDisplay();
        }

        function updateControlDisplay() {
            if (joystickContainer) {
                if (joystickEnabled) {
                    joystickContainer.classList.add('joystick-enabled');
                } else {
                    joystickContainer.classList.remove('joystick-enabled');
                }
            }
            if (tiltIndicator) {
                if (tiltEnabled) {
                    tiltIndicator.classList.add('tilt-enabled');
                } else {
                    tiltIndicator.classList.remove('tilt-enabled');
                }
            }
            if (pitchButtons) {
                pitchButtons.style.display = buttonControlsEnabled ? 'flex' : 'none';
            }
        }

        // ===== UPDATE MOBILE CONTROLS DISPLAY =====
        function shouldShowMobileControls() {
            if (window.innerWidth >= 1025) {
                return false;
            }
            if (buttonControlsEnabled) {
                return true;
            }
            if (joystickEnabled || tiltEnabled) {
                return true;
            }
            return false;
        }

        function updateMobileControlsDisplay() {
            const mobileControls = document.getElementById('mobile-controls');
            if (mobileControls) {
                if (shouldShowMobileControls()) {
                    mobileControls.style.display = 'block';
                    if (window.innerHeight > window.innerWidth) {
                        mobileControls.classList.add('portrait-controls');
                    } else {
                        mobileControls.classList.remove('portrait-controls');
                    }
                } else {
                    mobileControls.style.display = 'none';
                }
            }
        }

        window.addEventListener('load', function () {
            setTimeout(() => {
                initTiltControls();
            }, 2500);
        });

        // ===== AUTO-ROTATE FOR MOBILE - ENHANCED =====
        function requestLandscapeOrientation() {
            if (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth) {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(e => {
                        console.log('Orientation lock not supported or denied');
                    });
                }
            }
        }

        // Force landscape on orientation change
        function forceLandscapeOrientation() {
            if (window.innerHeight > window.innerWidth) {
                requestLandscapeOrientation();
            }
        }

        window.addEventListener('load', function () {
            requestLandscapeOrientation();
            forceLandscapeOrientation();
        });

        window.addEventListener('resize', function () {
            requestLandscapeOrientation();
            forceLandscapeOrientation();
            updateMobileControlsDisplay();
        });

        window.addEventListener('orientationchange', function () {
            setTimeout(() => {
                resizeCanvas();
                refreshGameState();
                updateMobileControlsDisplay();
                if (window.innerHeight > window.innerWidth) {
                    if (!isPaused) {
                        isPaused = true;
                    }
                    forceLandscapeOrientation();
                }
            }, 100);
        });

        // Check orientation periodically
        setInterval(forceLandscapeOrientation, 1000);

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
            const altitude = Math.max(0, Math.floor(WORLD_GROUND - player.y));
            if (altitude >= 5000 && altitude <= 6000) {
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
                            const puffX = sx + (p - cloud.puffCount / 2) * cloud.width * 0.4;
                            const puffY = sy + Math.sin(cloud.drift + p) * 10;
                            const gradient = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, cloud.height);
                            gradient.addColorStop(0, 'rgba(200, 200, 220, 0.9)');
                            gradient.addColorStop(0.5, 'rgba(180, 180, 200, 0.7)');
                            gradient.addColorStop(1, 'rgba(160, 160, 180, 0.3)');
                            ctx.fillStyle = gradient;
                            ctx.beginPath();
                            ctx.ellipse(puffX, puffY, cloud.width * 0.3, cloud.height * 0.5, 0, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.restore();
                    }
                });
            }
        }

        // ===== TIMED WEATHER EFFECTS (REDUCED SNOW DENSITY) =====
        let weatherParticles = [];
        let weatherType = 'clear';
        let weatherActive = false;
        let weatherTimer = 0;
        const WEATHER_DURATION = 300;
        let weatherFadeTimer = 0;
        const WEATHER_FADE_DURATION = 60;
        
        function checkAndStartWeather() {
            if (Math.random() < 0.3 && !weatherActive) {
                weatherActive = true;
                weatherType = Math.random() < 0.5 ? 'rain' : 'snow';
                weatherTimer = WEATHER_DURATION;
                weatherFadeTimer = 0;
                weatherParticles = [];
                
                if (weatherType === 'rain') {
                    for (let i = 0; i < 10; i++) {
                        clouds.push({
                            x: player.x - 1000 + Math.random() * 2000,
                            y: 800 + Math.random() * 1000,
                            width: 300 + Math.random() * 400,
                            height: 80 + Math.random() * 100,
                            speed: 0.3 + Math.random() * 0.5,
                            opacity: 0.7,
                            puffCount: 5,
                            drift: Math.random() * Math.PI * 2,
                            driftSpeed: 0.002
                        });
                    }
                } else if (weatherType === 'snow') {
                    for (let i = 0; i < 1; i++) { // REDUCED from 3 to 1 for minimal density
                        clouds.push({
                            x: player.x - 1500 + Math.random() * 3000,
                            y: 600 + Math.random() * 800,
                            width: 250 + Math.random() * 350,
                            height: 60 + Math.random() * 80,
                            speed: 0.2 + Math.random() * 0.4,
                            opacity: 0.6,
                            puffCount: 4,
                            drift: Math.random() * Math.PI * 2,
                            driftSpeed: 0.001
                        });
                    }
                }
            }
        }

        function updateWeather() {
            if (weatherActive) {
                weatherTimer--;
                
                if (weatherType === 'rain') {
                    for (let i = 0; i < 10; i++) {
                        weatherParticles.push({
                            x: Math.random() * canvas.width,
                            y: -10 - Math.random() * 20,
                            speed: 8 + Math.random() * 8,
                            angle: 0.1 + Math.random() * 0.1,
                            type: 'rain',
                            life: 1.0
                        });
                    }
                } else if (weatherType === 'snow') {
                    for (let i = 0; i < 1; i++) { // REDUCED from 3 to 1 for minimal density
                        weatherParticles.push({
                            x: Math.random() * canvas.width,
                            y: -10 - Math.random() * 20,
                            speed: 2 + Math.random() * 3,
                            drift: (Math.random() - 0.5) * 0.8,
                            size: 3 + Math.random() * 4,
                            spin: Math.random() * Math.PI * 2,
                            spinSpeed: 0.02 + Math.random() * 0.03,
                            type: 'snow',
                            life: 1.0
                        });
                    }
                }
                
                if (weatherTimer <= 0) {
                    weatherFadeTimer = WEATHER_FADE_DURATION;
                    weatherActive = false;
                }
            }
            
            if (weatherFadeTimer > 0) {
                weatherFadeTimer--;
                
                if (weatherFadeTimer <= 0) {
                    weatherType = 'clear';
                    weatherParticles = [];
                    clouds = clouds.filter(c => c.width < 300);
                }
            }
            
            const groundY = WORLD_GROUND - camera.y;
            for (let i = weatherParticles.length - 1; i >= 0; i--) {
                const p = weatherParticles[i];
                if (p.type === 'rain') {
                    p.x += p.angle * 2;
                    p.y += p.speed;
                    p.life -= 0.005;
                    if (p.y >= groundY || p.life <= 0) {
                        if (p.y >= groundY && p.life > 0.5) {
                            for (let s = 0; s < 3; s++) {
                                particles.push({
                                    x: p.x,
                                    y: groundY - 5,
                                    vx: (Math.random() - 0.5) * 2,
                                    vy: -Math.random() * 2,
                                    life: 0.3,
                                    color: '#a0d0ff',
                                    size: 1
                                });
                            }
                        }
                        weatherParticles.splice(i, 1);
                    }
                } else if (p.type === 'snow') {
                    p.x += p.drift + Math.sin(p.spin) * 0.5;
                    p.y += p.speed;
                    p.spin += p.spinSpeed;
                    p.life -= 0.002;
                    if (p.y >= groundY || p.life <= 0) {
                        weatherParticles.splice(i, 1);
                    }
                }
            }
        }

        function drawWeather() {
            const groundY = WORLD_GROUND - camera.y;
            const fadeAlpha = weatherFadeTimer > 0 ? weatherFadeTimer / WEATHER_FADE_DURATION : 1;
            
            weatherParticles.forEach(p => {
                if (p.type === 'rain') {
                    ctx.save();
                    ctx.strokeStyle = `rgba(174, 194, 224, ${p.life * 0.6 * fadeAlpha})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.angle * 8, Math.min(p.y + 12, groundY));
                    ctx.stroke();
                    ctx.restore();
                } else if (p.type === 'snow') {
                    ctx.save();
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.8 * fadeAlpha})`;
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 8 * p.life;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.restore();
                }
            });
        }

        // ===== ENHANCED METEOROID SYSTEM WITH GROUND EXPLOSIONS =====
        let meteoroids = [];
        const MAX_METEOROIDS = 30;
        const METEOROID_SPAWN_RATE = 0.05;
        
        function generateMeteoroid() {
            if (meteoroids.length < MAX_METEOROIDS && Math.random() < METEOROID_SPAWN_RATE) {
                meteoroids.push({
                    x: player.x + canvas.width + 200 + Math.random() * 3000,
                    y: 500 + Math.random() * 30000,
                    vx: -3 - Math.random() * 8,
                    vy: 1 + Math.random() * 6,
                    size: 2 + Math.random() * 12,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.05,
                    life: 1.0,
                    trail: [],
                    color: `hsl(${20 + Math.random() * 30}, 70%, ${40 + Math.random() * 40}%)`,
                    damage: 20 + Math.floor(Math.random() * 30),
                    isBackground: Math.random() > 0.3
                });
            }
        }
        
        function createMeteorExplosion(x, y, size) {
            meteorExplosions.push({
                x: x,
                y: y,
                size: size * 2,
                life: 1.0,
                color: '#ff6600'
            });
            
            // Create additional explosion particles
            for (let i = 0; i < size; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 15,
                    vy: (Math.random() - 0.5) * 15 - 5,
                    life: 0.8 + Math.random() * 0.4,
                    color: '#ffaa00',
                    size: 3 + Math.random() * 5
                });
            }
        }
        
        function updateMeteoroids() {
            generateMeteoroid();
            
            for (let i = meteoroids.length - 1; i >= 0; i--) {
                const m = meteoroids[i];
                
                if (frame % 3 === 0) {
                    m.trail.push({
                        x: m.x,
                        y: m.y,
                        life: 0.6,
                        size: m.size * 0.3
                    });
                    if (m.trail.length > 8) {
                        m.trail.shift();
                    }
                }
                
                m.x += m.vx;
                m.y += m.vy;
                m.rotation += m.rotationSpeed;
                
                m.trail.forEach(t => t.life -= 0.01);
                m.trail = m.trail.filter(t => t.life > 0);
                
                // Check if meteoroid hits the ground
                if (m.y >= WORLD_GROUND) {
                    createMeteorExplosion(m.x, WORLD_GROUND, m.size);
                    playSound('explode');
                    meteoroids.splice(i, 1);
                    continue;
                }
                
                if (!m.isBackground && !player.dead && !player.exploded) {
                    const dist = Math.hypot(m.x - player.x, m.y - player.y);
                    if (dist < m.size * 2 + 20) {
                        if (activePower !== 'shield') {
                            player.health -= m.damage;
                            createBlast(m.x, m.y, '#ff6600', 15);
                            playSound('hit');
                            
                            if (player.health <= 0) {
                                trackDeath(true);
                                triggerCrashSequence();
                            }
                        }
                        createMeteorExplosion(m.x, m.y, m.size);
                        meteoroids.splice(i, 1);
                        continue;
                    }
                }
                
                if (!m.isBackground) {
                    for (let j = bullets.length - 1; j >= 0; j--) {
                        const b = bullets[j];
                        if (Math.hypot(b.x - m.x, b.y - m.y) < m.size * 2 + 10) {
                            createMeteorExplosion(m.x, m.y, m.size);
                            bullets.splice(j, 1);
                            meteoroids.splice(i, 1);
                            inGameDollars += 3;
                            checkAchievement('meteorHunter', 1);
                            updateDollarDisplay();
                            playSound('explode');
                            break;
                        }
                    }
                }
                
                if (m.x < player.x - canvas.width - 1000) {
                    meteoroids.splice(i, 1);
                }
            }
            
            // Update meteor explosions
            for (let i = meteorExplosions.length - 1; i >= 0; i--) {
                const exp = meteorExplosions[i];
                exp.life -= 0.02;
                if (exp.life <= 0) {
                    meteorExplosions.splice(i, 1);
                }
            }
        }
        
        function drawMeteoroids() {
            meteoroids.forEach(m => {
                m.trail.forEach((t, idx) => {
                    const sx = t.x - camera.x;
                    const sy = t.y - camera.y;
                    if (sx > -100 && sx < canvas.width + 100 && sy > -100 && sy < canvas.height + 100) {
                        ctx.globalAlpha = t.life * 0.4;
                        ctx.fillStyle = m.color;
                        ctx.shadowColor = '#ffaa00';
                        ctx.shadowBlur = 8;
                        ctx.beginPath();
                        ctx.arc(sx, sy, t.size * (0.5 + idx * 0.1), 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                
                const sx = m.x - camera.x;
                const sy = m.y - camera.y;
                if (sx > -150 && sx < canvas.width + 150 && sy > -150 && sy < canvas.height + 150) {
                    ctx.save();
                    ctx.translate(sx, sy);
                    ctx.rotate(m.rotation);
                    ctx.shadowColor = m.isBackground ? '#886644' : '#ff6600';
                    ctx.shadowBlur = m.isBackground ? 10 : 20;
                    ctx.fillStyle = m.color;
                    ctx.globalAlpha = m.life;
                    
                    ctx.beginPath();
                    ctx.moveTo(0, -m.size);
                    for (let a = 0; a < 7; a++) {
                        const angle = (a / 7) * Math.PI * 2;
                        const radius = m.size * (0.8 + Math.random() * 0.4);
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    
                    if (!m.isBackground) {
                        ctx.shadowBlur = 30;
                        ctx.fillStyle = '#ff9900';
                        ctx.globalAlpha = 0.2;
                        ctx.beginPath();
                        ctx.arc(-m.size/2, m.size/2, m.size/2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    ctx.restore();
                }
            });
            
            // Draw meteor explosions with animation
            meteorExplosions.forEach(exp => {
                const sx = exp.x - camera.x;
                const sy = exp.y - camera.y;
                if (sx > -200 && sx < canvas.width + 200 && sy > -200 && sy < canvas.height + 200) {
                    const size = exp.size * (1 - exp.life) * 2;
                    const alpha = exp.life;
                    
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.shadowColor = '#ff6600';
                    ctx.shadowBlur = 30;
                    
                    // Inner explosion
                    ctx.fillStyle = '#ffff00';
                    ctx.beginPath();
                    ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Outer explosion
                    ctx.fillStyle = '#ff6600';
                    ctx.beginPath();
                    ctx.arc(sx, sy, size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Shockwave
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(sx, sy, size * 1.5, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            });
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        // ===== 10,000+ SHOOTING STARS SYSTEM =====
        let shootingStars = [];
        const MAX_SHOOTING_STARS = 10000;
        const SHOOTING_STAR_SPAWN_RATE = 0.3;
        
        function generateShootingStar() {
            if (shootingStars.length < MAX_SHOOTING_STARS && Math.random() < SHOOTING_STAR_SPAWN_RATE) {
                const starCount = 3 + Math.floor(Math.random() * 10);
                for (let s = 0; s < starCount; s++) {
                    if (shootingStars.length >= MAX_SHOOTING_STARS) break;
                    shootingStars.push({
                        x: player.x + canvas.width + 500 + Math.random() * 5000,
                        y: 500 + Math.random() * 30000,
                        vx: -12 - Math.random() * 20,
                        vy: 1 + Math.random() * 15,
                        size: 1 + Math.random() * 5,
                        life: 0.7 + Math.random() * 0.3,
                        trail: [],
                        color: `hsl(${40 + Math.random() * 20}, 100%, ${70 + Math.random() * 30}%)`,
                        age: 0,
                        maxAge: 30 + Math.floor(Math.random() * 90),
                        twinkle: Math.random() * Math.PI * 2
                    });
                }
            }
        }

        function updateShootingStars() {
            generateShootingStar();
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const star = shootingStars[i];
                if (frame % 2 === 0) {
                    star.trail.push({
                        x: star.x,
                        y: star.y,
                        life: 0.8,
                        size: star.size * 0.5
                    });
                    if (star.trail.length > 20) {
                        star.trail.shift();
                    }
                }
                star.x += star.vx;
                star.y += star.vy;
                star.age++;
                star.life *= 0.998;
                star.trail.forEach(t => t.life -= 0.02);
                star.trail = star.trail.filter(t => t.life > 0);
                if (star.age > star.maxAge || star.x < player.x - canvas.width - 2000 || star.life < 0.1) {
                    shootingStars.splice(i, 1);
                }
            }
        }

        function drawShootingStars() {
            shootingStars.forEach(star => {
                star.trail.forEach((t, index) => {
                    const sx = t.x - camera.x * 0.1;
                    const sy = t.y - camera.y * 0.1;
                    if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
                        ctx.globalAlpha = t.life * 0.4;
                        ctx.fillStyle = star.color;
                        ctx.shadowColor = star.color;
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.arc(sx, sy, t.size * (0.5 + index * 0.1), 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            });
            shootingStars.forEach(star => {
                const sx = star.x - camera.x * 0.1;
                const sy = star.y - camera.y * 0.1;
                if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
                    const twinkle = 0.7 + 0.3 * Math.sin(frame * 0.1 + star.twinkle);
                    ctx.globalAlpha = star.life * twinkle;
                    ctx.fillStyle = star.color;
                    ctx.shadowColor = star.color;
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        // ===== BIRDS FLYING =====
        let birds = [];
        function updateBirds(altitude) {
            if (altitude >= 400 && altitude <= 500) {
                if (Math.random() < 0.05 && birds.length < 10) {
                    birds.push({
                        x: player.x + canvas.width,
                        y: player.y + (Math.random() * 200 - 100),
                        speed: 2 + Math.random() * 3,
                        size: 5 + Math.random() * 5,
                        wingPhase: Math.random() * Math.PI
                    });
                }
                for (let i = birds.length - 1; i >= 0; i--) {
                    birds[i].x -= birds[i].speed;
                    birds[i].wingPhase += 0.2;
                    if (birds[i].x < player.x - canvas.width) {
                        birds.splice(i, 1);
                    }
                }
            } else {
                birds = [];
            }
        }

        function drawBirds() {
            birds.forEach(bird => {
                const sx = bird.x - camera.x;
                const sy = bird.y - camera.y;
                if (sx > -50 && sx < canvas.width + 50 && sy > -50 && sy < canvas.height + 50) {
                    ctx.save();
                    ctx.translate(sx, sy);
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    const wingOffset = Math.sin(bird.wingPhase) * 5;
                    ctx.moveTo(-bird.size, -wingOffset);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(bird.size, -wingOffset);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        }

        // ===== GROUND ANIMATION =====
        let groundSparkles = [];
        function updateGroundSparkles() {
            if (Math.random() < 0.1) {
                groundSparkles.push({
                    x: player.x - canvas.width / 2 + Math.random() * canvas.width,
                    y: WORLD_GROUND - 5 - Math.random() * 20,
                    life: 0.5 + Math.random() * 0.5,
                    size: 2 + Math.random() * 4,
                    speed: 0.1 + Math.random() * 0.3
                });
            }
            for (let i = groundSparkles.length - 1; i >= 0; i--) {
                const s = groundSparkles[i];
                s.life -= 0.01;
                s.y -= s.speed;
                if (s.life <= 0) {
                    groundSparkles.splice(i, 1);
                }
            }
        }

        function drawGroundSparkles() {
            const groundY = WORLD_GROUND - camera.y;
            groundSparkles.forEach(s => {
                const sx = s.x - camera.x;
                if (sx > 0 && sx < canvas.width) {
                    ctx.save();
                    ctx.globalAlpha = s.life;
                    ctx.fillStyle = '#fbbf24';
                    ctx.shadowColor = '#fbbf24';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(sx, groundY - 5, s.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });
        }

        // ===== ENHANCED ENEMY SHAPES =====
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
                drawShape: function (ctx, x, y, angle, scale, wingAngle) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.scale(scale * 0.8, scale * 0.8);
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
                drawShape: function (ctx, x, y, angle, scale, wingAngle) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.scale(scale * 0.8, scale * 0.8);
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
                drawShape: function (ctx, x, y, angle, scale, wingAngle) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.scale(scale * 0.8, scale * 0.8);
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
                    ctx.lineTo(45, 32);
                    ctx.lineTo(20, 0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
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
                drawShape: function (ctx, x, y, angle, scale, wingAngle) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.scale(scale * 0.8, scale * 0.8);
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
                    ctx.fillStyle = "#4b5563";
                    ctx.beginPath();
                    ctx.arc(20, 0, 6, 0, Math.PI * 2);
                    ctx.fill();
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
                drawShape: function (ctx, x, y, angle, scale, wingAngle) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.scale(scale * 0.8, scale * 0.8);
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

        // Player stats
        let playerMaxThrust = 12;
        let playerAcceleration = 0.1;
        let playerManeuverability = 0.035;
        let playerBaseHealth = 100;
        let playerBaseMissiles = 6;
        let playerColor = "#475569";
        let previousThrust = 4;
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

        // Power system (using dollars instead of coins)
        let activePower = null;
        let powerDuration = 0;
        let powerCooldown = 0;
        let powerMissileCount = 0;
        let originalEnemySpeedMultiplier = 1.0;
        
        const powerItems = [
            { id: 'rapidFire', name: 'RAPID FIRE', description: 'Gun fires 3x faster for 10 seconds', price: 50, levelReq: 1, icon: '🔥', duration: 600, effect: function () { activePower = 'rapidFire'; powerDuration = 600; } },
            { id: 'shield', name: 'ENERGY SHIELD', description: 'Invulnerable for 8 seconds', price: 75, levelReq: 2, icon: '🛡️', duration: 480, effect: function () { activePower = 'shield'; powerDuration = 480; } },
            { id: 'doubleDamage', name: 'DOUBLE DAMAGE', description: 'All weapons deal 2x damage for 12 seconds', price: 100, levelReq: 3, icon: '⚡', duration: 720, effect: function () { activePower = 'doubleDamage'; powerDuration = 720; } },
            { id: 'timeSlow', name: 'TIME SLOW', description: 'Slows down enemies for 8 seconds', price: 120, levelReq: 4, icon: '⏱️', duration: 480, effect: function () { activePower = 'timeSlow'; powerDuration = 480; } },
            { id: 'homingMissiles', name: 'HOMING MISSILES', description: 'Next 10 missiles are super homing', price: 150, levelReq: 5, icon: '🎯', duration: 0, effect: function () { activePower = 'homingMissiles'; powerMissileCount = 10; } },
            { id: 'repairKit', name: 'REPAIR KIT', description: 'Instantly restore 50% health', price: 60, levelReq: 1, icon: '❤️', duration: 0, effect: function () { player.health = Math.min(player.health + playerBaseHealth * 0.5, playerBaseHealth); document.getElementById('p-health').innerText = player.health + "%"; } },
            { id: 'missileRefill', name: 'MISSILE REFILL', description: 'Refill all missiles', price: 40, levelReq: 1, icon: '🚀', duration: 0, effect: function () { missileCount = playerBaseMissiles; } }
        ];

        // ===== ORIGINAL, COPYRIGHT-FREE SOUND SYSTEM =====
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
                    if (homeMenu.style.display !== 'none' && homeMenu.classList.contains('visible')) {
                        setTimeout(() => initHomeMusic(), 100);
                    }
                }).catch(e => console.log('Failed to resume audio context:', e));
            }
        }

        function initHomeMusic() {
            if (!soundEnabled || !audioCtx) {
                console.log('Sound disabled or no audio context');
                return;
            }
            if (homeMusicStarted) {
                console.log('Home music already started');
                return;
            }
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
                osc1.frequency.setValueAtTime(440, now);
                osc1.frequency.setValueAtTime(494, now + 0.5);
                osc1.frequency.setValueAtTime(523, now + 1.0);
                osc1.frequency.setValueAtTime(587, now + 1.5);
                osc1.frequency.setValueAtTime(523, now + 2.0);
                osc1.frequency.setValueAtTime(494, now + 2.5);
                osc1.frequency.setValueAtTime(440, now + 3.0);
                osc2.frequency.setValueAtTime(220, now);
                osc2.frequency.setValueAtTime(220, now + 2.0);
                osc2.frequency.setValueAtTime(220, now + 4.0);
                osc3.frequency.setValueAtTime(330, now);
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

        function playRealisticCrash() {
            if (!soundEnabled || !audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const now = audioCtx.currentTime;
            const vol = sfxVolume / 100;
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

        function updateEngineSound() {
            if (!engineGain || !engineFilter || !soundEnabled || !audioCtx || player.dead) {
                if (engineGain) engineGain.gain.value = 0;
                return;
            }
            const thrustPercent = player.thrust / playerMaxThrust;
            const baseFreq = 200 + (thrustPercent * 600);
            engineFilter.frequency.value = baseFreq;
            engineGain.gain.value = (0.05 + thrustPercent * 0.08) * (musicVolume / 100);
            engineFilter.Q.value = 0.5 + (thrustPercent * 0.5) + (Math.sin(frame * 0.1) * 0.1);
        }

        function createBlast(x, y, color, count = 25) {
            if (!soundEnabled) {
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
        }

        function playSound(type) {
            if (!soundEnabled || !audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const vol = sfxVolume / 100;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
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
                            else ctx.quadraticCurveTo(sx + xOffset / 2, peakY - layerHeight * 0.3, peakX, peakY);
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

        // ===== ENHANCED 2D CONTROL TOWER =====
        function drawDetailedControlTower(tower) {
            const sx = tower.x - camera.x;
            if (sx > -200 && sx < canvas.width + 200) {
                const groundY = WORLD_GROUND - camera.y;
                ctx.save();
                ctx.fillStyle = tower.baseColor;
                ctx.shadowColor = '#000';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 5;
                const gradient = ctx.createLinearGradient(sx - 20, groundY - 120, sx + 20, groundY - 20);
                gradient.addColorStop(0, '#64748b');
                gradient.addColorStop(0.5, '#475569');
                gradient.addColorStop(1, '#334155');
                ctx.fillStyle = gradient;
                ctx.fillRect(sx - 20, groundY - 120, 40, 100);
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(sx - 25, groundY - 150, 50, 30);
                ctx.fillStyle = '#60a5fa';
                ctx.globalAlpha = 0.6;
                ctx.fillRect(sx - 20, groundY - 145, 15, 20);
                ctx.fillRect(sx + 5, groundY - 145, 15, 20);
                ctx.globalAlpha = 1;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(sx - 20, groundY - 145, 15, 20);
                ctx.strokeRect(sx + 5, groundY - 145, 15, 20);
                ctx.fillStyle = '#94a3b8';
                ctx.beginPath();
                ctx.ellipse(sx, groundY - 165, 15, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.save();
                ctx.translate(sx, groundY - 168);
                ctx.rotate(frame * 0.02);
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(-20, -2, 40, 4);
                ctx.fillRect(-2, -10, 4, 20);
                ctx.restore();
                ctx.font = "bold 16px 'Courier New'";
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#fbbf24';
                ctx.fillText(tower.runwayNumber, sx - 15, groundY - 180);
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
                            x: pondX - pondWidth / 2 + 50 + Math.random() * (pondWidth - 100),
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
                    ctx.ellipse(sx, groundY - pond.depth / 2, pond.width / 2, pond.depth / 2, 0, 0, Math.PI * 2);
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

        // ===== NIGHT SKY - 40,000 STARS =====
        let stars = [];
        const NUM_STARS = 40000;

        // ===== RUNWAY LIGHTS =====
        let runwayLights = [];
        function generateRunwayLights() {
            runwayLights.length = 0;
            runwayStarts.forEach((start, index) => {
                const runwayEnd = start + 5500;
                for (let i = 0; i < 4; i++) {
                    runwayLights.push({
                        x: start + i * 60,
                        y: WORLD_GROUND - 35,
                        position: 'start',
                        side: 'left',
                        intensity: 1.0,
                        pulseSpeed: 0.04,
                        phase: Math.random() * Math.PI * 2,
                        color: '#ffffff'
                    });
                }
                for (let i = 0; i < 4; i++) {
                    runwayLights.push({
                        x: start + i * 60,
                        y: WORLD_GROUND - 35,
                        position: 'start',
                        side: 'right',
                        intensity: 1.0,
                        pulseSpeed: 0.04,
                        phase: Math.random() * Math.PI * 2,
                        color: '#ffffff'
                    });
                }
                for (let i = 0; i < 4; i++) {
                    runwayLights.push({
                        x: runwayEnd - i * 60,
                        y: WORLD_GROUND - 35,
                        position: 'end',
                        side: 'left',
                        intensity: 1.0,
                        pulseSpeed: 0.04,
                        phase: Math.random() * Math.PI * 2,
                        color: '#ffffff'
                    });
                }
                for (let i = 0; i < 4; i++) {
                    runwayLights.push({
                        x: runwayEnd - i * 60,
                        y: WORLD_GROUND - 35,
                        position: 'end',
                        side: 'right',
                        intensity: 1.0,
                        pulseSpeed: 0.04,
                        phase: Math.random() * Math.PI * 2,
                        color: '#ffffff'
                    });
                }
            });
        }

        function drawRunwayLights() {
            const groundY = WORLD_GROUND - camera.y;
            runwayLights.forEach(light => {
                let sx = light.x - camera.x;
                const sideOffset = light.side === 'left' ? -45 : 45;
                sx = sx + sideOffset;
                if (sx > -50 && sx < canvas.width + 50) {
                    const pulse = 0.5 + 0.5 * Math.sin(frame * light.pulseSpeed + light.phase);
                    const intensity = light.intensity * (0.7 + 0.3 * pulse);
                    ctx.save();
                    const gradient = ctx.createRadialGradient(sx, groundY - 5, 0, sx, groundY - 5, 22);
                    gradient.addColorStop(0, light.color);
                    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${intensity * 0.3})`);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(sx, groundY - 5, 22, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = light.color;
                    ctx.shadowColor = light.color;
                    ctx.shadowBlur = 14 * intensity;
                    ctx.beginPath();
                    ctx.arc(sx, groundY - 5, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });
        }

        // ===== LOCALIZER FOR EVERY RUNWAY =====
        let runwayLocalizers = [];
        function generateRunwayLocalizers() {
            runwayLocalizers.length = 0;
            runwayStarts.forEach((start, index) => {
                runwayLocalizers.push({
                    runwayIndex: index,
                    runwayNumber: runwayNumbers[index],
                    x: start + 5500,
                    y: WORLD_GROUND,
                    frequency: 108 + index * 0.5,
                    signalWidth: 700,
                    color: '#fbbf24',
                    active: true,
                    beamOpacity: 0.15
                });
            });
        }

        function drawRunwayLocalizers() {
            const groundY = WORLD_GROUND - camera.y;
            runwayLocalizers.forEach(loc => {
                const sx = loc.x - camera.x;
                if (sx > -200 && sx < canvas.width + 200) {
                    ctx.save();
                    ctx.fillStyle = '#64748b';
                    ctx.fillRect(sx - 5, groundY - 40, 10, 40);
                    const pulse = 0.5 + 0.5 * Math.sin(frame * 0.05);
                    ctx.fillStyle = loc.color;
                    ctx.shadowColor = loc.color;
                    ctx.shadowBlur = 15 * pulse;
                    ctx.beginPath();
                    ctx.arc(sx, groundY - 45, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = `rgba(251, 191, 36, ${loc.beamOpacity * (0.5 + 0.5 * Math.sin(frame * 0.02))})`;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([15, 25]);
                    ctx.beginPath();
                    ctx.moveTo(sx, groundY - 45);
                    ctx.lineTo(sx - loc.signalWidth, groundY - 45 - 300);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(sx, groundY - 45);
                    ctx.lineTo(sx + loc.signalWidth, groundY - 45 - 300);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.font = "bold 10px 'Courier New'";
                    ctx.fillStyle = '#fbbf24';
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#fbbf24';
                    ctx.fillText(`LOC ${loc.frequency.toFixed(1)}`, sx - 35, groundY - 55);
                    ctx.restore();
                }
            });
        }

        function generateStars() {
            stars.length = 0;
            for (let i = 0; i < NUM_STARS; i++) {
                stars.push({
                    x: Math.random() * 60000 - 10000,
                    y: Math.random() * 34000,
                    size: Math.random() * 2 + 0.5,
                    brightness: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.03 + 0.005,
                    phase: Math.random() * Math.PI * 2,
                    color: ['#ffffff', '#e0e0ff', '#fff5e6', '#d0d0ff'][Math.floor(Math.random() * 4)],
                    twinkleSpeed: 0.02 + Math.random() * 0.04,
                    twinklePhase: Math.random() * Math.PI * 2
                });
            }
        }

        const runwayStarts = [500, 11280, 22060, 32840, 43620];
        const runwayRanges = [[400, 6100], [11180, 16880], [21960, 27660], [32740, 38440], [43520, 49220]];
        
        function generateScenery() {
            scenery.length = 0;
            controlTowers.length = 0;
            npcs.length = 0;
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
                if (Math.random() < 0.8) {
                    const rand = Math.random();
                    if (rand < 0.15) {
                        scenery.push({ x: x + Math.random() * 40, type: 'tree_oak', height: 50 + Math.random() * 20, trunkColor: '#4a2e1e', leafColor: '#2d6a4f' });
                    } else if (rand < 0.30) {
                        scenery.push({ x: x + Math.random() * 40, type: 'tree_pine', height: 55 + Math.random() * 25, trunkColor: '#3a1e0e', leafColor: '#1e4d3a' });
                    } else if (rand < 0.45) {
                        scenery.push({ x: x + Math.random() * 40, type: 'tree_palm', height: 60 + Math.random() * 20, trunkColor: '#5a3e2e', leafColor: '#3d8a4f' });
                    } else if (rand < 0.55) {
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
                    } else if (rand < 0.65) {
                        scenery.push({ x: x + Math.random() * 80, type: 'hill', height: 10 + Math.random() * 30, width: 40 + Math.random() * 40, color: '#5d6d3b' });
                    } else if (rand < 0.75) {
                        scenery.push({ x: x + Math.random() * 30, type: 'bush', height: 5 + Math.random() * 8, color: '#2d6a4f' });
                    } else if (rand < 0.85) {
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
                if (Math.random() < 0.3) {
                    scenery.push({ x: x + Math.random() * 50, type: 'grass', height: 3 + Math.random() * 5, color: '#4a7c3a' });
                }
            }
            for (let i = 0; i < 200; i++) {
                npcs.push({
                    x: 1000 + Math.random() * 45000,
                    y: WORLD_GROUND,
                    size: 5 + Math.random() * 3,
                    color: ['#fbbf24', '#60a5fa', '#ef4444', '#a78bfa'][Math.floor(Math.random() * 4)],
                    direction: Math.random() > 0.5 ? 1 : -1,
                    speed: 0.1 + Math.random() * 0.2,
                    animation: 0,
                    type: ['person', 'dog', 'cat', 'bird', 'farmer', 'child'][Math.floor(Math.random() * 6)]
                });
            }
        }

        // Initialize world
        generateStars();
        generateRealisticMountains();
        generateScenery();
        generateRunwayLights();
        generateRunwayLocalizers();
        generatePondsAndBoats();
        generateClouds();

        // Player object
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
            if (window.innerWidth <= 1024) {
                if (window.innerHeight > window.innerWidth) {
                    if (!isPaused && !player.dead) {
                        isPaused = true;
                    }
                } else {
                    if (isPaused && homeMenu.style.display === 'none' && gameoverMenu.style.display === 'none') {
                        isPaused = false;
                    }
                }
            }
        }

        window.addEventListener('orientationchange', function () {
            setTimeout(() => {
                checkOrientation();
                resizeCanvas();
                refreshGameState();
                updateMobileControlsDisplay();
                if (window.innerHeight > window.innerWidth) {
                    if (!isPaused) {
                        isPaused = true;
                    }
                    forceLandscapeOrientation();
                }
            }, 100);
        });

        window.addEventListener('resize', checkOrientation);

        window.toggleAutoShoot = function () {
            autoShootEnabled = !autoShootEnabled;
            refreshGameState();
            playSound('gear');
        }

        window.keyDown = function (code) {
            if (keys[code]) return;
            keys[code] = true;
            if (code === 'KeyG') {
                player.gearDown = !player.gearDown;
                playSound('gear');
            }
            if (code === 'KeyM') {
                missileKeyPressed = true;
            }
        }

        window.keyUp = function (code) {
            keys[code] = false;
            if (code === 'KeyM') {
                missileKeyPressed = false;
            }
        }

        window.toggleHUD = function () {
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
            if (e.code === 'KeyM') {
                missileKeyPressed = true;
            }
        };

        window.onkeyup = e => {
            keys[e.code] = false;
            if (e.code === 'KeyM') {
                missileKeyPressed = false;
            }
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
            homeCoins += achievement.reward;
            showAchievementPopup(achievement);
            updateAchievementsDisplay();
            updateHomeCoinDisplay();
            saveGame();
        }

        function showAchievementPopup(achievement) {
            addNotification('🏆 Achievement Unlocked!', `${achievement.name} +${achievement.reward}💰`, '🏆');
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

        // ===== UPDATED PLANES DISPLAY WITH EQUIP BUTTON - FIXED SAVING =====
        function updatePlanesDisplay() {
            if (!planesList) return;
            let html = '';
            planes.forEach(plane => {
                const unlocked = plane.unlocked;
                const equipped = plane.id === selectedPlane;
                const lockedClass = !unlocked ? 'locked' : '';
                html += `<div class="plane-item ${lockedClass}">
                    <div class="plane-icon">${plane.icon}</div>
                    <div class="plane-info">
                        <div class="plane-name">${plane.name}</div>
                        <div class="plane-stats">Speed: ${plane.speed} | Handling: ${plane.handling} | Health: ${plane.health}</div>
                        <div class="plane-unlock">${unlocked ? '✓ UNLOCKED' : `🔒 Unlock: ${plane.price}💰`}</div>
                    </div>`;
                
                if (unlocked) {
                    if (equipped) {
                        html += `<button class="plane-equip-btn equipped" disabled>EQUIPPED</button>`;
                    } else {
                        html += `<button class="plane-equip-btn" onclick="equipPlane('${plane.id}')">EQUIP</button>`;
                    }
                } else {
                    html += `<button class="plane-equip-btn" onclick="unlockPlane('${plane.id}')">UNLOCK</button>`;
                }
                
                html += `</div>`;
            });
            planesList.innerHTML = html;
        }

        // Unlock plane using home coins - NOW FULLY SAVED
        function unlockPlane(planeId) {
            const plane = planes.find(p => p.id === planeId);
            if (plane && !plane.unlocked && homeCoins >= plane.price) {
                // Sufficient funds - unlock the plane
                homeCoins -= plane.price;
                plane.unlocked = true;
                updateHomeCoinDisplay();
                updatePlanesDisplay();
                
                // Save to dedicated plane storage
                savePlaneUnlocks();
                
                // Also save to main save data for backward compatibility
                saveGame();
                
                playSound('coin');
                
                addNotification('✈️ Plane Unlocked!', `${plane.name} is now available!`, '✈️');
                
                // Force immediate save to ensure persistence
                localStorage.setItem('planeUnlocks', JSON.stringify(planes.map(p => p.unlocked)));
                localStorage.setItem('selectedPlane', selectedPlane);
            } else if (plane && !plane.unlocked && homeCoins < plane.price) {
                // Not enough coins - show elegant message without alert
                addNotification('❌ Insufficient Coins', `Need ${plane.price} coins to unlock ${plane.name}`, '💰');
            }
        }

        // Equip plane (select for gameplay) - NOW FULLY SAVED
        function equipPlane(planeId) {
            const plane = planes.find(p => p.id === planeId);
            if (plane && plane.unlocked) {
                selectedPlane = planeId;
                updatePlayerStatsFromPlane();
                updatePlanesDisplay();
                
                // Save selected plane to dedicated storage
                localStorage.setItem('selectedPlane', selectedPlane);
                
                // Also save to main save data for backward compatibility
                saveGame();
                
                playSound('gear');
                
                addNotification('✈️ Plane Equipped!', `${plane.name} is ready for battle!`, '✈️');
            }
        }

        // Save plane unlocks to dedicated storage
        function savePlaneUnlocks() {
            const unlocks = planes.map(p => p.unlocked);
            localStorage.setItem('planeUnlocks', JSON.stringify(unlocks));
            localStorage.setItem('selectedPlane', selectedPlane);
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

        // ===== DAILY REWARD SYSTEM (24 HOUR COOLDOWN) =====
        function claimDailyReward() {
            const today = new Date().toDateString();
            const lastReward = localStorage.getItem('lastDailyReward');
            
            if (lastReward !== today) {
                lastDailyReward = today;
                localStorage.setItem('lastDailyReward', today);
                homeCoins += DAILY_REWARD_AMOUNT; // Now adds 50 coins
                dailyRewardBtn.classList.add('claimed');
                updateHomeCoinDisplay();
                saveGame();
                playSound('coin');
                
                addNotification('🎁 Daily Reward!', `+${DAILY_REWARD_AMOUNT} coins claimed!`, '💰');
            } else {
                addNotification('⏰ Daily Reward', 'Already claimed! Come back tomorrow!', '🎁');
            }
        }

        function checkDailyReward() {
            const today = new Date().toDateString();
            const lastReward = localStorage.getItem('lastDailyReward');
            if (lastReward === today) {
                dailyRewardBtn.classList.add('claimed');
            } else {
                dailyRewardBtn.classList.remove('claimed');
            }
        }

        function showPrivacyPolicy() {
            privacyMenu.style.display = 'block';
            homeMenu.style.opacity = '0.5';
        }

        function closePrivacyPolicy() {
            privacyMenu.style.display = 'none';
            homeMenu.style.opacity = '1';
        }

        // ===== FIXED ENEMY KILL FUNCTION - Now properly removes enemies =====
        function enemyKilled(enemy) {
            // Check if enemy is already dead
            if (enemy.exploded) return;
            
            const basePoints = enemy.points || 50;
            totalScore += basePoints;
            inGameDollars += (enemy.coins || 10);
            totalKills++;
            
            // NEW: Random chance to reduce player health when enemy is hit
            // This simulates enemy debris or return fire
            if (Math.random() < 0.1 && activePower !== 'shield') { // 10% chance
                player.health -= 5; // Lose 5% health
                
                // Show hit effect
                createHitEffect(player.x, player.y);
                
                if (player.health <= 0) {
                    trackDeath(true);
                    triggerCrashSequence();
                }
            }
            
            // Check if this was a mystery boss and add ONLY ONE mystery box per boss
            if (enemy.isMysteryBoss && enemy.id) {
                addMysteryBox(enemy.id);
            }
            
            // Mark enemy as exploded and remove from game
            enemy.exploded = true;
            enemy.alive = false;
            
            // Remove from enemies array
            const index = enemies.indexOf(enemy);
            if (index > -1) {
                enemies.splice(index, 1);
            }
            
            // Update displays
            updateMenuScore();
            checkAchievement('firstKill', 1);
            checkAchievement('acePilot', 1);
            checkAchievement('collector', enemy.coins || 10);
            updateDollarDisplay();
            
            // Check if all enemies are dead
            checkAllEnemiesDead();
            
            playSound('coin');
            trackKill();
            
            // Create explosion effect
            createBlast(enemy.x, enemy.y, enemy.color, 30);
        }

        // ===== FIXED CHECK ALL ENEMIES DEAD FUNCTION =====
        function checkAllEnemiesDead() {
            // Count only enemies that are truly alive (not exploded)
            const activeEnms = enemies.filter(e => e.alive && !e.exploded).length;
            const bossAlive = bossActive && boss && !boss.exploded ? 1 : 0;
            const totalRemaining = activeEnms + bossAlive;
            
            // Update display
            document.getElementById('enmCount').innerText = totalRemaining;
            
            if (totalRemaining === 0) {
                clearedToLandTimer = CLEARED_TO_LAND_DURATION;
                clearedToLand.style.display = 'block';
                
                // If this is the last stage, prepare for stage completion
                if (currentStage === 5 && !bossActive) {
                    // Stage 5 boss defeated
                }
            }
        }

        // ===== FIXED BOSS DETECTION =====
        function updateBossHealthBar() {
            if (bossActive && boss && boss.alive && !boss.exploded) {
                const percent = (boss.health / boss.maxHealth) * 100;
                bossHealthFill.style.width = percent + '%';
                bossHealthText.innerText = `BOSS HEALTH ${Math.floor(percent)}%`;
            } else {
                bossHealthContainer.style.display = 'none';
            }
        }

        // ===== FIXED MISSILE COLLISION DETECTION =====
        // (Modified in the main update loop - see below)

        function updateTargetRunway() {
            const runwayIndex = (currentLevel - 1) % runwayNumbers.length;
            targetRunway = runwayNumbers[runwayIndex];
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
            // Check for new high score
            if (totalScore > highScore) {
                highScore = totalScore;
                saveHighScore();
                updateHighScoreDisplay();
            }
        }

        function updateDollarDisplay() {
            dollarDisplay.innerHTML = inGameDollars;
            if (shopDollars) shopDollars.innerText = inGameDollars;
            if (totalDollarsDisplay) totalDollarsDisplay.innerText = inGameDollars;
        }

        function showGameOverMenu() {
            isPaused = true;
            
            // Check for high score
            if (totalScore > highScore) {
                highScore = totalScore;
                saveHighScore();
                updateHighScoreDisplay();
                addNotification('🏆 New High Score!', `You scored ${totalScore} points!`, '🏆');
            }
            
            if (gameoverScore) gameoverScore.innerText = totalScore;
            if (gameoverKills) gameoverKills.innerText = totalKills;
            if (gameoverCombo) gameoverCombo.innerText = `x${maxCombo}`;
            if (gameoverDollars) gameoverDollars.innerText = inGameDollars;
            if (gameoverLevel) gameoverLevel.innerText = currentLevel;
            if (gameoverEnemyDeaths) gameoverEnemyDeaths.innerText = playerStats.totalEnemyDeaths || 0;
            hud.style.display = 'none';
            radar.style.display = 'none';
            levelStage.style.display = 'none';
            dollarDisplay.style.display = 'none';
            shopBtn.style.display = 'none';
            document.getElementById('mobile-controls').style.display = 'none';
            pauseMenuBtn.style.display = 'none';
            gameoverMenu.style.display = 'block';
            hasSaveData = false;
            continueBtn.style.display = 'none';
            playSound('enginefail');
        }

        // ===== FIXED RESTART FROM GAME OVER FUNCTION =====
        window.restartFromGameOver = function () {
            // 🟢 ADDED: Show main ad when restarting from game over
            if (window.Android) {
                Android.showMainAd();
            }
            gameoverMenu.style.display = 'none';
            resetGameState();
            homeMenu.style.display = 'none';
            startGame(false);
        }

        window.goToHomeFromGameOver = function () {
            gameoverMenu.style.display = 'none';
            homeMenu.style.display = 'flex';
            homeMenu.style.opacity = '1';
            updateMenuScore();
            hasSaveData = false;
            continueBtn.style.display = 'none';
            stopHomeMusic();
            if (soundEnabled) initHomeMusic();
            resetGameState();
        }

        // ===== UPDATED SPAWN STAGE ENEMIES WITH PROGRESSIVE DIFFICULTY =====
        function spawnStageEnemies() {
            enemies = [];
            // Use progressive enemy count calculator
            let numEnemies = calculateEnemyCountForStage();
            
            // Log for debugging (can be removed)
            console.log(`Stage ${currentStage}: Spawning ${numEnemies} enemies (Max 27)`);
            
            for (let i = 0; i < numEnemies; i++) {
                // Determine enemy type based on current level and stage
                let typeKeys = ['scout', 'fighter', 'interceptor', 'gunship', 'ace'];
                // Higher levels spawn more advanced enemies
                let advancedChance = (currentLevel - 1) * 0.15;
                let randomRoll = Math.random();
                
                let typeKey;
                if (randomRoll < advancedChance && currentLevel > 1) {
                    // Spawn advanced enemies at higher levels
                    typeKey = typeKeys[Math.floor(Math.random() * (typeKeys.length - 1)) + 1];
                } else {
                    typeKey = typeKeys[Math.floor(Math.random() * (currentLevel + 2)) % typeKeys.length];
                }
                
                const enemyType = enemyShapes[typeKey];
                let health = enemyType.health * enemyHealthMultiplier;
                let shootSpeed = enemyType.shootSpeed / enemyAccuracyMultiplier;
                let thrust = enemyType.baseThrust * enemySpeedMultiplier;
                let bulletSpeed = enemyType.bulletSpeed * (difficultyLevel === 'Hard' ? 1.3 : difficultyLevel === 'Easy' ? 0.7 : 1.0);
                
                enemies.push({
                    id: `enemy_${Date.now()}_${i}_${Math.random()}`,
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

        // ===== NEW UPDATED SPAWN BOSS FUNCTION WITH MULTIPLE BOSS TYPES =====
        function spawnBoss() {
            if (bossActive) return;
            
            // 75% chance to spawn Mystery Boss instead of regular boss
            const isMysteryBoss = Math.random() < 0.75;
            
            if (isMysteryBoss) {
                // Spawn Mystery Boss with unique ID
                let bossHealth = calculateBossHealth() * 1.2; // Mystery boss has 20% more health
                const bossId = `mystery_${Date.now()}_${Math.random()}`;
                
                boss = {
                    id: bossId,
                    x: player.x + 3000, 
                    y: 2000, 
                    angle: Math.PI, 
                    thrust: 4.5 * enemySpeedMultiplier,
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
                    name: "MYSTERY BOSS", 
                    color: "#8b5cf6", 
                    size: 2.2,
                    shootSpeed: 40 / enemyAccuracyMultiplier, 
                    bulletSpeed: 16 * (difficultyLevel === 'Hard' ? 1.3 : difficultyLevel === 'Easy' ? 0.7 : 1.0),
                    points: 600 + (currentLevel * 100), 
                    coins: 120 + (currentLevel * 20),
                    shootState: 'cooldown', 
                    shootStateTimer: 0,
                    wingAngle: 0,
                    pattern: 'rapid',
                    bulletCount: 3,
                    spreadAngle: 0.2,
                    teleportTimer: 0,
                    isMysteryBoss: true, // Flag to identify mystery boss
                    drawFunc: mysteryBoss.drawShape
                };
                
                addNotification('👾 Mystery Boss Appears!', 'Defeat it for a mystery box!', '👑');
            } else {
                // Select random regular boss type based on level
                let bossKeys = ['trainer', 'warlord', 'phantom'];
                let bossIndex = Math.min(currentLevel - 1, bossKeys.length - 1);
                let bossType = bossTypes[bossKeys[bossIndex]];
                
                let bossHealth = calculateBossHealth();
                
                boss = {
                    id: `boss_${Date.now()}_${Math.random()}`,
                    x: player.x + 3000, 
                    y: 2000, 
                    angle: Math.PI, 
                    thrust: bossType.thrust * enemySpeedMultiplier,
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
                    size: bossType.size,
                    shootSpeed: bossType.shootSpeed / enemyAccuracyMultiplier, 
                    bulletSpeed: bossType.bulletSpeed * (difficultyLevel === 'Hard' ? 1.3 : difficultyLevel === 'Easy' ? 0.7 : 1.0),
                    points: bossType.points + (currentLevel * 100), 
                    coins: bossType.coins + (currentLevel * 20),
                    shootState: 'cooldown', 
                    shootStateTimer: 0,
                    wingAngle: 0,
                    pattern: bossType.pattern,
                    bulletCount: bossType.bulletCount,
                    spreadAngle: bossType.spreadAngle,
                    teleportTimer: 0
                };
                
                addNotification('👑 Boss Appears!', `${bossType.name} has arrived!`, '👑');
            }
            
            bossActive = true;
            bossSpawned = true;
            bossHealthContainer.style.display = 'block';
            updateBossHealthBar();
            playSound('bossSpawn');
            
            // Show boss indicator
            showBossIndicator();
        }

        function spawnEnemies() {
            if (currentStage === 5) spawnBoss();
            else spawnStageEnemies();
            
            checkAndStartWeather();
        }

        function updateStageDisplay() {
            levelStage.style.display = 'block';
            levelStage.innerHTML = `🌍 LEVEL ${currentLevel} | STAGE ${currentStage}/5`;
            document.getElementById('lvl').innerText = currentLevel;
        }

        window.openPowerShop = function () {
            if (isPaused) return;
            isPaused = true;
            let html = '';
            powerItems.forEach(item => {
                const canBuy = inGameDollars >= item.price && currentLevel >= item.levelReq;
                html += `<div class="shop-item ${canBuy ? '' : 'disabled'}" onclick="buyPower('${item.id}')">
<h3>${item.icon} ${item.name}</h3>
<div class="price">$${item.price}</div>
<div class="description">${item.description}</div>
<div class="level-req">Level Req: ${item.levelReq}</div>
</div>`;
            });
            shopItemsContainer.innerHTML = html;
            shopDollars.innerText = inGameDollars;
            powerShopMenu.style.display = 'block';
        }

        window.closePowerShop = function () {
            powerShopMenu.style.display = 'none';
            isPaused = false;
        }

        window.buyPower = function (powerId) {
            const power = powerItems.find(p => p.id === powerId);
            if (!power) return;
            if (inGameDollars >= power.price && currentLevel >= power.levelReq) {
                inGameDollars -= power.price;
                updateDollarDisplay();
                saveGame();
                power.effect();
                updatePowerDisplay();
                powerShopMenu.style.display = 'none';
                isPaused = false;
                playSound('powerup');
                
                addNotification('⚡ Power Purchased!', `${power.name} activated!`, power.icon);
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
            inGameDollars += stageBonus;
            freeSpinsRemaining++;
            checkAchievement('survivor', 1);
            updateDollarDisplay();
            updateMenuScore();
            updateFreeSpinDisplay();
            document.getElementById('p-health').innerText = player.health + "%";
            stageCompleteText.innerHTML = `Stage ${currentStage} Complete! +$${stageBonus} +1 FREE SPIN`;
            let nextStage = currentStage + 1;
            if (nextStage > STAGES_PER_LEVEL) nextStage = 1;
            nextStageNumber.innerText = nextStage;
            stageCompleteMenu.style.display = 'block';
            saveGame();
            playSound('repair');
            
            // TRACK LANDING - when stage is completed successfully
            trackLanding();
            
            // Check if this is stage 5 (level completion) and award level completion bonus
            if (currentStage === 5) {
                homeCoins += LEVEL_COMPLETION_REWARD;
                updateHomeCoinDisplay();
                
                addNotification('🏆 Level Completed!', `+${LEVEL_COMPLETION_REWARD} home coins!`, '⭐');
            }
        }

        window.continueToNextStage = function () {
            stageCompleteMenu.style.display = 'none';
            currentStage++;
            if (currentStage > STAGES_PER_LEVEL) { 
                currentLevel++; 
                currentStage = 1; 
            }
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

        window.returnToHome = function () {
            stageCompleteMenu.style.display = 'none';
            homeMenu.style.display = 'flex';
            homeMenu.style.opacity = '1';
            hud.style.display = 'none'; radar.style.display = 'none'; levelStage.style.display = 'none';
            dollarDisplay.style.display = 'none'; shopBtn.style.display = 'none';
            document.getElementById('mobile-controls').style.display = 'none';
            pauseMenuBtn.style.display = 'none';
            isPaused = true;
            stopHomeMusic();
            if (soundEnabled) initHomeMusic();
            resetGameState();
            saveGame();
        }

        // ===== SAVE/LOAD SETTINGS =====
        function saveSettings() {
            const settings = {
                soundEnabled,
                musicVolume,
                sfxVolume,
                sensitivityLevel,
                difficultyLevel,
                autoShootEnabled,
                buttonControlsEnabled,
                joystickEnabled,
                tiltEnabled
            };
            localStorage.setItem('gameSettings', JSON.stringify(settings));
        }

        function loadSettings() {
            const saved = localStorage.getItem('gameSettings');
            if (saved) {
                try {
                    const settings = JSON.parse(saved);
                    soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
                    musicVolume = settings.musicVolume || 70;
                    sfxVolume = settings.sfxVolume || 80;
                    sensitivityLevel = settings.sensitivityLevel || 'Normal';
                    difficultyLevel = settings.difficultyLevel || 'Normal';
                    autoShootEnabled = settings.autoShootEnabled || false;
                    buttonControlsEnabled = settings.buttonControlsEnabled !== undefined ? settings.buttonControlsEnabled : true;
                    joystickEnabled = settings.joystickEnabled !== undefined ? settings.joystickEnabled : false;
                    tiltEnabled = settings.tiltEnabled !== undefined ? settings.tiltEnabled : false;
                    document.getElementById('music-volume').value = musicVolume;
                    document.getElementById('sfx-volume').value = sfxVolume;
                } catch (e) {
                    console.log('Failed to load settings');
                }
            }
        }

        function saveGame() {
            // Save plane unlocks separately to ensure persistence
            savePlaneUnlocks();
            
            const saveData = {
                currentLevel, currentStage, totalScore, totalKills, inGameDollars, maxCombo, lives,
                lastDailyReward, selectedPlane, planes: planes.map(p => p.unlocked),
                achievements, soundEnabled, musicVolume, sfxVolume, sensitivityLevel, difficultyLevel,
                playerX: player.x, playerY: player.y, playerHealth: player.health,
                playerThrust: player.thrust, missileCount, autoShootEnabled, buttonControlsEnabled, tiltEnabled, joystickEnabled,
                playerStats: playerStats,
                freeSpinsRemaining,
                homeCoins,
                lastFreeSpinTime: localStorage.getItem('lastFreeSpinTime'),
                mysteryBoxes: mysteryBoxes // Save mystery boxes
            };
            localStorage.setItem('rfsSaveData', JSON.stringify(saveData));
            saveSettings();
            saveMysteryBoxes(); // Also save mystery boxes separately
            saveHighScore(); // Save high score
            if (!player.dead && lives > 0 && homeMenu.style.display === 'none') {
                hasSaveData = true;
                continueBtn.style.display = 'inline-block';
            }
        }

        function loadGame() {
            const savedData = localStorage.getItem('rfsSaveData');
            loadSettings();
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    if (data.lives <= 0) return false;
                    currentLevel = data.currentLevel || 1;
                    currentStage = data.currentStage || 1;
                    totalScore = data.totalScore || 0;
                    totalKills = data.totalKills || 0;
                    inGameDollars = data.inGameDollars || 0;
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
                    buttonControlsEnabled = data.buttonControlsEnabled !== undefined ? data.buttonControlsEnabled : true;
                    tiltEnabled = data.tiltEnabled !== undefined ? data.tiltEnabled : false;
                    joystickEnabled = data.joystickEnabled !== undefined ? data.joystickEnabled : false;
                    freeSpinsRemaining = data.freeSpinsRemaining || 1;
                    homeCoins = data.homeCoins || 0;
                    mysteryBoxes = data.mysteryBoxes || 0;
                    if (data.lastFreeSpinTime) {
                        localStorage.setItem('lastFreeSpinTime', data.lastFreeSpinTime);
                    }
                    if (data.playerStats) playerStats = data.playerStats;
                    if (data.planes) {
                        data.planes.forEach((unlocked, index) => { if (index < planes.length) planes[index].unlocked = unlocked; });
                    }
                    if (data.achievements) {
                        data.achievements.forEach((ach, index) => { if (index < achievements.length) achievements[index] = ach; });
                    }
                    document.getElementById('sensitivity-value').innerText = sensitivityLevel;
                    document.getElementById('difficulty-value').innerText = difficultyLevel;
                    updateDollarDisplay();
                    updateHomeCoinDisplay();
                    updateMenuScore();
                    updatePlayerStatsFromPlane();
                    if (player) {
                        player.x = data.playerX || 2000;
                        player.y = data.playerY || 3000;
                        player.health = data.playerHealth || playerBaseHealth;
                        player.thrust = data.playerThrust || 4;
                        missileCount = data.missileCount || 6;
                    }
                    checkDailyReward();
                    document.getElementById('lives-val').innerText = "❤️".repeat(lives);
                    refreshGameState();
                    updateMysteryBoxDisplay();
                    // Load plane unlocks from dedicated storage
                    loadUnlockedPlanes();
                    return true;
                } catch (e) { return false; }
            }
            return false;
        }

        window.continueGame = function () {
            const loaded = loadGame();
            if (loaded) startGame(true);
            else { addNotification('❌ No Save', 'No saved game found. Starting new game.', '💾'); startGame(false); }
        };

        window.startGame = function (isContinue = false) {
            // Reset lives to 3 when starting a new game
            if (!isContinue) {
                lives = 3;
                document.getElementById('lives-val').innerText = "❤️".repeat(lives);
                // Reset in-game dollars for new game
                inGameDollars = 0;
                updateDollarDisplay();
            }
            
            initAudio();
            if (audioCtx?.state === 'suspended' && soundEnabled) audioCtx.resume();
            stopHomeMusic();
            updatePlayerStatsFromPlane();
            homeMenu.style.display = 'none';
            gameoverMenu.style.display = 'none';
            hud.style.display = 'block';
            radar.style.display = 'block';
            levelStage.style.display = 'block';
            dollarDisplay.style.display = 'block';
            
            // Hide shop button on mobile
            if (window.innerWidth <= 1024) {
                shopBtn.style.display = 'none';
            } else {
                shopBtn.style.display = 'block';
            }
            
            pauseMenuBtn.style.display = 'flex';
            document.getElementById('auto-shoot-toggle').style.display = 'none';
            
            if (window.innerWidth <= 1024) {
                document.getElementById('mobile-controls').style.display = 'block';
            } else {
                document.getElementById('mobile-controls').style.display = 'none';
            }
            
            if (!isContinue) {
                resetGameState();
                lives = 3; // Ensure lives are reset to 3
                document.getElementById('lives-val').innerText = "❤️".repeat(lives);
            } else {
                if (!player) { }
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
            if (window.innerWidth <= 1024) hud.style.display = 'none';
            spawnEnemies();
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
            refreshGameState();
        };

        // ===== ENHANCED MAIN UPDATE FUNCTION - With full body enemy hit detection =====
        function update() {
            if (player.dead || isPaused) {
                if (engineGain) engineGain.gain.value = 0;
                return;
            }
            
            updateWeather();
            updateGroundSparkles();
            updateShootingStars();
            updateMeteoroids();
            
            // Update high altitude galaxy
            updateHighAltitudeGalaxy();
            
            // High altitude damage system
            const altitude = Math.max(0, Math.floor(WORLD_GROUND - player.y));
            if (altitude >= HIGH_ALTITUDE_THRESHOLD) {
                showHighAltitudeWarning(true);
                highAltitudeDamageTimer--;
                if (highAltitudeDamageTimer <= 0) {
                    if (activePower !== 'shield') {
                        player.health -= HIGH_ALTITUDE_DAMAGE_AMOUNT;
                        createHitEffect(player.x, player.y);
                        if (player.health <= 0) {
                            trackDeath(true);
                            triggerCrashSequence();
                        }
                    }
                    highAltitudeDamageTimer = HIGH_ALTITUDE_DAMAGE_RATE;
                }
            } else {
                showHighAltitudeWarning(false);
                highAltitudeDamageTimer = 0;
            }
            
            if (clearedToLandTimer > 0) {
                clearedToLandTimer--;
                if (clearedToLandTimer <= 0) {
                    clearedToLand.style.display = 'none';
                }
            }
            
            wingFlapPhase += 0.05;
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
            
            updateEngineSound();
            
            let pitchChange = playerManeuverability;
            if (sensitivityLevel === 'Low') pitchChange = 0.02;
            else if (sensitivityLevel === 'High') pitchChange = 0.05;
            
            if (keys['ArrowUp']) player.angle -= pitchChange;
            if (keys['ArrowDown']) player.angle += pitchChange;
            
            if (!player.wingOK) player.angle += 0.04;
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
            const bossAlive = bossActive && boss && boss.alive && !boss.exploded ? 1 : 0;
            
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
            
            if (player.gearDown) {
                player.gearAnim = Math.min(1, player.gearAnim + 0.02);
            } else {
                player.gearAnim = Math.max(0, player.gearAnim - 0.02);
            }
            
            if (altitude >= 10000) {
                moonElement.style.opacity = 1;
            } else {
                moonElement.style.opacity = 0;
            }
            
            updateBirds(altitude);
            
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
                gsDia.style.background = Math.abs(gsD) < 50 ? "#fbbf24" : "#87CEEB";
                const locD = dist + 3000;
                let locP = 50 + locD * 0.02;
                locP = Math.max(0, Math.min(100, locP));
                locDia.style.left = locP + "%";
                locDia.style.background = Math.abs(locD) < 500 ? "#fbbf24" : "#87CEEB";
                
                // Update bottom center ILS display
                updateBottomCenterILS();
            } else {
                gsDia.style.top = '50%';
                locDia.style.left = '50%';
                gsDia.style.background = '#87CEEB';
                locDia.style.background = '#87CEEB';
                
                // Update bottom center ILS display
                const bottomGs = document.getElementById('ils-bottom-gs-diamond');
                const bottomLoc = document.getElementById('ils-bottom-loc-diamond');
                const bottomGsVal = document.getElementById('ils-bottom-gs-value');
                const bottomLocVal = document.getElementById('ils-bottom-loc-value');
                
                if (bottomGs && bottomLoc) {
                    bottomGs.style.left = '50%';
                    bottomLoc.style.left = '50%';
                    if (bottomGsVal) bottomGsVal.innerText = '50%';
                    if (bottomLocVal) bottomLocVal.innerText = '50%';
                }
            }
            
            let shootDelay = activePower === 'rapidFire' ? 3 : 8;
            let shouldShoot = false;
            if (window.innerWidth <= 1024) {
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
            
            if (missileCooldown > 0) {
                missileCooldown--;
            }
            
            if (missileKeyPressed && missileCount > 0 && missileCooldown <= 0) {
                playSound('missile');
                const launchOffsetX = -15; const launchOffsetY = 30;
                const cos = Math.cos(player.angle); const sin = Math.sin(player.angle);
                const launchX = player.x + (launchOffsetX * cos - launchOffsetY * sin);
                const launchY = player.y + (launchOffsetX * sin + launchOffsetY * cos);
                
                let target = null;
                let minD = Infinity;
                
                if (bossActive && boss && boss.alive && !boss.exploded) {
                    minD = Math.hypot(boss.x - player.x, boss.y - player.y);
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
                        x: launchX, y: launchY,
                        angle: player.angle,
                        target: target,
                        speed: 22,
                        vx: Math.cos(player.angle) * 22 + player.vx,
                        vy: Math.sin(player.angle) * 22 + player.vy,
                        smokeTrail: [],
                        age: 0,
                        isHoming: activePower === 'homingMissiles' || powerMissileCount > 0
                    });
                    
                    for (let i = 0; i < 8; i++) {
                        particles.push({
                            x: launchX, y: launchY,
                            vx: (Math.random() - 0.5) * 8,
                            vy: (Math.random() - 0.5) * 8,
                            life: 0.8,
                            color: "#94a3b8"
                        });
                    }
                    
                    missileCount--;
                    missileCooldown = MISSILE_COOLDOWN_FRAMES;
                    if (powerMissileCount > 0) {
                        powerMissileCount--;
                        if (powerMissileCount === 0) {
                            activePower = null;
                            updatePowerDisplay();
                        }
                    }
                }
            }
            
            // ===== FIXED MISSILE UPDATE LOOP =====
            for (let mi = missiles.length - 1; mi >= 0; mi--) {
                const m = missiles[mi];
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
                
                let missileHit = false;
                
                // Check collision with boss
                if (bossActive && boss && boss.alive && !boss.exploded && Math.hypot(m.x - boss.x, m.y - boss.y) < 60) {
                    createBlast(m.x, m.y, boss.color, 30);
                    let damage = (activePower === 'doubleDamage' ? 50 : 35);
                    boss.health -= damage;
                    playSound('bossHit');
                    updateBossHealthBar();
                    if (boss.health <= 0) {
                        createBlast(boss.x, boss.y, "#ffaa00", 80);
                        playSound('bossDie');
                        totalScore += boss.points;
                        inGameDollars += boss.coins;
                        updateDollarDisplay();
                        updateMenuScore();
                        playSound('coin');
                        checkAchievement('bossSlayer', 1);
                        
                        // Check if this was a mystery boss and add mystery box
                        if (boss.isMysteryBoss && boss.id) {
                            addMysteryBox(boss.id);
                        }
                        
                        // Mark boss as exploded
                        boss.alive = false;
                        boss.exploded = true;
                        bossActive = false;
                        bossHealthContainer.style.display = 'none';
                        
                        // Check if all enemies are dead
                        checkAllEnemiesDead();
                        
                        // Advance to next level
                        currentStage = 1;
                        currentLevel++;
                        updateStageDisplay();
                        spawnEnemies();
                        saveGame();
                    }
                    missiles.splice(mi, 1);
                    missileHit = true;
                    continue;
                }
                
                // Check collision with enemies
                if (!missileHit) {
                    for (let ei = enemies.length - 1; ei >= 0; ei--) {
                        const e = enemies[ei];
                        if (e.alive && !e.exploded && Math.hypot(m.x - e.x, m.y - e.y) < 40) {
                            createBlast(m.x, m.y, "#ff4500", 25);
                            let damage = (activePower === 'doubleDamage' ? 50 : 35);
                            e.health -= damage;
                            e.hitCount++;
                            
                            if (e.health <= 0) {
                                // Call enemyKilled function which properly handles removal
                                enemyKilled(e);
                            } else {
                                playSound('hit');
                            }
                            
                            missiles.splice(mi, 1);
                            missileHit = true;
                            break;
                        }
                    }
                }
                
                if (!missileHit && m.age > 300) {
                    missiles.splice(mi, 1);
                }
            }
            
            missiles.forEach(m => {
                m.smokeTrail.forEach(smoke => smoke.life -= 0.02);
                m.smokeTrail = m.smokeTrail.filter(s => s.life > 0);
            });
            
            // ===== ENHANCED ENEMY UPDATE LOOP WITH FULL BODY HIT DETECTION =====
            for (let i = enemies.length - 1; i >= 0; i--) {
                const e = enemies[i];
                if (!e.alive || e.exploded) {
                    enemies.splice(i, 1);
                    continue;
                }
                
                e.wingAngle = Math.sin(wingFlapPhase * 2 + i) * 0.3;
                
                if (e.crashing) {
                    e.angle += 0.15; e.vy += GRAVITY; e.x += e.vx; e.y += e.vy;
                    if (e.y >= WORLD_GROUND) { 
                        e.exploded = true; 
                        createBlast(e.x, e.y, "#ffaa00", 40);
                        enemies.splice(i, 1);
                    }
                } else {
                    const dx = player.x - e.x;
                    const dy = player.y - e.y;
                    const distance = Math.hypot(dx, dy);
                    const targetAngle = Math.atan2(dy, dx);
                    const aggressiveness = e.aggressiveness || 1.0;
                    const randomFactor = 0.1 * (1 - aggressiveness);
                    e.angle += (targetAngle - e.angle) * 0.03 * aggressiveness + (Math.random() - 0.5) * randomFactor;
                    e.x += Math.cos(e.angle) * e.thrust;
                    e.y += Math.sin(e.angle) * e.thrust;
                    
                    const targetAlt = WORLD_GROUND - ENEMY_TARGET_ALTITUDE;
                    const altDiff = targetAlt - e.y;
                    if (Math.abs(altDiff) > 200) {
                        e.y += Math.sign(altDiff) * 0.8;
                    }
                    
                    e.shootTimer++;
                    let shootThreshold = e.shootSpeed;
                    if (distance < 800) {
                        shootThreshold *= 0.5;
                    } else if (distance < 1500) {
                        shootThreshold *= 0.8;
                    }
                    
                    if (e.shootTimer > shootThreshold) {
                        playSound('enemyShoot');
                        let bulletSpeed = e.bulletSpeed;
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
                
                // ===== ENHANCED BULLET COLLISION WITH FULL BODY DETECTION =====
                for (let j = bullets.length - 1; j >= 0; j--) {
                    const b = bullets[j];
                    
                    // INCREASED COLLISION RADIUS FOR FULL BODY HIT DETECTION
                    const collisionDistance = 35; // Increased from 30 to 35 for better hit detection
                    
                    if (Math.hypot(b.x - e.x, b.y - e.y) < collisionDistance) {
                        if (activePower === 'shield') { 
                            bullets.splice(j, 1); 
                            continue; 
                        }
                        
                        // Calculate damage with possible multiplier
                        let damage = b.damage || 15;
                        
                        // Apply double damage power-up if active
                        if (activePower === 'doubleDamage') {
                            damage *= 2;
                        }
                        
                        // Apply damage to enemy
                        e.health -= damage; 
                        e.hitCount++;
                        
                        // Create hit particles
                        for (let k = 0; k < 8; k++) {
                            particles.push({
                                x: e.x, y: e.y,
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6,
                                life: 0.4,
                                color: '#ffaa00',
                                size: 2 + Math.random() * 3
                            });
                        }
                        
                        // Create visual hit effect
                        createHitEffect(e.x, e.y);
                        
                        // Play hit sound
                        playSound('hit');
                        
                        // Check if enemy is destroyed
                        if (e.health <= 0) {
                            enemyKilled(e);
                        }
                        
                        // Remove bullet
                        bullets.splice(j, 1);
                        break;
                    }
                }
            }
            
            // ===== UPDATED BOSS UPDATE WITH PATTERN HANDLING =====
            if (bossActive && boss && boss.alive && !boss.exploded) {
                boss.wingAngle = Math.sin(wingFlapPhase) * 0.4;
                
                // Handle different boss patterns
                if (boss.pattern === 'basic') {
                    // Basic pattern - straight shots
                    boss.shootTimer++;
                    if (boss.shootTimer > boss.shootSpeed) {
                        playSound('enemyShoot');
                        for (let i = 0; i < boss.bulletCount; i++) {
                            const spreadAngle = boss.angle + (i - (boss.bulletCount - 1) / 2) * boss.spreadAngle;
                            enemyBullets.push({
                                x: boss.x, y: boss.y,
                                vx: Math.cos(spreadAngle) * boss.bulletSpeed,
                                vy: Math.sin(spreadAngle) * boss.bulletSpeed,
                                angle: spreadAngle
                            });
                        }
                        boss.shootTimer = 0;
                    }
                } else if (boss.pattern === 'spread') {
                    // Spread pattern - wider angles
                    boss.shootTimer++;
                    if (boss.shootTimer > boss.shootSpeed) {
                        playSound('enemyShoot');
                        for (let i = 0; i < boss.bulletCount; i++) {
                            const spreadAngle = boss.angle + (i - (boss.bulletCount - 1) / 2) * boss.spreadAngle * 2;
                            enemyBullets.push({
                                x: boss.x, y: boss.y,
                                vx: Math.cos(spreadAngle) * boss.bulletSpeed,
                                vy: Math.sin(spreadAngle) * boss.bulletSpeed,
                                angle: spreadAngle
                            });
                        }
                        boss.shootTimer = 0;
                    }
                } else if (boss.pattern === 'rapid' || boss.pattern === 'mystery') {
                    // Rapid fire pattern - more bullets, faster shooting
                    boss.shootTimer++;
                    if (boss.shootTimer > boss.shootSpeed / 2) {
                        playSound('enemyShoot');
                        for (let i = 0; i < boss.bulletCount; i++) {
                            const spreadAngle = boss.angle + (i - (boss.bulletCount - 1) / 2) * boss.spreadAngle;
                            enemyBullets.push({
                                x: boss.x, y: boss.y,
                                vx: Math.cos(spreadAngle) * boss.bulletSpeed,
                                vy: Math.sin(spreadAngle) * boss.bulletSpeed,
                                angle: spreadAngle
                            });
                        }
                        boss.shootTimer = 0;
                    }
                    
                    // Mystery boss also has teleport ability
                    if (boss.name === "MYSTERY BOSS") {
                        boss.teleportTimer++;
                        if (boss.teleportTimer > 200) { // Teleport every 3.3 seconds at 60fps
                            boss.x = player.x + (Math.random() * 2000 - 1000);
                            boss.y = player.y + (Math.random() * 500 - 250);
                            boss.teleportTimer = 0;
                            
                            // Create teleport effect
                            for (let i = 0; i < 20; i++) {
                                particles.push({
                                    x: boss.x, y: boss.y,
                                    vx: (Math.random() - 0.5) * 10,
                                    vy: (Math.random() - 0.5) * 10,
                                    life: 0.8,
                                    color: '#8b5cf6',
                                    size: 3
                                });
                            }
                        }
                    }
                }
                
                // Move boss towards player
                const dx = player.x - boss.x; 
                const dy = player.y - boss.y;
                boss.angle = Math.atan2(dy, dx);
                boss.x += Math.cos(boss.angle) * boss.thrust;
                boss.y += Math.sin(boss.angle) * boss.thrust;
            }
            
            // Landing check
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
                            player.angle = 0;
                            if (currentStage < 5) showStageComplete();
                            else { checkPerfectLanding(); showSuccessMenu(Math.abs(vsFPM)); }
                        }
                    }
                } else { playSound('crash'); triggerCrashSequence(); }
            } else if (overRunway && player.gearDown && player.y > WORLD_GROUND - 100) {
                player.vy *= 0.95;
                player.angle *= 0.98;
            }
            
            // Bullet-boss collisions
            if (bossActive && boss && boss.alive && !boss.exploded) {
                for (let i = bullets.length - 1; i >= 0; i--) {
                    const b = bullets[i];
                    if (Math.hypot(b.x - boss.x, b.y - boss.y) < 60) {
                        createBlast(b.x, b.y, boss.color, 15);
                        let damage = b.damage || 15;
                        boss.health -= damage; 
                        playSound('bossHit'); 
                        updateBossHealthBar();
                        
                        if (boss.health <= 0) {
                            createBlast(boss.x, boss.y, "#ffaa00", 80);
                            playSound('bossDie');
                            totalScore += boss.points; 
                            inGameDollars += boss.coins;
                            updateDollarDisplay(); 
                            updateMenuScore(); 
                            playSound('coin');
                            checkAchievement('bossSlayer', 1);
                            
                            // Check if this was a mystery boss and add mystery box
                            if (boss.isMysteryBoss && boss.id) {
                                addMysteryBox(boss.id);
                            }
                            
                            boss.alive = false;
                            boss.exploded = true;
                            bossActive = false; 
                            bossHealthContainer.style.display = 'none';
                            
                            checkAllEnemiesDead();
                            
                            currentStage = 1; 
                            currentLevel++;
                            updateStageDisplay(); 
                            spawnEnemies(); 
                            saveGame();
                        }
                        bullets.splice(i, 1);
                    }
                }
            }
            
            // Enemy bullet collisions with player
            for (let i = enemyBullets.length - 1; i >= 0; i--) {
                const b = enemyBullets[i];
                if (Math.hypot(b.x - player.x, b.y - player.y) < 30) {
                    if (activePower === 'shield') { enemyBullets.splice(i, 1); continue; }
                    playSound('hit');
                    let damage = 10;
                    if (difficultyLevel === 'Easy') damage = 5;
                    else if (difficultyLevel === 'Hard') damage = 15;
                    player.health -= damage;
                    for (let j = 0; j < 5; j++) { 
                        particles.push({ x: player.x, y: player.y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 0.5, color: '#ff0000' }); 
                    }
                    if (player.health <= 0) {
                        trackDeath(true);
                        triggerCrashSequence();
                    }
                    enemyBullets.splice(i, 1);
                }
            }
            
            bullets.forEach(b => { b.x += b.vx; b.y += b.vy; if (b.life) b.life--; });
            bullets = bullets.filter(b => !b.life || b.life > 0);
            enemyBullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
            particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.02; return p.life > 0; });
            
            if (player.engineOK && soundEnabled && engineGain && engineFilter) {
                engineFilter.frequency.value = 250 + player.thrust * 60;
                engineGain.gain.value = (0.05 + player.thrust * 0.02) * (musicVolume / 100);
            } else if (engineGain) engineGain.gain.value = 0;
            
            // Update enemy count display
            document.getElementById('enmCount').innerText = enemies.filter(e => e.alive && !e.exploded).length + (bossActive && boss && boss.alive && !boss.exploded ? 1 : 0);
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
            const bossRemaining = bossActive && boss && boss.alive && !boss.exploded ? 1 : 0;
            
            // Check for high score
            if (totalScore > highScore) {
                highScore = totalScore;
                saveHighScore();
                updateHighScoreDisplay();
            }
            
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
                document.getElementById('success-title').style.color = "#fbbf24";
                const levelBonus = 100 * currentLevel;
                inGameDollars += levelBonus;
                freeSpinsRemaining++;
                document.getElementById('success-stats').innerHTML = `Final Sink Rate: -${vs} FPM
Complete!
Score: ${totalScore}
Kills: ${totalKills}
In-Game Dollars: $${inGameDollars}
+$${levelBonus} Level Bonus!
+1 FREE SPIN`;
                document.getElementById('next-btn').style.display = 'inline-block';
                successMenu.style.borderColor = "#fbbf24";
                successMenu.style.display = 'block';
                playSound('repair');
                updateMenuScore();
                updateDollarDisplay();
                updateFreeSpinDisplay();
                saveGame();
                trackLanding();
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
            if (player.health <= 0) {
                // Already tracked
            } else {
                trackDeath(false);
            }
            if (lives <= 0) setTimeout(() => { showGameOverMenu(); }, 2500);
            else setTimeout(() => { respawnPlayer(); }, 2500);
        }

        function respawnPlayer() {
            // 🟡 ADD REWARD AD CALL HERE - Show ad before respawning
            reviveWithAd();
            // The actual respawn will happen in onRewardAdCompleted callback
        }

        // ===== ENHANCED 2D PLANE DRAWING =====
        function drawPlane(p, isPlayer) {
            if (p.exploded) return;
            if (!isPlayer && p.drawFunc) {
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
            ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
            ctx.beginPath();
            ctx.ellipse(15 * planeScale, 0, 15 * planeScale, 5 * planeScale, 0, 0, Math.PI * 2);
            ctx.fill();
            const wingMovement = isPlayer ? Math.sin(player.angle) * 0.5 : (p.wingAngle || 0);
            ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
            ctx.save();
            ctx.translate(20 * planeScale, -2 * planeScale);
            ctx.rotate(wingMovement * 0.3);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(35 * planeScale, -30 * planeScale);
            ctx.lineTo(45 * planeScale, -28 * planeScale);
            ctx.lineTo(25 * planeScale, 0);
            ctx.closePath();
            ctx.fill();
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
            ctx.save();
            ctx.translate(20 * planeScale, 2 * planeScale);
            ctx.rotate(-wingMovement * 0.3);
            ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(35 * planeScale, 30 * planeScale);
            ctx.lineTo(45 * planeScale, 28 * planeScale);
            ctx.lineTo(25 * planeScale, 0);
            ctx.closePath();
            ctx.fill();
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
            ctx.fillStyle = "#0ea5e9";
            ctx.beginPath();
            ctx.ellipse(30 * planeScale, -3 * planeScale, 10 * planeScale, 5 * planeScale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 1.5 * planeScale;
            ctx.beginPath();
            ctx.ellipse(30 * planeScale, -3 * planeScale, 10 * planeScale, 5 * planeScale, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(30 * planeScale, -8 * planeScale);
            ctx.lineTo(30 * planeScale, 2 * planeScale);
            ctx.stroke();
            ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
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
            ctx.fillStyle = isPlayer ? playerColor : (p.color || "#0f172a");
            ctx.beginPath();
            ctx.moveTo(-20 * planeScale, -2 * planeScale);
            ctx.lineTo(-40 * planeScale, -18 * planeScale);
            ctx.lineTo(-25 * planeScale, -16 * planeScale);
            ctx.lineTo(-15 * planeScale, -2 * planeScale);
            ctx.closePath();
            ctx.fill();
            if (isPlayer) {
                const gearExtend = player.gearAnim;
                if (gearExtend > 0) {
                    ctx.save();
                    ctx.translate(25 * planeScale, 5 * planeScale);
                    ctx.strokeStyle = "#1e293b";
                    ctx.lineWidth = 4 * planeScale;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, 15 * planeScale * gearExtend);
                    ctx.stroke();
                    ctx.fillStyle = "#334155";
                    ctx.beginPath();
                    ctx.ellipse(0, 15 * planeScale * gearExtend, 7 * planeScale, 4 * planeScale, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#94a3b8";
                    ctx.beginPath();
                    ctx.arc(0, 15 * planeScale * gearExtend, 3.5 * planeScale, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    ctx.save();
                    ctx.translate(-35 * planeScale, 5 * planeScale);
                    ctx.strokeStyle = "#1e293b";
                    ctx.lineWidth = 4 * planeScale;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, 15 * planeScale * gearExtend);
                    ctx.stroke();
                    ctx.fillStyle = "#334155";
                    ctx.beginPath();
                    ctx.ellipse(0, 15 * planeScale * gearExtend, 7 * planeScale, 4 * planeScale, 0, 0, Math.PI * 2);
                    ctx.fill();
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
                    if (s.type === 'tree_oak') {
                        ctx.fillStyle = s.trunkColor;
                        ctx.fillRect(sx - 8, baseY + s.height * 0.4, 16, s.height * 0.6);
                        ctx.fillStyle = s.leafColor;
                        ctx.beginPath();
                        ctx.arc(sx, baseY, s.height * 0.5, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (s.type === 'tree_pine') {
                        ctx.fillStyle = s.trunkColor;
                        ctx.fillRect(sx - 6, baseY + s.height * 0.3, 12, s.height * 0.7);
                        ctx.fillStyle = s.leafColor;
                        ctx.beginPath();
                        ctx.moveTo(sx, baseY - s.height * 0.8);
                        ctx.lineTo(sx - s.height * 0.3, baseY + s.height * 0.2);
                        ctx.lineTo(sx + s.height * 0.3, baseY + s.height * 0.2);
                        ctx.closePath();
                        ctx.fill();
                    } else if (s.type === 'tree_palm') {
                        ctx.fillStyle = s.trunkColor;
                        ctx.fillRect(sx - 5, baseY + s.height * 0.2, 10, s.height * 0.8);
                        ctx.fillStyle = s.leafColor;
                        for (let i = 0; i < 8; i++) {
                            const angle = (i / 8) * Math.PI + Math.PI;
                            const leafLength = s.height * 0.4;
                            ctx.beginPath();
                            ctx.moveTo(sx, baseY + s.height * 0.2);
                            ctx.lineTo(sx + Math.cos(angle) * leafLength, baseY + s.height * 0.2 + Math.sin(angle) * leafLength);
                            ctx.lineWidth = 4;
                            ctx.strokeStyle = s.leafColor;
                            ctx.stroke();
                        }
                    } else if (s.type === 'house') {
                        ctx.fillStyle = s.color;
                        ctx.fillRect(sx - s.width / 2, baseY + s.height * 0.3, s.width, s.height * 0.7);
                        ctx.fillStyle = s.roofColor;
                        ctx.beginPath();
                        ctx.moveTo(sx - s.width / 2 - 5, baseY + s.height * 0.3);
                        ctx.lineTo(sx, baseY);
                        ctx.lineTo(sx + s.width / 2 + 5, baseY + s.height * 0.3);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = s.doorColor || '#4a2e1e';
                        ctx.fillRect(sx - 5, baseY + s.height * 0.6, 10, s.height * 0.4);
                        ctx.fillStyle = s.windowColor || '#60a5fa';
                        ctx.fillRect(sx - 12, baseY + s.height * 0.4, 8, 8);
                        ctx.fillRect(sx + 4, baseY + s.height * 0.4, 8, 8);
                    } else if (s.type === 'building') {
                        ctx.fillStyle = s.color;
                        ctx.fillRect(sx - s.width / 2, baseY + s.height * 0.2, s.width, s.height * 0.8);
                        ctx.fillStyle = s.roofColor;
                        ctx.beginPath();
                        ctx.moveTo(sx - s.width / 2 - 3, baseY + s.height * 0.2);
                        ctx.lineTo(sx, baseY);
                        ctx.lineTo(sx + s.width / 2 + 3, baseY + s.height * 0.2);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = '#60a5fa';
                        for (let w = 0; w < s.windows; w++) {
                            ctx.fillRect(sx - 15 + w * 20, baseY + s.height * 0.4, 8, 8);
                        }
                    } else if (s.type === 'barn') {
                        ctx.fillStyle = s.color;
                        ctx.fillRect(sx - s.width / 2, baseY + s.height * 0.3, s.width, s.height * 0.7);
                        ctx.fillStyle = s.roofColor;
                        ctx.beginPath();
                        ctx.moveTo(sx - s.width / 2 - 8, baseY + s.height * 0.3);
                        ctx.lineTo(sx, baseY - 10);
                        ctx.lineTo(sx + s.width / 2 + 8, baseY + s.height * 0.3);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = s.doorColor || '#451a1a';
                        ctx.fillRect(sx - 8, baseY + s.height * 0.6, 16, s.height * 0.4);
                    } else if (s.type === 'bush') {
                        ctx.fillStyle = s.color;
                        ctx.beginPath();
                        ctx.arc(sx, baseY + s.height / 2, s.height / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (s.type === 'hill') {
                        ctx.fillStyle = s.color;
                        ctx.beginPath();
                        ctx.ellipse(sx, baseY + s.height / 2, s.width / 2, s.height / 2, 0, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (s.type === 'grass') {
                        ctx.fillStyle = s.color;
                        for (let g = 0; g < 5; g++) {
                            const gx = sx + (g - 2) * 8;
                            ctx.beginPath();
                            ctx.moveTo(gx, baseY);
                            ctx.lineTo(gx - 3, baseY - s.height);
                            ctx.lineTo(gx + 3, baseY - s.height);
                            ctx.closePath();
                            ctx.fill();
                        }
                    }
                }
            });
        }

        function drawNPCs() {
            const groundY = WORLD_GROUND - camera.y;
            npcs.forEach(npc => {
                npc.animation += 0.1;
                npc.x += npc.direction * npc.speed;
                if (Math.random() < 0.001) npc.direction *= -1;
                const sx = npc.x - camera.x;
                if (sx > -50 && sx < canvas.width + 50) {
                    ctx.save();
                    ctx.translate(sx, groundY - npc.size * 2);
                    if (npc.type === 'person') {
                        ctx.fillStyle = npc.color;
                        ctx.fillRect(-2, -npc.size * 2, 4, npc.size * 2);
                        ctx.beginPath();
                        ctx.arc(0, -npc.size * 3, npc.size, 0, Math.PI * 2);
                        ctx.fill();
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
                        ctx.fillStyle = npc.color;
                        ctx.fillRect(-3, -npc.size * 1.5, 6, npc.size * 1.5);
                        ctx.beginPath();
                        ctx.arc(-2, -npc.size * 2, npc.size * 0.7, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(2, -npc.size * 2, npc.size * 0.7, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (npc.type === 'cat') {
                        ctx.fillStyle = npc.color;
                        ctx.fillRect(-2, -npc.size * 1.5, 4, npc.size * 1.5);
                        ctx.beginPath();
                        ctx.arc(0, -npc.size * 2.5, npc.size, 0, Math.PI * 2);
                        ctx.fill();
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

        function drawRadar() {
            const rx = canvas.width - 105; const ry = canvas.height - 105;
            ctx.save();
            ctx.translate(rx, ry);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.beginPath();
            ctx.arc(0, 0, RADAR_RADIUS + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
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
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(RADAR_RADIUS, 0);
            ctx.stroke();
            ctx.restore();
            const altitude = WORLD_GROUND - player.y;
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
            const baseY = 20;
            const maxOffset = 25;
            const normalizedAlt = Math.min(altitude, 3000) / 3000;
            const verticalOffset = (normalizedAlt - 0.5) * maxOffset * 2;
            const yPos = baseY + verticalOffset;
            if (altitude < 3000) {
                runwayStarts.forEach((start, index) => {
                    const dx = (start - player.x) * RADAR_SCALE;
                    const runwayLength = 5500 * RADAR_SCALE;
                    const runwayStart = dx;
                    const runwayEnd = dx + runwayLength;
                    if (Math.abs(dx) < RADAR_RADIUS + runwayLength) {
                        ctx.globalAlpha = runwayAlpha;
                        const isTarget = runwayNumbers[index] === targetRunway;
                        ctx.strokeStyle = isTarget ? "#fbbf24" : "#38bdf8";
                        ctx.lineWidth = isTarget ? 4 : 2;
                        if (runwayStart < 0 && runwayEnd > 0) {
                            ctx.beginPath();
                            ctx.moveTo(runwayStart, yPos);
                            ctx.lineTo(0, yPos);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(0, yPos);
                            ctx.lineTo(runwayEnd, yPos);
                            ctx.stroke();
                        } else {
                            ctx.beginPath();
                            ctx.moveTo(runwayStart, yPos);
                            ctx.lineTo(runwayEnd, yPos);
                            ctx.stroke();
                        }
                        let textX = dx + runwayLength / 2;
                        if (Math.abs(textX) < 10) {
                            textX = 15;
                        }
                        ctx.font = `bold ${isTarget ? 10 : 8}px 'Courier New'`;
                        ctx.fillStyle = isTarget ? "#fbbf24" : "#ffffff";
                        ctx.globalAlpha = runwayAlpha * (isTarget ? 1.0 : 0.8);
                        ctx.fillText(runwayNumbers[index], textX, yPos - 5);
                    }
                });
            }
            ctx.globalAlpha = 1;
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
            if (bossActive && boss && boss.alive && !boss.exploded) {
                const dx = (boss.x - player.x) * RADAR_SCALE;
                const dy = (boss.y - player.y) * RADAR_SCALE;
                if (Math.hypot(dx, dy) < RADAR_RADIUS) {
                    ctx.fillStyle = boss.color || "#fbbf24";
                    ctx.beginPath();
                    ctx.arc(dx, dy, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            // Draw meteoroids on radar
            meteoroids.forEach(m => {
                if (!m.isBackground) {
                    const dx = (m.x - player.x) * RADAR_SCALE;
                    const dy = (m.y - player.y) * RADAR_SCALE;
                    if (Math.hypot(dx, dy) < RADAR_RADIUS) {
                        ctx.fillStyle = "#ff6600";
                        ctx.beginPath();
                        ctx.arc(dx, dy, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.strokeStyle = '#ff6600';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.arc(dx, dy, 6, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            });
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.font = "bold 14px 'Courier New'";
            ctx.fillStyle = "#fbbf24";
            ctx.fillText(`🚀 ${missileCount}`, canvas.width - 150, 50);
            if (activePower) {
                const power = powerItems.find(p => p.id === activePower);
                if (power) ctx.fillText(`${power.icon} ${power.name}`, canvas.width - 150, 75);
            }
            const activeMeteors = meteoroids.filter(m => !m.isBackground).length;
            if (activeMeteors > 0) {
                ctx.fillStyle = '#ff6600';
                ctx.fillText(`☄️ ${activeMeteors}`, canvas.width - 150, 100);
            }
            ctx.restore();
        }

        // ===== DRAW STARS WITH MOUNTAIN OCCLUSION =====
        function drawStars() {
            const groundY = WORLD_GROUND - camera.y;
            stars.forEach(star => {
                const sx = star.x - camera.x * 0.1;
                const sy = star.y - camera.y * 0.1;
                if (sx > 0 && sx < canvas.width && sy > 0 && sy < canvas.height) {
                    let behindMountain = false;
                    for (let m of mountains) {
                        const mountainSX = m.x - camera.x;
                        if (sx > mountainSX - m.width * 0.5 && sx < mountainSX + m.width * 0.5) {
                            const mountainTopY = groundY - m.height;
                            if (sy > mountainTopY) {
                                behindMountain = true;
                                break;
                            }
                        }
                    }
                    if (!behindMountain) {
                        const twinkle = 0.7 + 0.3 * Math.sin(frame * star.twinkleSpeed + star.twinklePhase);
                        ctx.globalAlpha = star.brightness * twinkle;
                        ctx.fillStyle = star.color;
                        ctx.beginPath();
                        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });
            ctx.globalAlpha = 1;
        }

        function draw() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawStars();
            drawShootingStars();
            drawClouds();
            drawRealisticMountains();
            
            const groundY = WORLD_GROUND - camera.y;
            const groundGradient = ctx.createLinearGradient(0, groundY - 50, 0, groundY + 50);
            groundGradient.addColorStop(0, '#1a2f1a');
            groundGradient.addColorStop(0.7, '#2d4a2d');
            groundGradient.addColorStop(1, '#3d5a3d');
            ctx.fillStyle = groundGradient;
            ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY + 10);
            
            ctx.fillStyle = '#2d4a2d';
            for (let i = 0; i < 20; i++) {
                const x = (Math.sin(frame * 0.02 + i) * 50 + i * 100) % (canvas.width + 200) - 100;
                ctx.fillRect(x, groundY - 2, 30, 4);
            }
            
            drawPondsAndBoats();
            drawScenery();
            controlTowers.forEach(tower => drawDetailedControlTower(tower));
            drawNPCs();
            drawRunwayLocalizers();
            
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
            
            drawRunwayLights();
            
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
            
            // Draw meteoroids and explosions
            drawMeteoroids();
            
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
            drawBirds();
            drawGroundSparkles();
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

        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (!isPaused && player) {
                camera.x = player.x - canvas.width / 2.8;
                camera.y = player.y - canvas.height / 2.5;
            }
            if (window.innerWidth <= 1024) {
                hud.style.display = 'none';
                document.getElementById('mobile-controls').style.display = 'block';
                document.getElementById('auto-shoot-toggle').style.display = 'none';
                shopBtn.style.display = 'none'; // Hide shop button on mobile
                updateMobileControlsDisplay();
            } else {
                if (homeMenu.style.display === 'none' && gameoverMenu.style.display === 'none') {
                    hud.style.display = 'block';
                    shopBtn.style.display = 'block'; // Show shop button on desktop
                }
                document.getElementById('mobile-controls').style.display = 'none';
                document.getElementById('auto-shoot-toggle').style.display = 'none';
            }
        });

        window.addEventListener('load', function () {
            // Check login status first
            checkFirstTimeUser();
            
            // Then proceed with normal loading
            setTimeout(() => {
                loadingPage.classList.add('hidden');
                homeMenu.classList.add('visible');
                initAudio();
                loadSettings();
                loadPlayerStats();
                updatePilotWelcomeDisplay();
                updatePilotDataDisplay();
                
                if (soundEnabled && audioCtx) {
                    if (audioCtx.state === 'suspended') {
                        audioCtx.resume().then(() => {
                            console.log('Audio context resumed, starting home music...');
                            setTimeout(() => {
                                initHomeMusic();
                                console.log('Home music started automatically');
                            }, 200);
                        }).catch(e => {
                            console.log('Failed to resume audio context:', e);
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
                
                checkDailyReward();
                refreshGameState();
                
                // Load home coins and mystery boxes
                loadHomeCoins();
                loadMysteryBoxes();
                
                // Load notifications
                loadNotifications();
                
                // Load high score
                loadHighScore();
                
                // Load planes
                loadUnlockedPlanes(); // Load planes on startup
                
                // Force landscape orientation
                forceLandscapeOrientation();
            }, 2000);
        });

        window.openSettings = function () {
            settingsPanel.style.display = 'block';
            homeMenu.style.opacity = '0.5';
            updatePilotDataDisplay();
            updatePilotWelcomeDisplay();
            updateStatsDisplay();
        }

        window.closeSettings = function () {
            settingsPanel.style.display = 'none';
            homeMenu.style.opacity = '1';
            saveSettings();
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
            saveSettings();
            refreshGameState();
        }

        window.updateVolume = function (val) {
            musicVolume = val;
            if (engineGain) engineGain.gain.value = soundEnabled ? (0.05 + (player?.thrust || 4) * 0.015) * (musicVolume / 100) : 0;
            saveSettings();
            refreshGameState();
        }

        window.updateSFXVolume = function (val) {
            sfxVolume = val;
            saveSettings();
            refreshGameState();
        }

        window.cycleSensitivity = function () {
            const sensitivities = ['Low', 'Normal', 'High'];
            let currentIndex = sensitivities.indexOf(sensitivityLevel);
            currentIndex = (currentIndex + 1) % sensitivities.length;
            sensitivityLevel = sensitivities[currentIndex];
            document.getElementById('sensitivity-value').innerText = sensitivityLevel;
            saveSettings();
            refreshGameState();
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
            saveSettings();
            refreshGameState();
        }

        window.nextLevel = function () {
            currentLevel++; currentStage = 1; bossActive = false; boss = null; bossHealthContainer.style.display = 'none';
            updatePlayerStatsFromPlane(); player.health = playerBaseHealth; missileCount = playerBaseMissiles;
            isPaused = false; successMenu.style.display = 'none';
            player.x = 2000; player.y = 3000; player.vx = 0; player.vy = 0; player.angle = 0; player.thrust = 4;
            bullets = []; enemyBullets = []; missiles = []; activePower = null; powerDuration = 0; updatePowerDisplay();
            spawnEnemies(); saveGame(); updateTargetRunway();
            refreshGameState();
        }

        window.retryLevel = function () {
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

        console.log('ULTIMATE EDITION WITH FIXED PLANE SAVING - Planes stay unlocked forever!');
        console.log('PORTRAIT MODE FIXED - Left controls on left side, Action buttons on right side, ILS and Radar removed in portrait mode!');
        console.log('AD INTEGRATION FULLY IMPLEMENTED - Main ad on START MISSION & Game Over Restart, Reward ad with callbacks for revive!');
   