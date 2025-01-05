const axios = require("axios");
const config = require("../../config");
const { quantityMapping } = require("../constants");

const { ZEPTO_BASE_URL, APP_VERSION } = config;

class ZeptoApis {
  constructor() {
    this.baseUrl = ZEPTO_BASE_URL;
    this.appVersion = APP_VERSION;
  }

  getStoreId = async (latitude, longitude) => {
    try {
      const url = `${this.baseUrl}v1/config/layout/?latitude=${latitude}&longitude=${longitude}&page_type=HOME&version=v2&show_new_eta_banner=false&page_size=10`;
      const headers = {
        app_version: APP_VERSION,
        appversion: APP_VERSION,
      };
      const response = await axios.get(url, { headers });
      if (response.status == 200) {
        const store_id = response.data.storeServiceableResponse.storeId;
        return store_id;
      }
    } catch (err) {
      console.log(err);
    }
  };

  getEtaForDelivery = async (latitude, longitude) => {
    try {
      const url = `${this.baseUrl}v1/config/layout/?latitude=${latitude}&longitude=${longitude}&page_type=HOME&version=v2&show_new_eta_banner=false&page_size=10`;
      const headers = {
        app_version: APP_VERSION,
        appversion: APP_VERSION,
      };
      const response = await axios.get(url, { headers });
      if (response.status == 200) {
        const store_id = response.data.storeServiceableResponse.storeId;
        const url = `${this.baseUrl}v2/inventory/banner/eta-info?store_id=${store_id}&latitude=${latitude}&longitude=${longitude}&version=v1&
        show_new_eta_banner=true`;
        const etaResponse = await axios.get(url, { headers });
        if (etaResponse.status == 200) {
          const etaInfo = etaResponse.data.etaInMinutes;
          return { etaInfo: `${etaInfo} Mins`, platform: "Zepto" };
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  getSearchedProductList = async (
    latitude,
    longitude,
    query,
    pageNumber,
    mode
  ) => {
    try {
      let finalData = [];
      const store_id = await this.getStoreId(latitude, longitude);
      const url = `${this.baseUrl}v3/search`;
      const headers = {
        app_version: APP_VERSION,
        appversion: APP_VERSION,
        storeid: store_id,
      };
      const body = {
        query,
        pageNumber,
        mode,
      };
      const eta = await this.getEtaForDelivery(latitude, longitude);
      const response = await axios.post(url, body, { headers });
      if (response.status == 200) {
        const layoutData = response.data.layout;
        let count = 0; // Counter to track the number of items added
        layoutData.forEach((layoutItem) => {
          if (
            layoutItem?.data?.resolver?.data?.items &&
            Array.isArray(layoutItem.data.resolver.data.items)
          ) {
            layoutItem.data.resolver.data.items.forEach((item) => {
              // if (count < 6) {
              // Check if the finalData array has less than 6 items
              const finalProduct = {
                brand: item.productResponse.product.brand,
                name: item.productResponse.product.name,
                price: item.productResponse.mrp / 100,
                discountedPrice: item.productResponse.sellingPrice / 100,
                product_id: item.productResponse.productVariant.id,
                quantity: `${item.productResponse.productVariant.packsize} ${
                  quantityMapping[
                    item.productResponse.productVariant.unitOfMeasure
                  ]
                }`,
                ...eta,
              };
              finalData.push(finalProduct);
              count++; // Increment the counter
              // }
            });
          }
        });
        return finalData;
      }
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = ZeptoApis;
