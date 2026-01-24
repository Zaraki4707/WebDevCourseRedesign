// Progress Page JavaScript
// Handles progress calculations and visualizations

document.addEventListener('DOMContentLoaded', function() {
  loadProgressData();
  displayRecentActivity();
});

function loadProgressData() {
  const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  
  // Define course categories
  const categories = {
    fundamentals: ['introduction', 'html', 'css-fundamentals', 'css-layout', 'element-positioning'],
    javascript: ['javascript-intro', 'dom', 'javascript-events', 'form-validation', 'jquery', 'ajax'],
    backend: ['php-intro', 'oop-php', 'php-mysql', 'sessions-cookies'],
    advanced: ['security', 'mvc', 'react', 'unit-testing']
  };
  
  // Calculate overall progress
  const allCourses = Object.values(categories).flat();
  const totalCourses = allCourses.length;
  const completedCourses = allCourses.filter(id => progress[id]?.completed).length;
  const percentage = Math.round((completedCourses / totalCourses) * 100);
  
  // Update overall progress
  updateProgressCircle(percentage);
  document.getElementById('progressPercent').textContent = percentage + '%';
  document.getElementById('completedCount').textContent = completedCourses;
  document.getElementById('remainingCount').textContent = totalCourses - completedCourses;
  document.getElementById('bookmarkedCount').textContent = bookmarks.length;
  
  // Update category progress
  updateCategoryProgress('fundamentals', categories.fundamentals, progress);
  updateCategoryProgress('javascript', categories.javascript, progress);
  updateCategoryProgress('backend', categories.backend, progress);
  updateCategoryProgress('advanced', categories.advanced, progress);
}

function updateProgressCircle(percentage) {
  const circle = document.getElementById('progressRing');
  const circumference = 2 * Math.PI * 90; // radius = 90
  const offset = circumference - (percentage / 100) * circumference;
  
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);
}

function updateCategoryProgress(categoryId, courses, progress) {
  const completed = courses.filter(id => progress[id]?.completed).length;
  const total = courses.length;
  const percentage = Math.round((completed / total) * 100);
  
  // Update percentage text
  document.getElementById(categoryId + 'Percent').textContent = percentage + '%';
  
  // Update progress bar
  const bar = document.getElementById(categoryId + 'Bar');
  setTimeout(() => {
    bar.style.width = percentage + '%';
  }, 100);
  
  // Update info text
  document.getElementById(categoryId + 'Info').textContent = 
    `${completed} of ${total} lessons completed`;
}

function displayRecentActivity() {
  const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
  const activityList = document.getElementById('recentActivityList');
  
  // Get completed courses sorted by timestamp
  const completedCourses = Object.entries(progress)
    .filter(([id, data]) => data.completed)
    .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
    .slice(0, 10); // Show last 10
  
  if (completedCourses.length === 0) {
    activityList.innerHTML = '<p class="no-activity">No activity yet. Start learning to see your progress!</p>';
    return;
  }
  
  // Course name mapping
  const courseNames = {
    'introduction': 'Introduction',
    'html': 'HTML',
    'css-fundamentals': 'CSS Fundamentals',
    'css-layout': 'CSS Layout',
    'element-positioning': 'Element Positioning',
    'javascript-intro': 'Introduction to JavaScript',
    'dom': 'DOM Manipulation',
    'javascript-events': 'JavaScript Events',
    'form-validation': 'Form Validation',
    'jquery': 'jQuery',
    'ajax': 'AJAX',
    'php-intro': 'PHP Introduction',
    'oop-php': 'Object-Oriented PHP',
    'php-mysql': 'PHP & MySQL',
    'sessions-cookies': 'Sessions & Cookies',
    'security': 'Web Security',
    'mvc': 'MVC Architecture',
    'react': 'React JS',
    'unit-testing': 'Unit Testing'
  };
  
  activityList.innerHTML = completedCourses.map(([courseId, data]) => {
    const courseName = courseNames[courseId] || courseId;
    const timestamp = new Date(data.timestamp);
    const timeAgo = getTimeAgo(timestamp);
    
    return `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="activity-details">
          <h4>Completed: ${courseName}</h4>
          <p>You've successfully finished this lesson</p>
        </div>
        <div class="activity-time">
          ${timeAgo}
        </div>
      </div>
    `;
  }).join('');
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

function resetProgress() {
  const confirmed = confirm(
    'Are you sure you want to reset all your progress? This action cannot be undone.'
  );
  
  if (confirmed) {
    localStorage.removeItem('courseProgress');
    localStorage.removeItem('bookmarks');
    
    window.CourseApp.showNotification('Progress reset successfully', 'success');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Export functions
window.resetProgress = resetProgress;
