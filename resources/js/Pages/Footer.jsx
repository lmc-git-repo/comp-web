
import React from 'react';

const Footer = ({ language = "en" }) => {
    const isJapanese = language === "ja";

    return (
        // Remove Container fluid to ensure background spans edge-to-edge
        <footer style={{
            backgroundColor: '#002C82', // Dark blue to match Navbar
            color: 'white',
            padding: '15px 0',
            textAlign: 'center',
            marginTop: 'auto', // Pushes footer to the bottom of the viewport
            width: '100%'
        }}>
            {/* The text itself will be slightly padded to avoid touching edges */}
            <div style={{ padding: '0 20px' }}>
                <p className="mb-0 small">
                    &copy; {new Date().getFullYear()} LAGUNA METTS CORPORATION.{' '}
                    {isJapanese ? "無断転載を禁じます。" : "All rights reserved."}
                </p>

                {/* INSERTED */}
                <p className="mb-0 small">
                    {isJapanese
                        ? "ウェブサイト制作：LMC ITチーム"
                        : "Website developed by LMC IT Team"}
                </p>

                {/* INSERTED */}
                <p className="mb-0 footer-credit">
                    {isJapanese
                        ? "主任開発者：Liezel Larracas"
                        : "Lead Developer: Liezel Larracas"}
                </p>
            </div>
        </footer>
    );
};

export default Footer;