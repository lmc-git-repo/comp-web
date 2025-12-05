import React from 'react';

const Footer = () => {
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
                    &copy; {new Date().getFullYear()} LAGUNA METTS CORPORATION. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;