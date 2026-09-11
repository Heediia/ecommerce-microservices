const express = require("express");

const app = express();

const PORT = 3004;

app.use(express.json());

// ORDERS TEMPORAIRES
let orders = [];

// HOME / HEALTH CHECK
app.get("/", (req, res) => {
    res.json({
        service: "Orders",
        message: "Orders Service fonctionne !"
    });
});

// GET ALL ORDERS
app.get("/orders", (req, res) => {
    res.json(orders);
});

// GET ORDERS BY USER
app.get("/orders/user/:userId", (req, res) => {
    const userId = req.params.userId;

    const userOrders = orders.filter(
        order => order.userId === userId
    );

    res.json(userOrders);
});

// GET ORDER BY ID
app.get("/orders/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const order = orders.find(
        order => order.id === id
    );

    if (!order) {
        return res.status(404).json({
            message: "Commande non trouvée"
        });
    }

    res.json(order);
});

// CREATE ORDER
app.post("/orders", (req, res) => {
    const {
        userId,
        items,
        total
    } = req.body || {};

    if (!userId || !items || total === undefined) {
        return res.status(400).json({
            message: "userId, items et total sont obligatoires"
        });
    }

    const newOrder = {
        id: orders.length > 0
            ? orders[orders.length - 1].id + 1
            : 1,
        userId,
        items,
        total,
        status: "pending"
    };

    orders.push(newOrder);

    res.status(201).json({
        message: "Commande créée avec succès",
        order: newOrder
    });
});

// UPDATE ORDER STATUS
app.put("/orders/:id/status", (req, res) => {
    const id = parseInt(req.params.id);

    const { status } = req.body || {};

    if (!status) {
        return res.status(400).json({
            message: "status est obligatoire"
        });
    }

    const order = orders.find(
        order => order.id === id
    );

    if (!order) {
        return res.status(404).json({
            message: "Commande non trouvée"
        });
    }

    order.status = status;

    res.json({
        message: "Statut de la commande mis à jour",
        order
    });
});

// DELETE ORDER
app.delete("/orders/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const orderExists = orders.some(
        order => order.id === id
    );

    if (!orderExists) {
        return res.status(404).json({
            message: "Commande non trouvée"
        });
    }

    orders = orders.filter(
        order => order.id !== id
    );

    res.json({
        message: "Commande supprimée avec succès"
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(
        `Orders Service running on http://localhost:${PORT}`
    );
});