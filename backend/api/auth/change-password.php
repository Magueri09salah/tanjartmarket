<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$body = jsonBody();
$currentPassword = trim($body['current_password'] ?? '');
$newPassword     = trim($body['new_password'] ?? '');
$confirmPassword = trim($body['confirm_password'] ?? '');

if (!$currentPassword || !$newPassword || !$confirmPassword)
  sendError('All fields are required');

if (strlen($newPassword) < 6)
  sendError('New password must be at least 6 characters');

if ($newPassword !== $confirmPassword)
  sendError('Passwords do not match');

$db = getDB();

// ✅ Check what your auth middleware sets — open middleware/auth.php
// and look for the variable name it sets after verifying the token
// It's likely $GLOBALS['admin_id'] or $GLOBALS['admin']['id']
// Use this to get the ID:
$token = getBearerToken();
$stmt = $db->prepare('SELECT * FROM admin WHERE token = ? AND token_expires > NOW()');
$stmt->execute([$token]);
$admin = $stmt->fetch();

if (!$admin) sendError('Admin not found', 404);

// ✅ Column is password_hash not password
if (!password_verify($currentPassword, $admin['password_hash']))
  sendError('Current password is incorrect');

// ✅ Update password_hash column
$hashed = password_hash($newPassword, PASSWORD_DEFAULT);
$stmt = $db->prepare('UPDATE admin SET password_hash = ? WHERE id = ?');
$stmt->execute([$hashed, $admin['id']]);

sendJson(['message' => 'Password updated successfully']);