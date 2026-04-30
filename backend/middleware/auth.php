<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';

function requireAuth(): array {
    $auth = '';

    $headers = getallheaders();
    foreach ($headers as $key => $val) {
        if (strtolower($key) === 'authorization') {
            $auth = $val;
            break;
        }
    }

    if (!$auth) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    }

    if (!preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
        sendError('Unauthorized', 401);
    }

    $token = trim($m[1]);
    $db    = getDB();
    $stmt  = $db->prepare('SELECT id, username FROM admin WHERE token = ? AND token_expires > NOW()');
    $stmt->execute([$token]);
    $admin = $stmt->fetch();

    if (!$admin) {
        sendError('Unauthorized – token expired or invalid', 401);
    }

    return $admin;
}
