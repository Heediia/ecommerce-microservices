import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser({
        email,
        password,
        nom,
        prenom
      });

      setSuccess("Inscription réussie !");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Inscription</h1>

      <form onSubmit={handleRegister}>

        <div>
          <label>Prénom</label>
          <br />
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Votre prénom"
            required
          />
        </div>

        <br />

        <div>
          <label>Nom</label>
          <br />
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Votre nom"
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            required
          />
        </div>

        <br />

        <div>
          <label>Mot de passe</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
}

export default Register;