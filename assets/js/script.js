// ============================================
// UNDERTALE GAME - MAIN SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

// ============================================
// GAME STATE
// ============================================

const gameState = {
    currentHP: 20,
    maxHP: 20,
    level: 1,
    currentAction: 'mercy',
    battleActive: true,
    dialogHistory: []
};

// ============================================
// ACTION BUTTONS
// ============================================

function initializeGame() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleAction(action);
        });
    });

    // Set initial dialog
    setDialog('mercy', [
        '* Spare the enemy',
        '* End battle peacefully',
        '* Run away from danger',
        '* Save your friends'
    ]);
}

// ============================================
// ACTION HANDLERS
// ============================================

function handleAction(action) {
    gameState.currentAction = action;
    
    switch(action) {
        case 'fight':
            handleFight();
            break;
        case 'act':
            handleAct();
            break;
        case 'item':
            handleItem();
            break;
        case 'mercy':
            handleMercy();
            break;
        default:
            break;
    }
}

function handleFight() {
    const damage = Math.floor(Math.random() * 8) + 3; // 3-10 damage
    const dialogMessages = [
        `* You attack the enemy!`,
        `* Damage dealt: ${damage} HP`,
        `* Enemy HP is now lower...`,
        `* But the enemy doesn't seem to care...`
    ];
    
    setDialog('FIGHT', dialogMessages);
    playActionSound('fight');
}

function handleAct() {
    const actOptions = [
        '* Talk to the enemy',
        '* Show kindness',
        '* Offer help',
        '* The enemy seems confused...'
    ];
    
    setDialog('ACT', actOptions);
    playActionSound('act');
}

function handleItem() {
    const itemOptions = [
        '* Potion - Restore 20 HP',
        '* Bread - Restore 10 HP',
        '* Butterscotch-Cinnamon Pie - Full Restore',
        '* You check your items...'
    ];
    
    setDialog('ITEM', itemOptions);
    playActionSound('item');
}

function handleMercy() {
    const mercyOptions = [
        '* Spare the enemy',
        '* End battle peacefully',
        '* Run away from danger',
        '* Save your friends'
    ];
    
    setDialog('MERCY', mercyOptions);
    playActionSound('mercy');
}

// ============================================
// DIALOG MANAGEMENT
// ============================================

function setDialog(title, messages) {
    const dialogSection = document.querySelector('.dialog-section');
    const dialogTitle = dialogSection.querySelector('.dialog-title');
    const dialogContent = dialogSection.querySelector('.dialog-content');
    
    // Set title with appropriate color
    dialogTitle.textContent = title;
    if (title === 'MERCY') {
        dialogTitle.style.color = '#00ff00';
    } else if (title === 'FIGHT') {
        dialogTitle.style.color = '#ff0000';
    } else if (title === 'ACT') {
        dialogTitle.style.color = '#ffff00';
    } else if (title === 'ITEM') {
        dialogTitle.style.color = '#00ffff';
    }
    
    // Clear previous messages
    dialogContent.innerHTML = '';
    
    // Add new messages with animation
    messages.forEach((message, index) => {
        const p = document.createElement('p');
        p.textContent = message;
        p.style.animationDelay = `${index * 0.1}s`;
        dialogContent.appendChild(p);
    });
    
    // Save to history
    gameState.dialogHistory.push({
        title: title,
        messages: messages,
        timestamp: new Date().getTime()
    });
}

// ============================================
// SOUND EFFECTS (using Web Audio API)
// ============================================

function playActionSound(action) {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    switch(action) {
        case 'fight':
            playBeep(audioContext, 400, 0.1, now);
            playBeep(audioContext, 600, 0.1, now + 0.1);
            break;
        case 'mercy':
            playBeep(audioContext, 500, 0.15, now);
            playBeep(audioContext, 700, 0.15, now + 0.1);
            break;
        case 'act':
            playBeep(audioContext, 450, 0.1, now);
            break;
        case 'item':
            playBeep(audioContext, 550, 0.1, now);
            playBeep(audioContext, 650, 0.1, now + 0.08);
            break;
    }
}

function playBeep(audioContext, frequency, duration, startTime) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// ============================================
// HP MANAGEMENT
// ============================================

function updateHP(newHP) {
    gameState.currentHP = Math.max(0, Math.min(newHP, gameState.maxHP));
    
    const hpFill = document.getElementById('hp-fill');
    const currentHPDisplay = document.getElementById('current-hp');
    
    const hpPercentage = (gameState.currentHP / gameState.maxHP) * 100;
    hpFill.style.width = hpPercentage + '%';
    currentHPDisplay.textContent = gameState.currentHP;
    
    // Change color based on HP
    if (hpPercentage > 50) {
        hpFill.style.background = 'linear-gradient(90deg, #ff0000, #ff6666)';
    } else if (hpPercentage > 25) {
        hpFill.style.background = 'linear-gradient(90deg, #ff6600, #ffaa00)';
    } else {
        hpFill.style.background = 'linear-gradient(90deg, #ff0000, #cc0000)';
    }
    
    if (gameState.currentHP <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameState.battleActive = false;
    const dialogSection = document.querySelector('.dialog-section');
    
    setDialog('GAME OVER', [
        '* Your HP fell to 0...',
        '* But... something is calling you back...',
        '* ...'
    ]);
    
    // Disable action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.5';
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', function(event) {
    if (!gameState.battleActive) return;
    
    switch(event.key.toLowerCase()) {
        case 'f':
            handleAction('fight');
            break;
        case 'a':
            handleAction('act');
            break;
        case 'i':
            handleAction('item');
            break;
        case 'm':
            handleAction('mercy');
            break;
        case 'h':
            // Decrease HP for testing
            updateHP(gameState.currentHP - 5);
            break;
        case 'l':
            // Increase HP for testing
            updateHP(gameState.currentHP + 10);
            break;
    }
});

// ============================================
// UTILITIES
// ============================================

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
}

// Log game state for debugging
function logGameState() {
    console.log('Game State:', gameState);
    console.log('Dialog History:', gameState.dialogHistory);
}

// Make functions accessible from console
window.gameState = gameState;
window.handleAction = handleAction;
window.updateHP = updateHP;
window.logGameState = logGameState;

// ============================================
// HAMBURGER NAVIGATION (Floating menu)
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initHamburger();
});

function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('nav-overlay');
    const body = document.body;

    if (!hamburger) return; // not present on all pages

    function openMenu() {
        body.classList.add('nav-open');
        hamburger.setAttribute('aria-expanded', 'true');
        if (overlay) overlay.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (overlay) overlay.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', function (e) {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        if (expanded) closeMenu(); else openMenu();
    });

    // Close when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function () {
            closeMenu();
        });
    }

    // Close on Escape
    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' || ev.key === 'Esc') {
            if (body.classList.contains('nav-open')) {
                closeMenu();
            }
        }
    });

    // Close when clicking a nav link (so focus returns to main content)
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.addEventListener('click', function (ev) {
            const target = ev.target;
            if (target && target.matches('a.nav-link')) {
                closeMenu();
            }
        });
    }
}
