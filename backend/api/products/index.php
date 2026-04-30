<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();

$db = getDB();

function castProduct(array $p): array {
    $p['id']            = (int)$p['id'];
    $p['category_id']   = $p['category_id']   ? (int)$p['category_id']    : null;
    $p['price']         = (float)$p['price'];
    $p['old_price']     = $p['old_price'] !== null ? (float)$p['old_price'] : null;
    $p['in_stock']      = (bool)$p['in_stock'];
    $p['category_slug'] = $p['category_slug'] ?? null;
    return $p;
}

// ── GET ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql    = 'SELECT p.*, c.name_en AS category_name, c.slug AS category_slug
               FROM products p
               LEFT JOIN categories c ON c.id = p.category_id';
    $params = [];

    // Single product by id
    if (!empty($_GET['id'])) {
        $sql .= ' WHERE p.id = ?';
        $params[] = (int)$_GET['id'];
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        if (!$row) sendError('Not found', 404);
        sendJson(castProduct($row));
    }

    // Filter by category slug
    if (!empty($_GET['category_slug'])) {
        $sql .= ' WHERE c.slug = ?';
        $params[] = $_GET['category_slug'];
    }

    $sql .= ' ORDER BY p.created_at DESC';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    sendJson(array_map('castProduct', $stmt->fetchAll()));
}

// ── POST – create (auth required) ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAuth();
    $body = jsonBody();

    $name       = trim($body['name'] ?? '');
    $nameEn     = trim($body['name_en'] ?? '');
    $price      = isset($body['price']) ? (float)$body['price'] : null;
    $oldPrice   = !empty($body['old_price']) ? (float)$body['old_price'] : null;
    $image      = trim($body['image'] ?? '') ?: null;
    $categoryId = !empty($body['category_id']) && $body['category_id'] !== 'none'
                    ? (int)$body['category_id'] : null;
    $badge      = in_array($body['badge'] ?? '', ['new', 'sale', 'hot']) ? $body['badge'] : null;
    $inStock    = isset($body['in_stock']) ? (bool)$body['in_stock'] : true;

    if (!$name || !$nameEn || $price === null) sendError('name, name_en and price are required');

    $stmt = $db->prepare(
        'INSERT INTO products (name, name_en, price, old_price, image, category_id, badge, in_stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$name, $nameEn, $price, $oldPrice, $image, $categoryId, $badge, $inStock ? 1 : 0]);

    $id   = (int)$db->lastInsertId();
    $stmt = $db->prepare(
        'SELECT p.*, c.name_en AS category_name, c.slug AS category_slug
         FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    sendJson(castProduct($stmt->fetch()), 201);
}

sendError('Method not allowed', 405);
