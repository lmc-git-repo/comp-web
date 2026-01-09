import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import api from "../../api/axios";

// Import Modals
import CreateUserModal from "./Create";
import EditUserModal from "./Edit";

const HEADER_BLUE = "#002C82";
const ACCENT_RED = "#dc3545";

const UserIndexPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {
        try {
            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const closeModals = () => {
        setShowCreate(false);
        setShowEdit(false);
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const handleDeleteConfirmed = async () => {
        if (!selectedUser) return;
        try {
            await api.delete(`/users/${selectedUser.id}`);
            setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
        closeModals();
    };

    return (
        <Container className="mt-5 mb-5">
            {/* Title + Add User */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="user-management-title m-0 text-center flex-grow-1">
                    USER MANAGEMENT
                </h2>

                <Button
                    className="user-add-btn-header"
                    onClick={() => setShowCreate(true)}
                >
                    Add User
                </Button>
            </div>

            <div className="user-management-wrapper">
                {loading ? (
                    <p className="text-center">Loading users...</p>
                ) : (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td data-label="Name">
                                            {user.name}
                                        </td>

                                        <td data-label="Email">
                                            {user.email}
                                        </td>

                                        <td data-label="Role" className="text-capitalize">
                                            {user.role}
                                        </td>

                                        <td data-label="Actions" className="user-actions-cell">
                                            <Button
                                                className="user-btn-edit"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowEdit(true);
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                style={{
                                                    backgroundColor: ACCENT_RED,
                                                    borderColor: ACCENT_RED,
                                                    fontWeight: 600,
                                                }}
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODALS */}
            <CreateUserModal
                show={showCreate}
                handleClose={closeModals}
                refreshUsers={loadUsers}
            />

            <EditUserModal
                show={showEdit}
                handleClose={closeModals}
                user={selectedUser}
                refreshUsers={loadUsers}
            />

            {/* DELETE MODAL */}
            <Modal show={showDeleteModal} onHide={closeModals} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title
                        style={{
                            fontWeight: 700,
                            fontSize: "1.4rem",
                            color: HEADER_BLUE,
                        }}
                    >
                        Confirm Deletion
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to permanently delete
                    <strong> {selectedUser?.name}</strong>?
                </Modal.Body>

                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={closeModals}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Delete Permanently
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserIndexPage;