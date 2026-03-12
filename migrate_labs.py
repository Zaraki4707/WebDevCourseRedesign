import os
import re
from bs4 import BeautifulSoup

dir_path = r'c:\Users\Nitro\Desktop\update mhmoudi\'s website\Web_Development_Course\labs'

def migrate_lab_file(file_path, filename):
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract lab number from filename (e.g., Lab_10.html -> 10)
    match = re.search(r'Lab_(\d+)', filename)
    lab_num = match.group(1) if match else "X"

    # Extract Title
    title_tag = soup.find('title')
    full_title = title_tag.get_text() if title_tag else f"Lab {lab_num}"
    
    # Try to clean title (remove "Lab X: " prefix if it exists)
    clean_title = re.sub(r'^Lab\s+\d+:\s*', '', full_title)
    if " - Web Development Platform" in clean_title:
        clean_title = clean_title.replace(" - Web Development Platform", "")

    # Extract original content
    # We want everything inside <main> except the back button and the <h1>
    main_tag = soup.find('main')
    if not main_tag:
        # Fallback if no <main> tag
        body_tag = soup.find('body')
        content_nodes = list(body_tag.children) if body_tag else []
    else:
        content_nodes = list(main_tag.children)

    # Filter out the back link div and the h1 lesson-header
    filtered_content = ""
    for node in content_nodes:
        node_str = str(node)
        # Skip the back courses button if it exists
        if 'courses.html' in node_str and 'Back to Courses' in node_str:
            continue
        # Skip the h1 lesson-header
        if node.name == 'h1' and ('lesson-header' in node.get('class', []) or node.get_text().startswith(f'Lab {lab_num}')):
            continue
        filtered_content += node_str

    # Extract any extra scripts (not the standard ones we'll add)
    extra_scripts = ""
    for script in soup.find_all('script'):
        src = script.get('src', '')
        # If it's not a relative path to modern-assets or a CDN we know, keep it
        if src and not any(x in src for x in ['modern-assets', 'cdnjs.cloudflare.com']):
            extra_scripts += str(script) + "\n"
        elif not src:
            # Inline script?
            extra_scripts += str(script) + "\n"

    # Construct New HTML
    new_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="icon" type="image/png" href="../assets/realfavicon.png">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab {lab_num}: {clean_title} - Web Development Platform</title>
  <link rel="stylesheet" href="../modern-assets/css/main.css">
  <link rel="stylesheet" href="../modern-assets/css/lesson.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-logo"><i class="fas fa-code"></i> <span>Web Dev Course</span></div>
      <button class="nav-toggle" id="navToggle"><i class="fas fa-bars"></i></button>
      <ul class="nav-menu" id="navMenu">
        <li><a href="../pages/modern-index.html"><i class="fas fa-home"></i> Home</a></li>
        <li><a href="../pages/courses.html"><i class="fas fa-book"></i> Courses</a></li>
        <li><a href="../pages/teachers.html"><i class="fas fa-chalkboard-teacher"></i> Teachers</a></li>
        <li><a href="../pages/progress.html"><i class="fas fa-chart-line"></i> Progress</a></li>
      </ul>
    </div>
  </nav>

  <div class="lesson-container">
    <main class="lesson-main">
      <div class="lesson-header" data-course-id="lab-{lab_num}">
        <div class="header-content">
          <div class="breadcrumb">
            <a href="../pages/courses.html">Courses</a>
            <i class="fas fa-chevron-right"></i>
            <span>Labs</span>
            <i class="fas fa-chevron-right"></i>
            <span>Lab {lab_num}</span>
          </div>
          <h1>Lab {lab_num}: {clean_title}</h1>
        </div>
      </div>

      <div class="lesson-content">
{filtered_content.strip()}
      </div>
    </main>
  </div>

  <script src="../modern-assets/js/main.js"></script>
  <script src="../modern-assets/js/lesson.js"></script>
  {extra_scripts.strip()}
</body>
</html>"""

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_html)

for filename in os.listdir(dir_path):
    if filename.endswith('.html') and filename.startswith('Lab_'):
        print(f"Processing {filename}...")
        migrate_lab_file(os.path.join(dir_path, filename), filename)

print("Finished processing all lab files.")
