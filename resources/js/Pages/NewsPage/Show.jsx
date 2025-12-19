import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Image, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

const HEADER_BLUE = "#002C82";

// Date formatter
const formatDate = (dateString) => {
  if (!dateString) return "(Unknown date)";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const NewsPageShow = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPost = async () => {
    try {
      const res = await api.get(`/announcements/${postId}`);
      setPost(res.data);
    } catch (err) {
      console.error("Failed to load announcement:", err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPost(); }, [postId]);

  if (loading) {
    return (
      <Container className="mt-5">
        <p>Loading announcement…</p>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Announcement with ID {postId} not found.
        </Alert>
        <Link to="/news" className="btn btn-primary" style={{ backgroundColor: HEADER_BLUE }}>
          ← Back to Announcements
        </Link>
      </Container>
    );
  }

  const attachments = Array.isArray(post.attachments) ? post.attachments : [];

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={10}>

          <div className="about-box-frame">
            <div className="about-box-topline"></div>

            <div className="p-4">

              <h2 className="details-title">ANNOUNCEMENT DETAILS</h2>

              <h3
                className="fw-bold"
                style={{
                  color: HEADER_BLUE,
                  fontSize: "1.65rem",
                  textTransform: "uppercase",
                  marginBottom: "15px"
                }}
              >
                {post.title}
              </h3>

              <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>
                Posted on {formatDate(post.posted_at)}
              </p>

              <p
                style={{
                  fontSize: "1.15rem",
                  lineHeight: "1.85",
                  whiteSpace: "pre-wrap",
                  marginBottom: "20px"
                }}
              >
                {post.content}
              </p>

              {/* ATTACHMENTS */}
              {attachments.length > 0 && (
                <div className="mt-4">
                  <h5 className="fw-bold" style={{ color: HEADER_BLUE }}>
                    Attachments
                  </h5>

                  {attachments.map((file) => (
                    <div key={file.id} className="mb-3">

                      {/* IMAGE PREVIEW */}
                      {file.mime_type?.startsWith("image/") ? (
                        <>
                          <Image
                            src={file.url}
                            alt={file.file_name}
                            fluid
                            className="rounded shadow-sm mb-2"
                            style={{ maxHeight: "400px" }}
                          />

                          <a
                            href={file.url}
                            download={file.file_name}
                            className="text-primary small d-block mt-1"
                            style={{ fontStyle: "italic" }}
                          >
                            Download image ({file.file_name})
                          </a>
                        </>
                      ) : (
                        <Alert
                          variant="light"
                          className="d-inline-flex align-items-center p-2 shadow-sm"
                        >
                          <span className="me-2 text-primary">📄</span>
                          <a
                            href={file.url}
                            download={file.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-underline"
                          >
                            {file.file_name}
                          </a>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Link to="/news" className="btn btn-secondary">
                  ← Back to Announcement Board
                </Link>
              </div>

            </div>
          </div>

        </Col>
      </Row>
    </Container>
  );
};

export default NewsPageShow;
