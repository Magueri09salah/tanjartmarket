<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();

$id = (int)($_GET['id'] ?? 0);
if (!$id) sendError('id param required');

$db = getDB();

// PUT – update
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    requireAuth();
    $body   = jsonBody();
    $name   = trim($body['name'] ?? '');
    $nameEn = trim($body['name_en'] ?? '');
    $image  = trim($body['image'] ?? '') ?: null;

    if (!$name || !$nameEn) sendError('name and name_en are required');

    $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $nameEn), '-'));

    $stmt = $db->prepare('UPDATE categories SET name=?, name_en=?, slug=?, image=? WHERE id=?');
    $stmt->execute([$name, $nameEn, $slug, $image, $id]);

    $stmt = $db->prepare(
        'SELECT c.*, COUNT(p.id) AS count FROM categories c
         LEFT JOIN products p ON p.category_id = c.id
         WHERE c.id = ? GROUP BY c.id'
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) sendError('Not found', 404);
    $row['id']    = (int)$row['id'];
    $row['count'] = (int)$row['count'];
    sendJson($row);
}

// DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    requireAuth();
    $stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    sendJson(['message' => 'Deleted']);
}

sendError('Method not allowed', 405);
