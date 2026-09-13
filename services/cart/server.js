const express = require("express");

const app = express();
const PORT = 3002;

app.use(express.json());

// Stockage temporaire des paniers
let carts = {};

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    service: "Cart",
    message: "Cart Service fonctionne !"
  });
});

// ===============================
// GET CART
// ===============================

app.get("/cart/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!carts[userId]) {
    carts[userId] = {
      userId: userId,
      items: []
    };
  }

  res.json(carts[userId]);
});

// ===============================
// ADD PRODUCT
// ===============================

app.post("/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      message: "productId et quantity sont obligatoires"
    });
  }

  if (!carts[userId]) {
    carts[userId] = {
      userId: userId,
      items: []
    };
  }

  const existingItem = carts[userId].items.find(
    item => item.productId === parseInt(productId)
  );

  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    carts[userId].items.push({
      productId: parseInt(productId),
      quantity: parseInt(quantity)
    });
  }

  res.status(201).json({
    message: "Produit ajouté au panier",
    cart: carts[userId]
  });
});

// ===============================
// UPDATE QUANTITY
// ===============================

app.put("/cart/:userId/:productId", (req, res) => {
  const userId = req.params.userId;
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;

  if (!carts[userId]) {
    return res.status(404).json({
      message: "Panier non trouvé"
    });
  }

  const item = carts[userId].items.find(
    item => item.productId === productId
  );

  if (!item) {
    return res.status(404).json({
      message: "Produit non trouvé dans le panier"
    });
  }

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      message: "La quantité doit être supérieure à 0"
    });
  }

  item.quantity = parseInt(quantity);

  res.json({
    message: "Quantité modifiée",
    cart: carts[userId]
  });
});

// ===============================
// DELETE ONE PRODUCT
// ===============================

app.delete("/cart/:userId/:productId", (req, res) => {
  const userId = req.params.userId;
  const productId = parseInt(req.params.productId);

  if (!carts[userId]) {
    return res.status(404).json({
      message: "Panier non trouvé"
    });
  }

  const itemExists = carts[userId].items.some(
    item => item.productId === productId
  );

  if (!itemExists) {
    return res.status(404).json({
      message: "Produit non trouvé dans le panier"
    });
  }

  carts[userId].items = carts[userId].items.filter(
    item => item.productId !== productId
  );

  res.json({
    message: "Produit supprimé du panier",
    cart: carts[userId]
  });
});

// ===============================
// CLEAR ENTIRE CART
// ===============================

app.delete("/cart/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!carts[userId]) {
    carts[userId] = {
      userId: userId,
      items: []
    };
  }

  carts[userId].items = [];

  res.json({
    message: "Panier vidé avec succès",
    cart: carts[userId]
  });
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(
    `Cart Service running on http://localhost:${PORT}`
  );
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});