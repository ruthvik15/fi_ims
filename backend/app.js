const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const app = express();
const userRoutes = require('./routes/users');
const { swaggerUi, swaggerSpec } = require('./swagger'); 
const{authenticate} =require('./middleware/authmiddle')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,              
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


app.use('/', authRoutes); 
app.use('/products', authenticate, productRoutes);
app.use('/users', authenticate, userRoutes); 
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
