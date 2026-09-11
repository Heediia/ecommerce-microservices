import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getProfile(token);
        setUser(data);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  if (loading) {
    return <h1>Chargement du profil...</h1>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Mon Profil</h1>

      {user && (
        <div>
          <p>
            <strong>ID :</strong> {user.id}
          </p>

          <p>
            <strong>Nom :</strong> {user.nom}
          </p>

          <p>
            <strong>Prénom :</strong> {user.prenom}
          </p>

          <p>
            <strong>Email :</strong> {user.email}
          </p>

          <p>
            <strong>Rôle :</strong> {user.role}
          </p>
        </div>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}

export default Profile;