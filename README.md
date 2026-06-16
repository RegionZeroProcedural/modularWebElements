# Reaper UI Showcase

A clean reusable static website scaffold built from your existing UI direction:

- Fixed glass header
- Accessible mobile nav
- Mouse-reactive glass highlights
- Reusable tilt cards
- Scroll-reactive ambient background
- Optional low-quality to high-quality video background swap
- TikTok embed loader from `videos.json`
- Forum activity preview from `Forums/forumData.json`
- Responsive portfolio/project sections

## File structure

```txt
index.html
styles.css
app.js
videos.json
Forums/
  forumData.json
video/
  background-preview.mp4
  background-hq.mp4
```

The video files are optional. If they are missing, the CSS background still provides a polished fallback.

## Reuse notes

Use these attributes/classes to reuse the systems:

- `class="liquid-glass"` for panels
- `class="liquid-button"` for buttons and nav links
- `data-glass` for mouse-follow highlights
- `data-tilt` for 3D tilt cards
- `class="reveal"` for reveal-on-scroll animation

## Deployment

This can run on GitHub Pages as plain HTML/CSS/JS. For local JSON loading, use Live Server or another local dev server instead of opening the file directly.
