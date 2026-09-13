// ======================================================
// API BASE URL
// ======================================================

// En local : les appels sont envoyés vers le même serveur
// En Kubernetes : le frontend et le Gateway seront exposés
// sous le même domaine via l'Ingress.
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// ======================================================
// AUTH
// ======================================================

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de l'inscription"
    );
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la connexion"
    );
  }

  return data;
}

export async function getProfile(token) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la récupération du profil"
    );
  }

  return data;
}

// ======================================================
// CATALOGUE
// ======================================================

export async function getProducts() {
  const response = await fetch(
    `${API_URL}/catalogue/products`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des produits"
    );
  }

  return data;
}

// ======================================================
// CART
// ======================================================

export async function getCart(userId) {
  const response = await fetch(
    `${API_URL}/cart/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération du panier"
    );
  }

  return response.json();
}

export async function addToCart(
  userId,
  productId,
  quantity
) {
  const response = await fetch(
    `${API_URL}/cart/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        quantity
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de l'ajout au panier"
    );
  }

  return data;
}

export async function updateCartItem(
  userId,
  productId,
  quantity
) {
  const response = await fetch(
    `${API_URL}/cart/${userId}/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la modification du panier"
    );
  }

  return data;
}

export async function deleteCartItem(
  userId,
  productId
) {
  const response = await fetch(
    `${API_URL}/cart/${userId}/${productId}`,
    {
      method: "DELETE"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la suppression du produit"
    );
  }

  return data;
}

export async function clearCart(userId) {
  const response = await fetch(
    `${API_URL}/cart/${userId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      error.message ||
        "Erreur lors du vidage du panier"
    );
  }

  return response.json();
}

// ======================================================
// ORDERS
// ======================================================

export async function getUserOrders(userId) {
  const response = await fetch(
    `${API_URL}/orders/user/${userId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des commandes"
    );
  }

  return data;
}

export async function getOrder(orderId) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération de la commande"
    );
  }

  return data;
}

export async function createOrder(
  userId,
  items,
  total
) {
  const response = await fetch(
    `${API_URL}/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        items,
        total
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la création de la commande"
    );
  }

  return data;
}

export async function updateOrderStatus(
  orderId,
  status
) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la modification du statut"
    );
  }

  return data;
}

// ======================================================
// NOTIFICATIONS
// ======================================================

export async function getUserNotifications(userId) {
  const response = await fetch(
    `${API_URL}/notifications/user/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des notifications"
    );
  }

  return response.json();
}

export async function getNotification(
  notificationId
) {
  const response = await fetch(
    `${API_URL}/notifications/${notificationId}`
  );

  if (!response.ok) {
    throw new Error("Notification non trouvée");
  }

  return response.json();
}

export async function createNotification(
  userId,
  type,
  title,
  message
) {
  const response = await fetch(
    `${API_URL}/notifications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        type,
        title,
        message
      })
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.message ||
        "Erreur lors de la création"
    );
  }

  return response.json();
}

export async function markNotificationAsRead(
  notificationId
) {
  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PUT"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la mise à jour"
    );
  }

  return response.json();
}

export async function deleteNotification(
  notificationId
) {
  const response = await fetch(
    `${API_URL}/notifications/${notificationId}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la suppression"
    );
  }

  return response.json();
}

// ======================================================
// PAYMENT
// ======================================================

export async function getUserPayments(userId) {
  const response = await fetch(
    `${API_URL}/payment/user/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Erreur lors de la récupération des paiements"
    );
  }

  return response.json();
}

export async function getPayment(paymentId) {
  const response = await fetch(
    `${API_URL}/payment/${paymentId}`
  );

  if (!response.ok) {
    throw new Error("Paiement non trouvé");
  }

  return response.json();
}

export async function createPayment(
  orderId,
  userId,
  amount,
  method
) {
  const response = await fetch(
    `${API_URL}/payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId,
        userId,
        amount,
        method
      })
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      error.message ||
        "Erreur lors de la création du paiement"
    );
  }

  return response.json();
}

export async function updatePaymentStatus(
  paymentId,
  status
) {
  const response = await fetch(
    `${API_URL}/payment/${paymentId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status
      })
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      error.message ||
        "Erreur lors de la modification du paiement"
    );
  }

  return response.json();
}