<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();

$id = (int)($_GET['id'] ?? 0);
if (!$id) sendError('id param required');

$db = getDB();

function castProduct(array $p): array {
    $p['id']          = (int)$p['id'];
    $p['category_id'] = $p['category_id'] ? (int)$p['category_id'] : null;
    $p['price']       = (float)$p['price'];
    $p['old_price']   = $p['old_price'] !== null ? (float)$p['old_price'] : null;
    $p['in_stock']    = (bool)$p['in_stock'];
    return $p;
}

// PUT – update
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
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
        'UPDATE products SET name=?, name_en=?, price=?, old_price=?, image=?,
         category_id=?, badge=?, in_stock=? WHERE id=?'
    );
    $stmt->execute([$name, $nameEn, $price, $oldPrice, $image, $categoryId, $badge, $inStock ? 1 : 0, $id]);

    $stmt = $db->prepare(
        'SELECT p.*, c.name_en AS category_name FROM products p
         LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) sendError('Not found', 404);
    sendJson(castProduct($row));
}

// DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    requireAuth();
    $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
    $stmt->execute([$id]);
    sendJson(['message' => 'Deleted']);
}

sendError('Method not allowed', 405);
