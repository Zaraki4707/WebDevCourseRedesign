// Lesson Page JavaScript
// Handles lesson navigation, progress, and sidebar

document.addEventListener('DOMContentLoaded', function() {
  initLessonPage();
  setupSidebarToggle();
  loadLessonProgress();
});

function initLessonPage() {
  // Get course from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const course = urlParams.get('course');
  
  if (course) {
    loadCourseContent(course);
  }
  
  populateSidebar();
}

function loadCourseContent(courseName) {
  // Update page title and breadcrumb
  document.getElementById('courseTitle').textContent = courseName + ' - Web Development';
  document.getElementById('breadcrumbCourse').textContent = courseName;
  document.getElementById('lessonTitle').textContent = courseName;
}

function populateSidebar() {
  const sidebar = document.getElementById('sidebarContent');
  
  const courses = [
    {
      category: 'Fundamentals',
      lessons: [
        { id: 'introduction', name: 'Introduction', icon: 'fa-book-open' },
        { id: 'html', name: 'HTML', icon: 'fab fa-html5' },
        { id: 'css-fundamentals', name: 'CSS Fundamentals', icon: 'fab fa-css3-alt' },
        { id: 'css-layout', name: 'CSS Layout', icon: 'fa-th-large' },
        { id: 'element-positioning', name: 'Element Positioning', icon: 'fa-vector-square' }
      ]
    },
    {
      category: 'JavaScript',
      lessons: [
        { id: 'javascript-intro', name: 'Introduction to JavaScript', icon: 'fab fa-js-square' },
        { id: 'dom', name: 'DOM Manipulation', icon: 'fa-project-diagram' },
        { id: 'javascript-events', name: 'JavaScript Events', icon: 'fa-mouse-pointer' },
        { id: 'form-validation', name: 'Form Validation', icon: 'fa-check-circle' },
        { id: 'jquery', name: 'jQuery', icon: 'fa-code-branch' },
        { id: 'ajax', name: 'AJAX', icon: 'fa-sync-alt' }
      ]
    },
    {
      category: 'Backend',
      lessons: [
        { id: 'php-intro', name: 'PHP Introduction', icon: 'fab fa-php' },
        { id: 'oop-php', name: 'Object-Oriented PHP', icon: 'fa-cube' },
        { id: 'php-mysql', name: 'PHP & MySQL', icon: 'fa-database' },
        { id: 'sessions-cookies', name: 'Sessions & Cookies', icon: 'fa-cookie' }
      ]
    },
    {
      category: 'Advanced',
      lessons: [
        { id: 'security', name: 'Web Security', icon: 'fa-shield-alt' },
        { id: 'mvc', name: 'MVC Architecture', icon: 'fa-sitemap' },
        { id: 'react', name: 'React JS', icon: 'fab fa-react' },
        { id: 'unit-testing', name: 'Unit Testing', icon: 'fa-vial' }
      ]
    }
  ];
  
  let html = '';
  
  courses.forEach(section => {
    html += `<div class="sidebar-section">`;
    html += `<div class="sidebar-section-title">${section.category}</div>`;
    
    section.lessons.forEach(lesson => {
      const isCompleted = window.CourseApp.isLessonComplete(lesson.id);
      const isLocked = !window.CourseApp.isCourseUnlocked(lesson.id);
      const isActive = window.location.search.includes(lesson.id);
      
      let classes = 'sidebar-link';
      if (isCompleted) classes += ' completed';
      if (isLocked) classes += ' locked';
      if (isActive) classes += ' active';
      
      html += `
        <a href="lesson.html?course=${lesson.id}" class="${classes}">
          <i class="fas ${lesson.icon}"></i>
          <span>${lesson.name}</span>
        </a>
      `;
    });
    
    html += `</div>`;
  });
  
  sidebar.innerHTML = html;
}

function setupSidebarToggle() {
  const sidebar = document.getElementById('lessonSidebar');
  const toggle = document.getElementById('sidebarToggle');
  const close = document.getElementById('sidebarClose');
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.add('active');
    });
  }
  
  if (close) {
    close.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });
}

function loadLessonProgress() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  
  if (courseId && window.CourseApp.isLessonComplete(courseId)) {
    const completeBtn = document.querySelector('.action-btn');
    if (completeBtn) {
      completeBtn.classList.add('completed');
      completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
    }
  }
}

function markComplete() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  
  if (courseId) {
    window.CourseApp.markLessonComplete(courseId);
    
    const btn = event.target.closest('.action-btn');
    btn.classList.add('completed');
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
    
    window.CourseApp.showNotification('Lesson marked as complete!', 'success');
    
    // Update sidebar
    populateSidebar();
  }
}

function toggleBookmark() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course');
  
  if (courseId) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (bookmarks.includes(courseId)) {
      bookmarks = bookmarks.filter(id => id !== courseId);
      window.CourseApp.showNotification('Bookmark removed', 'info');
      event.target.closest('.action-btn').innerHTML = '<i class="fas fa-bookmark"></i> Bookmark';
    } else {
      bookmarks.push(courseId);
      window.CourseApp.showNotification('Lesson bookmarked!', 'success');
      event.target.closest('.action-btn').innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
}

// Export functions
window.markComplete = markComplete;
window.toggleBookmark = toggleBookmark;
