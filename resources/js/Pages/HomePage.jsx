
import React, { useEffect, useState } from "react";

import { Container, Row, Col, Carousel } from "react-bootstrap";

import { Link } from "react-router-dom";

import api from "../api/axios";

const SLIDESHOW_IMAGES = [
    "/images/bg.JPG",
    "/images/bg2.png",
    "/images/bg1.png"
];

const formatDate = (dateString, language = "en") => {
    if (!dateString) return "";

    return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(dateString));
};

const HOME_TRANSLATIONS = {
    en: {
        latestAnnouncements: "LATEST ANNOUNCEMENTS",
        companyNews: "COMPANY NEWS",
        advisoryBulletin: "ADVISORY BULLETIN",
        loading: "Loading latest update…",
        postedOn: "Posted on",
        readMore: "Read more →",
        noAnnouncements: "No announcements available.",
        viewUpdates: "View updates →",

        policyTitle: "CORPORATE POLICY & VISION",
        policySubtitle: "Building a top-class brand image in the industry",
        policies: [
            ["1.", "Be a leader of light alloy technology and become a company that global customer always wanted to exist."],
            ["A.", "Always stay as an advanced company in fields of light alloy business."],
            ["B.", "Become a collaborative partner that can propose value anywhere, anytime."],
            ["C.", "Become a global company that is strong and flexible against changes of environment."],
            ["2.", "Be a corporate group that constantly makes associates feel being proud and confident to be with the team."],
            ["A.", "Achieve an environment friendly workplace that is comfortable to associate better than other in the casting industry."],
            ["B.", 'Share the joy of making of "only-one products" in such an environment that is created by associates themselves.'],
            ["C.", "Be a group known across the globe and proactive in any challenge by respecting individual motivation."]
        ],

        valuesTitle: "CORPORATE VALUES",
        values: [
            {
                letter: "M",
                title: "Make Safety Our Priority",
                description: "Protect everyone by following safety rules, identifying risks, and preventing accidents."
            },
            {
                letter: "E",
                title: "Excellence in QCD",
                description: "Deliver quality products that meet customer satisfaction and take responsibility for our work."
            },
            {
                letter: "T",
                title: "Teamwork for Success",
                description: "Work together in a collaborative and supportive environment to achieve our goals as one team."
            },
            {
                letter: "T",
                title: "Trust Through Professionalism",
                description: "Act with integrity, discipline, respect, and accountability for our actions."
            },
            {
                letter: "S",
                title: "Strive to Evolve",
                description: "Continuously seek new ideas and better ways of working by learning from mistakes and challenges."
            }
        ]
    },

    ja: {
        latestAnnouncements: "最新のお知らせ",
        companyNews: "会社ニュース",
        advisoryBulletin: "防災・緊急情報",
        loading: "最新情報を読み込み中…",
        postedOn: "掲載日：",
        readMore: "続きを読む →",
        noAnnouncements: "現在、お知らせはありません。",
        viewUpdates: "お知らせを見る →",

        policyTitle: "経営方針・ビジョン",
        policySubtitle: "業界における一流のブランドイメージの構築",
        policies: [
            ["1.", "軽合金技術のリーダーとなり、世界中のお客様から必要とされ続ける企業を目指します。"],
            ["A.", "軽合金事業の分野において、常に先進的な企業であり続けます。"],
            ["B.", "いつでも、どこでも価値を提案できる協力的なパートナーとなります。"],
            ["C.", "環境の変化に強く、柔軟に対応できるグローバル企業を目指します。"],
            ["2.", "従業員が常に誇りと自信を持って働ける企業グループを目指します。"],
            ["A.", "鋳造業界の中でも、従業員にとって快適で環境に配慮した職場を実現します。"],
            ["B.", "従業員自らが築く職場環境の中で、「オンリーワン製品」を生み出す喜びを共有します。"],
            ["C.", "一人ひとりの意欲を尊重し、あらゆる課題に積極的に挑戦する、世界に知られる企業グループを目指します。"]
        ],

        valuesTitle: "企業価値観",
        values: [
            {
                letter: "M",
                title: "安全を最優先に",
                description: "安全ルールを守り、リスクを把握し、事故を防止することで、すべての人の安全を守ります。"
            },
            {
                letter: "E",
                title: "QCDの卓越性",
                description: "お客様の満足につながる高品質な製品を提供し、自らの仕事に責任を持ちます。"
            },
            {
                letter: "T",
                title: "成功に向けたチームワーク",
                description: "互いに協力し、支え合う職場環境の中で、一つのチームとして目標達成を目指します。"
            },
            {
                letter: "T",
                title: "プロ意識による信頼",
                description: "誠実さ、規律、敬意、責任感を持って行動します。"
            },
            {
                letter: "S",
                title: "進化への挑戦",
                description: "失敗や課題から学び、新しい発想やより良い仕事の進め方を継続的に追求します。"
            }
        ]
    }
};

const HomePage = ({ language = "en" }) => {
    const [latestCompanyPost, setLatestCompanyPost] = useState(null);
    const [latestDisasterPost, setLatestDisasterPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const t = HOME_TRANSLATIONS[language] || HOME_TRANSLATIONS.en;

    const loadLatestPost = async () => {
        setLoading(true);

        try {
            const res = await api.get("/announcements", {
                params: language === "ja" ? { lang: "ja" } : {}
            });

            const announcements = Array.isArray(res.data) ? res.data : [];

            setLatestCompanyPost(
                announcements.find(
                    post => (post.category || "company_news") === "company_news"
                ) || null
            );

            setLatestDisasterPost(
                announcements.find(
                    post => post.category === "disaster_risk"
                ) || null
            );

        } catch (err) {
            console.error("Failed to load announcements:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLatestPost();
    }, [language]);

    const getExcerpt = (text) => {
        if (!text) return "";
        return text.length <= 150 ? text : text.substring(0, 150) + "...";
    };

    const renderLatestUpdate = (post, category) => {
        const isDisaster = category === "disaster_risk";

        return (
            <div className="latest-update-card">
                <div className="latest-update-category">
                    {isDisaster ? t.advisoryBulletin : t.companyNews}
                </div>

                {loading ? (
                    <p className="text-muted">{t.loading}</p>
                ) : post ? (
                    <>
                        {post.attachments?.find(
                            file => file.mime_type?.startsWith("image/")
                        ) && (
                            <img
                                src={
                                    post.attachments.find(
                                        file => file.mime_type?.startsWith("image/")
                                    ).url
                                }
                                alt={post.title}
                                className="latest-update-image"
                            />
                        )}

                        <h3 className="latest-update-title">
                            {post.title}
                        </h3>

                        <p className="news-subtitle">
                            {t.postedOn}{language === "ja" ? "" : " "}
                            {formatDate(post.posted_at, language)}
                        </p>

                        <p className="news-excerpt">
                            {getExcerpt(post.content)}
                        </p>

                        <Link
                            to={`/news/view/${post.id}`}
                            className="news-readmore"
                        >
                            {t.readMore}
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="text-muted">
                            {t.noAnnouncements}
                        </p>

                        <Link
                            to={isDisaster ? "/news/disaster-risk" : "/news"}
                            className="news-readmore"
                        >
                            {t.viewUpdates}
                        </Link>
                    </>
                )}
            </div>
        );
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

                    {/* LATEST UPDATES */}
                    <div className="home-news-wrapper">
                        <Row className="justify-content-center">
                            <Col md={10}>
                                <h2 className="news-title text-center">
                                    {t.latestAnnouncements}
                                </h2>

                                <Row className="g-4">
                                    <Col md={6}>
                                        {renderLatestUpdate(latestCompanyPost, "company_news")}
                                    </Col>

                                    <Col md={6}>
                                        {renderLatestUpdate(latestDisasterPost, "disaster_risk")}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    {/* CORPORATE POLICY & VISION */}
                    <Row className="justify-content-center mt-4 mb-4">
                        <Col md={10}>
                            <div className="about-box-frame">
                                <div className="about-box-topline"></div>
                                <div className="about-box-title">{t.policyTitle}</div>

                                <h4 className="text-center fw-bold mt-3 mb-3">
                                    {t.policySubtitle}
                                </h4>

                                {t.policies.map(([label, text], i) => (
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
                                <div className="about-box-title">{t.valuesTitle}</div>

                                {t.values.map((value, index) => (
                                    <div className="company-row" key={index}>
                                        <div className="company-label">
                                            {value.letter} - <u>{value.title}</u>
                                        </div>
                                        <div className="company-text">
                                            {value.description}
                                        </div>
                                    </div>
                                ))}
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