require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const PORT = 3000;


// ========================================
// SERVICE URLS
// ========================================

const AUTH_URL = process.env.AUTH_URL || "http://localhost:3003";

const CATALOGUE_URL =
    process.env.CATALOGUE_URL || "http://localhost:3001";

const CART_URL =
    process.env.CART_URL || "http://localhost:3002";

const ORDERS_URL =
    process.env.ORDERS_URL || "http://localhost:3004";

const PAYMENT_URL =
    process.env.PAYMENT_URL || "http://localhost:3005";

const NOTIFICATIONS_URL =
    process.env.NOTIFICATIONS_URL || "http://localhost:3006";


app.use(cors());


// ========================================
// AUTH SERVICE
// ========================================

app.use(
    "/auth",
    createProxyMiddleware({
        target: AUTH_URL,
        changeOrigin: true
    })
);


// ========================================
// CATALOGUE SERVICE
// ========================================

app.use(
    "/catalogue",
    createProxyMiddleware({
        target: CATALOGUE_URL,
        changeOrigin: true
    })
);


// ========================================
// CART SERVICE
// ========================================

app.use(
    "/cart",
    createProxyMiddleware({
        target: CART_URL,
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
        target: ORDERS_URL,
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
        target: PAYMENT_URL,
        changeOrigin: true,

        pathRewrite: (path) => {
            return "/payments" + path;
        }
    })
);


// ========================================
// NOTIFICATIONS SERVICE
// ========================================

app.use(
    "/notifications",
    createProxyMiddleware({
        target: NOTIFICATIONS_URL,
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


app.get("/health", (req, res) => {

    res.json({
        status: "ok"
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