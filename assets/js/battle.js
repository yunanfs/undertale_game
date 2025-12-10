// ============================================
// UNDERTALE BATTLE MINI-GAME ENGINE
// ============================================

class BattleGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.player = {
            x: 0,
            y: 0,
            size: 12,
            speed: 3,
            hp: 20,
            maxHP: 20,
            invincible: false,
            invincibleTime: 0
        };
        this.bullets = [];
        this.enemy = null;
        this.battleActive = false;
        this.battlePhase = 'menu'; // menu, fighting, victory, defeat
        this.keys = {};
        this.score = {
            exp: 0,
            gold: 0,
            dodges: 0
        };
        this.attackTimer = 0;
        this.battleTime = 0;
        this.enemyTypes = [
            {
                name: 'FROGGIT',
                hp: 30,
                attack: 5,
                defense: 4,
                exp: 10,
                gold: 5,
                color: '#90ee90',
                attackPattern: 'cross'
            },
            {
                name: 'WHIMSUN',
                hp: 20,
                attack: 3,
                defense: 2,
                exp: 8,
                gold: 4,
                color: '#87ceeb',
                attackPattern: 'spiral'
            },
            {
                name: 'MOLDSMAL',
                hp: 40,
                attack: 6,
                defense: 3,
                exp: 12,
                gold: 6,
                color: '#dda0dd',
                attackPattern: 'rain'
            },
            {
                name: 'LOOX',
                hp: 35,
                attack: 7,
                defense: 5,
                exp: 15,
                gold: 8,
                color: '#ffd700',
                attackPattern: 'wave'
            }
        ];
    }

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return false;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 400;
        
        // Center player
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
        
        this.setupControls();
        return true;
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Prevent arrow keys from scrolling
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    startBattle(enemyIndex = null) {
        // Random enemy if not specified
        if (enemyIndex === null) {
            enemyIndex = Math.floor(Math.random() * this.enemyTypes.length);
        }
        
        this.enemy = { ...this.enemyTypes[enemyIndex] };
        this.enemy.currentHP = this.enemy.hp;
        
        this.battleActive = true;
        this.battlePhase = 'fighting';
        this.bullets = [];
        this.attackTimer = 0;
        this.battleTime = 0;
        this.player.hp = this.player.maxHP;
        this.player.invincible = false;
        this.score.dodges = 0;
        
        // Reset player position
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
        
        this.gameLoop();
    }

    gameLoop() {
        if (!this.battleActive) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.battlePhase !== 'fighting') return;
        
        this.battleTime++;
        
        // Update player position
        const boundary = 50;
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.x = Math.max(boundary, this.player.x - this.player.speed);
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.player.x = Math.min(this.canvas.width - boundary, this.player.x + this.player.speed);
        }
        if (this.keys['arrowup'] || this.keys['w']) {
            this.player.y = Math.max(boundary, this.player.y - this.player.speed);
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
            this.player.y = Math.min(this.canvas.height - boundary, this.player.y + this.player.speed);
        }
        
        // Update invincibility
        if (this.player.invincible) {
            this.player.invincibleTime--;
            if (this.player.invincibleTime <= 0) {
                this.player.invincible = false;
            }
        }
        
        // Spawn bullets based on attack pattern
        this.attackTimer++;
        if (this.attackTimer > 60) { // Every 1 second
            this.spawnAttack();
            this.attackTimer = 0;
        }
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Remove bullets outside canvas
            return bullet.x > -20 && bullet.x < this.canvas.width + 20 &&
                   bullet.y > -20 && bullet.y < this.canvas.height + 20;
        });
        
        // Check collision
        if (!this.player.invincible) {
            for (let bullet of this.bullets) {
                const dx = this.player.x - bullet.x;
                const dy = this.player.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.player.size / 2 + bullet.size / 2) {
                    this.hitPlayer();
                    break;
                }
            }
        }
        
        // Check win condition (survive 30 seconds)
        if (this.battleTime > 1800) { // 30 seconds at 60fps
            this.winBattle();
        }
    }

    spawnAttack() {
        const pattern = this.enemy.attackPattern;
        
        switch(pattern) {
            case 'cross':
                this.spawnCrossPattern();
                break;
            case 'spiral':
                this.spawnSpiralPattern();
                break;
            case 'rain':
                this.spawnRainPattern();
                break;
            case 'wave':
                this.spawnWavePattern();
                break;
        }
    }

    spawnCrossPattern() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const speed = 2;
        
        // Four directions
        this.bullets.push({ x: centerX, y: centerY, vx: speed, vy: 0, size: 8, color: this.enemy.color });
        this.bullets.push({ x: centerX, y: centerY, vx: -speed, vy: 0, size: 8, color: this.enemy.color });
        this.bullets.push({ x: centerX, y: centerY, vx: 0, vy: speed, size: 8, color: this.enemy.color });
        this.bullets.push({ x: centerX, y: centerY, vx: 0, vy: -speed, size: 8, color: this.enemy.color });
    }

    spawnSpiralPattern() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const speed = 2.5;
        const angle = (this.battleTime * 5) * Math.PI / 180;
        
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        this.bullets.push({ x: centerX, y: centerY, vx, vy, size: 6, color: this.enemy.color });
    }

    spawnRainPattern() {
        const x = Math.random() * this.canvas.width;
        const y = 0;
        const speed = 3 + Math.random() * 2;
        
        this.bullets.push({ x, y, vx: 0, vy: speed, size: 8, color: this.enemy.color });
    }

    spawnWavePattern() {
        const x = Math.random() * this.canvas.width;
        const y = 0;
        const speed = 2;
        const vx = Math.sin(this.battleTime * 0.1) * 2;
        
        this.bullets.push({ x, y, vx, vy: speed, size: 7, color: this.enemy.color });
    }

    hitPlayer() {
        this.player.hp -= this.enemy.attack;
        this.player.invincible = true;
        this.player.invincibleTime = 60; // 1 second invincibility
        
        // Play hit sound
        this.playSound(300, 0.1);
        
        // Update HP display
        if (typeof updateHP === 'function') {
            updateHP(this.player.hp);
        }
        
        if (this.player.hp <= 0) {
            this.defeatBattle();
        }
    }

    winBattle() {
        this.battleActive = false;
        this.battlePhase = 'victory';

        // Award points
        this.score.exp += this.enemy.exp;
        this.score.gold += this.enemy.gold;

        // Play victory sound
        this.playSound(500, 0.1);
        this.playSound(600, 0.1, 0.1);
        this.playSound(700, 0.2, 0.2);

        // Show victory message
        this.showBattleResult('VICTORY', `YOU WON!\n+${this.enemy.exp} EXP\n+${this.enemy.gold} GOLD\nDodges: ${this.score.dodges}`);

        // Return to main game after 3 seconds
        setTimeout(() => {
            if (window.returnToMainGame) {
                window.returnToMainGame();
            }
        }, 3000);
    }

    defeatBattle() {
        this.battleActive = false;
        this.battlePhase = 'defeat';

        // Play defeat sound
        this.playSound(200, 0.3);

        // Show defeat message
        this.showBattleResult('DEFEAT', 'YOU LOST...\nTry again!');

        // Return to main game after 3 seconds
        setTimeout(() => {
            if (window.returnToMainGame) {
                window.returnToMainGame();
            }
        }, 3000);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw battle box
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(40, 40, this.canvas.width - 80, this.canvas.height - 80);
        
        // Draw enemy name
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.enemy.name, this.canvas.width / 2, 30);
        
        // Draw timer
        const timeLeft = Math.max(0, 30 - Math.floor(this.battleTime / 60));
        this.ctx.font = '16px "Courier New"';
        this.ctx.fillStyle = timeLeft < 10 ? '#ff0000' : '#fff';
        this.ctx.fillText(`Time: ${timeLeft}s`, this.canvas.width - 80, 30);
        
        // Draw bullets
        for (let bullet of this.bullets) {
            this.ctx.fillStyle = bullet.color;
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw player (heart)
        if (this.player.invincible && Math.floor(this.battleTime / 10) % 2 === 0) {
            // Flashing when invincible
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        } else {
            this.ctx.fillStyle = '#ff0000';
        }
        
        // Draw heart shape
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        this.ctx.scale(this.player.size / 20, this.player.size / 20);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 5);
        this.ctx.bezierCurveTo(-10, -5, -20, 0, -10, 15);
        this.ctx.lineTo(0, 20);
        this.ctx.lineTo(10, 15);
        this.ctx.bezierCurveTo(20, 0, 10, -5, 0, 5);
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw HP
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px "Courier New"';
        this.ctx.fillText(`HP: ${this.player.hp}/${this.player.maxHP}`, 50, 30);
    }

    showBattleResult(title, message) {
        const resultDiv = document.getElementById('battle-result');
        const titleEl = document.getElementById('battle-result-title');
        const messageEl = document.getElementById('battle-result-message');
        
        if (resultDiv && titleEl && messageEl) {
            titleEl.textContent = title;
            messageEl.innerHTML = message.replace(/\n/g, '<br>');
            resultDiv.classList.remove('hidden');
            
            if (title === 'VICTORY') {
                titleEl.style.color = '#00ff00';
            } else {
                titleEl.style.color = '#ff0000';
            }
        }
    }

    playSound(frequency, duration, delay = 0) {
        setTimeout(() => {
            if (typeof playBeep === 'function') {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                playBeep(audioContext, frequency, duration, audioContext.currentTime);
            }
        }, delay * 1000);
    }

    reset() {
        this.battleActive = false;
        this.battlePhase = 'menu';
        this.bullets = [];
        this.player.hp = this.player.maxHP;
        
        // Hide result
        const resultDiv = document.getElementById('battle-result');
        if (resultDiv) {
            resultDiv.classList.add('hidden');
        }
        
        // Clear canvas
        if (this.ctx) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Global battle game instance
window.battleGame = new BattleGame();