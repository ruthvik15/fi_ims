const pool = require('../db');

const addProduct = async (req, res) => {
  const { name, type, sku, image_url, description, quantity, price } = req.body;
  const userId = req.user?.id;

  if (!name || !sku || quantity === undefined || price === undefined) {
    return res.status(400).json({ message: 'Required fields: name, sku, quantity, price' });
  }

  if (isNaN(quantity) || quantity < 0 || isNaN(price) || price < 0) {
    return res.status(400).json({ message: 'Quantity and price must be non-negative numbers' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products 
        (name, type, sku, image_url, description, quantity, price, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
      [name, type, sku, image_url, description, quantity, price, userId]
    );

    return res.status(201).json({ product_id: result.rows[0].id });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Product with this SKU already exists' });
    }
    console.error('Add Product Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity == null || isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ message: 'Quantity must be a non-negative number' });
  }

  try {
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (product.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = product.rows[0];
    if (productData.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You cannot update this product' });
    }

    const updated = await pool.query(
      'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );

    return res.json(updated.rows[0]);
  } catch (err) {
    console.error('Update Quantity Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getmine = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? 'SELECT * FROM products ORDER BY created_at DESC'
      : 'SELECT * FROM products WHERE created_by = $1 ORDER BY created_at DESC';

    const values = req.user.role === 'admin' ? [] : [req.user.id];
    const result = await pool.query(query, values);

    return res.json(result.rows);
  } catch (err) {
    console.error('Get Mine Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const getPaginatedProducts = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  try {
    if (!page || !limit || isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
    
      const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return res.json(result.rows); 
    }

    const offset = (page - 1) * limit;

    const paginated = await pool.query(
      'SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const total = await pool.query('SELECT COUNT(*) FROM products');

    return res.json({
      products: paginated.rows,
      total: parseInt(total.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    console.error('Get Products Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getRecentlyAddedProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT *, COUNT(*) OVER() AS total_count
       FROM products
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.json({
      products: result.rows,
      total: result.rows[0]?.total_count || 0
    });
  } catch (err) {
    console.error('Recently Added Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getMostValuableProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT *, (price * quantity) AS value, COUNT(*) OVER() AS total_count
       FROM products
       ORDER BY value DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.json({
      products: result.rows,
      total: result.rows[0]?.total_count || 0
    });
  } catch (err) {
    console.error('Most Valuable Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const productdetails=async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Product Fetch Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}


const getCategoryBreakdown = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT type, COUNT(*) AS product_count, SUM(quantity) AS total_quantity
       FROM products
       GROUP BY type
       ORDER BY total_quantity DESC`
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('Category Breakdown Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getAnalytics = async (req, res) => {
  try {
    const [top, totalQty, productCount, userCount] = await Promise.all([
      pool.query(`SELECT name, SUM(quantity) AS total_quantity FROM products GROUP BY name ORDER BY total_quantity DESC LIMIT 5`),
      pool.query(`SELECT SUM(quantity) AS total_quantity FROM products`),
      pool.query(`SELECT COUNT(*) AS product_count FROM products`),
      pool.query(`SELECT COUNT(*) AS user_count FROM users`)
    ]);

    return res.json({
      topProducts: top.rows,
      totalQuantity: parseInt(totalQty.rows[0]?.total_quantity) || 0,
      productCount: parseInt(productCount.rows[0]?.product_count) || 0,
      userCount: parseInt(userCount.rows[0]?.user_count) || 0
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addProduct,
  updateQuantity,
  getmine,
  getPaginatedProducts,
  getRecentlyAddedProducts,
  getMostValuableProducts,
  getCategoryBreakdown,
  getAnalytics,
  productdetails
};
