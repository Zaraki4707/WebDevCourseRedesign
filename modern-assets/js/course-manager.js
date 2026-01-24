// Course Manager JavaScript
// Handles course locking/unlocking for teachers

// Teacher password (in production, use proper authentication)
const TEACHER_PASSWORD = 'teacher2023';
let isTeacherMode = false;

// Check if user is teacher (simple implementation)
function checkTeacherMode() {
  const savedMode = localStorage.getItem('teacherMode');
  if (savedMode === 'true') {
    isTeacherMode = true;
    showAdminPanel();
  }
}

// Toggle teacher mode
function toggleTeacherMode() {
  const password = prompt('Enter teacher password:');
  if (password === TEACHER_PASSWORD) {
    isTeacherMode = true;
    localStorage.setItem('teacherMode', 'true');
    window.CourseApp.showNotification('Teacher mode activated', 'success');
    showAdminPanel();
  } else {
    window.CourseApp.showNotification('Incorrect password', 'error');
  }
}

// Show admin panel
function showAdminPanel() {
  const panel = document.getElementById('adminPanel');
  if (panel) {
    panel.style.display = 'block';
  }
}

// Show course manager modal
function showCourseManager() {
  const modal = document.getElementById('courseManagerModal');
  modal.classList.add('active');
  populateCourseLocks();
}

// Close course manager modal
function closeCourseManager() {
  const modal = document.getElementById('courseManagerModal');
  modal.classList.remove('active');
}

// Populate course locks list
function populateCourseLocks() {
  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  const container = document.getElementById('courseLocksList');
  
  const courses = [
    { id: 'introduction', name: 'Introduction' },
    { id: 'html', name: 'HTML' },
    { id: 'css-fundamentals', name: 'CSS Fundamentals' },
    { id: 'css-layout', name: 'CSS Layout' },
    { id: 'positioning', name: 'Element Positioning' },
    { id: 'intro-javascript', name: 'Introduction to JavaScript' },
    { id: 'dom', name: 'DOM Manipulation' },
    { id: 'javascript-events', name: 'JavaScript Events' },
    { id: 'form-validation', name: 'Form Validation' },
    { id: 'jquery', name: 'jQuery' },
    { id: 'ajax', name: 'AJAX' },
    { id: 'php-intro', name: 'PHP Introduction' },
    { id: 'oop-php', name: 'Object-Oriented PHP' },
    { id: 'php-mysql', name: 'PHP & MySQL' },
    { id: 'sessions-cookies', name: 'Sessions & Cookies' },
    { id: 'security', name: 'Web Security' },
    { id: 'mvc', name: 'MVC Architecture' },
    { id: 'react', name: 'React JS' },
    { id: 'unit-testing', name: 'Unit Testing' }
  ];
  
  container.innerHTML = courses.map(course => {
    const lockData = locks[course.id] || { locked: false, unlockDate: null };
    const isLocked = typeof lockData === 'boolean' ? lockData : lockData.locked;
    const unlockDate = (lockData && lockData.unlockDate) ? lockData.unlockDate.split('T')[0] : '';
    
    return `
      <div class="course-lock-item">
        <div class="course-lock-info">
          <span class="course-lock-name">${course.name}</span>
          <div class="unlock-date-group">
            <label>Auto-unlock date:</label>
            <input type="date" class="unlock-date-input" 
                   data-course-id="${course.id}" 
                   value="${unlockDate}">
          </div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" 
                 class="lock-toggle"
                 data-course-id="${course.id}" 
                 ${!isLocked ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;
  }).join('');
}

// Save course locks
function saveCourseLocks() {
  const checkboxes = document.querySelectorAll('#courseLocksList .lock-toggle');
  const dateInputs = document.querySelectorAll('#courseLocksList .unlock-date-input');
  
  const locks = {};
  
  checkboxes.forEach((checkbox, index) => {
    const courseId = checkbox.dataset.courseId;
    const dateInput = dateInputs[index];
    
    locks[courseId] = {
      locked: !checkbox.checked,
      unlockDate: dateInput.value ? dateInput.value + 'T00:00:00' : null
    };
  });
  
  localStorage.setItem('courseLocks', JSON.stringify(locks));
  window.CourseApp.showNotification('Course locks updated successfully', 'success');
  closeCourseManager();
  
  // Reload page to reflect changes
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  checkTeacherMode();
  
  // Add teacher mode toggle button (hidden by default)
  // Teachers can access by pressing Ctrl+Shift+T
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      toggleTeacherMode();
    }
  });
  
  // Close modal when clicking outside
  const modal = document.getElementById('courseManagerModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeCourseManager();
      }
    });
  }
});

// Export functions
window.showCourseManager = showCourseManager;
window.closeCourseManager = closeCourseManager;
window.saveCourseLocks = saveCourseLocks;
window.toggleTeacherMode = toggleTeacherMode;
