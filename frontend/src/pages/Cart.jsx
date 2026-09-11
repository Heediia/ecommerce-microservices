import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  deleteCartItem
} from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadCart = async () => {
    try {
      if (!user) {
        setError("Vous devez être connecté.");
        return;
      }

      const data = await getCart(user.id);
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdate = async (productId, quantity) => {
    try {
      if (quantity < 1) {
        return;
      }

      await updateCartItem(user.id, productId, quantity);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteCartItem(user.id, productId);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <h1>Chargement du panier...</h1>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  return (
    <div>
      <h1>Mon Panier</h1>

      {!cart || !cart.items || cart.items.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.productId}>
              <h2>Produit {item.productId}</h2>

              <p>Quantité : {item.quantity}</p>

              <button
                onClick={() =>
                  handleUpdate(item.productId, item.quantity + 1)
                }
              >
                +
              </button>

              <button
                onClick={() =>
                  handleUpdate(item.productId, item.quantity - 1)
                }
              >
                -
              </button>

              <button
                onClick={() =>
                  handleDelete(item.productId)
                }
              >
                Supprimer
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;