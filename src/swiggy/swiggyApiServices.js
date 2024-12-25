const axios = require("axios");
const config = require("../../config");

const { SWIGGY_BASE_URL, CLIENT_ID } = config;

class SwiggyApis {
  constructor() {
    this.baseUrl = SWIGGY_BASE_URL;
    this.clientId = CLIENT_ID;
  }
  getEtaForDelivery = async (latitude, longitude) => {
    try {
      const url = `${this.baseUrl}instamart/home/select-location`;
      const headers = {
        "user-agent":
          " Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      };
      const body = {
        data: {
          lat: latitude,
          lng: longitude,
          clientId: this.clientId,
        },
      };
      const resp = await axios.post(url, body, { headers });
      if (resp.status == 200) {
        const result = resp.data;
        const etaInfo = result.data.slaString;
        return { etaInfo, platform: "Swiggy", storeid: result.data.storeId };
      }
    } catch (err) {
      console.log(err);
    }
  };

  getSearchedProductList = async (latitude, longitude, query) => {
    try {
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        Cookie:
          "ally-on=false; bottomOffset=0; deviceId=s%3A76033919-ba2a-2fe1-0a0c-7a7fdc6eea7a.im8IlRuOt%2BJfV%2BrULqVisO3Z2Uy4SPF%2F%2BKvtiXw7p7Y; genieTrackOn=false; isNative=false; openIMHP=false; platform=web; sid=s%3Ahzpb4374-9303-4d1b-a682-609d0939c3d8.SxZAJzb9QQSR3qw6lqHUmy4JF5bV1190EnZJel9lQgA; statusBarHeight=0; strId=; subplatform=dweb; tid=s%3A1facaa5d-45a0-45b7-8a16-9071a5b02168.5X2kMRcSUSB6rtvLxIwIM5IlmfiYIQPN7Ab5ur9QLX4; userLocation=%7B%22lat%22%3A28.5877897%2C%22lng%22%3A77.405142%2C%22address%22%3A%22%22%2C%22id%22%3A%22%22%2C%22annotation%22%3A%22%22%2C%22name%22%3A%22%22%7D; versionCode=1200",
      };

      const body = JSON.stringify({
        facets: {},
        sortAttribute: "",
      });

      // Ensure query is URL-encoded
      query = encodeURIComponent(query);

      // Fetch ETA details
      const eta = await this.getEtaForDelivery(latitude, longitude);
      if (!eta || !eta.storeid) {
        throw new Error("Invalid ETA or store ID");
      }

      const url = `${this.baseUrl}instamart/search?pageNumber=0&searchResultsOffset=0&limit=6&query=${query}&ageConsent=false&layoutId=3990&pageType=INSTAMART_SEARCH_PAGE&isPreSearchTag=false&highConfidencePageNo=0&lowConfidencePageNo=0&voiceSearchTrackingId=&storeId=${eta.storeid}&primaryStoreId=${eta.storeid}`;

      const requestOptions = {
        method: "POST",
        headers,
        body,
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch product list: ${response.statusText}`);
      }

      const result = await response.json();

      // Process and return the products
      const products =
        result?.data?.widgets?.[0]?.data
          ?.map((item) => {
            const variation = item.variations?.[0]; // Safely access variations
            if (!variation) return null; // Skip if variation doesn't exist
            return {
              name: item.display_name,
              brand: item.brand,
              discountedPrice: variation.price.offer_price,
              price: variation.price.mrp,
              quantity: variation.quantity,
              ...eta,
            };
          })
          ?.filter(Boolean) || []; // Remove null entries

      return products.slice(0, 6); // Return only the first 6 products
    } catch (error) {
      console.error("Error fetching searched product list:", error.message);
      return []; // Return an empty array in case of an error
    }
  };
}

module.exports = SwiggyApis;
