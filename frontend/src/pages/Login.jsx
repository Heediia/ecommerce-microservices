import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(email, password);

            // Sauvegarder le token JWT
            localStorage.setItem("token", data.token);

            // Sauvegarder les informations utilisateur
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Redirection vers le profil
            navigate("/profile");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Connexion</h1>

            <form onSubmit={handleLogin}>

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

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>

            </form>

            {error && (
                <p>
                    {error}
                </p>
            )}
        </div>
    );
}

export default Login;