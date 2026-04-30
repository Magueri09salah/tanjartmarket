<?php
require_once __DIR__ . '/../config/config.php';
setCorsHeaders();
echo json_encode(['status' => 'ok', 'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'none']);