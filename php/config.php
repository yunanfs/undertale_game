<?php
// ============================================
// UNDERTALE GAME - CONFIGURATION
// ============================================

// Database Configuration (Optional)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'undertale_game');

// Game Settings
define('MAX_HP', 20);
define('STARTING_LEVEL', 1);
define('MAX_LEVEL', 99);

// Game Mechanics
define('MERCY_THRESHOLD', 3);
define('MIN_DAMAGE', 1);
define('MAX_DAMAGE', 10);

// Session Configuration
ini_set('session.gc_maxlifetime', 3600);
session_set_cookie_params(3600);

// Error Reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Log Path
define('LOG_PATH', __DIR__ . '/../logs/');

// Ensure log directory exists
if (!is_dir(LOG_PATH)) {
    mkdir(LOG_PATH, 0755, true);
}

?>
