require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = 3001;

app.use(express.json());

// ===============================
// CONNEXION REDIS (Azure)
// ===============================
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {}
});

redis.on("connect", () => console.log("✅ Connecté à Redis"));
redis.on("error", (err) => console.error("❌ Erreur Redis :", err.message));

// ===============================
// HOME / HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
    res.json({
        service: "Catalogue",
        message: "Catalogue Service fonctionne !"
    });
});

// ===============================
// INITIALISATION (données de test, une seule fois)
// ===============================
async function seedProducts() {
    const exists = await redis.exists("product:1");
    if (!exists) {
        await redis.hset("product:1", { id: 1, name: "Laptop", price: 2500, stock: 10 });
        await redis.hset("product:2", { id: 2, name: "Smartphone", price: 1200, stock: 20 });
        await redis.sadd("products:ids", 1, 2);
        await redis.set("products:nextId", 2);
        console.log("📦 Produits de test ajoutés dans Redis");
    }
}
seedProducts();

// ===============================
// PRODUCTS
// ===============================

// GET - Tous les produits
app.get("/products", async (req, res) => {
    try {
        const ids = await redis.smembers("products:ids");
        const products = [];
        for (const id of ids) {
            const product = await redis.hgetall(`product:${id}`);
            products.push(product);
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// GET - Un produit par ID
app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await redis.hgetall(`product:${id}`);

        if (!product || Object.keys(product).length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// POST - Ajouter un produit
app.post("/products", async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({ message: "name, price et stock sont obligatoires" });
        }

        const newId = await redis.incr("products:nextId");
        const newProduct = { id: newId, name, price, stock };

        await redis.hset(`product:${newId}`, newProduct);
        await redis.sadd("products:ids", newId);

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// PUT - Modifier un produit
app.put("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const exists = await redis.exists(`product:${id}`);

        if (!exists) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        const { name, price, stock } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (price !== undefined) updates.price = price;
        if (stock !== undefined) updates.stock = stock;

        if (Object.keys(updates).length > 0) {
            await redis.hset(`product:${id}`, updates);
        }

        const updated = await redis.hgetall(`product:${id}`);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// DELETE - Supprimer un produit
app.delete("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const exists = await redis.exists(`product:${id}`);

        if (!exists) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        await redis.del(`product:${id}`);
        await redis.srem("products:ids", id);

        res.json({ message: "Produit supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
    console.log(`🚀 Catalogue Service running on http://localhost:${PORT}`);
});