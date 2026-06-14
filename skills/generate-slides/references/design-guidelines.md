# Slide Design Guidelines

## How to Use This Document

When creating plan.json, each slide's `imagePrompt` MUST be constructed by:
1. Copying the **Base Layer** verbatim
2. Appending the **Layout Template** for the slide's layoutHint, filling in content

CRITICAL: The imagePrompt is sent directly to an image generation AI.
- Do NOT include pixel values, hex color codes, CSS properties, or any technical measurements in the imagePrompt. The AI will render them as visible text on the slide.
- Use natural language descriptions for sizes (large, medium, small), positions (top-left, centered), and colors (indigo, violet, emerald green, etc).

---

## Base Layer (COPY THIS VERBATIM into every imagePrompt)

```
Presentation slide, 16:9 aspect ratio.
Background: smooth vertical gradient from very light lavender at top to very light indigo at bottom.
Background decorations: exactly 2 soft pastel blob shapes — one light purple at low opacity in the top-right corner, one light cyan at low opacity in the bottom-left corner, each roughly medium-sized with organic rounded edges. Also 3 tiny circles scattered in the whitespace — one medium purple, one teal, one light violet — placed away from text areas.
No 3D objects, no floating cubes, no rings, no complex geometric shapes in the background.
All visible text on the slide must be in Japanese only. Do not render any English text on the slide except well-known technical terms like HTML, CSS, JavaScript, Claude Code, VS Code, PWA.
Do not render any pixel values, hex color codes, font sizes, spacing measurements, or CSS property names as visible text anywhere on the slide.
Do not include any company name, school name, logo, branding, or the word INTENTION.
Do not include lecture duration or time information.
Do not include any page numbers, slide numbers, or number indicators anywhere on the slide.
```

---

## Color Palette (reference for Claude Code — do NOT put hex codes in imagePrompt)

Use these color NAMES in imagePrompt instead of hex codes:

| Name in imagePrompt | Actual color |
|---|---|
| indigo | #6366F1 |
| violet | #8B5CF6 |
| cyan / teal | #06B6D4 |
| blue | #3B82F6 |
| amber / golden yellow | #F59E0B |
| emerald green | #10B981 |
| red | #EF4444 |
| orange | #F97316 |
| deep indigo-black | #1E1B4B |
| dark gray | #374151 |
| medium gray | #6B7280 |
| light gray border | #E5E7EB |

---

## Icon Style (MUST be consistent across all slides)

```
All icons are flat 2D vector style with smooth gradient fills (indigo-to-violet or cyan-to-blue). Simple geometric shapes only — no photorealistic rendering, no 3D shading, no hand-drawn style. Each icon sits inside a small rounded-square container with a very light tinted background matching the icon color.
```

---

## Typography Rules (reference for Claude Code — use descriptive terms in imagePrompt)

Instead of writing "42px bold" in the prompt, write "large bold title text".

| Element | Describe as |
|---|---|
| Slide title | "large bold title text in deep indigo-black" |
| Subtitle | "medium subtitle text in gray" |
| Bullet heading | "bold heading text in deep indigo-black" |
| Bullet description | "small description text in medium gray" |
| Card body text | "regular body text in dark gray" |

All text uses a clean modern sans-serif font.

---

## Layout Templates

### Title Slide (`layoutHint: "title"`)

```
[Base Layer]

Layout: centered composition.
Large extra-bold title text in white (keep the title short — ideally under 10 characters), centered horizontally, positioned high enough to leave balanced whitespace above and below. Behind the title, a wide rounded banner filled with a gradient from indigo to violet, giving the white text a colorful background.
Below the title with a small gap: a subtitle line in medium gray, centered.
Center of the slide below the subtitle: a single clean flat vector illustration representing the module theme, using gradient fills in indigo, violet, and cyan tones.
Near the bottom of the slide: 3 horizontal pill-shaped tag chips in a row with small gaps. First chip has a very light indigo background with indigo text. Second chip has a very light green background with emerald green text. Third chip has a very light orange background with amber text. Each chip contains a short Japanese label.

```

### Bullet Point Slide (`layoutHint: "bullets"`)

```
[Base Layer]

Layout: two-column — left side is wider for content, right side is narrower for illustration. Balance the widths so content is readable and the illustration has enough space.

Left column:
- At the top-left, a short vertical accent bar in indigo, with the slide title as large bold text in deep indigo-black immediately to the right of the bar.
- Below the title with moderate spacing: 3 to 4 bullet cards stacked vertically with small gaps between them.
- Each bullet card is a rounded rectangle with white semi-transparent background and a thin light gray border. Each card has a colored left border stripe — the colors cycle through indigo, violet, teal, emerald green for cards 1 through 4. Inside each card: a small flat vector icon in a rounded-square container on the left, then a bold heading in deep indigo-black, and optionally a small description line in medium gray below it.

Right column:
- A single flat vector illustration representing the slide topic, centered vertically. Clean minimal style with gradient fills in indigo, violet, and cyan tones. No photographs.

```

### Comparison Slide (`layoutHint: "comparison"`)

```
[Base Layer]

Layout: title at top center, two equal-width cards side by side below.

Title: large bold text in deep indigo-black, centered horizontally near the top.

Two cards below the title with moderate spacing between them:
- Each card is a rounded rectangle with white semi-transparent background and subtle shadow.
- Left card header: a rounded-top colored bar filled with a gradient from red to orange. Inside: a white X circle icon on the left and white bold title text.
- Right card header: a rounded-top colored bar filled with a gradient from emerald green to light green. Inside: a white checkmark circle icon on the left and white bold title text.
- Left card body: 3 to 4 bullet items. Each has a small red X icon followed by Japanese text in dark gray.
- Right card body: 3 to 4 bullet items. Each has a small emerald green checkmark icon followed by Japanese text in dark gray.

```

### Diagram Slide (`layoutHint: "diagram"`)

```
[Base Layer]

Layout: title at top center, diagram area centered below.

Title: large bold text in deep indigo-black, centered horizontally near the top.

Diagram area centered in the middle of the slide:
- 3 to 5 step nodes arranged horizontally in a row (for linear flows) or in a circle (for cycles).
- Each node is a rounded rectangle filled with a distinct soft gradient — node 1 in indigo tones, node 2 in violet tones, node 3 in cyan/teal tones, node 4 in amber/yellow tones, node 5 in emerald green tones. White text inside each node: a bold label on top and a smaller description below. Subtle shadow on each node.
- Between nodes: curved arrow connectors in light gray with small arrowheads, flowing left-to-right or clockwise.
- Each node has a small white circle badge at the top-left corner with a bold number in the node's matching color.

```

### Code Slide (`layoutHint: "code"`)

```
[Base Layer]

Layout: title at top-left, content stacked vertically below.

At the top-left, a short vertical accent bar in indigo, with the slide title as large bold text in deep indigo-black to the right of the bar.

Optional: below the title, a rounded light card with semi-transparent white background containing an explanation text in dark gray with a small indigo info icon.

Main code block area below: a large rounded rectangle with deep indigo-black background. Inside, code text in a monospace font with syntax coloring — commands in light indigo, arguments in teal, strings in light violet, comments in emerald green, default text in near-white. Subtle line numbers on the left in dark gray.

If multiple code blocks: stack them vertically with small gaps.

```

### Summary Slide (`layoutHint: "summary"`)

```
Background: same gradient as other slides, but replace the blob decorations with small scattered confetti-like rectangles in indigo, violet, teal, amber, and emerald green at low opacity, rotated at various angles across the top portion. This gives a subtle celebratory feel.
No 3D objects, no floating cubes, no rings.
All visible text on the slide must be in Japanese only. Do not render any English text except well-known technical terms.
Do not render any pixel values, hex color codes, font sizes, spacing measurements, or CSS property names as visible text.
Do not include any company name, school name, logo, branding, or the word INTENTION.

Layout: title at top center, items in a 2-column grid below, a banner at the bottom.

Title: large bold text in deep indigo-black, centered near the top.

Items arranged in a 2-column grid with small gaps:
Each item is a rounded card with white semi-transparent background and thin light gray border. Inside each card: a small circle badge with indigo-to-violet gradient fill and a white bold number, then a small emerald green checkmark icon, then the item text in medium bold deep indigo-black.

Near the bottom, centered: a wide rounded banner filled with a gradient from indigo to teal. White bold text centered inside showing the next module title.

```

---

## Prohibited Content

- Do NOT include any company/school name, logo, or branding text
- Do NOT include lecture duration or time information on slides
- Do NOT include "INTENTION" text anywhere
- Do NOT use photorealistic images or photographs
- Do NOT use 3D-rendered floating objects (cubes, spheres, rings) as decorations
- Do NOT include English section titles or headings (technical terms like HTML, VS Code are OK)
- Do NOT render pixel values, hex codes, font sizes, or CSS properties as visible text on slides
- Do NOT include any page numbers, slide numbers, or number indicators on slides

## Quality Rules

- Every slide must use the exact same background gradient and blob decoration pattern
- All icons must use the same flat vector gradient style across all slides
- Card styles (rounded corners, semi-transparent white, subtle shadow) must be identical
- Title position and style must match the layout template consistently
- Maintain generous whitespace — do not overfill slides with content
- Maximum 4 bullet items per bullet slide, maximum 5 nodes per diagram
