import { useEffect, useState } from "react";
import { getProducts, addToCart } from "../services/api";

function Catalogue() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Vous devez être connecté pour ajouter un produit au panier.");
        return;
      }

      await addToCart(user.id, productId, 1);

      alert("Produit ajouté au panier !");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <h1>Chargement des produits...</h1>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  return (
    <div>
      <h1>Catalogue</h1>

      {products.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id}>
              <h2>{product.name}</h2>

              <p>Prix : {product.price} €</p>

              <p>Stock : {product.stock}</p>

              {product.stock > 0 ? (
                <button
                  onClick={() => handleAddToCart(product.id)}
                >
                  Ajouter au panier
                </button>
              ) : (
                <p>Produit en rupture de stock</p>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogue;