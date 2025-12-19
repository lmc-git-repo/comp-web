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

      selectedFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("attachments[]", file);
        }
      });

      const res = await api.post("/announcements", formData);

      // ✅ FIX: USE ACTUAL ANNOUNCEMENT OBJECT
      onPostSuccess(res.data.data);

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
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="post-announcement-modal"
    >
      <div className="post-announcement-wrapper">
        <div className="edit-announcement-card">
          <div className="edit-announcement-topline"></div>

          <h2 className="edit-title">POST ANNOUNCEMENT</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Announcement Title</Form.Label>
              <Form.Control
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                disabled={loading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
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

            <Form.Group className="mb-4">
              <Form.Label>Upload New Attachments</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                disabled={loading}
              />
            </Form.Group>

            <div className="edit-buttons-row d-flex justify-content-between">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: COMPANY_BLUE,
                  borderColor: COMPANY_BLUE,
                }}
              >
                {loading ? "Processing..." : "Save"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
}