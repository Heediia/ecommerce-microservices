require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3003;

app.use(express.json());

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {}
});

redis.on("connect", () => console.log("Connecte a Redis"));
redis.on("error", (err) => console.error("Erreur Redis :", err.message));

app.get("/", (req, res) => {
    res.json({ service: "Auth", message: "Auth Service fonctionne" });
});

app.post("/register", async (req, res) => {
    try {
        const { email, password, nom, prenom } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email et password sont obligatoires" });
        }

        const existingId = await redis.get(`email:${email}`);
        if (existingId) {
            return res.status(409).json({ message: "Cet email est deja utilise" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newId = await redis.incr("users:nextId");
        const newUser = {
            id: newId,
            email,
            passwordHash,
            nom: nom || "",
            prenom: prenom || "",
            role: "client"
        };

        await redis.hset(`user:${newId}`, newUser);
        await redis.set(`email:${email}`, newId);

        res.status(201).json({
            message: "Utilisateur cree avec succes",
            user: { id: newId, email, nom, prenom, role: "client" }
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email et password sont obligatoires" });
        }

        const userId = await redis.get(`email:${email}`);
        if (!userId) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const user = await redis.hgetall(`user:${userId}`);
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Connexion reussie",
            token,
            user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

app.get("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token manquant" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await redis.hgetall(`user:${decoded.id}`);
        res.json({ id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role });
    } catch (err) {
        res.status(401).json({ message: "Token invalide ou expire" });
    }
});

app.listen(PORT, () => {
    console.log(`Auth Service running on http://localhost:${PORT}`);
});