import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import api from "../../api/axios";

const COMPANY_BLUE = "#004d99";

export default function CreateAnnouncementModal({
  show,
  handleClose,
  onPostSuccess,
}) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!postTitle.trim() || !postContent.trim()) {
      setError("Both title and content are required.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", postTitle);
      formData.append("content", postContent);

      // ✅ MUST MATCH BACKEND: attachments[]
      selectedFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("attachments[]", file);
        }
      });

      const res = await api.post("/announcements", formData);

      onPostSuccess(res.data);

      setPostTitle("");
      setPostContent("");
      setSelectedFiles([]);
      handleClose();
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please check file size or type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Body>
        <h4 className="mb-4 text-center">Post Announcement</h4>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Announcement Title</Form.Label>
            <Form.Control
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Announcement Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Photos / PDF (optional)</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              disabled={loading}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: COMPANY_BLUE, borderColor: COMPANY_BLUE }}
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}