import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

const SLIDESHOW_IMAGES = [
    "/images/bg.JPG",
    "/images/bg2.jpg",
    "/images/bg3.JPG"
];

const VISION_IMAGE_SRC = "/images/Metts Group 2030 Vision.png";
const VALUES_IMAGE_SRC = "/images/corporate values.png";

const NAVBAR_BLUE = "#002C82";

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(dateString));
};

const HomePage = () => {
    const [latestPost, setLatestPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadLatestPost = async () => {
        try {
            const res = await api.get("/announcements");
            if (res.data?.length > 0) {
                setLatestPost(res.data[0]);
            }
        } catch (err) {
            console.error("Failed to load announcements:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLatestPost();
    }, []);

    const getExcerpt = (text) => {
        if (!text) return "";
        return text.length <= 150 ? text : text.substring(0, 150) + "...";
    };

    return (
        <Container fluid className="mt-0 mb-0 p-0">

            {/* SLIDESHOW */}
            <Row className="mx-0 px-0">
                <Col xs={12} className="p-0">
                    <Carousel
                        controls={false}
                        indicators={false}
                        interval={2500}
                        fade
                        className="home-hero-carousel"
                    >
                        {SLIDESHOW_IMAGES.map((img, index) => (
                            <Carousel.Item key={index}>
                                <div className="home-hero-image-wrapper">
                                    <img
                                        src={img}
                                        loading="lazy"
                                        alt="LMC slideshow"
                                        className={`home-hero-image slide-${index + 1}`}
                                    />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
            </Row>

            {/* CONTENT AREA */}
            <div style={{ width: "100%", backgroundColor: "white", paddingTop: "40px", paddingBottom: "60px" }}>
                <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 20px" }}>

                    {/* CORPORATE POLICY & VISION */}
                    <Row className="justify-content-center mt-4 mb-4">
                        <Col md={10}>
                            <div className="about-box-frame text-center">
                                <div className="about-box-topline"></div>
                                <div className="about-box-title">CORPORATE POLICY & VISION</div>
                                <img
                                    src={VISION_IMAGE_SRC}
                                    loading="lazy"
                                    alt="Corporate Vision"
                                    className="about-box-image"
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* CORPORATE VALUES */}
                    <Row className="justify-content-center mb-4">
                        <Col md={10}>
                            <div className="about-box-frame text-center">
                                <div className="about-box-topline"></div>
                                <div className="about-box-title">CORPORATE VALUES</div>
                                <img
                                    src={VALUES_IMAGE_SRC}
                                    loading="lazy"
                                    alt="Corporate Values"
                                    className="about-box-image"
                                />
                            </div>
                        </Col>
                    </Row>

                </div>

                {/* DIVIDER */}
                <div className="home-divider"></div>

                {/* NEWS */}
                <div className="home-news-wrapper" style={{ maxWidth: "1500px", margin: "0 auto" }}>
                    <Row className="justify-content-center">
                        <Col md={10} className="text-center">

                            <h2 className="news-title">COMPANY NEWS UPDATE</h2>

                            {loading && <p className="text-muted">Loading latest news…</p>}
                            {!loading && !latestPost && <p className="text-muted">No announcements available.</p>}

                            {!loading && latestPost && (
                                <>
                                    <h3 className="fw-bold news-article-title" style={{ color: "#000" }}>
                                        {latestPost.title}
                                    </h3>

                                    <p className="news-subtitle">
                                        Posted on {formatDate(latestPost.posted_at)}
                                    </p>

                                    <p className="news-excerpt">{getExcerpt(latestPost.content)}</p>

                                    <Link
                                        to={`/news/view/${latestPost.id}`}
                                        className="news-readmore"
                                        style={{ fontStyle: "italic" }}
                                    >
                                        [Read more →]
                                    </Link>
                                </>
                            )}
                        </Col>
                    </Row>
                </div>

            </div>

        </Container>
    );
};

export default HomePage;