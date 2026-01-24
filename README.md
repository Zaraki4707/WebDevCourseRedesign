# Web Development Course – ENSIA

This project is a modern, interactive web development curriculum for ENSIA students. It is designed for static hosting and is ready for deployment on [Vercel](https://vercel.com/).

---

## 🚀 Deployment (Vercel)

1. **Automatic Deploy:**
	- Every push to the `main` branch will trigger a new deployment on Vercel.
	- The root `index.html` is the homepage. All main pages are in the root directory.

2. **Manual Deploy:**
	- Import this repo into Vercel via the dashboard.
	- Set the output/public directory to `.` (the root folder).
	- No build command is needed (static site).

---

## 📁 Project Structure
- `index.html` – Home page (root)
- `modern-courses.html` – Course catalog
- `modern-teachers.html` – Teachers page
- `modern-progress.html` – Progress tracker
- `labs/` – All practical lab exercises (Lab 0–13)
- `main-courses/` – Main course content (HTML, CSS, JS, PHP, etc.)
- `optional-courses/` – Optional/specialized tracks (React, Security, MVC, Unit Testing)
- `modern-assets/` – CSS and JS for the modern UI
- `assets/` – Images and icons
- `SRC/` – Legacy and supporting files

---

## 📝 Notes
- All internal links and asset paths are relative to the root for Vercel compatibility.
- No server-side code (PHP) will run on Vercel; only static HTML, CSS, and JS are supported.
- For dynamic/server features, use Vercel Serverless Functions or an external backend.

---

**Happy learning and teaching!**


