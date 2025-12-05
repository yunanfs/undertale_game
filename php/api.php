<?php
// ============================================
// UNDERTALE GAME - PHP BACKEND
// ============================================

// Set header untuk JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ============================================
// ERROR HANDLING
// ============================================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// DATABASE CONNECTION (OPTIONAL)
// ============================================

// Uncomment if you want to use database
// $host = 'localhost';
// $user = 'root';
// $password = '';
// $database = 'undertale_game';
//
// $conn = new mysqli($host, $user, $password, $database);
// if ($conn->connect_error) {
//     die(json_encode(['error' => 'Database connection failed']));
// }

// ============================================
// REQUEST ROUTING
// ============================================

$request = $_REQUEST['action'] ?? null;

switch($request) {
    case 'get_game_state':
        getGameState();
        break;
    case 'save_action':
        saveAction();
        break;
    case 'get_dialog':
        getDialog();
        break;
    case 'calculate_damage':
        calculateDamage();
        break;
    case 'check_battle_end':
        checkBattleEnd();
        break;
    case 'reset_game':
        resetGame();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}

// ============================================
// GAME STATE FUNCTIONS
// ============================================

function getGameState() {
    $gameState = [
        'currentHP' => $_SESSION['currentHP'] ?? 20,
        'maxHP' => 20,
        'level' => $_SESSION['level'] ?? 1,
        'experience' => $_SESSION['experience'] ?? 0,
        'battleActive' => $_SESSION['battleActive'] ?? true,
        'timestamp' => time()
    ];
    
    echo json_encode(['success' => true, 'data' => $gameState]);
}

function saveAction() {
    $action = $_REQUEST['action_type'] ?? null;
    $timestamp = time();
    
    if (!$action) {
        http_response_code(400);
        echo json_encode(['error' => 'Action type is required']);
        return;
    }
    
    // Here you can save to database
    $actionLog = [
        'action' => $action,
        'timestamp' => $timestamp,
        'ip_address' => $_SERVER['REMOTE_ADDR']
    ];
    
    // Save to file (if database is not available)
    $logFile = __DIR__ . '/../logs/actions.log';
    if (!is_dir(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    
    file_put_contents($logFile, json_encode($actionLog) . PHP_EOL, FILE_APPEND);
    
    echo json_encode(['success' => true, 'message' => 'Action saved']);
}

function getDialog() {
    $type = $_REQUEST['type'] ?? 'mercy';
    
    $dialogs = [
        'fight' => [
            '* You attack the enemy!',
            '* The enemy takes damage...',
            '* The battle continues...'
        ],
        'act' => [
            '* You try to show kindness.',
            '* The enemy seems confused.',
            '* What will you do?'
        ],
        'item' => [
            '* You check your items.',
            '* Potion, Bread, Pie',
            '* Choose wisely.'
        ],
        'mercy' => [
            '* Spare the enemy',
            '* End battle peacefully',
            '* Run away from danger',
            '* Save your friends'
        ]
    ];
    
    $selectedDialog = $dialogs[$type] ?? $dialogs['mercy'];
    
    echo json_encode([
        'success' => true,
        'type' => $type,
        'messages' => $selectedDialog
    ]);
}

function calculateDamage() {
    $actionType = $_REQUEST['action_type'] ?? 'normal';
    
    $damageRanges = [
        'fight' => ['min' => 3, 'max' => 10],
        'act' => ['min' => 0, 'max' => 5],
        'item' => ['min' => 0, 'max' => 0]
    ];
    
    $range = $damageRanges[$actionType] ?? ['min' => 1, 'max' => 5];
    $damage = rand($range['min'], $range['max']);
    
    echo json_encode([
        'success' => true,
        'damage' => $damage,
        'action_type' => $actionType
    ]);
}

function checkBattleEnd() {
    $currentHP = $_REQUEST['currentHP'] ?? 20;
    $battleEnded = false;
    $endReason = null;
    
    if ($currentHP <= 0) {
        $battleEnded = true;
        $endReason = 'You were defeated...';
    } else if ($_REQUEST['action'] === 'mercy' && $_REQUEST['mercy_level'] >= 3) {
        $battleEnded = true;
        $endReason = 'You won peacefully!';
    }
    
    echo json_encode([
        'success' => true,
        'battle_ended' => $battleEnded,
        'reason' => $endReason
    ]);
}

function resetGame() {
    // Reset session variables
    $_SESSION['currentHP'] = 20;
    $_SESSION['level'] = 1;
    $_SESSION['experience'] = 0;
    $_SESSION['battleActive'] = true;
    
    echo json_encode([
        'success' => true,
        'message' => 'Game reset'
    ]);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function logError($error) {
    $logFile = __DIR__ . '/../logs/errors.log';
    if (!is_dir(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $error" . PHP_EOL, FILE_APPEND);
}

function sendResponse($success, $data = [], $message = '') {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message,
        'timestamp' => time()
    ]);
}

// ============================================
// SESSION MANAGEMENT
// ============================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Initialize session variables if not set
if (!isset($_SESSION['currentHP'])) {
    $_SESSION['currentHP'] = 20;
    $_SESSION['maxHP'] = 20;
    $_SESSION['level'] = 1;
    $_SESSION['experience'] = 0;
    $_SESSION['battleActive'] = true;
}

?>
