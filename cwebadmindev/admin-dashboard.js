// Admin Dashboard JavaScript

const COURSES = [
  { id: 'introduction', name: 'Introduction', file: 'Introduction.html', order: 1 },
  { id: 'html', name: 'HTML Fundamentals', file: 'HTML.html', order: 2 },
  { id: 'css-fundamentals', name: 'CSS Fundamentals', file: 'CSS_fundamentals.html', order: 3 },
  { id: 'css-layout', name: 'CSS Layout', file: 'CSS_Layout.html', order: 4 },
  { id: 'positioning', name: 'Element Positioning', file: 'ELEMENT_POSITIONING.html', order: 5 },
  { id: 'intro-javascript', name: 'Introduction to JavaScript', file: 'Introduction_JavaScript.html', order: 6 },
  { id: 'dom', name: 'DOM Manipulation', file: 'DOM.html', order: 7 },
  { id: 'javascript-events', name: 'JavaScript Events', file: 'JavaScript_Events.html', order: 8 },
  { id: 'form-validation', name: 'JS Form Validation', file: 'JS_Form_Validation.html', order: 9 },
  { id: 'ajax', name: 'AJAX', file: 'AJAX.html', order: 10 },
  { id: 'jquery', name: 'jQuery', file: 'jQuery.html', order: 11 },
  { id: 'php-intro', name: 'Introduction to PHP', file: 'Introduction_PHP.html', order: 12 },
  { id: 'php-mysql', name: 'PHP & MySQL', file: 'PHP_MySQL.html', order: 13 },
  { id: 'sessions-cookies', name: 'Sessions & Cookies', file: 'Sessions_Cookies.html', order: 14 },
  { id: 'oop-php', name: 'OOP in PHP', file: 'OOPHP.html', order: 15 },
  { id: 'mvc', name: 'MVC Architecture', file: 'MVC.html', order: 16 },
  { id: 'security', name: 'Web Security', file: 'Security.html', order: 17 },
  { id: 'unit-testing', name: 'Unit Testing', file: 'Unit_Testing.html', order: 18 },
  { id: 'react', name: 'React JS', file: 'React_JS.html', order: 19 },
  { id: 'lab-0', name: 'Lab 0: Basic Setup', file: 'Lab_0.html', order: 20 },
  { id: 'lab-1', name: 'Lab 1: HTML Structure', file: 'Lab_1.html', order: 21 },
  { id: 'lab-2', name: 'Lab 2: CSS Styling', file: 'Lab_2.html', order: 22 },
  { id: 'lab-3', name: 'Lab 3: Layouts', file: 'Lab_3.html', order: 23 },
  { id: 'lab-4', name: 'Lab 4: Advanced CSS', file: 'Lab_4.html', order: 24 },
  { id: 'lab-5', name: 'Lab 5: JavaScript Basics', file: 'Lab_5.html', order: 25 },
  { id: 'lab-6', name: 'Lab 6: DOM Events', file: 'Lab_6.html', order: 26 },
  { id: 'lab-7', name: 'Lab 7: Form Validation', file: 'Lab_7.html', order: 27 },
  { id: 'lab-9', name: 'Lab 9: AJAX & API', file: 'Lab_9.html', order: 28 },
  { id: 'lab-10', name: 'Lab 10: PHP Basics', file: 'Lab_10.html', order: 29 },
  { id: 'lab-11', name: 'Lab 11: PHP Forms', file: 'Lab_11.html', order: 30 },
  { id: 'lab-12', name: 'Lab 12: MySQL Integration', file: 'Lab_12.html', order: 31 },
  { id: 'lab-13', name: 'Lab 13: Project Completion', file: 'Lab_13.html', order: 32 }
];

let adminSession = null;
let currentCourseId = null;

// Initialize dashboard
function init() {
  // Check authentication
  const sessionData = localStorage.getItem('adminSession');
  if (!sessionData) {
    window.location.href = 'admin-login.html';
    return;
  }

  adminSession = JSON.parse(sessionData);
  
  // Display admin info
  document.getElementById('adminEmail').textContent = adminSession.email;
  document.getElementById('adminRole').textContent = adminSession.role === 'super' ? 'Super Admin' : 'Admin';

  // Show permission notice for normal admins
  if (adminSession.role === 'normal') {
    document.getElementById('permissionNotice').style.display = 'flex';
  } else if (adminSession.role === 'super') {
    // Show deadline manager for super admins
    document.getElementById('deadlineManager').style.display = 'block';
    renderDeadlines();
  }

  // Initialize course locks if not exists
  if (!localStorage.getItem('courseLocks')) {
    const defaultLocks = {};
    COURSES.forEach((course, index) => {
      defaultLocks[course.id] = {
        locked: index !== 0, // First course unlocked, rest locked
        unlockDate: null,
        lockedBy: null,
        lockedAt: null
      };
    });
    localStorage.setItem('courseLocks', JSON.stringify(defaultLocks));
  }

  // Check scheduled unlocks
  checkScheduledUnlocks();

  // Render courses
  renderCourses();
  updateStats();

  // Set up auto-check for scheduled unlocks
  setInterval(checkScheduledUnlocks, 60000); // Check every minute
}

function renderCourses() {
  const tbody = document.getElementById('coursesTableBody');
  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  const isSuperAdmin = adminSession.role === 'super';

  tbody.innerHTML = '';

  COURSES.forEach(course => {
    const lockData = locks[course.id] || { locked: true, unlockDate: null };
    const isLocked = lockData.locked;
    const hasSchedule = lockData.unlockDate !== null;

    let status, statusClass;
    if (!isLocked) {
      status = 'Unlocked';
      statusClass = 'unlocked';
    } else if (hasSchedule) {
      status = 'Scheduled';
      statusClass = 'scheduled';
    } else {
      status = 'Locked';
      statusClass = 'locked';
    }

    const unlockDateStr = hasSchedule 
      ? new Date(lockData.unlockDate).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        })
      : '-';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="course-name">
          <i class="fas fa-book"></i>
          <span>${course.name}</span>
        </div>
      </td>
      <td>
        <span class="status-badge ${statusClass}">${status}</span>
      </td>
      <td>${unlockDateStr}</td>
      <td>
        <div class="action-btns">
          ${isLocked ? `
            <button class="btn-small btn-unlock ${!isSuperAdmin ? 'btn-disabled' : ''}" 
                    onclick="toggleLock('${course.id}')" 
                    ${!isSuperAdmin ? 'disabled' : ''}>
              <i class="fas fa-unlock"></i>
              Unlock
            </button>
          ` : `
            <button class="btn-small btn-lock ${!isSuperAdmin ? 'btn-disabled' : ''}" 
                    onclick="toggleLock('${course.id}')" 
                    ${!isSuperAdmin ? 'disabled' : ''}>
              <i class="fas fa-lock"></i>
              Lock
            </button>
          `}
          <button class="btn-small btn-schedule ${!isSuperAdmin ? 'btn-disabled' : ''}" 
                  onclick="openScheduleModal('${course.id}')" 
                  ${!isSuperAdmin ? 'disabled' : ''}>
            <i class="fas fa-clock"></i>
            Schedule
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function toggleLock(courseId) {
  if (adminSession.role !== 'super') {
    alert('Only super admins can lock/unlock courses');
    return;
  }

  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  const currentLock = locks[courseId];

  locks[courseId] = {
    ...currentLock,
    locked: !currentLock.locked,
    unlockDate: currentLock.locked ? null : currentLock.unlockDate, // Clear schedule if unlocking
    lockedBy: adminSession.email,
    lockedAt: new Date().toISOString()
  };

  localStorage.setItem('courseLocks', JSON.stringify(locks));
  renderCourses();
  updateStats();
}

function openScheduleModal(courseId) {
  if (adminSession.role !== 'super') {
    alert('Only super admins can schedule unlocks');
    return;
  }

  currentCourseId = courseId;
  const course = COURSES.find(c => c.id === courseId);
  document.getElementById('modalCourseName').textContent = course.name;

  // Set min date to now
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 16);
  document.getElementById('unlockDate').min = dateStr;
  document.getElementById('unlockDate').value = dateStr;

  document.getElementById('scheduleModal').classList.add('show');
}

function closeModal() {
  document.getElementById('scheduleModal').classList.remove('show');
  currentCourseId = null;
}

function saveSchedule() {
  const unlockDate = document.getElementById('unlockDate').value;
  
  if (!unlockDate) {
    alert('Please select a date and time');
    return;
  }

  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  
  locks[currentCourseId] = {
    ...locks[currentCourseId],
    locked: true,
    unlockDate: new Date(unlockDate).toISOString(),
    lockedBy: adminSession.email,
    lockedAt: new Date().toISOString()
  };

  localStorage.setItem('courseLocks', JSON.stringify(locks));
  closeModal();
  renderCourses();
  updateStats();
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
        locks[courseId] = {
          ...lockData,
          locked: false,
          unlockDate: null
        };
        updated = true;
      }
    }
  });

  if (updated) {
    localStorage.setItem('courseLocks', JSON.stringify(locks));
    renderCourses();
    updateStats();
  }
}

function updateStats() {
  const locks = JSON.parse(localStorage.getItem('courseLocks') || '{}');
  
  let unlockedCount = 0;
  let lockedCount = 0;
  let scheduledCount = 0;

  Object.values(locks).forEach(lockData => {
    if (!lockData.locked) {
      unlockedCount++;
    } else if (lockData.unlockDate) {
      scheduledCount++;
      lockedCount++;
    } else {
      lockedCount++;
    }
  });

  document.getElementById('totalCourses').textContent = COURSES.length;
  document.getElementById('unlockedCount').textContent = unlockedCount;
  document.getElementById('lockedCount').textContent = lockedCount;
  document.getElementById('scheduledCount').textContent = scheduledCount;
}

function logout() {
  localStorage.removeItem('adminSession');
  window.location.href = 'admin-login.html';
}

// ===== DEADLINE MANAGEMENT (SUPER ADMIN) =====
function renderDeadlines() {
  const tbody = document.getElementById('deadlinesTableBody');
  if (!tbody) return;
  
  const deadlines = JSON.parse(localStorage.getItem('courseDeadlines') || '[]');
  tbody.innerHTML = '';

  if (deadlines.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: var(--gray-dark);">No deadlines set.</td></tr>';
    return;
  }

  deadlines.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${new Date(item.date).toLocaleDateString()}</td>
      <td>
        <button onclick="deleteDeadline(${index})" class="btn-small btn-lock">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function addDeadline() {
  const nameInput = document.getElementById('deadlineName');
  const dateInput = document.getElementById('deadlineDate');
  
  if (!nameInput.value || !dateInput.value) {
    alert('Please fill in both the name and the date');
    return;
  }

  const deadlines = JSON.parse(localStorage.getItem('courseDeadlines') || '[]');
  deadlines.push({
    name: nameInput.value,
    date: dateInput.value
  });

  localStorage.setItem('courseDeadlines', JSON.stringify(deadlines));
  
  // Reset inputs
  nameInput.value = '';
  dateInput.value = '';
  
  renderDeadlines();
  alert('Deadline added successfully!');
}

function deleteDeadline(index) {
  if (!confirm('Are you sure you want to delete this deadline?')) return;
  
  const deadlines = JSON.parse(localStorage.getItem('courseDeadlines') || '[]');
  deadlines.splice(index, 1);
  localStorage.setItem('courseDeadlines', JSON.stringify(deadlines));
  renderDeadlines();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
