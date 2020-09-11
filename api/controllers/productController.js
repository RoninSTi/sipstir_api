const {
  getPrices: getStripePrices,
  getProducts: getStripeProducts
} = require('../adaptors/stripeAdaptor');

function getPricesForProduct({ product, prices }) {
  return prices
    .map(price => price.product === product.id ? price : null)
    .filter(el => el !== null)
}

async function getProducts(_, res) {
  try {
    const { data: products } = await getStripeProducts({ stripe: this.stripe});
    const { data: prices } = await getStripePrices({ stripe: this.stripe });

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
