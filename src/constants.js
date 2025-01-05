const quantityMapping = {
  KILOGRAM: "kg",
  GRAM: "g",
  LITER: "l",
  MILLILITRE: "ml",
};

const colorMapping = {
  BlinkIt: "yellow",
  Zepto: "purple",
  Swiggy: "orange",
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
        product_id,
        store_id,
      } = product;
      const productKey = `${name}-${brand}`;
      productMap[productKey] = {
        name,
        brand,
        product_id,
        platform_name: platform,
        price,
        discountedPrice,
        quantity,
        etaInfo,
        color: colorMapping[platform],
        store_id,
      };
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
