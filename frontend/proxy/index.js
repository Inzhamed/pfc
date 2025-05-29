const { onRequest } = require("firebase-functions/v2/https");
const { createProxyMiddleware } = require("http-proxy-middleware");

const backendURL = "https://backend-railvision.onrender.com";

exports.api = onRequest(
  createProxyMiddleware({
    target: backendURL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // supprime le préfixe /api si nécessaire
    },
  })
);
