const { attachPaymentToCustomer, createSubscription, getPrices: getStripePrices, getProducts: getStripeProducts } = require('../adaptors/stripeAdaptor');

const getPricesForProduct = ({ product, prices }) => {
  return prices
    .map(price => price.product === product.id ? price : null)
    .filter(el => el !== null)
}

const getProducts = async (_, res) => {
  try {
    const { data: products } = await getStripeProducts();
    const { data: prices } = await getStripePrices();

    const response = products.map(product => {
      const productPrices = getPricesForProduct({ product, prices });

      return {
        ...product,
        prices: productPrices
      }
    });

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getProducts
};
