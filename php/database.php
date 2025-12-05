<?php
// ============================================
// UNDERTALE GAME - DATABASE FUNCTIONS
// ============================================

class GameDatabase {
    private $conn;
    
    public function __construct() {
        $this->connect();
    }
    
    // ============================================
    // CONNECTION METHODS
    // ============================================
    
    private function connect() {
        $this->conn = new mysqli(
            DB_HOST,
            DB_USER,
            DB_PASSWORD,
            DB_NAME
        );
        
        if ($this->conn->connect_error) {
            die('Connection failed: ' . $this->conn->connect_error);
        }
        
        $this->conn->set_charset('utf8mb4');
    }
    
    // ============================================
    // PLAYER METHODS
    // ============================================
    
    public function createPlayer($name, $level = 1) {
        $query = "INSERT INTO players (name, level, max_hp, current_hp, created_at) 
                  VALUES (?, ?, ?, ?, NOW())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('siii', $name, $level, MAX_HP, MAX_HP);
        
        return $stmt->execute();
    }
    
    public function getPlayer($id) {
        $query = "SELECT * FROM players WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_assoc();
    }
    
    public function updatePlayerHP($id, $hp) {
        $query = "UPDATE players SET current_hp = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $hp, $id);
        
        return $stmt->execute();
    }
    
    public function updatePlayerLevel($id, $level) {
        $query = "UPDATE players SET level = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ii', $level, $id);
        
        return $stmt->execute();
    }
    
    // ============================================
    // BATTLE METHODS
    // ============================================
    
    public function createBattle($player_id, $enemy_type) {
        $query = "INSERT INTO battles (player_id, enemy_type, status, created_at) 
                  VALUES (?, ?, 'active', NOW())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('is', $player_id, $enemy_type);
        
        return $stmt->execute() ? $this->conn->insert_id : false;
    }
    
    public function getBattle($id) {
        $query = "SELECT * FROM battles WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_assoc();
    }
    
    public function endBattle($id, $outcome) {
        $query = "UPDATE battles SET status = 'ended', outcome = ?, ended_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('si', $outcome, $id);
        
        return $stmt->execute();
    }
    
    // ============================================
    // ACTION METHODS
    // ============================================
    
    public function logAction($battle_id, $action_type, $damage) {
        $query = "INSERT INTO actions (battle_id, action_type, damage, timestamp) 
                  VALUES (?, ?, ?, NOW())";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('isi', $battle_id, $action_type, $damage);
        
        return $stmt->execute();
    }
    
    public function getActionHistory($battle_id) {
        $query = "SELECT * FROM actions WHERE battle_id = ? ORDER BY timestamp ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $battle_id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    // ============================================
    // DIALOG METHODS
    // ============================================
    
    public function getDialogByType($type) {
        $query = "SELECT * FROM dialogs WHERE type = ? ORDER BY display_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $type);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    public function addDialog($type, $message, $display_order) {
        $query = "INSERT INTO dialogs (type, message, display_order) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssi', $type, $message, $display_order);
        
        return $stmt->execute();
    }
    
    // ============================================
    // CLEANUP & CLOSE
    // ============================================
    
    public function close() {
        $this->conn->close();
    }
}

// ============================================
// DATABASE SCHEMA SQL
// ============================================

/*

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    max_hp INT DEFAULT 20,
    current_hp INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS battles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    enemy_type VARCHAR(50) NOT NULL,
    status ENUM('active', 'ended') DEFAULT 'active',
    outcome VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    battle_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    damage INT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (battle_id) REFERENCES battles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dialogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_dialog (type, display_order)
);

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    hp_restore INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*/

?>
