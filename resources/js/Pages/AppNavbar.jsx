
import React, { useState } from "react";
import { Navbar, Nav, Container, Modal, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const LOGO_SRC = "/images/LMC-Logo-Wht.png";

const AppNavbar = ({
    userRole,
    language = "en",
    onLanguageChange,
    showLanguageToggle = false
}) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isAuthenticated = !!localStorage.getItem("auth_token");

    const isSuperAdmin = userRole === "super admin";
    const isAdmin = userRole === "admin";

    const isJapanese = showLanguageToggle && language === "ja";

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        window.location.href = "/login";
    };

    return (
        <>
            <Navbar expand="lg" sticky="top" style={{ backgroundColor: "#002C82" }}>
                <Container fluid>

                    {/* LOGO */}
                    <Navbar.Brand as={Link} to="/" style={{ padding: 0 }}>
                        <img
                            src={LOGO_SRC}
                            alt="Logo"
                            style={{ width: "120px", height: "auto" }}
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">

                        {/* SINGLE NAV GROUP */}
                        <Nav className="ms-auto" style={{ gap: "20px" }}>

                            <Nav.Link as={Link} to="/about" className="nav-hover-link">
                                {isJapanese ? "会社概要" : "About"}
                            </Nav.Link>

                            {/* NEWS DROPDOWN */}
                            <NavDropdown
                                title={isJapanese ? "お知らせ" : "News"}
                                id="news-dropdown"
                                className="nav-hover-link news-nav-dropdown"
                            >
                                <NavDropdown.Item as={Link} to="/news">
                                    {isJapanese ? "会社ニュース" : "Company News"}
                                </NavDropdown.Item>

                                <NavDropdown.Item as={Link} to="/news/disaster-risk">
                                    {isJapanese ? "勧告速報" : "Advisory Bulletin"}
                                </NavDropdown.Item>
                            </NavDropdown>

                            {isSuperAdmin && (
                                <Nav.Link as={Link} to="/admin/users" className="nav-hover-link">
                                    Users
                                </Nav.Link>
                            )}

                            {(isAdmin || isSuperAdmin) && isAuthenticated && (
                                <Nav.Link
                                    as="button"
                                    onClick={() => setShowLogoutModal(true)}
                                    className="nav-hover-link"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer"
                                    }}
                                >
                                    Logout
                                </Nav.Link>
                            )}

                        </Nav>

                        {/* PUBLIC LANGUAGE TOGGLE */}
                        {showLanguageToggle && (
                            <div
                                className="lmc-language-toggle"
                                role="group"
                                aria-label="Website language"
                            >
                                <button
                                    type="button"
                                    className={`lmc-language-option ${language === "ja" ? "selected" : ""}`}
                                    onClick={() => onLanguageChange?.("ja")}
                                    aria-pressed={language === "ja"}
                                >
                                    JAPANESE
                                </button>

                                <span className="lmc-language-separator" aria-hidden="true">
                                    |
                                </span>

                                <button
                                    type="button"
                                    className={`lmc-language-option ${language === "en" ? "selected" : ""}`}
                                    onClick={() => onLanguageChange?.("en")}
                                    aria-pressed={language === "en"}
                                >
                                    ENGLISH
                                </button>
                            </div>
                        )}

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* LOGOUT CONFIRMATION MODAL */}
            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "#002C82", fontWeight: 700 }}>
                        Confirm Logout
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to log out?
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowLogoutModal(false)}
                        style={{ fontWeight: 600 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleLogout}
                        style={{ fontWeight: 600 }}
                    >
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AppNavbar;