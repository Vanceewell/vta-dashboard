# Session: 2026-04-24 07:02:34 UTC

- **Session Key**: agent:main:main
- **Session ID**: 326e4b1f-ee97-4c3c-bdc1-bed46a68f23c
- **Source**: webchat

## Conversation Summary

assistant: Perfect! I found all instances of the old phone number. Now I'll update them with the new number. I'll replace:
- Old: (949) 973-6434 → New: (949) 424-3230
- Old: tel:+19499736434 → New: tel:+19494243230
- Old placeholder in form
assistant: Let me check the exact formatting for the phone input field:
assistant: Let me search for the exact text around the phone placeholder:
assistant: Now let me do the edits with proper formatting:
assistant: Perfect! Now let me read the updated file and verify all changes were made correctly:
assistant: Perfect! ✅ All phone numbers have been successfully updated. Here's a summary of the changes made:

## Update Summary

**All 4 phone number instances updated:**

1. ✅ **Hero Section "CALL NOW" button** (line 719)
   - Changed: `tel:+19499736434` → `tel:+19494243230`
   - Changed: `(949) 973-6434` → `(949) 424-3230`

2. ✅ **Form Phone Placeholder** (line 979)
   - Changed: `placeholder="(949) 973-6434"` → `placeholder="(949) 424-3230"`

3. ✅ **Final CTA Section "CALL NOW" button** (line 1030)
   - Changed: `tel:+19499736434` → `tel:+19494243230`
   - Changed: `(949) 973-6434` → `(949) 424-3230`

4. ✅ **Footer Contact Link** (line 1059)
   - Changed: `tel:+19499736434` → `tel:+19494243230`
   - Changed: `(949) 973-6434` → `(949) 424-3230`

**No styling, layout, colors, or formatting was changed** — only the phone number values as requested. The file is ready to use!
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-control-ui",
  "id": "openclaw-control-ui"
}
```

[Fri 2026-04-24 06:47 UTC] Make the following small improvements to my existing website code without changing layout, colors, spacing, or styling:

1. Update all "CALL NOW" button text to:
CALL OR TEXT (949) 424-3230

2. In the hero section (top of the page), directly under the main buttons, add a small line of text that says:
Text for fastest response

Style this text to match the site (small, clean, slightly faded/low opacity, centered).

3. Do NOT modify any CSS, layout, or structure.
Only update the button text and add this one line under the hero buttons.

4. Keep all phone links formatted as:
tel:+19494243230

Return the full updated code.
assistant: I'll update the button text and add the helper text under the hero buttons.
assistant: Perfect! Let me verify the changes:
assistant: Excellent! Now let me show you the updated hero section to confirm it looks right:
assistant: Perfect! ✅ All updates complete. Here's what was changed:

## Updates Made

**1. Button Text Updated (2 instances)**
- Hero section button: `CALL NOW (949) 424-3230` → `CALL OR TEXT (949) 424-3230`
- Final CTA section button: `CALL NOW (949) 424-3230` → `CALL OR TEXT (949) 424-3230`

**2. Helper Text Added Under Hero Buttons**
- New line: `"Text for fastest response"`
- Styled with:
  - Font size: 14px (small and clean)
  - Color: white
  - Opacity: 0.85 (slightly faded/low opacity)
  - Centered alignment
  - Margin-top: 20px (proper spacing below buttons)

**3. Phone Links Maintained**
- All `tel:+19494243230` links preserved ✓

**No CSS, layout, spacing, or structure changes** — everything is exactly as before, just with the new button text and helper message in the hero section.

The website is ready to use!
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-control-ui",
  "id": "openclaw-control-ui"
}
```

[Fri 2026-04-24 06:52 UTC] You are editing an EXISTING FULL HTML WEBSITE FILE.

CRITICAL RULES:
- You MUST return the COMPLETE FULL HTML file from <!DOCTYPE html> to </html>
- Do NOT shorten, summarize, or remove ANY code
- Do NOT remove images, styles, scripts, or sections
- Do NOT change layout, spacing, colors, or CSS
- Do NOT rewrite anything except what is specifically requested
- Output ONLY the full updated HTML file (no explanations, no comments outside the code)

TASKS:

1. Find ALL buttons that say:
CALL NOW (949) 424-3230

Replace with:
CALL OR TEXT (949) 424-3230

2. In the HERO SECTION (top of page), locate the div with class "hero-buttons"

DIRECTLY UNDER that div, add this exact line:

<p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">Text for fastest response</p>

3. Ensure ALL phone links use this exact format:
tel:+19494243230

Do NOT change anything else.

Again:
Return the COMPLETE FULL HTML file exactly as given, with ONLY these changes applied.
assistant: Now I'll make the required edits and return the complete file:
user: Sender (untrusted metadata):
```json
{
  "label": "openclaw-control-ui",
  "id": "openclaw-control-ui"
}
```

[Fri 2026-04-24 06:55 UTC] You are fixing and updating an EXISTING FULL HTML WEBSITE FILE.

CRITICAL RULES:
- You MUST return the COMPLETE FULL HTML file from <!DOCTYPE html> to </html>
- Do NOT shorten, summarize, or remove any code
- Do NOT remove images, sections, styles, or scripts
- Do NOT change layout, colors, spacing, or design
- Output ONLY the full HTML file (no explanations, no extra text)

TASKS:

1. REMOVE any non-HTML junk text such as:
- "Copy"
- "Tool"
- timestamps
- random text outside of HTML tags

2. ENSURE the file properly starts with:
<!DOCTYPE html>
<html lang="en">
<head>

3. ENSURE the file properly ends with:
</body>
</html>

4. UPDATE all phone numbers to:
(949) 424-3230

5. ENSURE all phone links use EXACTLY:
tel:+19494243230

6. CHANGE all button text from:
CALL NOW (949) 424-3230

TO:
CALL OR TEXT (949) 424-3230

7. In the HERO SECTION, directly under the "hero-buttons" div, ADD this line:
<p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">Text for fastest response</p>

8. DO NOT change anything else.

FINAL INSTRUCTION:
Return the FULL corrected HTML file only.
assistant: ```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="VTA Cleaning Solutions - Professional commercial cleaning services for offices, medical clinics, and businesses across Orange County, California.">
    <meta name="keywords" content="commercial cleaning Orange County, office cleaning, medical clinic cleaning, professional cleaning services, San Clemente">
    <meta name="robots" content="index, follow">
    <title>VTA Cleaning Solutions | Professional Commercial Cleaning Orange County</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background-color: #f0f7ff;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Navigation */
        nav {
            background-color: #ffffff;
            box-shadow: 0 2px 12px rgba(0, 102, 204, 0.08);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
        }

        .logo {
            font-size: 22px;
            font-weight: 700;
            color: #0066cc;
            text-decoration: none;
            letter-spacing: -0.5px;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 40px;
            align-items: center;
        }

        .nav-menu a {
            text-decoration: none;
            color: #2c3e50;
            font-weight: 500;
            font-size: 15px;
            transition: color 0.3s ease;
        }

        .nav-menu a:hover {
            color: #0066cc;
        }

        .nav-btn-primary {
            background-color: #0066cc;
            color: white;
            padding: 11px 26px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .nav-btn-primary:hover {
            background-color: #0052a3;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 102, 204, 0.25);
        }

        .menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #2c3e50;
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, rgba(0, 102, 204, 0.85) 0%, rgba(0, 82, 163, 0.85) 100%), url('https://images.pexels.com/photos/6197116/pexels-photo-6197116.jpeg') center/cover;
            color: white;
            padding: 140px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.35);
            z-index: 0;
        }

        .hero .container {
            position: relative;
            z-index: 1;
        }

        .hero h1 {
            font-size: 56px;
            font-weight: 800;
            margin-bottom: 16px;
            line-height: 1.15;
            letter-spacing: -1.2px;
        }

        .hero .subheadline {
            font-size: 20px;
            margin-bottom: 8px;
            line-height: 1.5;
            font-weight: 300;
            opacity: 0.95;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero .tagline {
            font-size: 15px;
            margin-bottom: 50px;
            opacity: 0.9;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .hero-buttons {
            display: flex;
            gap: 24px;
            justify-content: center;
            flex-wrap: wrap;
            align-items: center;
        }

        .btn {
            padding: 18px 42px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-block;
            letter-spacing: 0.3px;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #0066cc;
            box-shadow: 0 8px 24px rgba(255, 255, 255, 0.25);
        }

        .btn-primary:hover {
            background-color: #f0f6ff;
            transform: translateY(-3px);
            box-shadow: 0 12px 32px rgba(255, 255, 255, 0.35);
        }

        .btn-secondary {
            background-color: #0066cc;
            color: white;
            border: 2px solid white;
        }

        .btn-secondary:hover {
            background-color: white;
            color: #0066cc;
            transform: translateY(-3px);
        }

        /* Trust Strip */
        .trust-strip {
            background-color: #ffffff;
            padding: 40px 0;
            border-bottom: 1px solid #e0e8f0;
        }

        .trust-content {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;
            gap: 40px;
            text-align: center;
        }

        .trust-item {
            flex: 1;
            min-width: 200px;
        }

        .trust-item p {
            font-size: 15px;
            color: #2c3e50;
            font-weight: 500;
        }

        /* Services Section */
        .services {
            background-color: #ffffff;
            padding: 100px 0;
        }

        .section-title {
            font-size: 48px;
            font-weight: 800;
            color: #1a1a1a;
            text-align: center;
            margin-bottom: 20px;
            letter-spacing: -1px;
        }

        .section-subtitle {
            text-align: center;
            color: #666;
            font-size: 18px;
            margin-bottom: 70px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 32px;
        }

        .service-card {
            background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
            padding: 48px 40px;
            border-radius: 12px;
            border: 2px solid #e0e8f0;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #0066cc 0%, #0099ff 100%);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
        }

        .service-card:hover::before {
            transform: scaleX(1);
        }

        .service-card:hover {
            border-color: #0066cc;
            box-shadow: 0 16px 48px rgba(0, 102, 204, 0.15);
            transform: translateY(-6px);
        }

        .service-card h3 {
            font-size: 22px;
            color: #1a1a1a;
            margin-bottom: 16px;
            font-weight: 700;
        }

        .service-card p {
            font-size: 15px;
            color: #555;
            line-height: 1.7;
        }

        /* Why Choose Section */
        .why-choose {
            background-color: #f0f7ff;
            padding: 100px 0;
        }

        .why-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }

        .why-card {
            background-color: #ffffff;
            padding: 42px 36px;
            border-radius: 12px;
            border: 1px solid #e0e8f0;
            transition: all 0.3s ease;
        }

        .why-card:hover {
            box-shadow: 0 12px 40px rgba(0, 102, 204, 0.12);
            border-color: #0066cc;
            transform: translateY(-4px);
        }

        .why-icon {
            font-size: 36px;
            margin-bottom: 16px;
            display: block;
        }

        .why-card h3 {
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 14px;
            font-weight: 700;
        }

        .why-card p {
            font-size: 15px;
            color: #555;
            line-height: 1.7;
        }

        /* How It Works Section */
        .how-it-works {
            background-color: #ffffff;
            padding: 100px 0;
        }

        .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 50px;
            max-width: 900px;
            margin: 0 auto;
        }

        .step {
            text-align: center;
            position: relative;
        }

        .step-number {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #0066cc 0%, #0099ff 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: 800;
            color: white;
            margin: 0 auto 24px;
            box-shadow: 0 8px 24px rgba(0, 102, 204, 0.25);
        }

        .step h3 {
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 12px;
            font-weight: 700;
        }

        .step p {
            font-size: 15px;
            color: #666;
            line-height: 1.6;
        }

        /* Quote Form Section */
        .quote-section {
            background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
            padding: 100px 0;
        }

        .quote-container {
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 60px;
            border-radius: 16px;
            box-shadow: 0 12px 48px rgba(0, 102, 204, 0.12);
        }

        .quote-title {
            font-size: 42px;
            font-weight: 800;
            color: #1a1a1a;
            text-align: center;
            margin-bottom: 12px;
            letter-spacing: -0.8px;
        }

        .quote-subtitle {
            text-align: center;
            color: #666;
            font-size: 16px;
            margin-bottom: 48px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .form-group label {
            display: block;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
            font-size: 14px;
            letter-spacing: 0.3px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e0e8f0;
            border-radius: 8px;
            font-size: 15px;
            font-family: inherit;
            transition: all 0.3s ease;
            background-color: #f8fbff;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: #999;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #0066cc;
            background-color: #ffffff;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 140px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .form-submit {
            background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
            color: white;
            padding: 16px 40px;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
            margin-top: 16px;
            letter-spacing: 0.3px;
            box-shadow: 0 8px 20px rgba(0, 102, 204, 0.3);
        }

        .form-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(0, 102, 204, 0.4);
        }

        .form-submit:active {
            transform: translateY(0);
        }

        .form-disclaimer {
            text-align: center;
            font-size: 13px;
            color: #999;
            margin-top: 16px;
        }

        /* Service Area Section */
        .service-area {
            background-color: #ffffff;
            padding: 100px 0;
        }

        .service-area-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }

        .service-area h2 {
            font-size: 42px;
            font-weight: 800;
            color: #1a1a1a;
            margin-bottom: 24px;
            letter-spacing: -0.8px;
        }

        .service-area p {
            font-size: 16px;
            color: #555;
            line-height: 1.8;
            margin-bottom: 32px;
        }

        .cities-list {
            font-size: 16px;
            color: #2c3e50;
            line-height: 2;
            background: linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%);
            padding: 48px;
            border-radius: 12px;
            border: 2px solid #e0e8f0;
        }

        .cities-list strong {
            color: #0066cc;
            font-weight: 700;
        }

        /* Final CTA Section */
        .final-cta {
            background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }

        .final-cta h2 {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 24px;
            letter-spacing: -0.8px;
        }

        .final-cta p {
            font-size: 18px;
            margin-bottom: 48px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            opacity: 0.95;
        }

        .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn-light {
            background-color: white;
            color: #0066cc;
        }

        .btn-light:hover {
            background-color: #f0f6ff;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
        }

        /* Footer */
        footer {
            background-color: #1a1a1a;
            color: #bbb;
            padding: 70px 0 30px;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 50px;
            margin-bottom: 50px;
        }

        footer h4 {
            color: white;
            margin-bottom: 18px;
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 0.2px;
        }

        footer p {
            font-size: 14px;
            line-height: 1.8;
        }

        footer a {
            color: #bbb;
            text-decoration: none;
            transition: color 0.3s ease;
            font-weight: 500;
        }

        footer a:hover {
            color: #0099ff;
        }

        footer ul {
            list-style: none;
        }

        footer ul li {
            margin-bottom: 12px;
        }

        .footer-bottom {
            border-top: 1px solid #333;
            padding-top: 30px;
            text-align: center;
            font-size: 13px;
            color: #888;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .logo {
                font-size: 20px;
            }

            .nav-menu {
                display: none;
                position: absolute;
                top: 70px;
                left: 0;
                right: 0;
                flex-direction: column;
                background-color: white;
                padding: 20px;
                gap: 12px;
                border-bottom: 2px solid #e0e8f0;
                border-radius: 0 0 12px 12px;
            }

            .nav-menu.active {
                display: flex;
            }

            .menu-toggle {
                display: block;
            }

            .hero {
                padding: 100px 0;
            }

            .hero h1 {
                font-size: 36px;
            }

            .hero .subheadline {
                font-size: 17px;
            }

            .hero-buttons {
                flex-direction: column;
                gap: 16px;
            }

            .btn {
                width: 100%;
                padding: 16px 32px;
            }

            .section-title {
                font-size: 32px;
                margin-bottom: 16px;
            }

            .section-subtitle {
                font-size: 16px;
                margin-bottom: 50px;
            }

            .services-grid,
            .why-grid,
            .steps-grid {
                grid-template-columns: 1fr;
                gap: 24px;
            }

            .form-row {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .quote-container {
                padding: 40px 24px;
            }

            .quote-title {
                font-size: 28px;
            }

            .final-cta h2 {
                font-size: 32px;
            }

            .cta-buttons {
                flex-direction: column;
                gap: 16px;
            }

            .cta-buttons .btn {
                width: 100%;
            }

            .trust-content {
                gap: 20px;
            }

            .nav-menu a {
                display: block;
                padding: 10px 0;
            }
        }

        @media (max-width: 480px) {
            .hero h1 {
                font-size: 28px;
                margin-bottom: 12px;
            }

            .hero .subheadline {
                font-size: 15px;
                margin-bottom: 6px;
            }

            .hero .tagline {
                font-size: 13px;
                margin-bottom: 30px;
            }

            .btn {
                padding: 14px 24px;
                font-size: 14px;
            }

            .section-title {
                font-size: 24px;
            }

            .service-card,
            .why-card {
                padding: 32px 24px;
            }

            .service-card h3,
            .why-card h3 {
                font-size: 18px;
            }

            .step-number {
                width: 64px;
                height: 64px;
                font-size: 28px;
            }

            .quote-container {
                padding: 32px 20px;
                border-radius: 12px;
            }

            .quote-title {
                font-size: 24px;
            }

            .final-cta h2 {
                font-size: 26px;
            }

            .cities-list {
                padding: 32px 24px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <div class="navbar">
                <a href="#" class="logo">VTA Cleaning Solutions</a>
                <button class="menu-toggle" id="menuToggle">☰</button>
                <ul class="nav-menu" id="navMenu">
                    <li><a href="#services">Services</a></li>
                    <li><a href="#why-choose">Why Choose Us</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="#service-area">Service Area</a></li>
                    <li><a href="#quote" class="nav-btn-primary">Get a Quote</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>Professional Commercial Cleaning You Can Rely On</h1>
            <p class="subheadline">Serving Orange County businesses with reliable, detail-focused cleaning for offices, clinics, and commercial spaces.</p>
            <p class="tagline">Owner-operated. Reliable. Detail-focused.</p>
            <div class="hero-buttons">
                <a href="#quote" class="btn btn-primary">REQUEST A FREE QUOTE</a>
                <a href="tel:+19494243230" class="btn btn-secondary">CALL OR TEXT (949) 424-3230</a>
            </div>
            <p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">Text for fastest response</p>
        </div>
    </section>

    <!-- Trust Strip -->
    <section class="trust-strip">
        <div class="container">
            <div class="trust-content">
                <div class="trust-item">
                    <p>✓ Serving businesses across Orange County</p>
                </div>
                <div class="trust-item">
                    <p>✓ Trusted by offices and clinics</p>
                </div>
                <div class="trust-item">
                    <p>✓ Professional, detail-focused service</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
        <div class="container">
            <h2 class="section-title">Our Commercial Cleaning Services</h2>
            <p class="section-subtitle">From medical clinics to retail spaces, we deliver professional cleaning tailored to your business.</p>
            <div class="services-grid">
                <div class="service-card">
                    <h3>Commercial Cleaning</h3>
                    <p>Professional cleaning for offices, commercial buildings, and workspaces. Daily maintenance that keeps your business looking professional and well-maintained.</p>
                </div>
                <div class="service-card">
                    <h3>Medical Clinic Cleaning</h3>
                    <p>Specialized cleaning for medical practices, dental offices, and therapy clinics. We follow strict infection control standards and use medical-grade disinfectants.</p>
                </div>
                <div class="service-card">
                    <h3>Office Cleaning</h3>
                    <p>Keep your workspace clean and hygienic. We handle reception areas, workstations, conference rooms, restrooms, and break areas with precision.</p>
                </div>
                <div class="service-card">
                    <h3>Retail Cleaning</h3>
                    <p>Professional cleaning for retail environments. Floor care, window maintenance, and display area cleaning that keeps customers impressed.</p>
                </div>
                <div class="service-card">
                    <h3>Deep Cleaning</h3>
                    <p>Comprehensive cleaning for areas needing extra attention. Carpet cleaning, upholstery, baseboards, light fixtures, and hard-to-reach areas.</p>
                </div>
                <div class="service-card">
                    <h3>Residential Cleaning</h3>
                    <p>Select residential projects for properties requesting our professional-grade service. Move-in, move-out, and special cleaning needs available.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Section -->
    <section class="why-choose" id="why-choose">
        <div class="container">
            <h2 class="section-title">Why Choose VTA Cleaning Solutions</h2>
            <p class="section-subtitle">We're different because we're built for commercial success.</p>
            <div class="why-grid">
                <div class="why-card">
                    <span class="why-icon">🎯</span>
                    <h3>Commercial-First Focus</h3>
                    <p>We specialize in commercial cleaning. Your business needs are our priority, and we understand the unique demands of offices, clinics, and retail spaces.</p>
                </div>
                <div class="why-card">
                    <span class="why-icon">⏰</span>
                    <h3>Reliable Scheduling</h3>
                    <p>Scheduled service on YOUR timeline. Same professional team, consistent quality, every visit. Your business runs smoothly because cleaning is handled.</p>
                </div>
                <div class="why-card">
                    <span class="why-icon">✨</span>
                    <h3>Detail-Oriented Cleaning</h3>
                    <p>We clean every detail—baseboards, light fixtures, corners, high-touch surfaces. Nothing is missed. Your space looks professionally maintained.</p>
                </div>
                <div class="why-card">
                    <span class="why-icon">📞</span>
                    <h3>Professional Communication</h3>
                    <p>Quick response times, transparent communication, honest service. No surprises, no complications. You know exactly what you're getting.</p>
                </div>
                <div class="why-card">
                    <span class="why-icon">👤</span>
                    <h3>Owner-Operated Quality</h3>
                    <p>Owner-managed business means personal attention to every job. Your satisfaction is directly tied to our success. We take pride in every detail.</p>
                </div>
                <div class="why-card">
                    <span class="why-icon">💼</span>
                    <h3>Flexible Service Plans</h3>
                    <p>Weekly, bi-weekly, monthly, or custom schedules tailored to your business needs and budget. We work around your schedule, not the other way around.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works" id="how-it-works">
        <div class="container">
            <h2 class="section-title">How It Works</h2>
            <p class="section-subtitle">Getting started is simple. Three easy steps.</p>
            <div class="steps-grid">
                <div class="step">
                    <div class="step-number">1</div>
                    <h3>Request a Quote</h3>
                    <p>Tell us about your cleaning needs. Fill out our form or call us directly. We'll gather all the details.</p>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <h3>We Contact You</h3>
                    <p>Our team contacts you quickly with a customized quote and service plan. No surprises, no pressure.</p>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <h3>Professional Cleaning</h3>
                    <p>We clean your space on schedule with our professional team. Reliable, detail-focused service every time.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Quote Form Section -->
    <section class="quote-section" id="quote">
        <div class="container">
            <div class="quote-container">
                <h2 class="quote-title">Request Your Free Cleaning Quote</h2>
                <p class="quote-subtitle">Tell us about your business. We'll provide a customized quote within 24 hours.</p>
                <form id="quoteForm">
                    <div class="form-group">
                        <label for="name">Full Name *</label>
                        <input type="text" id="name" name="name" placeholder="Your name" required>
                    </div>

                    <div class="form-group">
                        <label for="company">Company Name *</label>
                        <input type="text" id="company" name="company" placeholder="Your company" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone">Phone Number *</label>
                            <input type="tel" id="phone" name="phone" placeholder="(949) 424-3230" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" placeholder="your@email.com" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="service">Service Type *</label>
                        <select id="service" name="service" required>
                            <option value="">Select a service...</option>
                            <option value="Commercial Cleaning">Commercial Cleaning</option>
                            <option value="Medical Clinic Cleaning">Medical Clinic Cleaning</option>
                            <option value="Office Cleaning">Office Cleaning</option>
                            <option value="Retail Cleaning">Retail Cleaning</option>
                            <option value="Deep Cleaning">Deep Cleaning</option>
                            <option value="Residential Cleaning">Residential Cleaning</option>
                            <option value="Move-In / Move-Out Cleaning">Move-In / Move-Out Cleaning</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="sqft">Square Footage</label>
                            <input type="text" id="sqft" name="sqft" placeholder="e.g., 5,000">
                        </div>
                        <div class="form-group">
                            <label for="city">City *</label>
                            <input type="text" id="city" name="city" placeholder="Your city" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="notes">Additional Notes</label>
                        <textarea id="notes" name="notes" placeholder="Tell us more about your cleaning needs..."></textarea>
                    </div>

                    <button type="submit" class="form-submit">REQUEST A COMMERCIAL CLEANING QUOTE</button>
                    <p class="form-disclaimer">We respond quickly. Serving all Orange County.</p>
                </form>
            </div>
        </div>
    </section>

    <!-- Service Area Section -->
    <section class="service-area" id="service-area">
        <div class="container">
            <div class="service-area-content">
                <h2>Serving All of Orange County</h2>
                <p>VTA Cleaning Solutions proudly serves all of Orange County with professional commercial and residential cleaning services.</p>
                <div class="cities-list">
                    <p><strong>Service Cities Include:</strong></p>
                    <p>San Clemente, Dana Point, San Juan Capistrano, Irvine, Mission Viejo, Laguna Niguel, Costa Mesa, Newport Beach, Anaheim</p>
                    <p style="margin-top: 20px;"><strong>And all surrounding Orange County communities.</strong></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta">
        <div class="container">
            <h2>Need Reliable Cleaning for Your Business?</h2>
            <p>Get a free quote today. No obligation. Quick response guaranteed.</p>
            <div class="cta-buttons">
                <a href="tel:+19494243230" class="btn btn-light">CALL OR TEXT (949) 424-3230</a>
                <a href="#quote" class="btn btn-light">REQUEST A QUOTE</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h4>VTA Cleaning Solutions</h4>
                    <p>Professional commercial and residential cleaning services across Orange County, California.</p>
                </div>
                <div>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#why-choose">Why Choose Us</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        <li><a href="#service-area">Service Area</a></li>
                        <li><a href="#quote">Get a Quote</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Contact</h4>
                    <p><strong>Phone:</strong> <a href="tel:+19494243230">(949) 424-3230</a></p>
                    <p><strong>Service Area:</strong> All Orange County, CA</p>
                    <p style="margin-top: 16px; font-size: 13px;">Quick response to all inquiries</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 VTA Cleaning Solutions. All rights reserved. | Commercial & Residential Cleaning | Orange County, CA</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Form submission
        const quoteForm = document.getElementById('quoteForm');
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                sqft: document.getElementById('sqft').value,
                city: document.getElementById('city').value,
                notes: document.getElementById('notes').value
            };

            // Log form data (in production, send to backend)
            console.log('Quote Request:', formData);

            // Show confirmation
            alert('Thank you for your quote request! We will contact you soon at ' + formData.phone + '.');
            
            // Reset form
            quoteForm.reset();
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    </script>
</body>
</html>
```
