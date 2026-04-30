<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$body     = jsonBody();
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if (!$username || !$password) sendError('Username and password are required');

$db   = getDB();
$stmt = $db->prepare('SELECT * FROM admin WHERE username = ?');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    sendError('Invalid credentials', 401);
}

$token   = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', time() + TOKEN_EXPIRY_SECONDS);

$stmt = $db->prepare('UPDATE admin SET token = ?, token_expires = ? WHERE id = ?');
$stmt->execute([$token, $expires, $admin['id']]);

sendJson([
    'token' => $token,
    'admin' => ['id' => (int)$admin['id'], 'username' => $admin['username']],
]);
