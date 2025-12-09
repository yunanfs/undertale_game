// ============================================
// LOGIN PAGE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initLoginPage();
});

function initLoginPage() {
    const playerNameInput = document.getElementById('player-name');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (!playerNameInput) return; // Not on login page

    // Set default name
    playerNameInput.value = 'FRISK';
    playerNameInput.focus();

    // Start button - navigate to game with player name
    startBtn.addEventListener('click', function() {
        const playerName = playerNameInput.value.trim() || 'FRISK';
        startGame(playerName);
    });

    // Reset button - clear input
    resetBtn.addEventListener('click', function() {
        playerNameInput.value = 'FRISK';
        playerNameInput.focus();
    });

    // Press Enter to start
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const playerName = this.value.trim() || 'FRISK';
            startGame(playerName);
        }
    });

    // Press Z to start (Undertale reference)
    document.addEventListener('keydown', function(e) {
        if ((e.key === 'z' || e.key === 'Z') && document.body.classList.contains('login-page')) {
            const playerName = playerNameInput.value.trim() || 'FRISK';
            startGame(playerName);
        }
    });

    // Validate input - uppercase only
    playerNameInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });
}

function startGame(playerName) {
    // Store player name in localStorage
    localStorage.setItem('undertale_player_name', playerName);

    // Add loading animation
    const loginBox = document.querySelector('.login-box');
    if (loginBox) {
        loginBox.style.opacity = '0.5';
    }

    // Redirect to game after short delay
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 300);
}

// ============================================
// LOAD PLAYER NAME IN GAME PAGE
// ============================================

function loadPlayerNameInGame() {
    const playerName = localStorage.getItem('undertale_player_name') || 'FRISK';
    const playerNameDisplay = document.getElementById('player-name-display');
    
    if (playerNameDisplay) {
        playerNameDisplay.textContent = playerName;
    }

    // Store in game state if available
    if (typeof gameState !== 'undefined') {
        gameState.playerName = playerName;
    }
}

// Call this on game page load
if (document.body.classList.contains('login-page') === false) {
    document.addEventListener('DOMContentLoaded', loadPlayerNameInGame);
}
