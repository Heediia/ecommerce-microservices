const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const PORT = 3000;

app.use(cors());


// ========================================
// AUTH SERVICE
// ========================================

app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://localhost:3003",
        changeOrigin: true
    })
);


// ========================================
// CATALOGUE SERVICE
// ========================================

app.use(
    "/catalogue",
    createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true
    })
);


// ========================================
// CART SERVICE
// ========================================

app.use(
    "/cart",
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true,
        pathRewrite: {
            "^/": "/cart/"
        }
    })
);


// ========================================
// ORDERS SERVICE
// ========================================

app.use(
    "/orders",
    createProxyMiddleware({
        target: "http://localhost:3004",
        changeOrigin: true,
        pathRewrite: {
            "^/": "/orders/"
        }
    })
);


// ========================================
// PAYMENT SERVICE
// ========================================

app.use(
    "/payment",
    createProxyMiddleware({
        target: "http://localhost:3005",
        changeOrigin: true,

        pathRewrite: (path) => {
            return "/payments" + path;
        }
    })
);


app.use(
  "/notifications",
  createProxyMiddleware({
    target: "http://localhost:3006",
    changeOrigin: true,
    pathRewrite: (path) => {
      return "/notifications" + path;
    }
  })
);


// ========================================
// HOME / HEALTH CHECK
// ========================================

app.get("/", (req, res) => {

    res.json({
        service: "API Gateway",
        message: "API Gateway fonctionne !"
    });

});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `API Gateway running on http://localhost:${PORT}`
    );

});