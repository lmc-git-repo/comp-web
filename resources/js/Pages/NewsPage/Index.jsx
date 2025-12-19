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

  const [searchTerm, setSearchTerm] = useState("");

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

  // ✅ FIX: RELOAD DATA AFTER CREATE
  const handlePostSuccess = () => {
    loadAnnouncements();
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
      loadAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }

    handleCloseDelete();
  };

  const filteredAnnouncements = announcements.filter((post) => {
    const search = (searchTerm || "").toLowerCase();
    const title = (post.title || "").toLowerCase();
    const content = (post.content || "").toLowerCase();

    return title.includes(search) || content.includes(search);
  });

  return (
    <>
      <Container className="mt-5 mb-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 className="section-title mb-4" style={{ fontSize: "2.5rem" }}>
              ANNOUNCEMENT BOARD
            </h2>

            <div className="d-flex justify-content-center mb-4">
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{
                  maxWidth: "400px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccd",
                  fontSize: "1rem",
                }}
              />
            </div>

            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            )}

            {!loading && filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((post) => (
                <div
                  key={post.id}
                  className="about-box-frame post-card-hover mb-4"
                >
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
                        style={{
                          textDecoration: "none",
                          color: HEADER_BLUE,
                        }}
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
                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          as={Link}
                          to={`/news/edit/${post.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleShowDelete(post.id)}
                          style={{
                            backgroundColor: ACCENT_RED,
                            borderColor: ACCENT_RED,
                          }}
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

      <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this announcement?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete Permanently
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewsPageIndex;