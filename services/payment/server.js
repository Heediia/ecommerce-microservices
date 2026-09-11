const express = require("express");

const app = express();
const PORT = 3005;

app.use(express.json());

let payments = [];

// Test connection
app.get("/", (req, res) => {
  res.json({
    service: "Payment",
    message: "Payment Service fonctionne !"
  });
});

// Get all payments
app.get("/payments", (req, res) => {
  res.json(payments);
});

// Get payments for a user
app.get("/payments/user/:userId", (req, res) => {
  const userId = String(req.params.userId);

  const userPayments = payments.filter(
    (payment) => payment.userId === userId
  );

  res.json(userPayments);
});

// Get one payment
app.get("/payments/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const payment = payments.find(
    (payment) => payment.id === id
  );

  if (!payment) {
    return res.status(404).json({
      message: "Paiement non trouvé"
    });
  }

  res.json(payment);
});

// Create simulated payment
app.post("/payments", async (req, res) => {
  try {
    const {
      orderId,
      userId,
      amount,
      method
    } = req.body || {};

    if (
      !orderId ||
      !userId ||
      amount === undefined ||
      !method
    ) {
      return res.status(400).json({
        message:
          "orderId, userId, amount et method sont obligatoires"
      });
    }

    // Check if this order was already paid
    const existingPayment = payments.find(
      (payment) =>
        payment.orderId === orderId &&
        payment.userId === String(userId) &&
        payment.status === "paid"
    );

    if (existingPayment) {
      return res.status(400).json({
        message: "Cette commande est déjà payée",
        payment: existingPayment
      });
    }

    // Create payment
    const newPayment = {
      id:
        payments.length > 0
          ? payments[payments.length - 1].id + 1
          : 1,

      orderId: orderId,
      userId: String(userId),
      amount: Number(amount),
      method: method,

      // Simulated payment
      status: "paid",

      createdAt: new Date().toISOString()
    };

    payments.push(newPayment);

    // Update order status
    try {
      const orderResponse = await fetch(
        `http://localhost:3004/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "paid"
          })
        }
      );

      if (!orderResponse.ok) {
        console.log(
          "Attention : impossible de mettre à jour le statut de la commande."
        );
      }
    } catch (error) {
      console.log(
        "Erreur lors de la communication avec Orders Service:",
        error.message
      );
    }

    // Create notification
    try {
      await fetch(
        "http://localhost:3006/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: String(userId),
            type: "payment",
            title: "Paiement réussi",
            message:
              `Le paiement de la commande #${orderId} a été effectué avec succès.`
          })
        }
      );
    } catch (error) {
      console.log(
        "Erreur lors de la création de la notification:",
        error.message
      );
    }

    res.status(201).json({
      message: "Paiement simulé avec succès",
      payment: newPayment
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la création du paiement"
    });
  }
});

// Update payment status manually
app.put("/payments/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({
      message: "status est obligatoire"
    });
  }

  const payment = payments.find(
    (payment) => payment.id === id
  );

  if (!payment) {
    return res.status(404).json({
      message: "Paiement non trouvé"
    });
  }

  payment.status = status;

  res.json({
    message: "Statut du paiement mis à jour",
    payment
  });
});

// Delete payment
app.delete("/payments/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (
    !payments.some(
      (payment) => payment.id === id
    )
  ) {
    return res.status(404).json({
      message: "Paiement non trouvé"
    });
  }

  payments = payments.filter(
    (payment) => payment.id !== id
  );

  res.json({
    message: "Paiement supprimé avec succès"
  });
});

app.listen(PORT, () => {
  console.log(
    `Payment Service running on http://localhost:${PORT}`
  );
});