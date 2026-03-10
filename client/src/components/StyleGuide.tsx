/**
 * TROVES & COVES - COMPLETE STYLE GUIDE
 * Client: Robin Kroeker
 * Date: 2026-03-08
 */

import { useState } from "react";
import "./StyleGuide.css";

export function StyleGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const colors = [
    {
      name: "Troves Turquoise",
      hex: "#4abfbf",
      rgb: "rgb(74, 191, 191)",
      usage: "Primary brand color, 'TROVES' text, links, CTAs"
    },
    {
      name: "Coves Gold 1",
      hex: "#deb55b",
      rgb: "rgb(222, 181, 91)",
      usage: "Ampersand (&), accents, borders"
    },
    {
      name: "Coves Gold 2",
      hex: "#e1af2f",
      rgb: "rgb(225, 175, 47)",
      usage: "'Coves' text, highlights, decorative elements"
    },
    {
      name: "Linen Background",
      hex: "#faf8f3",
      rgb: "rgb(250, 248, 243)",
      usage: "Primary background, 'not so harsh on the eyes'"
    },
    {
      name: "Dark Text",
      hex: "#2c2c2c",
      rgb: "rgb(44, 44, 44)",
      usage: "Body text, headings, primary content"
    }
  ];

  const fonts = [
    {
      name: "Libre Baskerville",
      category: "Serif",
      usage: "\"TROVES\" text, headings, subheadings",
      weights: [400, 700],
      style: "font-family: 'Libre Baskerville', serif;"
    },
    {
      name: "Alex Brush",
      category: "Script",
      usage: "\"Coves\" text, decorative elements, quotes",
      weights: [400],
      style: "font-family: 'Alex Brush', cursive;"
    },
    {
      name: "Montserrat",
      category: "Sans-serif",
      usage: "Body text, navigation, UI elements",
      weights: [300, 400, 500, 600, 700],
      style: "font-family: 'Montserrat', sans-serif;"
    }
  ];

  return (
    <div className="style-guide-page" style={{ backgroundColor: "#faf8f3", minHeight: "100vh" }}>
      <div className="style-guide-container">
        {/* Header */}
        <header className="sg-header">
          <div className="sg-logo">
            <span style={{ fontFamily: "Libre Baskerville, serif", fontWeight: 700, color: "hsl(var(--accent-vibrant))", textTransform: "uppercase" }} className="text-4xl">TROVES</span>
            <span style={{ color: "hsl(var(--gold-medium))", fontFamily: "Alex Brush", fontSize: "2rem" }}>&</span>
            <span style={{ fontFamily: "Alex Brush, cursive", color: "hsl(var(--gold-medium))", fontSize: "2.5rem" }}>Coves</span>
          </div>
          <h1 className="sg-title">Brand Style Guide</h1>
          <p className="sg-subtitle">Handcrafted Crystal Jewelry • Winnipeg, Manitoba</p>
        </header>

        {/* Colors Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Colors</h2>
          <p className="sg-section-desc">
            Client-specified colors (Robin Kroeker). These are locked and should not be modified.
          </p>

          <div className="color-grid">
            {colors.map((color) => (
              <div key={color.hex} className="color-card">
                <div
                  className="color-swatch"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="color-info">
                  <h3 className="color-name">{color.name}</h3>
                  <div className="color-values">
                    <div className="color-value">
                      <span className="color-label">HEX</span>
                      <code className="color-code">{color.hex}</code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(color.hex, color.hex)}
                      >
                        {copied === color.hex ? "✓" : "📋"}
                      </button>
                    </div>
                    <div className="color-value">
                      <span className="color-label">RGB</span>
                      <code className="color-code">{color.rgb}</code>
                    </div>
                  </div>
                  <p className="color-usage">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Color Combinations */}
        <section className="sg-section">
          <h2 className="sg-section-title">Color Combinations</h2>

          <div className="combo-grid">
            <div className="combo-card">
              <div className="combo-preview" style={{ backgroundColor: "#faf8f3", border: "2px solid hsl(var(--accent-vibrant))" }}>
                <span style={{ color: "hsl(var(--accent-vibrant))", fontFamily: "Libre Baskerville, serif" }}>Primary</span>
              </div>
              <p>Turquoise on Linen</p>
            </div>

            <div className="combo-card">
              <div className="combo-preview" style={{ backgroundColor: "#faf8f3", border: "2px solid hsl(var(--gold-medium))" }}>
                <span style={{ color: "hsl(var(--gold-medium))", fontFamily: "Alex Brush, cursive" }}>Accent</span>
              </div>
              <p>Gold on Linen</p>
            </div>

            <div className="combo-card">
              <div className="combo-preview" style={{ backgroundColor: "hsl(var(--accent-vibrant))" }}>
                <span style={{ color: "#faf8f3", fontFamily: "Libre Baskerville, serif" }}>Inverse</span>
              </div>
              <p>Linen on Turquoise</p>
            </div>

            <div className="combo-card">
              <div className="combo-preview" style={{ backgroundColor: "#2c2c2c" }}>
                <span style={{ color: "hsl(var(--accent-vibrant))", fontFamily: "Libre Baskerville, serif" }}>Dark Mode</span>
              </div>
              <p>Turquoise on Dark</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Typography</h2>
          <p className="sg-section-desc">
            Client-specified fonts. Import via Google Fonts before use.
          </p>

          <div className="font-grid">
            {fonts.map((font) => (
              <div key={font.name} className="font-card">
                <div className="font-preview" style={{ fontFamily: font.style }}>
                  <span className="font-name-display">{font.name}</span>
                  <p className="font-sample">
                    {font.name === "Alex Brush"
                      ? "Handcrafted Crystal Jewelry"
                      : font.name === "Libre Baskerville"
                      ? "The quick brown fox jumps over the lazy dog."
                      : "Body text appears in Montserrat for optimal readability."
                    }
                  </p>
                </div>
                <div className="font-info">
                  <h3 className="font-title">{font.name}</h3>
                  <span className="font-category">{font.category}</span>
                  <p className="font-usage">{font.usage}</p>
                  <div className="font-weights">
                    <span className="font-label">Weights:</span>
                    {font.weights.map(w => (
                      <span key={w} className="weight-badge">{w}</span>
                    ))}
                  </div>
                  <code className="font-code">{font.style}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Logo Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Logo</h2>

          <div className="logo-showcase">
            <div className="logo-display">
              <div className="logo-main">
                <span style={{ fontFamily: "Libre Baskerville, serif", fontWeight: 700, color: "hsl(var(--accent-vibrant))", textTransform: "uppercase", fontSize: "3rem" }}>TROVES</span>
                <span style={{ color: "hsl(var(--gold-medium))", fontFamily: "Alex Brush", fontSize: "2.5rem", margin: "0 0.5rem" }}>&</span>
                <span style={{ fontFamily: "Alex Brush, cursive", color: "hsl(var(--gold-medium))", fontSize: "3rem" }}>Coves</span>
              </div>
              <p className="logo-tagline">Handcrafted Crystal Jewelry • Winnipeg</p>
            </div>

            <div className="logo-rules">
              <h3>Logo Rules</h3>
              <ul>
                <li>Always display as "TROVES & Coves" - never reverse order</li>
                <li>"TROVES" must be Libre Baskerville, uppercase, #4abfbf</li>
                <li>"Coves" must be Alex Brush, #e1af2f</li>
                <li>Ampersand (&) must be Alex Brush, #deb55b</li>
                <li>Maintain clear space around logo equal to height of "&"</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sizes Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Type Scale</h2>

          <div className="type-scale">
            <div className="type-level">
              <span className="type-label">Display (48px)</span>
              <span style={{ fontFamily: "Libre Baskerville, serif", fontSize: "3rem", color: "hsl(var(--accent-vibrant))" }}>Mystical Crystals</span>
            </div>
            <div className="type-level">
              <span className="type-label">Heading (32px)</span>
              <span style={{ fontFamily: "Libre Baskerville, serif", fontSize: "2rem", color: "#2c2c2c" }}>Crystal Healing Properties</span>
            </div>
            <div className="type-level">
              <span className="type-label">Subheading (24px)</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 600, color: "#2c2c2c" }}>Handcrafted with Intention</span>
            </div>
            <div className="type-level">
              <span className="type-label">Body (16px)</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", color: "#2c2c2c" }}>
                Each crystal is carefully selected for its unique energy and healing properties.
              </span>
            </div>
            <div className="type-level">
              <span className="type-label">Caption (14px)</span>
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", color: "#2c2c2c", opacity: 0.7 }}>
                Made in Winnipeg, Manitoba
              </span>
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Spacing & Layout</h2>

          <div className="spacing-showcase">
            <div className="spacing-item">
              <div className="spacing-bar" style={{ width: "8px" }}></div>
              <span>XS: 8px</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-bar" style={{ width: "16px" }}></div>
              <span>SM: 16px</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-bar" style={{ width: "24px" }}></div>
              <span>MD: 24px</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-bar" style={{ width: "32px" }}></div>
              <span>LG: 32px</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-bar" style={{ width: "48px" }}></div>
              <span>XL: 48px</span>
            </div>
            <div className="spacing-item">
              <div className="spacing-bar" style={{ width: "64px" }}></div>
              <span>2XL: 64px</span>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Components</h2>

          <div className="components-preview">
            {/* Buttons */}
            <div className="component-group">
              <h3>Buttons</h3>
              <div className="button-showcase">
                <button className="btn btn-primary">Add to Cart</button>
                <button className="btn btn-secondary">Browse Collection</button>
                <button className="btn btn-outline">View Details</button>
              </div>
            </div>

            {/* Cards */}
            <div className="component-group">
              <h3>Cards</h3>
              <div className="card-showcase">
                <div className="preview-card">
                  <div className="preview-card-img" style={{ backgroundColor: "hsl(var(--accent-vibrant))" }}></div>
                  <div className="preview-card-body">
                    <h4 style={{ fontFamily: "Libre Baskerville, serif" }}>Crystal Name</h4>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>Short description</p>
                    <span className="preview-price" style={{ color: "hsl(var(--gold-medium))" }}>$89.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Section */}
        <section className="sg-section">
          <h2 className="sg-section-title">Brand Voice</h2>

          <div className="voice-content">
            <p><strong>Tone:</strong> Mystical, spiritual, authentic, personal</p>
            <p><strong>Personality:</strong> Wise, nurturing, magical, connected to earth's energies</p>
            <p><strong>Key Themes:</strong></p>
            <ul>
              <li>Crystal healing properties and metaphysical benefits</li>
              <li>Handcrafted quality and intention</li>
              <li>Personal connection to crystal energy</li>
              <li>Spiritual growth and transformation</li>
              <li>Nature's wisdom and earth's gifts</li>
            </ul>
            <p><strong>Sample Language:</strong></p>
            <blockquote style={{
              borderLeft: "4px solid hsl(var(--accent-vibrant))",
              paddingLeft: "1rem",
              fontStyle: "italic",
              fontFamily: "Montserrat, sans-serif"
            }}>
              "Each piece is infused with positive energy and crafted with intention.
              Wear these crystals as a reminder of your inner strength and the healing
              power of nature's gifts."
            </blockquote>
          </div>
        </section>

        {/* Footer */}
        <footer className="sg-footer">
          <p>Style Guide for Troves & Coves • Created 2026-03-08</p>
          <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
            Specifications by Robin Kroeker • Handcrafted Crystal Jewelry • Winnipeg, Manitoba
          </p>
        </footer>
      </div>
    </div>
  );
}

export default StyleGuide;
