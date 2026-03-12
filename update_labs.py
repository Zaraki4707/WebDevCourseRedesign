import os
import re

dir_path = r'c:\Users\Nitro\Desktop\update mhmoudi\'s website\Web_Development_Course\labs'
button_html = """
<div style="margin: 20px; text-align: left;">
    <a href="../pages/courses.html" style="text-decoration: none; color: #FF6B35; font-weight: bold; display: inline-flex; align-items: center; gap: 8px;">
        <i class="fas fa-arrow-left"></i> Back to Courses
    </a>
</div>
"""

for filename in os.listdir(dir_path):
    if filename.endswith('.html'):
        file_path = os.path.join(dir_path, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Fix broken h1 tag
        # The user specifically mentioned &gt;&lt;h1&gt; inside the tag.
        # It looks like <h1 class="lesson-header"&gt;&lt;h1>
        content = content.replace('&gt;&lt;h1>', '>')

        # 2. Add button - only if not already present
        if '../pages/courses.html' not in content:
            if '<main>' in content:
                # Insert after <main>
                content = content.replace('<main>', f'<main>{button_html}')
            elif '<body>' in content:
                content = content.replace('<body>', f'<body>{button_html}')

        # 3. Ensure CSS paths are correct (Styles.css, HTML.css, Nav_Bar.css)
        # Should be ../SRC/CSS/
        content = re.sub(r'href="[^"]*Styles\.css"', r'href="../SRC/CSS/Styles.css"', content)
        content = re.sub(r'href="[^"]*HTML\.css"', r'href="../SRC/CSS/HTML.css"', content)
        content = re.sub(r'href="[^"]*Nav_Bar\.css"', r'href="../SRC/CSS/Nav_Bar.css"', content)

        # 4. Ensure image paths are correct
        # Should be ../SRC/IMAGES/
        # Check for paths that contain SRC/IMAGES but are not starting with ../
        # or paths that only have IMAGES/
        
        # This regex looks for src=" followed by anything containing SRC/IMAGES/ but not prefixed with ../
        content = re.sub(r'src="(?!(\.\./)+SRC/IMAGES/)[^"]*SRC/IMAGES/([^"]+)"', r'src="../SRC/IMAGES/\2"', content)
        # This regex looks for src=" followed by IMAGES/ (no SRC/)
        content = re.sub(r'src="(?!(\.\./)+SRC/IMAGES/)[^"]*IMAGES/([^"]+)"', r'src="../SRC/IMAGES/\2"', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

print("Finished processing all lab files.")
