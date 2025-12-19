import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LOGO_SRC = "/images/LMC-Logo-only.png";

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);
        setSuccess(false);

        try {
            const response = await axios.post("/api/login", {
                email: formData.username,
                password: formData.password,
            });

            if (response.data.access_token) {
                const userRole = response.data.user.role;

                localStorage.setItem("auth_token", response.data.access_token);
                localStorage.setItem("user_role", userRole);

                if (onLogin) onLogin(userRole);

                if (userRole === "super admin" || userRole === "admin") {
                    setSuccess(true);
                    navigate("/");
                } else {
                    setError("Access denied: Insufficient privileges.");
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user_role");
                }
            }
        } catch (err) {
            const errorMessage = err.response
                ? err.response.data.message || "Invalid username or password."
                : "Network error. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Background blur layer */}
            <div className="login-bg-blur"></div>

            <Container fluid className="login-page-container">
                <Row className="justify-content-center w-100">
                    <Col xs={12} sm={10} md={6} lg={4}>
                        {/* Reuse homepage box style */}
                        <div className="about-box-frame login-box-frame text-center">

                            <div className="about-box-topline"></div>

                            <div className="about-box-title login-title-fix">
                                ACCOUNT LOGIN
                            </div>

                            {/* logo */}
                            <div className="login-logo-wrapper">
                                <Image
                                    src={LOGO_SRC}
                                    alt="LMC Logo"
                                    className="login-logo"
                                />
                            </div>

                            {/* company name */}
                            <p className="login-company-title">
                                LAGUNA METTS <br /> CORPORATION
                            </p>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && (
                                <Alert variant="success">
                                    Login successful! Redirecting…
                                </Alert>
                            )}

                            <div className="login-form-section">
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Username"
                                            autoComplete="username"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Control
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 login-button-custom"
                                        disabled={loading}
                                    >
                                        {loading ? "Logging In…" : "Login"}
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LoginPage;