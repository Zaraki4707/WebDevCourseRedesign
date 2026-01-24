// Global Configuration for Web Dev Course
// Update this file and push to GitHub to change settings for ALL students

window.CourseGlobalConfig = {
    // These deadlines are visible to everyone
    deadlines: [
        { name: "Lab 1: Environment Setup", date: "2026-02-10" },
        { name: "Lab 2: HTML & CSS Submission", date: "2026-02-25" },
        { name: "Midterm Project Proposal", date: "2026-03-15" }
    ],

    // Default locking state for courses (if not changed by user)
    // true = locked, false = unlocked
    defaultLocks: {
        'introduction': false,
        'html': false,
        'css-fundamentals': true,
        // ... you can add specific overrides here if needed
    }
};
