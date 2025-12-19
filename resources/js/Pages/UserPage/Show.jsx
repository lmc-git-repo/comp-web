import React from "react";
import { Modal, Button } from "react-bootstrap";

const HEADER_BLUE = "#002C82";

const ShowUserModal = ({ show, handleClose, user }) => {
    if (!user) return null;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            dialogClassName="show-user-modal"
        >
            <div className="edit-announcement-card">

                {/* Blue top line */}
                <div className="edit-announcement-topline"></div>

                <br />

                {/* Title */}
                <h2 className="edit-title text-center">USER DETAILS</h2>

                <Modal.Body className="px-4">

                    <p className="detail-line">
                        <strong>Name:</strong> {user.name}
                    </p>

                    <p className="detail-line">
                        <strong>Email:</strong> {user.email}
                    </p>

                    <p className="detail-line">
                        <strong>Role:</strong> {user.role}
                    </p>

                </Modal.Body>

                <Modal.Footer className="px-4 pb-4">
                    <Button
                        variant="secondary"
                        className="px-4 py-2"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default ShowUserModal;