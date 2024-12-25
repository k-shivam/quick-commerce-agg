const quantityMapping = {
  KILOGRAM: "kg",
  GRAM: "g",
  LITER: "l",
  MILLILITRE: "ml",
};

const mergeProductData = (data) => {
  const productMap = {};
  data.forEach((platformData) => {
    platformData.forEach((product) => {
      const {
        brand,
        name,
        price,
        discountedPrice,
        quantity,
        etaInfo,
        platform,
      } = product;
      const productKey = `${name}-${brand}`;
      if (productMap[productKey]) {
        productMap[productKey][platform] = {
          price,
          discountedPrice,
          quantity,
          etaInfo,
        };
      } else {
        productMap[productKey] = {
          name,
          brand,
          [platform]: {
            price,
            discountedPrice,
            quantity,
            etaInfo,
          },
        };
      }
    });
  });

  const result = Object.values(productMap).filter((product) => {
    return Object.keys(product).length > 2;
  });
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
};

module.exports = {
  quantityMapping,
  mergeProductData,
};
