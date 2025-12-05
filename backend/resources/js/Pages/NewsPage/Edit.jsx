import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const COMPANY_BLUE = "#004d99";

export default function NewsPageEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", content: "" });
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialPost, setInitialPost] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await api.get(`/announcements/${postId}`);
        const post = res.data;

        setInitialPost(post);
        setFormData({
          title: post.title,
          content: post.content,
        });

        setExistingAttachments(post.attachments || []);
      } catch (err) {
        console.error("Failed to load announcement:", err);
        setError("Announcement not found.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  useEffect(() => {
    if (!initialPost) return;

    const changed =
      formData.title !== initialPost.title ||
      formData.content !== initialPost.content ||
      newFiles.length > 0 ||
      deletedAttachments.length > 0;

    setHasChanges(changed);
  }, [formData, newFiles, deletedAttachments, initialPost]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleDeleteAttachment = (id) => {
    if (window.confirm("Delete this attachment?")) {
      setExistingAttachments(prev => prev.filter(file => file.id !== id));
      setDeletedAttachments(prev => [...prev, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!hasChanges) return;

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("content", formData.content);

      deletedAttachments.forEach(id => form.append("deleted_attachments[]", id));
      newFiles.forEach(file => form.append("attachments[]", file));

      await api.post(`/announcements/${postId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/news");

    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update announcement.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <p>Loading editor…</p>
      </Container>
    );
  }

  if (error && !initialPost) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/news" className="btn btn-secondary mt-3">
          ← Back
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
        <Row className="justify-content-center">
            <Col md={10}>

                <div className="edit-announcement-card">

                <br />

                <div className="edit-announcement-topline"></div>


                <h2 className="edit-title text-center mb-4">
                  EDIT ANNOUNCEMENT
                </h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>

                        {/* TITLE */}
                        <Form.Group className="mb-4">
                            <Form.Label>Announcement Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* CONTENT */}
                        <Form.Group className="mb-4">
                            <Form.Label>Announcement Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* EXISTING ATTACHMENTS */}
                        <Form.Group className="mb-4">
                            <Form.Label>Existing Attachments</Form.Label>

                            {existingAttachments.length > 0 ? (
                                <div className="p-3 bg-light rounded border">
                                    {existingAttachments.map(att => (
                                        <span
                                            key={att.id}
                                            className="badge bg-secondary p-2 me-2"
                                        >
                                            {att.file_name}
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-white p-0 ms-1"
                                                onClick={() => handleDeleteAttachment(att.id)}
                                            >
                                                ×
                                            </Button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted small">No attachments left.</p>
                            )}
                        </Form.Group>

                        {/* UPLOAD NEW FILES */}
                        <Form.Group className="mb-4">
                            <Form.Label>Upload New Attachments</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                        </Form.Group>

                        {/* BUTTONS */}
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => navigate("/news")}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!hasChanges}
                                style={{ backgroundColor: "#004d99", borderColor: "#004d99" }}
                            >
                                Save Changes
                            </Button>
                        </div>

                    </Form>
                </div>

            </Col>
        </Row>
    </Container>
);
}