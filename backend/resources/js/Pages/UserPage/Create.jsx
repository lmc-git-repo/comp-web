import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import api from "../../api/axios";

const COMPANY_BLUE = "#004d99";

export default function CreateUserModal({ show, handleClose, refreshUsers }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "member",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            role: "member",
            password: "",
            password_confirmation: "",
        });
        setError(null);
    };

    const closeModal = () => {
        resetForm();
        handleClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/users", formData);
            refreshUsers();
            closeModal();
        } catch (err) {
            setError("Unable to create user. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={closeModal}
            centered
            size="lg"
            dialogClassName="create-user-modal"
        >
            <Modal.Body className="p-0">

                {/* CARD */}
                <div className="create-user-card p-5" style={{ position: "relative" }}>

                    {/* BLUE TOP BAR */}
                    <div
                        className="create-user-topline"
                        style={{
                            width: "100%",
                            height: "8px",
                            backgroundColor: COMPANY_BLUE,
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    ></div>

                    {/* TITLE */}
                    <h2 className="create-user-title mb-5">Add New User</h2>

                    {/* ERROR */}
                    {error && (
                        <Alert variant="danger" style={{ fontSize: "1rem" }}>
                            {error}
                        </Alert>
                    )}

                    {/* FORM */}
                    <Form onSubmit={handleSubmit}>

                        {/* NAME */}
                        <Form.Group className="mb-4">
                            <Form.Label className="form-label">Name</Form.Label>
                            <Form.Control
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* EMAIL */}
                        <Form.Group className="mb-4">
                            <Form.Label className="form-label">Email</Form.Label>
                            <Form.Control
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* ROLE */}
                        <Form.Group className="mb-4">
                            <Form.Label className="form-label">Role</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="super admin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                            </Form.Select>
                        </Form.Group>

                        {/* PASSWORD */}
                        <Form.Group className="mb-4">
                            <Form.Label className="form-label">Password</Form.Label>
                            <Form.Control
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* CONFIRM PASSWORD */}
                        <Form.Group className="mb-5">
                            <Form.Label className="form-label">Confirm Password</Form.Label>
                            <Form.Control
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* BUTTONS */}
                        <div className="create-user-buttons d-flex justify-content-end gap-3 mt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={loading}
                                onClick={closeModal}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{
                                    backgroundColor: COMPANY_BLUE,
                                    borderColor: COMPANY_BLUE,
                                }}
                            >
                                {loading ? "Creating..." : "Create User"}
                            </Button>
                        </div>

                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
}