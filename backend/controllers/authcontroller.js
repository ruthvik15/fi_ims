const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}


const register = async (req, res) => {
  const { username, password } = req.body;


  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const existing = await pool.query(
      'SELECT 1 FROM users WHERE username = $1',
      [username.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
      [username.trim(), hashedPassword]
    );

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Register error:', err);

    if (err.code === '23505') {
      return res.status(409).json({ message: 'Username already exists (conflict)' });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;


  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, role, password_hash FROM users WHERE username = $1',
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000, // 1 day
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
};
