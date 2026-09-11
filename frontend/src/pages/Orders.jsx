import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUserOrders,
  createOrder,
  getCart,
  clearCart
} from "../services/api";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // LOAD USER ORDERS
  // =========================

  const loadOrders = async () => {
    try {
      if (!user) {
        setError(
          "Vous devez être connecté pour voir vos commandes."
        );
        setLoading(false);
        return;
      }

      const data = await getUserOrders(user.id);

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================
  // CREATE ORDER FROM CART
  // =========================

  const handleCreateOrder = async () => {
    try {
      if (!user) {
        setError("Vous devez être connecté.");
        return;
      }

      setCreating(true);
      setError("");

      // 1. Récupérer le panier
      const cart = await getCart(user.id);

      // 2. Vérifier si le panier est vide
      if (!cart.items || cart.items.length === 0) {
        setError("Votre panier est vide.");
        return;
      }

      // 3. Prix temporaires des produits
      const prices = {
        1: 2500,
        2: 1200
      };

      // 4. Calculer le total
      const total = cart.items.reduce((sum, item) => {
        const price = prices[item.productId];

        if (price === undefined) {
          return sum;
        }

        return sum + price * item.quantity;
      }, 0);

      // 5. Vérifier le total
      if (total <= 0) {
        setError(
          "Impossible de calculer le total de la commande."
        );
        return;
      }

      // 6. Créer la commande
      await createOrder(
        user.id,
        cart.items,
        total
      );

      // 7. Vider le panier
      await clearCart(user.id);

      // 8. Message de succès
      alert(
        `Commande créée avec succès ! Total : ${total} €\n\nVotre panier a été vidé.`
      );

      // 9. Recharger les commandes
      await loadOrders();

    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <h1>
        Chargement des commandes...
      </h1>
    );
  }

  // =========================
  // NOT CONNECTED
  // =========================

  if (!user) {
    return (
      <div>
        <h1>Mes Commandes</h1>

        <p>
          Vous devez être connecté pour voir vos commandes.
        </p>

        <button
          onClick={() => navigate("/login")}
        >
          Se connecter
        </button>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div>
      <h1>Mes Commandes</h1>

      {error && (
        <p>
          Erreur : {error}
        </p>
      )}

      <button
        onClick={handleCreateOrder}
        disabled={creating}
      >
        {creating
          ? "Création..."
          : "Créer une commande depuis mon panier"}
      </button>

      <hr />

      {orders.length === 0 ? (
        <p>
          Vous n'avez aucune commande.
        </p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>

              <h2>
                Commande #{order.id}
              </h2>

              <p>
                <strong>Utilisateur :</strong>{" "}
                {order.userId}
              </p>

              <p>
                <strong>Total :</strong>{" "}
                {order.total} €
              </p>

              <p>
                <strong>Statut :</strong>{" "}
                {order.status}
              </p>

              <h3>
                Produits :
              </h3>

              {order.items.map((item, index) => (
                <div key={index}>

                  <p>
                    <strong>Produit :</strong>{" "}
                    {item.productId}
                  </p>

                  <p>
                    <strong>Quantité :</strong>{" "}
                    {item.quantity}
                  </p>

                </div>
              ))}

              <hr />

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;