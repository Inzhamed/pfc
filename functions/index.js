const functions = require("firebase-functions");
const { createProxyMiddleware } = require("http-proxy-middleware");

const API_URL = "https://backend-railvision.onrender.com";

exports.api = functions.https.onRequest(
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // ça enlève /api du chemin
    },
  })
);
