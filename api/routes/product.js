const { getProducts } = require('../controllers/productController');

module.exports = async (fastify) => {
  fastify.get('/products', getProducts);
};
