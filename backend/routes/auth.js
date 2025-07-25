const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authcontroller');
const { authenticate } = require('../middleware/authmiddle');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, role]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in, returns JWT token in cookie
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, (req, res) => {
  return res.json({ loggedIn: true, user: req.user });
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
