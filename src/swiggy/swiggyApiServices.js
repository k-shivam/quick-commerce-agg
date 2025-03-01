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
      const url = `${this.baseUrl}/instamart/home?clientId=${this.clientId}`;
  
      const headers = {
        "accept-language": "en-US,en;q=0.5",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "cookie": "__SW=Fm2W5eRXQ9npj2VECAp3rD-DCve9z4NN; _device_id=76033919-ba2a-2fe1-0a0c-7a7fdc6eea7a; ally-on=false; strId=; LocSrc=s%3AswgyUL.Dzm1rLPIhJmB3Tl2Xs6141hVZS0ofGP7LGmLXgQOA7Y; _guest_tid=5622ab93-bdc3-4fd0-ac83-c32cbb02b87e; _sid=j7b59bbe-770b-4dbe-a5b3-812c856e1d09; fontsLoaded=1; deviceId=s%3A76033919-ba2a-2fe1-0a0c-7a7fdc6eea7a.im8IlRuOt%2BJfV%2BrULqVisO3Z2Uy4SPF%2F%2BKvtiXw7p7Y; tid=s%3A5622ab93-bdc3-4fd0-ac83-c32cbb02b87e.PvglCGoCBFOTuWLeKB3SATngFhbn%2FU61uoS2DzsE7Og; sid=s%3Aj7b59bbe-770b-4dbe-a5b3-812c856e1d09.BIzQFGTsXwOC4ajHYIzKx%2FQcNOfgJ%2BsT3RiZc0SA8dE; versionCode=1200; platform=web; subplatform=dweb; statusBarHeight=0; bottomOffset=0; genieTrackOn=false; isNative=false; openIMHP=false; addressId=s%3A.4Wx2Am9WLolnmzVcU32g6YaFDw0QbIBFRj2nkO7P25s; webBottomBarHeight=0; dadl=true; lat=s%3A28.587144248972344.%2FCQ5Fldmljr%2B1h0ubRE%2FR1YPIU9dCab4T60gBOJ3SSo; lng=s%3A77.4045728197187.5OKBkbBqwA10ZPLFFjE2glvErsnulJ8K1eZWSNVbH6o; address=s%3AFNG%20Expressway%20Service%20Rd%2C%20Eldeco%20Magnolia%20Park%2C%20S.F6%2BMg0H8BSh%2FCNxHojgJGSF5xSGnfl4246D0qj%2BkF9A; imOrderAttribution={%22entryId%22:%22milk%22%2C%22entryName%22:%22instamartOpenSearch%22}; userLocation=%7B%22address%22%3A%22FNG%20Expressway%20Service%20Rd%2C%20Eldeco%20Magnolia%20Park%2C%20Sector%20119%2C%20Noida%2C%20Uttar%20Pradesh%20201305%2C%20India%22%2C%22lat%22%3A28.587144248972344%2C%22lng%22%3A77.4045728197187%2C%22id%22%3A%22%22%2C%22annotation%22%3A%22%22%2C%22name%22%3A%22%22%7D; ally-on=false; bottomOffset=0; deviceId=s%3A76033919-ba2a-2fe1-0a0c-7a7fdc6eea7a.im8IlRuOt%2BJfV%2BrULqVisO3Z2Uy4SPF%2F%2BKvtiXw7p7Y; genieTrackOn=false; isNative=false; openIMHP=false; platform=web; sid=s%3Aj7b59bbe-770b-4dbe-a5b3-812c856e1d09.BIzQFGTsXwOC4ajHYIzKx%2FQcNOfgJ%2BsT3RiZc0SA8dE; statusBarHeight=0; strId=; subplatform=dweb; tid=s%3A5622ab93-bdc3-4fd0-ac83-c32cbb02b87e.PvglCGoCBFOTuWLeKB3SATngFhbn%2FU61uoS2DzsE7Og; versionCode=1200; webBottomBarHeight=0"
      };
  
      const response = await axios.get(url, { headers });
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching Swiggy Instamart data:", error.message);
      return null;
    }
  };

  getSearchedProductList = async (latitude, longitude, query, page, limit) => {
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
      if (!eta || !eta?.data?.storeId) {
        throw new Error("Invalid ETA or store ID");
      }

      // const url = `${this.baseUrl}instamart/search?pageNumber=0&searchResultsOffset=0&limit=6&query=${query}&ageConsent=false&layoutId=2671&pageType=INSTAMART_PRE_SEARCH_PAGE&isPreSearchTag=false&highConfidencePageNo=0&lowConfidencePageNo=0&voiceSearchTrackingId=&storeId=${eta?.data?.storeId}&primaryStoreId=${eta?.data?.storeId}`;
      const url = `https://www.swiggy.com/api/instamart/search?pageNumber=0&searchResultsOffset=0&limit=6&query=${query}&ageConsent=false&layoutId=2671&pageType=INSTAMART_PRE_SEARCH_PAGE&isPreSearchTag=false&highConfidencePageNo=0&lowConfidencePageNo=0&voiceSearchTrackingId=&storeId=${eta?.data?.storeId}&primaryStoreId=${eta?.data?.storeId}&secondaryStoreId=${eta?.data?.storeId}`

      const requestOptions = {
        method: "POST",
        headers,
        body,
      };

      console.log(url, requestOptions)

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch product list: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result)

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
              product_id: item.product_id,
              etaInfo: eta.etaInfo,
              store_id: eta?.storeid,
              platform: eta.platform,
              images: variation.images
            };
          })
          ?.filter(Boolean) || []; // Remove null entries
          const startIndex = (page -1) * limit;
          const endIndex = startIndex + limit;
          const paginatedData = products.slice(startIndex, endIndex);
          return paginatedData; // Return only the first 6 products
    } catch (error) {
      console.error("Error fetching searched product list:", error.message);
      return []; // Return an empty array in case of an error
    }
  };
}

module.exports = SwiggyApis;
