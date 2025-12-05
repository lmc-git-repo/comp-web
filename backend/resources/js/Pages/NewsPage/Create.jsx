import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import api from "../../api/axios";

const COMPANY_BLUE = "#004d99";

export default function CreateAnnouncementModal({ show, handleClose, onPostSuccess }) {

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
        formData.append("attachments[]", file);
      });

      const res = await api.post("/announcements", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPostSuccess(res.data);

      setPostTitle("");
      setPostContent("");
      setSelectedFiles([]);
      handleClose();

    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please check API route or file size.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="post-announcement-wrapper"
  >
      <Modal.Body className="p-0">     {/* REMOVE ALL MODAL PADDING */}
          
          {/* FULL WHITE CARD (MATCH EDIT ANNOUNCEMENT) */}
          <div className="edit-announcement-card">

              {/* BLUE TOP LINE */}
              <div className="edit-announcement-topline"></div>

              <br />

              {/* TITLE */}
              <h2 className="edit-title text-center">POST ANNOUNCEMENT</h2>

              {/* INNER FORM BODY WITH PROPER PADDING */}
              <div className="post-announcement-inner">

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>

                      {/* TITLE FIELD */}
                      <Form.Group className="mb-4">
                          <Form.Label className="form-label">Announcement Title</Form.Label>
                          <Form.Control
                              type="text"
                              value={postTitle}
                              onChange={(e) => setPostTitle(e.target.value)}
                              required
                              disabled={loading}
                          />
                      </Form.Group>

                      {/* CONTENT FIELD */}
                      <Form.Group className="mb-4">
                          <Form.Label className="form-label">Announcement Content</Form.Label>
                          <Form.Control
                              as="textarea"
                              rows={8}
                              value={postContent}
                              onChange={(e) => setPostContent(e.target.value)}
                              required
                              disabled={loading}
                          />
                      </Form.Group>

                      {/* FILES */}
                      <Form.Group className="mb-4">
                          <Form.Label className="form-label">
                              Upload Photos / PDF (optional)
                          </Form.Label>
                          <Form.Control
                              type="file"
                              multiple
                              accept="image/*,application/pdf"
                              onChange={handleFileChange}
                              disabled={loading}
                          />
                      </Form.Group>

                      {/* BUTTON ROW */}
                      <div className="d-flex justify-content-end gap-3 edit-buttons-row mt-2">
                          <Button
                              variant="secondary"
                              onClick={handleClose}
                              disabled={loading}
                          >
                              Cancel
                          </Button>

                          <Button
                              variant="primary"
                              type="submit"
                              disabled={loading}
                              style={{
                                  backgroundColor: COMPANY_BLUE,
                                  borderColor: COMPANY_BLUE,
                              }}
                          >
                              {loading ? "Processing..." : "Submit"}
                          </Button>
                      </div>

                  </Form>

              </div> {/* end inner */}

          </div> {/* end full card */}

      </Modal.Body>
  </Modal>
);
}