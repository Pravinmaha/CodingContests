import React from 'react';
import './Guidlines.css'

const Guidlines = ({ toggleGuidelines, guidlines }) => {

    const renderMarkdownLine = (line) => {
        if (line.startsWith('##')) {
            return <div className="heading2">{line.replace(/^##\s*/, '')}</div>;
        } else if (line.startsWith('#')) {
            return <div className="heading1">{line.replace(/^#\s*/, '')}</div>;
        } else if (line.startsWith('>')) {
            return <div className="quote">{line.slice(1).trim()}</div>;
        } else if (line.startsWith('---')) {
            return <hr className="divider" />;
        } else {
            // Replace **bold** and `code`
            let processed = line
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')

                // Convert ```code``` blocks (multi-line)
                .replace(/```([\s\S]*?)```/g, (match, p1) => {
                    const escaped = p1.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    console.log(match)
                    return `<pre class="codeBlock"><code>${escaped}</code></pre>`;
                })

                // Convert **bold**
                .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')

                // Convert `inline code`
                .replace(/`([^`]+)`/g, '<span class="inlineCode">$1</span>')

                // Convert _italic_
                .replace(/_(.*?)_/g, '<span class="italic">$1</span>');

            return <div dangerouslySetInnerHTML={{ __html: processed }} style={{ whiteSpace: 'pre-wrap' }} />;
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.guidelineBox}>
                <button
                    onClick={toggleGuidelines}
                    style={styles.closeGuidelineBtn}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
                >
                    ✖
                </button>
                <h3 style={styles.title}>📜 Guidelines</h3>
                <div style={styles.contentScroll}>
                    {/* <pre style={styles.guidelineText}>{guidlines}</pre> */}
                    {guidlines.split('\n').map((line, i) => (
                        <div key={i}>{renderMarkdownLine(line)}
                            <br />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Guidlines;

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        animation: 'fadeInOverlay 0.3s ease-in-out',
    },
    guidelineBox: {
        position: 'relative',
        width: '92%',
        maxWidth: '720px',
        maxHeight: '82vh',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #1e272e, #263238)',
        border: '1px solid #4e5d6c',
        borderRadius: '14px',
        padding: '28px 24px 20px',
        color: '#f1f1f1',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
        animation: 'fadeInBox 0.35s ease',
    },
    closeGuidelineBtn: {
        position: 'absolute',
        top: '14px',
        right: '14px',
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#fff',
        border: 'none',
        fontSize: '20px',
        padding: '10px 14px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
    },
    title: {
        fontSize: '22px',
        marginBottom: '18px',
        color: '#00e5ff',
        textAlign: 'center',
        borderBottom: '1px solid #37474f',
        paddingBottom: '10px',
        fontWeight: 600,
    },
    contentScroll: {
        maxHeight: '65vh',
        overflowY: 'auto',
        paddingRight: '10px',
        scrollbarWidth: 'thin',
    },
    guidelineText: {
        whiteSpace: 'pre-wrap',
        fontFamily: 'Consolas, monospace',
        fontSize: '15px',
        lineHeight: '1.7',
        color: '#d0f0ff',
    },
};

// CSS Keyframe Animations (inject these in your global CSS or inside a styled component block)
const fadeInKeyframes = `
@keyframes fadeInOverlay {
  from { opacity: 0 }
  to { opacity: 1 }
}
@keyframes fadeInBox {
  from { transform: translateY(20px); opacity: 0 }
  to { transform: translateY(0); opacity: 1 }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('guideline-keyframes')) {
    const style = document.createElement('style');
    style.id = 'guideline-keyframes';
    style.innerHTML = fadeInKeyframes;
    document.head.appendChild(style);
}
