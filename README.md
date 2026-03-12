# 🌐 Web Development Interactive Curriculum — ENSIA

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://web-dev-course-redesign.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-HTML5%20|%20CSS3%20|%20JS-orange?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/Zaraki4707/WebDevCourseRedesign)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An advanced, interactive learning platform designed for **ENSIA** students. This project modernizes the legacy web development curriculum into a responsive, sleek, and feature-rich experience.

---

## ✨ Core Features

- 🎓 **Comprehensive Curriculum**: 14+ Labs covering everything from HTML basics to advanced React & PHP.
- 📅 **Global Deadline System**: Super Admin controlled sync for project submissions.
- 📊 **Progress Analytics**: Localized student progress tracking with interactive charts.
- 🔐 **Course Locking**: Admin-controlled scheduling for course accessibility.
- 👨‍🏫 **Admin Dashboard**: Dedicated portal for course management and synchronization.
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile viewing.

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern Flexbox/Grid), JavaScript (ES6+)
- **Charts**: [Chart.js](https://www.chartjs.org/) for progress visualization
- **Icons**: [FontAwesome 6](https://fontawesome.com/)
- **Hosting**: [Vercel](https://vercel.com/) (CI/CD Integrated)

---

## 📁 Project Architecture

```text
root/
├── 🏠 index.html            # Main Entry Point
├── 📚 modern-courses.html    # Course Catalog
├── 📅 modern-deadlines.html  # Student Deadline Tracking
├── 👨‍🏫 modern-teachers.html   # Faculty Directory
├── 📈 modern-progress.html   # Student Analytics
├── 🏗️ labs/                  # Modernized Practical Exercises (0-13)
├── ⚙️ cwebadmindev/          # Admin Portal & Management Logic
└── 🎨 modern-assets/         # Centralized Styles & Global Config
```

---

## 🚀 Getting Started

### For Students
1. Open the [Live Site](https://webdevcourse-ensia.vercel.app/).
2. Navigate to **Courses** to begin your journey.
3. Check **Deadlines** to stay updated on submissions.

### For Administrators
1. Access the dashboard via `/cwebadmindev/admin-login.html`.
2. Manage deadlines, course locks, and schedules.
3. Use the **Global Sync** feature to update `modern-assets/js/config.js` and notify all students.

---

## 🏗 Deployment Guide

This project is optimized for **Vercel**. Every commit to `main` triggers an automatic build.

1. **Root Directory**: `.`
2. **Build Settings**: No override needed.
3. **Environment**: Ensure `vercel.json` is present for clean URLs.

---

## 🎓 About ENSIA
This platform serves as the primary resource for the Web Development module at the **Ecole Nationale Supérieure d'Intelligence Artificielle (ENSIA)**.

---

## 📜 License

Copyright © 2026 **Mekki Zakaria Abdenour** & **ENSIA**

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

This platform was developed for educational use at ENSIA. Unauthorized commercial use or redistribution without attribution is prohibited.

---

<p align="center">
  <b>Built with ❤️ for the next generation of Web Developers</b><br>
  <sub>© 2026 Mekki Zakaria Abdenour — ENSIA</sub>
</p>


