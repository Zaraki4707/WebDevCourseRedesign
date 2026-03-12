// Modern Web Development Course - Main JavaScript
// Handles navigation, progress tracking, and interactive features

// ===== STICKY NAVBAR WITH BLUR =====
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ===== NAVIGATION TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize sticky navbar
  initStickyNavbar();
  
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (navMenu && !event.target.closest('.navbar')) {
      navMenu.classList.remove('active');
    }
  });

  // Initialize progress tracking
  initProgressTracking();
  
  // Initialize course locks
  initCourseLocks();

  // Automatic course access check for lesson pages
  const lessonHeader = document.querySelector('.lesson-header');
  if (lessonHeader && lessonHeader.dataset.courseId) {
    const courseId = lessonHeader.dataset.courseId;
    if (!isCourseUnlocked(courseId)) {
      window.location.href = '../locked.html?course=' + courseId;
    }
  }
});

// ===== PROGRESS TRACKING SYSTEM =====
function initProgressTracking() {
  if (!localStorage.getItem('courseProgress')) {
    localStorage.setItem('courseProgress', JSON.stringify({}));
  }
}

function markLessonComplete(lessonId) {
  const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
  progress[lessonId] = {
    completed: true,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('courseProgress', JSON.stringify(progress));
  updateProgressUI();
}

function isLessonComplete(lessonId) {
  const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
  return progress[lessonId]?.completed || false;
}

function getCompletionPercentage() {
  const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
  const totalLessons = 20; // Update based on actual course count
  const completedLessons = Object.keys(progress).length;
  return Math.round((completedLessons / totalLessons) * 100);
}

function updateProgressUI() {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  const progressTexts = document.querySelectorAll('.progress-percentage');
  const percentage = getCompletionPercentage();
  
  progressBars.forEach(bar => {
    bar.style.width = percentage + '%';
  });
  
  progressTexts.forEach(text => {
    text.textContent = percentage + '%';
  });
}

// ===== COURSE LOCKING SYSTEM =====
function initCourseLocks() {
  // Initialize locks if not exists
  if (!localStorage.getItem('courseLocks')) {
    const defaultLocks = {
      'introduction': { locked: false, unlockDate: null },
      'html': { locked: true, unlockDate: null },
      'css-fundamentals': { locked: true, unlockDate: null },
      'css-layout': { locked: true, unlockDate: null },
      'positioning': { locked: true, unlockDate: null },
      'intro-javascript': { locked: true, unlockDate: null },
      'dom': { locked: true, unlockDate: null },
      'javascript-events': { locked: true, unlockDate: null },
      'form-validation': { locked: true, unlockDate: null },
      'ajax': { locked: true, unlockDate: null },
      'jquery': { locked: true, unlockDate: null },
      'php-intro': { locked: true, unlockDate: null },
      'php-mysql': { locked: true, unlockDate: null },
      'sessions-cookies': { locked: true, unlockDate: null },
      'oop-php': { locked: true, unlockDate: null },
      'mvc': { locked: true, unlockDate: null },
      'security': { locked: true, unlockDate: null },
      'unit-testing': { locked: true, unlockDate: null },
      'react': { locked: true, unlockDate: null },
      'lab-0': { locked: false, unlockDate: null },
      'lab-1': { locked: false, unlockDate: null },
      'lab-2': { locked: false, unlockDate: null },
      'lab-3': { locked: false, unlockDate: null },
      'lab-4': { locked: false, unlockDate: null },
      'lab-5': { locked: false, unlockDate: null },
      'lab-6': { locked: false, unlockDate: null },
      'lab-7': { locked: false, unlockDate: null },
      'lab-9': { locked: false, unlockDate: null },
      'lab-10': { locked: false, unlockDate: null },
      'lab-11': { locked: false, unlockDate: null },
      'lab-12': { locked: false, unlockDate: null },
      'lab-13': { locked: false, unlockDate: null }
    };
    localStorage.setItem('courseLocks', JSON.stringify(defaultLocks));
  }
  
  // Check scheduled unlocks
  checkScheduledUnlocks();
}

function checkScheduledUnlocks() {
  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  const now = new Date();
  let updated = false;

  Object.keys(locks).forEach(courseId => {
    const lockData = locks[courseId];
    if (lockData.locked && lockData.unlockDate) {
      const unlockDate = new Date(lockData.unlockDate);
      if (now >= unlockDate) {
        locks[courseId].locked = false;
        locks[courseId].unlockDate = null;
        updated = true;
      }
    }
  });

  if (updated) {
    localStorage.setItem('courseLocks', JSON.stringify(locks));
  }
}

function isCourseUnlocked(courseId) {
  // Teachers bypass locks
  if (localStorage.getItem('teacherMode') === 'true') return true;

  const locksString = localStorage.getItem('courseLocks');
  let locks = {};
  
  try {
    locks = JSON.parse(locksString || '{}');
  } catch (e) {
    locks = {};
  }

  // Handle both formats (boolean or object)
  const lockData = locks[courseId];
  
  // If the course isn't in the locks but it's a lab, default to UNLOCKED
  if (lockData === undefined && courseId.startsWith('lab-')) {
    return true;
  }

  if (typeof lockData === 'boolean') return !lockData;
  if (lockData && typeof lockData === 'object') return !lockData.locked;
  
  return true; // Default to unlocked if not found
}

function checkCourseAccess(courseId) {
  if (!isCourseUnlocked(courseId)) {
    window.location.href = '../locked.html?course=' + courseId;
    return false;
  }
  return true;
}

function toggleCourseLock(courseId, teacherMode = false, unlockDate = null) {
  if (!teacherMode) return false;
  
  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  const current = locks[courseId];
  
  if (typeof current === 'boolean') {
    locks[courseId] = { locked: !current, unlockDate: unlockDate };
  } else if (current && typeof current === 'object') {
    locks[courseId].locked = !locks[courseId].locked;
    locks[courseId].unlockDate = unlockDate;
  } else {
    locks[courseId] = { locked: true, unlockDate: unlockDate };
  }
  
  localStorage.setItem('courseLocks', JSON.stringify(locks));
  return true;
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== ANIMATE ON SCROLL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.objective-card, .info-card, .course-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#FF6B35'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Export functions for use in other modules
window.CourseApp = {
  markLessonComplete,
  isLessonComplete,
  getCompletionPercentage,
  isCourseUnlocked,
  toggleCourseLock,
  showNotification
};

