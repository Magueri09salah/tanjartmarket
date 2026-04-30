<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

requireAuth();

if (empty($_FILES['file'])) sendError('No file uploaded');

$file    = $_FILES['file'];
$allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

if (!in_array($file['type'], $allowed)) sendError('Invalid file type. Allowed: jpg, png, webp, gif');
if ($file['size'] > 5 * 1024 * 1024) sendError('File too large. Maximum size is 5MB');
if ($file['error'] !== UPLOAD_ERR_OK) sendError('Upload error: ' . $file['error']);

if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

$ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$filename = uniqid('img_', true) . '.' . $ext;
$dest     = UPLOAD_DIR . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) sendError('Failed to save file');

sendJson(['url' => UPLOAD_URL . $filename]);
