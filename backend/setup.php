<?php
/**
 * ONE-TIME SETUP SCRIPT
 * 1. Copy the backend/ folder to C:\xampp\htdocs\tanjartmarket-backend\
 * 2. Open http://localhost/tanjartmarket-backend/setup.php in your browser
 * 3. DELETE this file after setup!
 */

$host   = 'localhost';
$user   = 'root';
$pass   = '';
$dbname = 'tanjartmarket';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbname`");

    $pdo->exec("CREATE TABLE IF NOT EXISTS admin (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        username      VARCHAR(100)  NOT NULL UNIQUE,
        password_hash VARCHAR(255)  NOT NULL,
        token         VARCHAR(64)   DEFAULT NULL,
        token_expires DATETIME      DEFAULT NULL,
        created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        name_en    VARCHAR(255) NOT NULL,
        slug       VARCHAR(255) NOT NULL UNIQUE,
        image      VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB");

    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT          DEFAULT NULL,
        name        VARCHAR(255) NOT NULL,
        name_en     VARCHAR(255) NOT NULL,
        price       DECIMAL(10,2) NOT NULL,
        old_price   DECIMAL(10,2) DEFAULT NULL,
        image       VARCHAR(500)  DEFAULT NULL,
        badge       ENUM('new','sale','hot') DEFAULT NULL,
        in_stock    TINYINT(1)   DEFAULT 1,
        created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB");

    // Insert default admin if not exists
    $hash = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT IGNORE INTO admin (username, password_hash) VALUES ('admin', ?)");
    $stmt->execute([$hash]);

    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:500px;margin:60px auto">';
    echo '<h2 style="color:#16a34a">✅ Setup Complete!</h2>';
    echo '<p>Database <strong>tanjartmarket</strong> is ready.</p>';
    echo '<ul>';
    echo '<li>Table: <strong>admin</strong></li>';
    echo '<li>Table: <strong>categories</strong></li>';
    echo '<li>Table: <strong>products</strong></li>';
    echo '</ul>';
    echo '<p>Default admin credentials:<br>';
    echo 'Username: <strong>admin</strong><br>';
    echo 'Password: <strong>admin123</strong></p>';
    echo '<p style="color:red;font-weight:bold">⚠️ Delete this file (setup.php) now!</p>';
    echo '</body></html>';

} catch (Exception $e) {
    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:500px;margin:60px auto">';
    echo '<h2 style="color:#dc2626">❌ Setup Failed</h2>';
    echo '<p>' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '</body></html>';
}
