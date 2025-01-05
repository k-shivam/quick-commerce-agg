const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;

const ZeptoApis = require("../zepto/zeptoApiServices");
const BlinkItApis = require("../blinkit/blinkitApiServices");
const SwiggyApis = require("../swiggy/swiggyApiServices");
const { start } = require("repl");
const { mergeProductData } = require("../constants");

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
  const {
    latitude,
    longitude,
    pageNumber,
    mode,
    query,
    start = 2,
    size = 20,
    page,
  } = req.body || {};
  const productsData = await Promise.all([
    new ZeptoApis().getSearchedProductList(
      latitude,
      longitude,
      query,
      pageNumber,
      mode
    ),
    new BlinkItApis().getSearchedProductList(
      latitude,
      longitude,
      query,
      start,
      size
    ),
    new SwiggyApis().getSearchedProductList(latitude, longitude, query),
  ]);
  const updatedData = mergeProductData(productsData);
  const unfiltered = updatedData.filter(
    (item) => Object.keys(item).length >= 1
  );
  const finalProducts = [...unfiltered];
  const response = {
    totalItems: finalProducts.length,
    page,
    data: finalProducts,
  };

  return res.status(200).json(finalProducts);
});

module.exports = router;
