# Anurag Singh — Portfolio Website

Personal portfolio site for **Anurag Singh**, an AI/ML Engineer and NLP researcher.
Live at: **[anurag-env.github.io](https://anurag-env.github.io)**

Built from scratch with vanilla HTML/CSS/JS (plus jQuery and Bootstrap for layout) —
no frontend framework, no build step. The hero background is a custom real-time
flocking (Boids) simulation rendered on `<canvas>`.

---

## ✨ Features

- **Real-time Boids flocking simulation** — a from-scratch implementation of
  Craig Reynolds' 1986 flocking algorithm (separation, alignment, cohesion) in
  vanilla JavaScript, running as the animated hero background on desktop.
  Includes mouse-reactive scatter, per-boid persistent coloring, density
  limiting, and dynamic multi-flock split/merge — with a live debug/stats
  overlay.
- **Mobile-first responsive design** — the canvas simulation is swapped for a
  rotating photo cross-fade on mobile, with its own separate layout, spacing,
  and interaction rules (kept independent from desktop via scoped media
  queries).
- **Dark mode** — toggleable theme with the preference persisted across visits.
- **Dynamic research section** — publication details (title, abstract,
  pipeline diagram, metrics) are rendered from a JS data array rather than
  hardcoded markup, so adding a new paper doesn't require touching the HTML.
- **Expandable project cards** — collapsible `<details>`-based cards for each
  project, with tech-stack tags, key metrics, and GitHub/live links.
- **Accessible interactions** — keyboard-focusable hobby icons, ARIA labels
  on icon-only buttons, `prefers-reduced-motion` support, and semantic
  section landmarks throughout.
- **SEO-ready** — Open Graph / Twitter Card meta tags and JSON-LD structured
  data (`schema.org/Person`) in the document head.

---

## 🗂️ Sections

| Section | What's there |
|---|---|
| **Hero** | Name, title, live-updated date badge, scroll-to-content chevron |
| **About** | Short bio + "outside of work" hobby icons |
| **Journey** | Timeline of education and experience |
| **Research** | Published/accepted papers with pipeline diagrams and metrics |
| **Projects** | Featured builds — NLP, RAG, generative AI, security, and the Boids simulation itself |
| **Skills** | Languages, frameworks, ML/systems, and tools, grouped into categories |
| **Recognition** | Awards, hackathon results, and other achievements |

---

## 🧰 Tech Stack

- **Structure/Styling:** HTML5, CSS3 (custom, mobile-first media queries), Bootstrap (grid utilities)
- **Interactivity:** Vanilla JavaScript, jQuery
- **Icons:** Font Awesome 5
- **Simulation:** HTML5 Canvas + `requestAnimationFrame` (no external physics/animation library)
- **Hosting:** GitHub Pages

---

## 📁 Project Structure

```
.
├── index.html          # Page structure + content (bio, projects, research, etc.)
├── main.css            # All custom styling, including mobile media queries
├── main.js             # Boids simulation, scroll/nav behavior, dark mode, research renderer
├── all.min.css          # Font Awesome (vendor)
├── jquery.min.js        # jQuery (vendor)
├── images/              # Logos, hero photos, skill/tool icons
│   └── bootstrap.min.css
└── README.md

---

## 🚀 Running Locally

No build step or dependencies to install — it's static HTML/CSS/JS.

bash
git clone https://github.com/anurag-env/anurag-env.github.io.git
cd anurag-env.github.io

Then just open `index.html` in a browser, or serve it locally to avoid any
`file://` quirks:

bash
python3 -m http.server 8000
# visit http://localhost:8000

---

## 🌐 Deployment

Deployed via **GitHub Pages** directly from this repository — any push to the
default branch updates the live site at [anurag-env.github.io](https://anurag-env.github.io).

---

## 📬 Contact

- **Portfolio:** [anurag-env.github.io](https://anurag-env.github.io)
- **GitHub:** [@anurag-env](https://github.com/anurag-env)

---

## 📄 License

*(Add a license here if you want others to know how they can/can't reuse this code —
e.g. [MIT](https://choosealicense.com/licenses/mit/) is a common permissive choice
for a personal portfolio.)*