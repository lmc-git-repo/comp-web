import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

const SLIDESHOW_IMAGES = [
    "/images/bg.JPG",
    "/images/bg2.png",
    "/images/bg1.png"
];

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
        <Container fluid className="p-0">

            {/* SLIDESHOW */}
            <Row className="mx-0">
                <Col xs={12} className="p-0">
                    <Carousel controls={false} indicators={false} interval={2500} fade>
                        {SLIDESHOW_IMAGES.map((img, index) => (
                            <Carousel.Item key={index}>
                                <div className="home-hero-image-wrapper">
                                    <img
                                        src={img}
                                        alt="LMC slideshow"
                                        className={`home-hero-image slide-${index + 1}`}
                                    />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
            </Row>

            {/* CONTENT */}
            <div style={{ backgroundColor: "white", padding: "40px 0 60px" }}>
                <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 20px" }}>

                    {/* COMPANY NEWS UPDATE */}
                    <div className="home-news-wrapper">
                        <Row className="justify-content-center">
                            <Col md={10} className="text-center">
                                <h2 className="news-title">COMPANY NEWS UPDATE</h2>

                                {loading && <p className="text-muted">Loading latest news…</p>}
                                {!loading && !latestPost && <p className="text-muted">No announcements available.</p>}

                                {!loading && latestPost && (
                                    <>
                                        <h3 className="fw-bold news-article-title">
                                            {latestPost.title}
                                        </h3>
                                        <p className="news-subtitle">
                                            Posted on {formatDate(latestPost.posted_at)}
                                        </p>
                                        <p className="news-excerpt">
                                            {getExcerpt(latestPost.content)}
                                        </p>
                                        <Link
                                            to={`/news/view/${latestPost.id}`}
                                            className="news-readmore"
                                        >
                                            [Read more →]
                                        </Link>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </div>

                    {/* CORPORATE POLICY & VISION */}
                    <Row className="justify-content-center mt-4 mb-4">
                        <Col md={10}>
                            <div className="about-box-frame">
                                <div className="about-box-topline"></div>
                                <div className="about-box-title">CORPORATE POLICY & VISION</div>

                                {[
                                    ["1.", "Be a leader of light alloy technology and become a company that global customer always wanted to exist."],
                                    ["A.", "Always stay as an advanced company in fields of light alloy business"],
                                    ["B.", "Become a collaborative partner that can propose value anywhere, anytime"],
                                    ["C.", "Become a global company that is strong and flexible against changes of environment"],
                                    ["2.", "Be a corporate group that constantly makes associates feel being proud and confident to be with the team"],
                                    ["A.", "Achieve an environment friendly workplace that is comfortable to associate better than other in the casting industry."],
                                    ["B.", 'Share the joy of making "only-one products" in such an environment that is created by associates themselves'],
                                    ["C.", "Be a group known across the globe and proactive in any challenge by respecting individual motivation."]
                                ].map(([label, text], i) => (
                                    <div className="company-row" key={i}>
                                        <span className="company-label">{label}</span>
                                        <span className="company-text">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>

                    {/* CORPORATE VALUES */}
                    <Row className="justify-content-center mb-4">
                        <Col md={10}>
                            <div className="about-box-frame">
                                <div className="about-box-topline"></div>
                                <div className="about-box-title">CORPORATE VALUES</div>

                                <div className="company-row">
                                    <div className="company-label">Customer Satisfaction</div>
                                    <div className="company-text">
                                        Deliver products and services that meet the requirements of internal
                                        and external customers by putting the value of our customers as our
                                        number one priority.
                                    </div>
                                </div>

                                <div className="company-row">
                                    <div className="company-label">Teamwork</div>
                                    <div className="company-text">
                                        Working together harmoniously to achieve beyond our common goal.
                                    </div>
                                </div>

                                <div className="company-row">
                                    <div className="company-label">Quality</div>
                                    <div className="company-text">
                                        Give the best effort to achieve excellent results by doing the right thing which make it a habit.
                                    </div>
                                </div>

                                <div className="company-row">
                                    <div className="company-label">Professionalism</div>
                                    <div className="company-text">
                                        Act in accordance with our corporate governance and globally acceptable work ethics.
                                    </div>
                                </div>

                                <div className="company-row">
                                    <div className="company-label">Constant Improvement</div>
                                    <div className="company-text">
                                        Continuously making efficient work improvement.
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </div>

                <div className="home-divider"></div>
            </div>
        </Container>
    );
};

export default HomePage;