import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import api from "../../api/axios";

// Import Modals
import CreateUserModal from "./Create";
import EditUserModal from "./Edit";
import ShowUserModal from "./Show";

const HEADER_BLUE = "#002C82";
const ACCENT_RED = "#dc3545";

const UserIndexPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    /* -----------------------
       Load Users
    ------------------------ */
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

    /* -----------------------
       Modal Handling
    ------------------------ */
    const openCreateModal = () => setShowCreate(true);

    const openEditModal = (user) => {
        setSelectedUser(user);
        setShowEdit(true);
    };

    const openViewModal = (user) => {
        setSelectedUser(user);
        setShowView(true);
    };

    // OPEN DELETE MODAL
    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowCreate(false);
        setShowEdit(false);
        setShowView(false);
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    /* -----------------------
       DELETE USER CONFIRM
    ------------------------ */
    const handleDeleteConfirmed = async () => {
        if (!selectedUser) return;

        try {
            await api.delete(`/users/${selectedUser.id}`);

            // Remove user from UI
            setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        } catch (err) {
            console.error("Failed to delete user:", err);
        }

        closeModals();
    };

    return (
        <Container className="mt-5 mb-5">

            {/* Title + Add User Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="user-management-title m-0 text-center flex-grow-1">
                    USER MANAGEMENT
                </h2>

                <Button
                    className="user-add-btn-header"
                    onClick={openCreateModal}
                >
                    Add User
                </Button>
            </div>

            {/* User Table Wrapper */}
            <div className="user-management-wrapper">

                {loading ? (
                    <p className="text-center">Loading users...</p>
                ) : (
                    <table className="user-table">

                        {/* TABLE HEADER */}
                        <thead>
                            <tr>
                                <th style={{ width: "28%" }}>Name</th>
                                <th style={{ width: "35%" }}>Email</th>
                                <th style={{ width: "20%" }}>Role</th>
                                <th style={{ width: "17%" }}>Actions</th>
                            </tr>
                        </thead>

                        {/* TABLE BODY */}
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
                                        <td
                                            className="clickable-name"
                                            onClick={() => openViewModal(user)}
                                        >
                                            {user.name}
                                        </td>

                                        <td>{user.email}</td>
                                        <td className="text-capitalize">{user.role}</td>

                                        <td className="d-flex gap-2">

                                            <Button
                                                className="user-btn-edit"
                                                size="sm"
                                                onClick={() => openEditModal(user)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                className="user-btn-delete"
                                                size="sm"
                                                variant="danger"
                                                style={{ 
                                                    backgroundColor: "#dc3545", 
                                                    borderColor: "#dc3545",
                                                    fontWeight: 600 
                                                }}
                                                onClick={() => openDeleteModal(user)}
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

            <ShowUserModal
                show={showView}
                handleClose={closeModals}
                user={selectedUser}
            />

            {/* -------------------------
               DELETE USER MODAL (Copied from NewsPage)
            -------------------------- */}
            <Modal show={showDeleteModal} onHide={closeModals} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title
                        style={{
                            fontWeight: "700",
                            fontSize: "1.4rem",
                            color: HEADER_BLUE,
                        }}
                    >
                        Confirm Deletion
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body
                    className="pt-2 pb-3"
                    style={{ fontSize: "1.05rem", color: "#333" }}
                >
                    <p className="mb-1">
                        Are you sure you want to permanently delete user
                        <strong> {selectedUser?.name}</strong>?
                    </p>
                </Modal.Body>

                <Modal.Footer className="border-0 pt-0 d-flex justify-content-end gap-2">

                    {/* CANCEL button */}
                    <Button
                        variant="secondary"
                        onClick={closeModals}
                        style={{
                            backgroundColor: "#6c757d",
                            borderColor: "#6c757d",
                            fontWeight: 600,
                            padding: "6px 18px",
                            borderRadius: "6px",
                            transition: "0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#5a6268";
                            e.target.style.borderColor = "#545b62";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#6c757d";
                            e.target.style.borderColor = "#6c757d";
                        }}
                    >
                        Cancel
                    </Button>

                    {/* DELETE button */}
                    <Button
                        variant="danger"
                        onClick={handleDeleteConfirmed}
                        style={{
                            backgroundColor: ACCENT_RED,
                            borderColor: ACCENT_RED,
                            fontWeight: 700,
                            padding: "6px 18px",
                            borderRadius: "6px",
                            transition: "0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#c82333";
                            e.target.style.borderColor = "#bd2130";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = ACCENT_RED;
                            e.target.style.borderColor = ACCENT_RED;
                        }}
                    >
                        Delete Permanently
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserIndexPage;