<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();

$db = getDB();

function castCategory(array $r): array {
    $r['id']    = (int)$r['id'];
    $r['count'] = (int)($r['count'] ?? 0);
    return $r;
}

// ── GET ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $base = 'SELECT c.*, COUNT(p.id) AS count
             FROM categories c
             LEFT JOIN products p ON p.category_id = c.id';

    // Single category by slug
    if (!empty($_GET['slug'])) {
        $stmt = $db->prepare($base . ' WHERE c.slug = ? GROUP BY c.id');
        $stmt->execute([$_GET['slug']]);
        $row = $stmt->fetch();
        if (!$row) sendError('Category not found', 404);
        sendJson(castCategory($row));
    }

    // All categories
    $stmt = $db->query($base . ' GROUP BY c.id ORDER BY c.created_at ASC');
    sendJson(array_map('castCategory', $stmt->fetchAll()));
}

// ── POST – create (auth required) ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAuth();
    $body   = jsonBody();
    $name   = trim($body['name'] ?? '');
    $nameEn = trim($body['name_en'] ?? '');
    $image  = trim($body['image'] ?? '') ?: null;

    if (!$name || !$nameEn) sendError('name and name_en are required');

    $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $nameEn), '-'));

    $stmt = $db->prepare('INSERT INTO categories (name, name_en, slug, image) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $nameEn, $slug, $image]);

    $id   = (int)$db->lastInsertId();
    $stmt = $db->prepare('SELECT *, 0 AS count FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    $row       = $stmt->fetch();
    $row['id'] = $id;
    sendJson(castCategory($row), 201);
}

sendError('Method not allowed', 405);
