import axios from "axios";

export function fetchDomain(domain) {
  const options = {
    method: "GET",
    url: "https://similar-web.p.rapidapi.com/get-analysis",
    params: { domain },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "similar-web.p.rapidapi.com",
    },
  };

  return axios.request(options);
}

export function getAll() {
  return axios.get("/api/getAll");
}
