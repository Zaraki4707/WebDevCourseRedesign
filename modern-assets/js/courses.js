// Courses Page JavaScript
// Handles course filtering, progress tracking, and navigation

document.addEventListener('DOMContentLoaded', function() {
  initCoursesPage();
  updateCourseProgress();
  setupCourseFilters();
  checkLockedCourses();
});

function initCoursesPage() {
  // Update overall progress
  const percentage = window.CourseApp.getCompletionPercentage();
  document.getElementById('overallProgress').style.width = percentage + '%';
  document.getElementById('progressText').textContent = percentage + '% Complete';
  
  // Mark completed courses
  document.querySelectorAll('.course-card').forEach(card => {
    const courseId = card.dataset.courseId;
    if (window.CourseApp.isLessonComplete(courseId)) {
      card.classList.add('completed');
    }
  });
}

function setupCourseFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCategories = document.querySelectorAll('.course-category');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      
      // Filter courses
      if (filter === 'all') {
        courseCategories.forEach(category => {
          category.style.display = 'block';
        });
      } else {
        courseCategories.forEach(category => {
          if (category.dataset.category === filter) {
            category.style.display = 'block';
          } else {
            category.style.display = 'none';
          }
        });
      }
    });
  });
}

function updateCourseProgress() {
  // Update progress indicators
  const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
  
  Object.keys(progress).forEach(courseId => {
    const card = document.querySelector(`[data-course-id="${courseId}"]`);
    if (card) {
      card.classList.add('completed');
    }
  });
}

function checkLockedCourses() {
  const isTeacher = localStorage.getItem('teacherMode') === 'true';
  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  
  Object.keys(locks).forEach(courseId => {
    const lockData = locks[courseId];
    const isLocked = lockData && (typeof lockData === 'boolean' ? lockData : lockData.locked);
    
    if (isLocked) {
      const card = document.querySelector(`[data-course-id="${courseId}"]`);
      if (card) {
        if (isTeacher) {
          card.classList.add('admin-locked');
          const btn = card.querySelector('.course-btn');
          btn.innerHTML = 'Override Lock <i class="fas fa-key"></i>';
        } else {
          // Check if it's scheduled to unlock soon
          let showAsLocked = true;
          if (lockData.unlockDate) {
            const now = new Date();
            const unlockDate = new Date(lockData.unlockDate);
            if (now >= unlockDate) {
              showAsLocked = false;
            }
          }
          
          if (showAsLocked) {
            card.classList.add('locked');
            const btn = card.querySelector('.course-btn');
            btn.innerHTML = '<i class="fas fa-lock"></i> Locked';
          }
        }
      }
    }
  });
}

function openCourse(courseId) {
  // Check if course is locked
  if (!window.CourseApp.isCourseUnlocked(courseId)) {
    window.CourseApp.showNotification('This course is not opened yet. Contact your teacher.', 'error');
    return;
  }
  
  // Map course IDs to actual course file names
  const courseMap = {
    'introduction': 'main-courses/Introduction.html',
    'html': 'main-courses/HTML.html',
    'css-fundamentals': 'main-courses/CSS_fundamentals.html',
    'css-layout': 'main-courses/CSS_Layout.html',
    'positioning': 'main-courses/ELEMENT_POSITIONING.html',
    'intro-javascript': 'main-courses/Introduction_JavaScript.html',
    'dom': 'main-courses/DOM.html',
    'javascript-events': 'main-courses/JavaScript_Events.html',
    'form-validation': 'main-courses/JS_Form_Validation.html',
    'jquery': 'main-courses/jQuery.html',
    'ajax': 'main-courses/AJAX.html',
    'php-intro': 'main-courses/Introduction_PHP.html',
    'oop-php': 'main-courses/OOPHP.html',
    'php-mysql': 'main-courses/PHP_MySQL.html',
    'sessions-cookies': 'main-courses/Sessions_Cookies.html',
    'security': 'optional-courses/Security.html',
    'mvc': 'optional-courses/MVC.html',
    'react': 'optional-courses/React_JS.html',
    'unit-testing': 'optional-courses/Unit_Testing.html',
    'lab-0': 'labs/Lab_0.html',
    'lab-1': 'labs/Lab_1.html',
    'lab-2': 'labs/Lab_2.html',
    'lab-3': 'labs/Lab_3.html',
    'lab-4': 'labs/Lab_4.html',
    'lab-5': 'labs/Lab_5.html',
    'lab-6': 'labs/Lab_6.html',
    'lab-7': 'labs/Lab_7.html',
    'lab-9': 'labs/Lab_9.html',
    'lab-10': 'labs/Lab_10.html',
    'lab-11': 'labs/Lab_11.html',
    'lab-12': 'labs/Lab_12.html',
    'lab-13': 'labs/Lab_13.html'
  };
  
  const courseUrl = courseMap[courseId];
  if (courseUrl) {
    window.location.href = courseUrl;
  } else {
    window.CourseApp.showNotification('Course page coming soon!', 'info');
  }
}

// Search functionality
function searchCourses(query) {
  const cards = document.querySelectorAll('.course-card');
  query = query.toLowerCase();
  
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    
    if (title.includes(query) || description.includes(query)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Export functions
window.openCourse = openCourse;
window.searchCourses = searchCourses;

