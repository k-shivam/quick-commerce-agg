const axios = require("axios");
const config = require("../../config");

const { BLINKIT_BASE_URL } = config;

class BlinkItApis {
  constructor() {
    this.baseUrl = BLINKIT_BASE_URL;
  }
  getEtaForDelivery = async (latitude, longitude) => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("access_token", "null");
    myHeaders.append("app_client", "consumer_web");
    myHeaders.append("app_version", "52434332");
    myHeaders.append(
      "auth_key",
      "c761ec3633c22afad934fb17a66385c1c06c5472b4898b866b7306186d0bb477"
    );
    myHeaders.append("content-type", "application/json");
    myHeaders.append("lat", latitude);
    myHeaders.append("lon", longitude);
    myHeaders.append(
      "Cookie",
      "__cf_bm=efHAjECQcmTzdbP58llpXrG7D5PN4Jsbgg1j54kcWUM-1734169255-1.0.1.1-ccl32_hi6x1VCeDvxDlB0_1AGE5G5tA3pR5Ge8TFIg9CAJmKMmis7FcPfqPXVaUGxlqDhA9ukhYgc94.RZBN8Q; __cfruid=4315926aceacf1e89d6738e0d28be68af8470a1f-1734169255; _cfuvid=QvvtVX37.IgJ0Ow.epz70J_PoPd7M9mlbCHRuQWgpfw-1734169255990-0.0.1.1-604800000"
    );
    const url = `${this.baseUrl}/layout/earliest_promise_time?template_version=9`;
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.text();
      const resp = JSON.parse(result);
      const etaInfo = resp.data.eta_in_minutes;
      return { etaInfo: `${etaInfo} Mins`, platform: "BlinkIt" };
    } catch (err) {
      console.log(err.message);
    }
  };
  getSearchedProductList = async (
    latitude,
    longitude,
    q,
    start = 2,
    size = 20
  ) => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("app_client", "consumer_web");
    myHeaders.append("app_version", "52434332");
    myHeaders.append("content-type", "application/json");
    myHeaders.append(
      "cookie",
      "gr_1_deviceId=d1076951-c508-4921-9165-70e1f396a86f; _cfuvid=uSJRdIMhcgA0479IjwBavQ19hFS.JU3w9WRygk7XV0k-1734155441602-0.0.1.1-604800000; _gcl_au=1.1.1348027085.1734155442; _fbp=fb.1.1734155442009.493943217291818214; gr_1_lat=28.5885945; gr_1_lon=77.4049325; gr_1_locality=Noida; gr_1_landmark=undefined; city=Delhi; __cf_bm=TCxoxXoC8yitr3Y2KhlcJfurnMVUZu7k0BRNR9DmzW8-1734622065-1.0.1.1-qebkEhW58zYDc3inwAt.F3UfiRh.gkw9x484Fjxz17n0oDPOBDJOgnKyrGrNfMA3j1ul2XXiT9OWL3RJVOtjqw; __cfruid=9392a98e9b1d384f6c047afc9a735c7fe55d5085-1734622065; _gid=GA1.2.1197362819.1734622065; _ga=GA1.2.1679356735.1734155442; _ga_DDJ0134H6Z=GS1.2.1734622065.4.1.1734622257.11.0.0; _ga_JSMJG966C7=GS1.1.1734622065.5.1.1734622276.60.0.0; __cf_bm=ag9QztMyeivXtK06m9P1eMyp8MHHb9lWAJ439cSAymw-1734622370-1.0.1.1-LQIXi861BF7lb7DDU8_ZMfX4SmBKSlQSPECJ92_D0SD0XQjEpzsvQZgFXKQM7bmxZJ7yoYOGHe0OVRrY_SVSOw; __cfruid=da556c7ee0135a3c2676305e8b31f6911f625f07-1734622370; _cfuvid=pIUuG10HQOA9Swuz8GY5i21711EbmQMqQ18DWlN48WA-1734622370541-0.0.1.1-604800000"
    );
    myHeaders.append("device_id", "d1076951-c508-4921-9165-70e1f396a86f");
    myHeaders.append("lat", latitude);
    myHeaders.append("lon", longitude);
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("referer", "https://blinkit.com/s/?q=fresh%20paneer");
    myHeaders.append("rn_bundle_version", "1009003012");
    myHeaders.append(
      "sec-ch-ua",
      '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"'
    );
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", '"macOS"');
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("session_uuid", "9cc2199c-db63-4915-a8f2-79dd7d8e869a");
    myHeaders.append("web_app_version", "1008010016");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let query = q.replaceAll(" ", "%20");
    const eta = await this.getEtaForDelivery(latitude, longitude);
    const url = `${this.baseUrl}v6/search/products?start=${start}&size=${size}&search_type=7&q=${query}`;
    try {
      let finalData = [];
      let count = 0;
      const response = await fetch(url, requestOptions);
      const result = await response.text();
      const resp = JSON.parse(result);
      resp.products.forEach((item) => {
        if (count < 6) {
          const finalProduct = {
            brand: item.brand,
            name: item.name,
            price: item.mrp,
            discountedPrice: item.price,
            quantity: item.unit,
            ...eta,
          };
          finalData.push(finalProduct);
          count++;
        }
      });
      return finalData;
    } catch (err) {
      console.log(err.message);
    }
  };
}

module.exports = BlinkItApis;
