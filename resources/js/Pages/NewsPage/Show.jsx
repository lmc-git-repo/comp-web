
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Image,
  Button,
  Modal
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

const HEADER_BLUE = "#002C82";

// Date formatter
const formatDate = (dateString, language = "en") => {
  if (!dateString) return language === "ja" ? "日付不明" : "(Unknown date)";
  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const NewsPageShow = ({ language = "en" }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("user_role");
  const isAdmin = role === "admin" || role === "super admin";
  const isJapanese = !isAdmin && language === "ja";

  // IMAGE GALLERY STATE
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const loadPost = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/announcements/${postId}`, {
        params: isJapanese ? { lang: "ja" } : {}
      });

      setPost(res.data);
    } catch (err) {
      console.error("Failed to load announcement:", err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [postId, isJapanese]);

  const attachments = Array.isArray(post?.attachments)
    ? post.attachments
    : [];

  const imageAttachments = attachments.filter((file) =>
    file.mime_type?.startsWith("image/")
  );

  const fileAttachments = attachments.filter(
    (file) => !file.mime_type?.startsWith("image/")
  );

  const openImageGallery = (index) => {
    setActiveImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageGallery = () => {
    setShowImageModal(false);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      (currentIndex - 1 + imageAttachments.length) % imageAttachments.length
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      (currentIndex + 1) % imageAttachments.length
    );
  };

  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && imageAttachments.length > 1) {
        setActiveImageIndex((currentIndex) =>
          (currentIndex - 1 + imageAttachments.length) % imageAttachments.length
        );
      }

      if (event.key === "ArrowRight" && imageAttachments.length > 1) {
        setActiveImageIndex((currentIndex) =>
          (currentIndex + 1) % imageAttachments.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showImageModal, imageAttachments.length]);

  const activeImage = imageAttachments[activeImageIndex];

  if (loading) {
    return (
      <Container className="mt-5">
        <p>{isJapanese ? "お知らせを読み込み中…" : "Loading announcement…"}</p>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          {isJapanese
            ? `お知らせ（ID: ${postId}）が見つかりません。`
            : `Announcement with ID ${postId} not found.`}
        </Alert>
        <Link
          to="/news"
          className="btn btn-primary"
          style={{ backgroundColor: HEADER_BLUE }}
        >
          {isJapanese ? "← お知らせ一覧に戻る" : "← Back to Announcements"}
        </Link>
      </Container>
    );
  }

  const backPath = post.category === "disaster_risk"
    ? "/news/disaster-risk"
    : "/news";

  return (
    <>
      <Container className="mt-5 mb-5">
        <Row className="justify-content-center">
          <Col md={10}>

            <div className="about-box-frame">
              <div className="about-box-topline"></div>

              <div className="p-4 news-details-content">

                <h2 className="details-title news-details-title">
                  {isJapanese ? "お知らせの詳細" : "ANNOUNCEMENT DETAILS"}
                </h2>

                <h3
                  className="fw-bold news-details-post-title"
                  style={{
                    color: HEADER_BLUE,
                    fontSize: "1.65rem",
                    textTransform: "uppercase",
                    marginBottom: "15px"
                  }}
                >
                  {post.title}
                </h3>

                <p
                  className="text-muted mb-4 news-details-date"
                  style={{ fontSize: "1rem" }}
                >
                  {isJapanese ? "掲載日：" : "Posted on "}
                  {formatDate(post.posted_at, isJapanese ? "ja" : "en")}
                </p>

                <p
                  className="news-details-body"
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
                  <div className="mt-4 news-details-attachments">

                    <h5
                      className="fw-bold"
                      style={{ color: HEADER_BLUE }}
                    >
                      {isJapanese ? "添付ファイル" : "Attachments"}
                    </h5>

                    {/* FACEBOOK-STYLE IMAGE GALLERY */}
                    {imageAttachments.length > 0 && (
                      <div className="mt-3 mb-4">

                        <div
                          className={`news-photo-gallery ${
                            imageAttachments.length === 1
                              ? "gallery-one"
                              : imageAttachments.length === 2
                              ? "gallery-two"
                              : imageAttachments.length === 3
                              ? "gallery-three"
                              : "gallery-four"
                          }`}
                        >
                          {imageAttachments.slice(0, 4).map((file, index) => (
                            <button
                              key={file.id}
                              type="button"
                              className={`news-photo-item news-photo-item-${index + 1}`}
                              onClick={() => openImageGallery(index)}
                              aria-label={
                                isJapanese
                                  ? `画像 ${index + 1} を表示`
                                  : `View image ${index + 1}`
                              }
                            >
                              <Image
                                src={file.url}
                                alt={file.file_name}
                                className="news-photo-image"
                              />

                              {index === 3 && imageAttachments.length > 4 && (
                                <span className="news-photo-more-overlay">
                                  +{imageAttachments.length - 4}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                        <small className="text-muted fst-italic d-block mt-2">
                          {isJapanese
                            ? "画像をクリックすると拡大できます"
                            : "Click image to zoom"}
                        </small>

                      </div>
                    )}

                    {/* OTHER FILE ATTACHMENTS */}
                    {fileAttachments.map((file) => (
                      <div key={file.id} className="mb-3">
                        <Alert
                          variant="light"
                          className="d-inline-flex align-items-center p-2 shadow-sm news-details-file-alert"
                        >
                          <span className="me-2 text-primary">📄</span>

                          <a
                            href={file.url}
                            download={file.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-underline news-details-file-link"
                          >
                            {file.file_name}
                          </a>
                        </Alert>
                      </div>
                    ))}

                  </div>
                )}

                <div className="mt-4 news-details-back-btn-wrap">
                  <Link
                    to={backPath}
                    className="btn btn-secondary news-details-back-btn"
                  >
                    {isJapanese
                      ? "← お知らせ一覧に戻る"
                      : "← Back to Announcement Board"}
                  </Link>
                </div>

              </div>
            </div>

          </Col>
        </Row>
      </Container>

      {/* IMAGE GALLERY MODAL */}
      <Modal
        show={showImageModal}
        onHide={closeImageGallery}
        centered
        size="xl"
        backdrop="static"
        className="image-zoom-modal news-gallery-modal"
      >
        <Modal.Body className="p-0 bg-dark text-center">

          {activeImage && (
            <div className="news-gallery-viewer">

              {/* CLOSE BUTTON */}
              <button
                type="button"
                className="news-gallery-close"
                onClick={closeImageGallery}
                aria-label={isJapanese ? "閉じる" : "Close"}
              >
                ×
              </button>

              {/* PHOTO COUNTER */}
              <div className="news-gallery-counter">
                {activeImageIndex + 1} / {imageAttachments.length}
              </div>

              {/* PREVIOUS IMAGE */}
              {imageAttachments.length > 1 && (
                <button
                  type="button"
                  className="news-gallery-arrow news-gallery-prev"
                  onClick={showPreviousImage}
                  aria-label={isJapanese ? "前の画像" : "Previous image"}
                >
                  ‹
                </button>
              )}

              {/* ACTIVE IMAGE */}
              <Image
                src={activeImage.url}
                alt={activeImage.file_name}
                fluid
                className="news-gallery-active-image"
              />

              {/* NEXT IMAGE */}
              {imageAttachments.length > 1 && (
                <button
                  type="button"
                  className="news-gallery-arrow news-gallery-next"
                  onClick={showNextImage}
                  aria-label={isJapanese ? "次の画像" : "Next image"}
                >
                  ›
                </button>
              )}

              {/* DOWNLOAD IMAGE */}
              <div className="news-gallery-bottom">
                <a
                  href={activeImage.url}
                  download={activeImage.file_name}
                  className="news-gallery-download"
                >
                  {isJapanese
                    ? `画像をダウンロード (${activeImage.file_name})`
                    : `Download image (${activeImage.file_name})`}
                </a>
              </div>

            </div>
          )}

        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewsPageShow;