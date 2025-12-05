import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const MAIN_IMAGE_SRC = '/images/bg.JPG';
const CSR_IMAGE_SRC = '/images/corporate social responsibility.png';
const GOV_IMAGE_SRC = '/images/corporate governance.png';
const TIMELINE_IMAGE_SRC = '/images/history timeline.png';

const NAVBAR_BLUE = '#002C82';

const AboutPage = () => {
    return (
        <div className="about-page-wrapper">

            {/* HERO IMAGE ONLY */}
            <div className="about-hero-wrapper">
                <img
                    src={MAIN_IMAGE_SRC}
                    loading="lazy"
                    alt="Laguna Metts Corporation main signage"
                    className="about-hero-image"
                />
                <div className="about-hero-overlay" />
            </div>

            <Container className="about-inner-container">

                {/* OVERVIEW + PHILOSOPHY */}
                <Row className="about-section align-items-start">
                    <Col md={6} className="mb-4 mb-md-0">
                        <h4 className="about-section-title">
                            COMPANY OVERVIEW
                        </h4>
                        <p className="about-text">
                            We are a growing Japanese multinational company with
                            operation in several locations around the globe. We
                            cater Global customer in the automotive parts
                            industry. Our Motivation is to succeed in the Light
                            Metal Industry business and is driven to succeed and
                            champion the automotive parts components
                            manufacturing using Aluminum Die casting technology.
                        </p>
                    </Col>

                    <Col md={6}>
                        <h4 className="about-section-title">
                            CORPORATE PHILOSOPHY
                        </h4>
                        <p className="about-text">
                            Our Company believes that customer satisfaction is
                            the foremost consideration and ultimate measure of
                            the company's success. The company is guided by its
                            philosophy of providing materials for mankind through
                            engineering excellence, modern technology, and
                            teamwork built on mutual trust.
                        </p>
                    </Col>
                </Row>

                {/* CSR BOX */}
                <Row className="about-section text-center">
                    <Col lg={12}>
                        <div className="about-box-frame">
                            <div className="about-box-topline"></div>
                            <div className="about-box-title">
                                CORPORATE SOCIAL RESPONSIBILITY
                            </div>
                            <img
                                src={CSR_IMAGE_SRC}
                                loading="lazy"
                                alt="CSR"
                                className="about-box-image"
                            />
                        </div>
                    </Col>
                </Row>

                {/* GOVERNANCE BOX */}
                <Row className="about-section text-center">
                    <Col lg={12}>
                        <div className="about-box-frame">
                            <div className="about-box-topline"></div>
                            <div className="about-box-title">
                                CORPORATE GOVERNANCE
                            </div>
                            <img
                                src={GOV_IMAGE_SRC}
                                loading="lazy"
                                alt="Corporate Governance"
                                className="about-box-image"
                            />
                        </div>
                    </Col>
                </Row>

                {/* TIMELINE BOX */}
                <Row className="about-section text-center mb-5">
                    <Col lg={12}>
                        <div className="about-box-frame">
                            <div className="about-box-topline"></div>
                            <div className="about-box-title">
                                HISTORY TIMELINES
                            </div>
                            <img
                                src={TIMELINE_IMAGE_SRC}
                                loading="lazy"
                                alt="History Timeline"
                                className="about-box-image"
                            />
                        </div>
                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default AboutPage;