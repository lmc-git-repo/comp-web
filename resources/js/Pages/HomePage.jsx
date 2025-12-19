import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

const SLIDESHOW_IMAGES = [
    "/images/bg.JPG",
    "/images/bg2.JPG",
    "/images/bg3.JPG"
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
        <Container fluid className="mt-0 mb-0 p-0">

            {/* SLIDESHOW */}
            <Row className="mx-0 px-0">
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
            <div style={{ backgroundColor: "white", paddingTop: "40px", paddingBottom: "60px" }}>
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

                                <p className="company-paragraph">
                                    <strong>1.</strong>
                                    Be a leader of light alloy technology and become a company that global
                                    customers always want to exist.
                                </p>

                                <p className="company-paragraph">
                                    <strong>1.1</strong>
                                    Always stay as an advanced company in fields of light alloy business.
                                </p>

                                <p className="company-paragraph">
                                    <strong>1.2</strong>
                                    Become a collaborative partner that can propose value anywhere, anytime.
                                </p>

                                <p className="company-paragraph">
                                    <strong>1.3</strong>
                                    Become a global company that is strong and flexible against changes of environment.
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* CORPORATE VALUES */}
                    <Row className="justify-content-center mb-4">
                        <Col md={10}>
                            <div className="about-box-frame">
                                <div className="about-box-topline"></div>
                                <div className="about-box-title">CORPORATE VALUES</div>

                                <p className="company-paragraph">
                                    <strong>Customer Satisfaction</strong>
                                    Deliver products and services that meet the requirements of internal
                                    and external customers by putting customer value first.
                                </p>

                                <p className="company-paragraph">
                                    <strong>Teamwork</strong>
                                    Working together harmoniously to achieve beyond our common goal.
                                </p>

                                <p className="company-paragraph">
                                    <strong>Quality</strong>
                                    Give the best effort to achieve excellent results by doing the right thing.
                                </p>

                                <p className="company-paragraph">
                                    <strong>Professionalism</strong>
                                    Act in accordance with corporate governance and globally acceptable work ethics.
                                </p>

                                <p className="company-paragraph">
                                    <strong>Constant Improvement</strong>
                                    Continuously making efficient work improvement.
                                </p>
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