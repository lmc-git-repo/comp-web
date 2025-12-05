import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import CreateAnnouncementModal from "./Create";

const HEADER_BLUE = "#002C82";
const ACCENT_RED = "#dc3545";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const NewsPageIndex = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("user_role");
  const isAdmin = role === "admin" || role === "super admin";

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handlePostSuccess = (newPost) => {
    setAnnouncements((prev) => [newPost, ...prev]);
    setShowCreateModal(false);
  };

  const handleShowDelete = (id) => {
    setPostToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setPostToDeleteId(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!postToDeleteId) return;

    try {
      await api.delete(`/announcements/${postToDeleteId}`);
      setAnnouncements((prev) =>
        prev.filter((post) => post.id !== postToDeleteId)
      );
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }

    handleCloseDelete();
  };

  return (
    <>
      <Container className="mt-5 mb-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 className="section-title mb-4"
            style={{ fontSize: "2.5rem" }}
            >
              ANNOUNCEMENT BOARD
            </h2>
            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            )}

            {!loading && announcements.length > 0 ? (
              announcements.map((post) => (
                <div key={post.id} className="about-box-frame post-card-hover mb-4">
                  <div className="about-box-topline"></div>

                  <div className="p-4">

                    <h3
                      className="fw-bold mb-2"
                      style={{
                        fontSize: "1.45rem",
                        color: HEADER_BLUE,
                        textTransform: "uppercase",
                      }}
                    >
                      <Link
                        to={`/news/view/${post.id}`}
                        style={{ textDecoration: "none", color: HEADER_BLUE }}
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p
                      style={{
                        color: "#444",
                        fontSize: "1.05rem",
                        marginBottom: "8px",
                      }}
                    >
                      {post.content}
                    </p>

                    <small className="text-muted">
                      Posted on {formatDate(post.posted_at)}
                    </small>

                    {isAdmin && (
                      <div
                        className="d-flex justify-content-end gap-2 mt-3"
                      >
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          as={Link}
                          to={`/news/edit/${post.id}`}
                          style={{
                            padding: "6px 16px",
                            fontWeight: "600",
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="delete-btn"
                          style={{ backgroundColor: ACCENT_RED, borderColor: ACCENT_RED }}
                          onClick={() => handleShowDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              !loading && (
                <div className="text-center text-muted py-5">
                  <p className="fs-4">NO ANNOUNCEMENT POST</p>
                </div>
              )
            )}

            {/* FLOATING ADD BUTTON (ADMIN ONLY) */}
            {isAdmin && (
              <button
                className="fab-add-button"
                onClick={() => setShowCreateModal(true)}
              >
                +
              </button>
            )}
          </Col>
        </Row>
      </Container>

      <CreateAnnouncementModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onPostSuccess={handlePostSuccess}
      />

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
        <Modal.Header 
          closeButton 
          className="border-0 pb-0"
        >
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
            Are you sure you want to permanently delete this
            announcement?
          </p>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 d-flex justify-content-end gap-2">

          {/* CANCEL button */}
          <Button
            variant="secondary"
            onClick={handleCloseDelete}
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
              e.target.style.backgroundColor = "#c82333"; // deeper red
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
    </>
  );
};

export default NewsPageIndex;