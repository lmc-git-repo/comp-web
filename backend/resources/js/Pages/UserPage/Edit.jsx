import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import api from "../../api/axios";

const COMPANY_BLUE = "#004d99";

const EditUserModal = ({ show, handleClose, user, refreshUsers }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "member",
        password: "",
        password_confirmation: "",
    });

    const [originalData, setOriginalData] = useState(null);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (user) {
            const initial = {
                name: user.name || "",
                email: user.email || "",
                role: user.role || "member",
                password: "",
                password_confirmation: "",
            };

            setFormData(initial);
            setOriginalData(initial);
            setIsDirty(false);
            setError(null);
        }
    }, [user]);

    const closeModal = () => {
        setError(null);
        setIsDirty(false);
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...formData,
            [name]: value,
        };

        setFormData(updatedForm);

        // Dirty check: compare new formData with originalData
        const hasChanges =
            updatedForm.name !== originalData.name ||
            updatedForm.email !== originalData.email ||
            updatedForm.role !== originalData.role ||
            updatedForm.password !== "" ||
            updatedForm.password_confirmation !== "";

        setIsDirty(hasChanges);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match.");
            setSaving(false);
            return;
        }

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
            };

            if (formData.password.trim() !== "") {
                payload.password = formData.password;
                payload.password_confirmation = formData.password_confirmation;
            }

            await api.put(`/users/${user.id}`, payload);

            refreshUsers();
            closeModal();
        } catch (err) {
            setError("Unable to update user. Please check your inputs.");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    return (
        <Modal
            show={show}
            onHide={closeModal}
            centered
            size="lg"
            dialogClassName="create-user-modal"
        >
            <Modal.Body className="p-0">
                <div className="create-user-card p-5" style={{ position: "relative" }}>

                    <div className="create-user-topline"></div>

                    <h2 className="create-user-title mb-5">Edit User</h2>

                    {error && (
                        <Alert variant="danger" style={{ fontSize: "1rem" }}>
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-4">
                            <Form.Label className="form-label">Name</Form.Label>
                            <Form.Control
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="form-label">Email</Form.Label>
                            <Form.Control
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

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

                        <Form.Group className="mb-4">
                            <Form.Label className="form-label">
                                New Password (optional)
                            </Form.Label>
                            <Form.Control
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current password"
                            />
                        </Form.Group>

                        <Form.Group className="mb-5">
                            <Form.Label className="form-label">
                                Confirm New Password
                            </Form.Label>
                            <Form.Control
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm only if password is changed"
                            />
                        </Form.Group>

                        <div className="create-user-buttons d-flex justify-content-end gap-3 mt-4">

                            <Button
                                variant="secondary"
                                disabled={saving}
                                onClick={closeModal}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={!isDirty || saving}
                                className="btn-primary"
                                style={{
                                    backgroundColor: COMPANY_BLUE,
                                    borderColor: COMPANY_BLUE,
                                    opacity: (!isDirty || saving) ? 0.6 : 1,
                                }}
                            >
                                {saving ? "Saving..." : "Update User"}
                            </Button>

                        </div>

                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;