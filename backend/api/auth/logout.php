<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$admin = requireAuth();
$db    = getDB();
$stmt  = $db->prepare('UPDATE admin SET token = NULL, token_expires = NULL WHERE id = ?');
$stmt->execute([$admin['id']]);

sendJson(['message' => 'Logged out']);
