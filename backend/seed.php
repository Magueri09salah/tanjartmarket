<?php
/**
 * SEED SCRIPT — inserts mock store data into the database.
 * Run AFTER setup.php: http://localhost/tanjartmarket-backend/seed.php
 * Safe to re-run — skips duplicates via INSERT IGNORE.
 */
require_once __DIR__ . '/config/database.php';

try {
    $db = getDB();

    // ── Categories ─────────────────────────────────────────────────────────
    $categories = [
        ['name' => 'الحلويات و البسكويت',       'name_en' => 'Sweets & Biscuits',       'slug' => 'sweets',         'image' => '/images/cat-sweets.jpg'],
        ['name' => 'منتجات TANJARTMARKET',       'name_en' => 'Tanjartmarket Products',  'slug' => 'tanjartmarket',  'image' => '/images/cat-cleaning.jpg'],
        ['name' => 'منتجات النظافة و المنزل',    'name_en' => 'Cleaning & Home',         'slug' => 'cleaning',       'image' => '/images/cat-cleaning.jpg'],
        ['name' => 'المعلبات',                   'name_en' => 'Canned Foods',            'slug' => 'canned',         'image' => '/images/cat-canned.jpg'],
        ['name' => 'ثلاجتي',                     'name_en' => 'Fridge',                  'slug' => 'fridge',         'image' => '/images/cat-fridge.jpg'],
        ['name' => 'الدقيق و القطاني',           'name_en' => 'Flour & Legumes',         'slug' => 'flour',          'image' => '/images/cat-flour.jpg'],
        ['name' => 'عروضنا',                     'name_en' => 'Best Offers',             'slug' => 'offers',         'image' => '/images/cat-offers.jpg'],
        ['name' => 'الأجبان',                    'name_en' => 'Cheeses',                 'slug' => 'cheese',         'image' => '/images/cat-cheese.jpg'],
        ['name' => 'مشتقات الحليب',              'name_en' => 'Dairy',                   'slug' => 'dairy',          'image' => '/images/cat-dairy.jpg'],
    ];

    $stmtCat = $db->prepare(
        'INSERT IGNORE INTO categories (name, name_en, slug, image) VALUES (?, ?, ?, ?)'
    );
    foreach ($categories as $c) {
        $stmtCat->execute([$c['name'], $c['name_en'], $c['slug'], $c['image']]);
    }

    // Build slug → id map
    $slugMap = [];
    $rows = $db->query('SELECT id, slug FROM categories')->fetchAll();
    foreach ($rows as $r) {
        $slugMap[$r['slug']] = (int)$r['id'];
    }

    // ── Products ───────────────────────────────────────────────────────────
    $products = [
        ['name' => 'ساشي ديال الويزة',           'name_en' => 'Dates Pack',        'price' => 2.9,  'old_price' => null, 'image' => '/images/prod-dates.jpg',   'cat' => 'offers', 'badge' => 'sale'],
        ['name' => 'ريحة ديال زعتر',             'name_en' => 'Fresh Thyme',       'price' => 5.9,  'old_price' => null, 'image' => '/images/prod-thyme.jpg',   'cat' => 'offers', 'badge' => 'new'],
        ['name' => 'الكرعة الحمرة طرية وجديدة',  'name_en' => 'Fresh Pumpkin',     'price' => 12.0, 'old_price' => null, 'image' => '/images/prod-pumpkin.jpg', 'cat' => 'offers', 'badge' => null],
        ['name' => 'الفلفلة الخضرة طرية',        'name_en' => 'Green Bell Pepper', 'price' => 7.5,  'old_price' => null, 'image' => '/images/prod-pepper.jpg',  'cat' => 'offers', 'badge' => 'hot'],
        ['name' => 'فرماج طرونشي 24',            'name_en' => 'Cheese Slices 24',  'price' => 17.0, 'old_price' => 22.0, 'image' => '/images/cat-cheese.jpg',   'cat' => 'cheese', 'badge' => 'sale'],
        ['name' => 'بلوك لفاش كيري',             'name_en' => 'Kiri Block',        'price' => 11.9, 'old_price' => null, 'image' => '/images/cat-cheese.jpg',   'cat' => 'cheese', 'badge' => null],
        ['name' => 'فرماج لديد 96',              'name_en' => 'Ladid Cheese 96',   'price' => 49.0, 'old_price' => 80.0, 'image' => '/images/cat-cheese.jpg',   'cat' => 'cheese', 'badge' => 'sale'],
        ['name' => 'زبدة كيلو القنيطرة',         'name_en' => 'Butter 1KG',        'price' => 84.9, 'old_price' => null, 'image' => '/images/cat-dairy.jpg',    'cat' => 'dairy',  'badge' => null],
        ['name' => 'فرماج موزريلا 200g',         'name_en' => 'Mozzarella 200g',   'price' => 12.9, 'old_price' => 15.0, 'image' => '/images/cat-cheese.jpg',   'cat' => 'cheese', 'badge' => 'sale'],
        ['name' => 'فرماج طبيعي بتومة 1g',       'name_en' => 'Natural Cheese 1g', 'price' => 49.5, 'old_price' => null, 'image' => '/images/cat-cheese.jpg',   'cat' => 'cheese', 'badge' => null],
        ['name' => 'فرماج طبيعي 900g',           'name_en' => 'Natural Cheese 900g','price'=> 44.9, 'old_price' => null, 'image' => '/images/cat-cheese.jpg',   'cat' => 'cheese', 'badge' => null],
        ['name' => 'فرماج بلانك 1 كلو',          'name_en' => 'Fromage Blanc 1KG', 'price' => 49.9, 'old_price' => null, 'image' => '/images/cat-cheese.jpg',   'cat' => 'cheese', 'badge' => 'hot'],
    ];

    $stmtProd = $db->prepare(
        'INSERT IGNORE INTO products (name, name_en, price, old_price, image, category_id, badge, in_stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)'
    );

    // Use (name, name_en) uniqueness check to skip duplicates
    $existStmt = $db->prepare('SELECT id FROM products WHERE name = ? AND name_en = ?');

    foreach ($products as $p) {
        $existStmt->execute([$p['name'], $p['name_en']]);
        if ($existStmt->fetch()) continue; // already exists

        $catId = $slugMap[$p['cat']] ?? null;
        $stmtProd->execute([$p['name'], $p['name_en'], $p['price'], $p['old_price'], $p['image'], $catId, $p['badge']]);
    }

    // ── Summary ────────────────────────────────────────────────────────────
    $catCount  = $db->query('SELECT COUNT(*) FROM categories')->fetchColumn();
    $prodCount = $db->query('SELECT COUNT(*) FROM products')->fetchColumn();

    echo '<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:500px;margin:60px auto">';
    echo '<h2 style="color:#16a34a">✅ Seed Complete!</h2>';
    echo "<p>Categories in DB: <strong>$catCount</strong></p>";
    echo "<p>Products in DB: <strong>$prodCount</strong></p>";
    echo '<p style="color:gray">Safe to run again — duplicates are skipped.</p>';
    echo '</body></html>';

} catch (Exception $e) {
    echo '<h2 style="color:red">❌ Seed Failed</h2><p>' . htmlspecialchars($e->getMessage()) . '</p>';
}
