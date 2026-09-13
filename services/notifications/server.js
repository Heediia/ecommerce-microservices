const express = require("express");

const app = express();

const PORT = 3006;

// Allow JSON requests
app.use(express.json());


// ======================================================
// TEMPORARY STORAGE
// ======================================================

let notifications = [];


// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
    res.json({
        service: "Notifications",
        message: "Notification Service fonctionne !"
    });
});


// ======================================================
// GET - ALL NOTIFICATIONS
// ======================================================

app.get("/notifications", (req, res) => {
    res.json(notifications);
});


// ======================================================
// GET - NOTIFICATIONS BY USER
// ======================================================

app.get("/notifications/user/:userId", (req, res) => {

    const userId = String(req.params.userId);

    const userNotifications = notifications.filter(
        notification => notification.userId === userId
    );

    res.json(userNotifications);
});


// ======================================================
// GET - ONE NOTIFICATION
// ======================================================

app.get("/notifications/:id", (req, res) => {

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "ID de notification invalide"
        });
    }

    const notification = notifications.find(
        notification => notification.id === id
    );

    if (!notification) {
        return res.status(404).json({
            message: "Notification non trouvée"
        });
    }

    res.json(notification);
});


// ======================================================
// POST - CREATE NOTIFICATION
// ======================================================

app.post("/notifications", (req, res) => {

    const {
        userId,
        type,
        title,
        message
    } = req.body || {};

    // Validation
    if (!userId || !type || !title || !message) {
        return res.status(400).json({
            message:
                "userId, type, title et message sont obligatoires"
        });
    }

    // Generate new ID
    const newId =
        notifications.length > 0
            ? Math.max(...notifications.map(n => n.id)) + 1
            : 1;

    const newNotification = {
        id: newId,
        userId: String(userId),
        type: type,
        title: title,
        message: message,
        read: false,
        createdAt: new Date().toISOString()
    };

    notifications.push(newNotification);

    res.status(201).json({
        message: "Notification créée avec succès",
        notification: newNotification
    });
});


// ======================================================
// PUT - MARK NOTIFICATION AS READ
// ======================================================

app.put("/notifications/:id/read", (req, res) => {

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "ID de notification invalide"
        });
    }

    const notification = notifications.find(
        notification => notification.id === id
    );

    if (!notification) {
        return res.status(404).json({
            message: "Notification non trouvée"
        });
    }

    notification.read = true;

    res.json({
        message: "Notification marquée comme lue",
        notification: notification
    });
});


// ======================================================
// DELETE - DELETE NOTIFICATION
// ======================================================

app.delete("/notifications/:id", (req, res) => {

    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "ID de notification invalide"
        });
    }

    const notificationExists = notifications.some(
        notification => notification.id === id
    );

    if (!notificationExists) {
        return res.status(404).json({
            message: "Notification non trouvée"
        });
    }

    notifications = notifications.filter(
        notification => notification.id !== id
    );

    res.json({
        message: "Notification supprimée avec succès"
    });
});


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
    console.log(
        `Notification Service running on http://localhost:${PORT}`
    );
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});