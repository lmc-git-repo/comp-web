
import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const MAIN_IMAGE_SRC = '/images/bg.JPG';
const CSR_IMAGE_SRC = '/images/corporate social responsibility FINAL.png';
const GOV_IMAGE_SRC = '/images/corporate governance.png';
const TIMELINE_IMAGE_SRC = '/images/history timeline.png';

const NAVBAR_BLUE = '#002C82';

const ABOUT_TRANSLATIONS = {
    en: {
        overviewTitle: "COMPANY OVERVIEW",
        overviewText: `We are a growing Japanese multinational company with
            operation in several locations around the globe. We
            cater Global customer in the automotive parts
            industry. Our Motivation is to succeed in the Light
            Metal Industry business and is driven to succeed and
            champion the automotive parts components
            manufacturing using Aluminum Die casting technology.`,

        philosophyTitle: "CORPORATE PHILOSOPHY",
        philosophyText: `Our Company believes that customer satisfaction is
            the foremost consideration and ultimate measure of
            the company's success. The company is guided by its
            philosophy of providing materials for mankind through
            engineering excellence, modern technology, and
            teamwork built on mutual trust.`,

        csrTitle: "CORPORATE SOCIAL RESPONSIBILITY",
        governanceTitle: "CORPORATE GOVERNANCE"
    },

    ja: {
        overviewTitle: "会社概要",
        overviewText: `当社は、世界各地に事業拠点を展開する成長中の日系多国籍企業です。
            自動車部品業界のグローバルなお客様に製品を提供しています。
            軽金属事業における成功を目指し、アルミニウムダイカスト技術を活用した
            自動車部品の製造において、さらなる発展と技術力の向上に取り組んでいます。`,

        philosophyTitle: "企業理念",
        philosophyText: `当社は、お客様の満足を最も重要な事項と考え、
            企業の成功を測る究極の基準であると信じています。
            卓越した技術、最新のテクノロジー、そして相互の信頼に基づく
            チームワークを通じて、人々の暮らしに役立つ素材を提供するという
            理念のもとで事業を展開しています。`,

        csrTitle: "企業の社会的責任",
        governanceTitle: "コーポレートガバナンス"
    }
};

const AboutPage = ({ language = "en" }) => {
    const t = ABOUT_TRANSLATIONS[language] || ABOUT_TRANSLATIONS.en;

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
                            {t.overviewTitle}
                        </h4>
                        <p className="about-text">
                            {t.overviewText}
                        </p>
                    </Col>

                    <Col md={6}>
                        <h4 className="about-section-title">
                            {t.philosophyTitle}
                        </h4>
                        <p className="about-text">
                            {t.philosophyText}
                        </p>
                    </Col>
                </Row>

                {/* CSR BOX */}
                <Row className="about-section text-center">
                    <Col lg={12}>
                        <div className="about-box-frame">
                            <div className="about-box-topline"></div>
                            <div className="about-box-title">
                                {t.csrTitle}
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
                                {t.governanceTitle}
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
            </Container>
        </div>
    );
};

export default AboutPage;