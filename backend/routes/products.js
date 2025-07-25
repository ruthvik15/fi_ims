const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authmiddle');

const {
  addProduct,
  updateQuantity,
  getAnalytics,
  getPaginatedProducts,
  getRecentlyAddedProducts,
  getMostValuableProducts,
  getCategoryBreakdown,
  getmine,
  productdetails
} = require('../controllers/productController');


/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - sku
 *               - image_url
 *               - description
 *               - quantity
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               sku:
 *                 type: string
 *               image_url:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Internal server error
 */
router.post('/', addProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get paginated list of products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of paginated products
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Internal server error
 */
router.get('/', getPaginatedProducts);

/**
 * @swagger
 * /products/{id}/quantity:
 *   put:
 *     summary: Update the quantity of a specific product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Token required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/quantity', updateQuantity);

/**
 * @swagger
 * /products/mine:
 *   get:
 *     summary: Get products added by the current logged-in user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products added by user
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Internal server error
 */
router.get('/mine', getmine);

/**
 * @swagger
 * /products/analytics:
 *   get:
 *     summary: Get basic analytics (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Basic analytics data
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Internal server error
 */
router.get('/analytics', isAdmin, getAnalytics);

/**
 * @swagger
 * /products/recent:
 *   get:
 *     summary: Get recently added products (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recently added products
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Internal server error
 */
router.get('/recent', isAdmin, getRecentlyAddedProducts);

/**
 * @swagger
 * /products/valuable:
 *   get:
 *     summary: Get most valuable products (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most valuable products
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Internal server error
 */
router.get('/valuable', isAdmin, getMostValuableProducts);

/**
 * @swagger
 * /products/category-breakdown:
 *   get:
 *     summary: Get product category breakdown (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category-wise breakdown of products
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Internal server error
 */
router.get('/category-breakdown', isAdmin, getCategoryBreakdown);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numeric ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', productdetails);
module.exports = router;