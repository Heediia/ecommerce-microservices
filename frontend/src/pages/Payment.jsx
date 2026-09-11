import { useEffect, useState } from "react";

import {
  getUserPayments,
  createPayment,
  getUserOrders
} from "../services/api";

function Payment() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadData = async () => {
    try {
      if (!user) {
        setError("Vous devez être connecté.");
        setLoading(false);
        return;
      }

      const paymentsData = await getUserPayments(user.id);
      const ordersData = await getUserOrders(user.id);

      setPayments(paymentsData);
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePayment = async (order) => {
    try {
      if (!user) {
        setError("Vous devez être connecté.");
        return;
      }

      setCreating(true);
      setError("");

      const orderId = order.id;
      const amount = order.total;
      const method = "card";

      await createPayment(
        orderId,
        user.id,
        amount,
        method
      );

      alert(
        `Paiement créé avec succès !\n\nCommande #${orderId}\nMontant : ${amount} €`
      );

      await loadData();

    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <h1>Chargement des paiements...</h1>;
  }

  if (!user) {
    return (
      <div>
        <h1>Paiement</h1>
        <p>Vous devez être connecté.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Paiement</h1>

      {error && (
        <p>Erreur : {error}</p>
      )}

      <h2>Mes commandes à payer</h2>

      {orders.length === 0 ? (
        <p>Aucune commande disponible.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <h3>
                Commande #{order.id}
              </h3>

              <p>
                <strong>Total :</strong>{" "}
                {order.total} €
              </p>

              <p>
                <strong>Statut :</strong>{" "}
                {order.status}
              </p>

              <button
                onClick={() => handleCreatePayment(order)}
                disabled={creating}
              >
                {creating
                  ? "Création..."
                  : `Payer la commande #${order.id}`}
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}

      <h2>Mes paiements</h2>

      {payments.length === 0 ? (
        <p>Aucun paiement.</p>
      ) : (
        <div>
          {payments.map((payment) => (
            <div key={payment.id}>
              <h3>
                Paiement #{payment.id}
              </h3>

              <p>
                <strong>Commande :</strong>{" "}
                {payment.orderId}
              </p>

              <p>
                <strong>Montant :</strong>{" "}
                {payment.amount} €
              </p>

              <p>
                <strong>Méthode :</strong>{" "}
                {payment.method}
              </p>

              <p>
                <strong>Statut :</strong>{" "}
                {payment.status}
              </p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Payment;