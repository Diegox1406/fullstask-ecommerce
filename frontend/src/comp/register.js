import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "react-bootstrap/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Error al registrarse");
    }
  };

  return (
    <div
      className="container"
      style={{
        paddingTop: "50px",
        paddingBottom: "50px",
        minHeight: "50vh",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Crear cuenta</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                  />
                  <small className="form-text text-muted">
                    Mínimo 6 caracteres
                  </small>
                </div>
                <Button
                  type="submit"
                  className="w-100"
                  style={{
                    borderRadius: "25px",
                    padding: "10px 20px",
                    backgroundColor: "#fedf9f",
                    border: "none",
                    color: "#000",
                  }}
                >
                  Registrarse
                </Button>
              </form>
              <div className="text-center mt-3">
                <small>
                  ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
