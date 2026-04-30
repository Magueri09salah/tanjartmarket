<?php
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
// define('UPLOAD_URL', 'http://localhost/tanjartmarket-backend/uploads/');
define('UPLOAD_URL', 'http://tanjartmarket.test/market/backend/uploads/');
define('TOKEN_EXPIRY_SECONDS', 86400 * 7); // 7 days

function setCorsHeaders(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080'];

    if (in_array($origin, $allowed)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function sendJson(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function sendError(string $message, int $status = 400): never {
    sendJson(['error' => $message], $status);
}

function jsonBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
