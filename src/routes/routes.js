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

    // Fetch data from different platforms
    const [zeptoData, blinkItData, swiggyData] = await Promise.all([
      new ZeptoApis().getSearchedProductList(latitude, longitude, query, pageNumber, mode, page, limit),
      new BlinkItApis().getSearchedProductList(latitude, longitude, query, start, size, page, limit),
      new SwiggyApis().getSearchedProductList(latitude, longitude, query, page, limit),
    ]);

    // Initialize structured response
    let structuredResponse = {
      Zepto: {},
      Swiggy: {},
      Blinkit: {},
      Kakeibo: {}
    };

    const platforms = {
      Zepto: zeptoData,
      Blinkit: blinkItData,
      Swiggy: swiggyData
    };

    Object.entries(platforms).forEach(([platform, products]) => {
      products.forEach(product => {
        const productName = product.name;

        // Standardized product structure
        const productData = {
          platform: product.platform,
          source: platform,
          brand: product.brand,
          price: product.price,
          discountedPrice: product.discountedPrice,
          product_id: product.product_id,
          quantity: product.quantity,
          images: product.images?.map(img => img.path) || [],
          etaInfo: product.etaInfo,
          store_id: product.store_id
        };

        // Organize under main platform
        if (!structuredResponse[platform][productName]) {
          structuredResponse[platform][productName] = [];
        }
        structuredResponse[platform][productName].push(productData);

        // Organize under Kakeibo
        if (!structuredResponse.Kakeibo[productName]) {
          structuredResponse.Kakeibo[productName] = {};
        }
        structuredResponse.Kakeibo[productName][platform] = productData;
      });
    });

    return res.status(200).json(structuredResponse);
  } catch (error) {
    console.error("Error fetching product list:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
