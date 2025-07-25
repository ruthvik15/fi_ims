const pool = require('../db');

exports.getUsersPaginated = async (req, res) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  
  const validPage = !isNaN(page) && page > 0 ? page : 1;
  const validLimit = !isNaN(limit) && limit > 0 ? limit : 10;
  const offset = (validPage - 1) * validLimit;

  try {
    const users = await pool.query(
      'SELECT id, username, role FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [validLimit, offset]
    );

    const total = await pool.query('SELECT COUNT(*) FROM users');

    return res.json({
      users: users.rows,
      total: parseInt(total.rows[0].count),
      page: validPage,
      limit: validLimit,
    });

  } catch (err) {
    console.error('User Fetch Error:', err);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};
