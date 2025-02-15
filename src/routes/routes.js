const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;

const ZeptoApis = require("../zepto/zeptoApiServices");
const BlinkItApis = require("../blinkit/blinkitApiServices");
const SwiggyApis = require("../swiggy/swiggyApiServices");
const { start } = require("repl");
const { mergeProductData, normalizeName } = require("../constants");

const filePath = path.join(__dirname, "../../data.json");

router.post("/delivery-est", async (req, res) => {
  try {
    const { latitude = 28.5885945, longitude = 77.4049325 } = req.body;
    const data = await fs.readFile(filePath, "utf-8");
    const etadata = await Promise.all([
      new ZeptoApis().getEtaForDelivery(latitude, longitude),
      new BlinkItApis().getEtaForDelivery(latitude, longitude),
      new SwiggyApis().getEtaForDelivery(latitude, longitude),
    ]);
    const updatedData = JSON.parse(data).map((platObj) => {
      const matchingPlat = etadata.find(
        (item) => item.platform === platObj.platform
      );
      if (matchingPlat) {
        platObj.eta = matchingPlat.etaInfo;
      }
      return platObj;
    });
    return res.status(200).json(updatedData);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

router.post("/products-list", async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      pageNumber,
      mode,
      query,
      start = 2,
      size = 20,
      page = 1,
      limit = 20
    } = req.body || {};

    const productsData = await Promise.all([
      new ZeptoApis().getSearchedProductList(
        latitude, longitude, query, pageNumber, mode, page, limit
      ),
      new BlinkItApis().getSearchedProductList(
        latitude, longitude, query, start, size, page, limit
      ),
      new SwiggyApis().getSearchedProductList(latitude, longitude, query, page, limit),
    ]);

    // Combine all products with source labels
    const allProducts = [
      ...productsData[0].map((p) => ({ ...p, source: "Zepto" })),
      ...productsData[1].map((p) => ({ ...p, source: "BlinkIt" })),
      ...productsData[2].map((p) => ({ ...p, source: "Swiggy" })),
    ];

    // Group products by name
    let groupedProducts = {};
    allProducts.forEach(product => {
      const productName = product.name;

      if (!groupedProducts[productName]) {
        groupedProducts[productName] = [];
      }

      groupedProducts[productName].push({
        platform: product.platform,
        source: product.source,
        brand: product.brand,
        price: product.price,
        discountedPrice: product.discountedPrice,
        product_id: product.product_id,
        quantity: product.quantity,
        images: product.images?.map(img => img.path) || [],
        etaInfo: product.etaInfo,
        store_id: product.store_id
      });
    });

    // Calculate pagination metadata
    const totalItems = allProducts.length;
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      page,
      limit,
      totalItems,
      totalPages,
      data: groupedProducts
    });

  } catch (error) {
    console.error("Error fetching product list:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
