import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const LOGO_SRC = "/images/LMC-Logo-Wht.png";

const AppNavbar = ({ userRole }) => {

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isAuthenticated = !!localStorage.getItem("auth_token");

    const isSuperAdmin = userRole === "super admin";
    const isAdmin = userRole === "admin";
    const isMember = userRole === "member" || userRole === "user";

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
                            style={{ width: "120px", height: "auto", cursor: "pointer" }}
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto" style={{ gap: "20px" }}>

                            <Nav.Link as={Link} to="/about" className="nav-hover-link">
                                About
                            </Nav.Link>

                            <Nav.Link as={Link} to="/news" className="nav-hover-link">
                                News
                            </Nav.Link>

                            {isSuperAdmin && (
                                <Nav.Link as={Link} to="/admin/users" className="nav-hover-link">
                                    Users
                                </Nav.Link>
                            )}

                            {(isAdmin || isSuperAdmin) && isAuthenticated && (
                                <Button
                                    variant="link"
                                    onClick={() => setShowLogoutModal(true)}
                                    className="nav-link navbar-logout-link"
                                >
                                    Logout
                                </Button>
                            )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* LOGOUT CONFIRMATION MODAL */}
            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "#002C82", fontWeight: "700" }}>
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
                        style={{
                            fontWeight: 600,
                            padding: "6px 18px"
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleLogout}
                        style={{
                            backgroundColor: "#dc3545",
                            borderColor: "#dc3545",
                            fontWeight: 600,
                            padding: "6px 18px"
                        }}
                    >
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AppNavbar;