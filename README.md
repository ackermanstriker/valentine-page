

💖 Valentine Interactive Web Page

A fun, interactive Valentine proposal web page withUX experiment demonstrating advanced CSS animation layering, mobile-first interaction design, and state-driven UI behavior using vanilla JavaScript.
Built as a lightweight static web app and hosted using GitHub Pages for easy sharing across mobile and desktop browsers.


---

🌇 Features

💘 Interactive Valentine Question

Yes / No choice interaction
Multi-stage Yes behavior
Playful No button dodge mechanic
Teasing message system

---

📱 Mobile Optimized UX

Dynamic viewport centering (100dvh)
Safe dodge zone for touch devices
Fixed-width wrapping dodge button on mobile
Result overlay without layout jump
Tap highlight removed for cleaner UX


---

🎉 Celebration Effects

Theme-based sparkle / ember particle animation
Downward romantic particle drift
GPU-friendly animation layering


---

🔗 Shareable Personalization

Supports query parameters:
| Parameter | Example                    | Purpose                      |
| --------- | -------------------------- | ---------------------------- |
| name      | `?name=Alex`               | Replaces default “love” text |
| from      | `&from=Sam`                | Shows sender name            |
| q         | `&q=Custom question`       | Custom question text         |
| yes       | `&yes=Custom success text` | Custom success message       |


---

🌐 Live Demo

👉 Live Site
https://ackermanstriker.github.io/valentine-page/

👉 Example Personalized Link
https://ackermanstriker.github.io/valentine-page/index.html?name=John


---

🧱 Project Structure

valentine-page/
│
├ index.html        → Main markup
├ style.css         → Theme + layout + animations
├ app.js            → Interaction logic + dodge engine
├ config.js         → Text config + limits + messages
└ README.md


---

⚙️ Tech Stack

HTML5
CSS3 (Grid, Gradients, Animations, Blend Modes)
Vanilla JavaScript
Canvas API (Particles)
GitHub Pages Hosting

No frameworks. No dependencies. Fully static.


---

🧠 Core UX Mechanics

🏃 Dodge Engine

Randomized movement inside safe zone
Minimum jump distance
Mobile-safe movement bounds
Result overlay collision avoidance


---

🎭 Interaction States

Dodge phase
Locked phase
Final state lockout



---

🌌 Background Engine

Layered animation system:

1. Static gradient base
2. UI layer
3. Particle celebration layer


---

📲 Mobile Considerations

Handled:
Dynamic browser UI height
Tap highlight removal
Touch dodge triggering
Safe zone padding vs overlay result
Button text wrapping under dodge conditions



---

🚀 Deployment (GitHub Pages)

1️⃣ Push to GitHub

git add .
git commit -m "Initial commit"
git push origin main

2️⃣ Enable GitHub Pages

Settings → Pages → Deploy from Branch → main → /root


---


❤️ Inspiration

Built as a fun personal project combining:

UI polish
Playful interaction design
Mobile-first UX thinking
Lightweight performance



---

📜 License

Personal / Educational use.


---

✨ Author

Built with ❤️ and chaos by Pratyusha


---


