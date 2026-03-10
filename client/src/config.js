const Conf = require("conf");

const config = new Conf({
  projectName: "livepreview",
  schema: {
    api_token: { type: "string" },
    server_url: { type: "string" },
    api_url: { type: "string" },
  },
});

const defaults = {
  server_url: process.env.LIVEPREVIEW_SERVER || "wss://preview.yourdomain.com",
  api_url: process.env.LIVEPREVIEW_API || "https://preview.yourdomain.com/api",
};

module.exports = {
  getToken: () => process.env.LIVEPREVIEW_TOKEN || config.get("api_token"),
  setToken: (t) => config.set("api_token", t),
  getServerUrl: () => config.get("server_url") || defaults.server_url,
  getApiUrl: () => config.get("api_url") || defaults.api_url,
  clearAll: () => config.clear(),
};
