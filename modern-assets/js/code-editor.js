// Interactive Code Editor Component
// Supports HTML, CSS, JavaScript, and PHP with live preview

class CodeEditor {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    
    // Check if container exists
    if (!this.container) {
      console.error(`CodeEditor: Container with id "${containerId}" not found`);
      return;
    }
    
    this.options = {
      language: options.language || 'html',
      theme: options.theme || 'dark',
      readOnly: options.readOnly || false,
      showPreview: options.showPreview !== false,
      initialCode: options.initialCode || '',
      height: options.height || '400px'
    };
    
    this.init();
  }

  init() {
    try {
      this.createEditorStructure();
      this.setupEditor();
      this.setupEventListeners();
      
      if (this.options.showPreview && this.options.language !== 'php') {
        this.updatePreview();
      }
      
      console.log(`CodeEditor initialized for container: ${this.container.id}`);
    } catch (error) {
      console.error('CodeEditor init failed:', error);
    }
  }

  createEditorStructure() {
    this.container.innerHTML = `
      <div class="code-editor-wrapper">
        <div class="editor-header">
          <div class="editor-tabs">
            <button class="editor-tab active" data-mode="code">
              <i class="fas fa-code"></i> Editor
            </button>
            ${this.options.showPreview && this.options.language !== 'php' ? `
              <button class="editor-tab" data-mode="preview">
                <i class="fas fa-eye"></i> Preview
              </button>
              <button class="editor-tab" data-mode="split">
                <i class="fas fa-columns"></i> Split View
              </button>
            ` : ''}
          </div>
          <div class="editor-actions">
            <button class="editor-btn" id="runCode">
              <i class="fas fa-play"></i> Run
            </button>
            <button class="editor-btn" id="resetCode">
              <i class="fas fa-undo"></i> Reset
            </button>
            <button class="editor-btn" id="copyCode">
              <i class="fas fa-copy"></i> Copy
            </button>
            <select class="language-selector" id="languageSelector">
              <option value="html" ${this.options.language === 'html' ? 'selected' : ''}>HTML</option>
              <option value="css" ${this.options.language === 'css' ? 'selected' : ''}>CSS</option>
              <option value="javascript" ${this.options.language === 'javascript' ? 'selected' : ''}>JavaScript</option>
              <option value="php" ${this.options.language === 'php' ? 'selected' : ''}>PHP</option>
            </select>
          </div>
        </div>
        <div class="editor-body">
          <div class="editor-section ${this.options.showPreview ? 'split-mode' : 'full-mode'}">
            <div class="line-numbers" id="lineNumbers"></div>
            <textarea 
              class="code-textarea" 
              id="codeTextarea" 
              spellcheck="false"
              placeholder="Write your code here..."
              ${this.options.readOnly ? 'readonly' : ''}
            >${this.options.initialCode}</textarea>
          </div>
          ${this.options.showPreview && this.options.language !== 'php' ? `
            <div class="preview-section" id="previewSection">
              <iframe id="previewFrame"></iframe>
            </div>
          ` : ''}
        </div>
        <div class="editor-footer">
          <span class="editor-info">
            <i class="fas fa-info-circle"></i> 
            <span id="editorStatus">Ready</span>
          </span>
          <span class="editor-info">
            Lines: <span id="lineCount">1</span> | 
            Characters: <span id="charCount">0</span>
          </span>
        </div>
      </div>
    `;
  }

  setupEditor() {
    this.textarea = document.getElementById('codeTextarea');
    this.lineNumbers = document.getElementById('lineNumbers');
    this.previewFrame = document.getElementById('previewFrame');
    
    // Initialize iframe document
    if (this.previewFrame) {
      this.initializeIframe();
    }
    
    this.updateLineNumbers();
    this.applySyntaxHighlighting();
  }

  initializeIframe() {
    // Ensure iframe has a document ready for manipulation
    try {
      const iframeDoc = this.previewFrame.contentDocument || this.previewFrame.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body></body></html>');
      iframeDoc.close();
    } catch (error) {
      console.error('Failed to initialize iframe:', error);
    }
  }

  setupEventListeners() {
    // Code input
    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      this.updateStats();
      this.applySyntaxHighlighting();
      
      if (this.options.showPreview && this.options.language !== 'php') {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => this.updatePreview(), 500);
      }
    });

    // Tab key support
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;
        this.textarea.value = value.substring(0, start) + '  ' + value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
        this.updateLineNumbers();
      }
    });

    // Scroll sync
    this.textarea.addEventListener('scroll', () => {
      this.lineNumbers.scrollTop = this.textarea.scrollTop;
    });

    // Run button
    const runBtn = document.getElementById('runCode');
    if (runBtn) {
      runBtn.addEventListener('click', () => this.runCode());
    }

    // Reset button
    const resetBtn = document.getElementById('resetCode');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCode());
    }

    // Copy button
    const copyBtn = document.getElementById('copyCode');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCode());
    }

    // Language selector
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
      langSelector.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }

    // Tab switching
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchMode(e.target.closest('.editor-tab').dataset.mode);
      });
    });
  }

  updateLineNumbers() {
    const lines = this.textarea.value.split('\n').length;
    this.lineNumbers.innerHTML = Array.from(
      { length: lines },
      (_, i) => `<span>${i + 1}</span>`
    ).join('');
  }

  updateStats() {
    const code = this.textarea.value;
    const lines = code.split('\n').length;
    const chars = code.length;
    
    document.getElementById('lineCount').textContent = lines;
    document.getElementById('charCount').textContent = chars;
  }

  applySyntaxHighlighting() {
    // Basic syntax highlighting using CSS classes
    // For production, consider using libraries like Prism.js or highlight.js
    const code = this.textarea.value;
    // This is a simplified version - full implementation would be more complex
  }

  updatePreview() {
    if (!this.previewFrame) {
      console.warn('Preview frame not available');
      return;
    }

    const code = this.textarea.value;
    const language = this.options.language;
    
    try {
      const iframeDoc = this.previewFrame.contentDocument || this.previewFrame.contentWindow.document;
      
      if (language === 'html') {
        // Check if code has full HTML structure
        const hasDoctype = code.trim().toLowerCase().startsWith('<!doctype');
        const hasHtmlTag = code.toLowerCase().includes('<html');
        
        if (hasDoctype && hasHtmlTag) {
          // Full HTML document - write entire document
          iframeDoc.open();
          iframeDoc.write(code);
          iframeDoc.close();
        } else {
          // HTML fragment - inject into body with proper styling
          iframeDoc.open();
          iframeDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      margin: 0;
      line-height: 1.6;
    }
  </style>
</head>
<body>
${code}
</body>
</html>`);
          iframeDoc.close();
        }
      } else if (language === 'css') {
        iframeDoc.open();
        iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${code}</style>
</head>
<body>
  <div class="preview-demo">
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <p>This is a paragraph with some <strong>bold</strong> and <em>italic</em> text.</p>
    <button>Button</button>
    <div class="box">Box Element</div>
  </div>
</body>
</html>`);
        iframeDoc.close();
      } else if (language === 'javascript') {
        iframeDoc.open();
        iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
    #output { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 10px; }
    .log { margin: 5px 0; }
  </style>
</head>
<body>
  <h3>Console Output:</h3>
  <div id="output"></div>
  <script>
    const output = document.getElementById('output');
    const originalLog = console.log;
    console.log = function(...args) {
      const logDiv = document.createElement('div');
      logDiv.className = 'log';
      logDiv.textContent = args.join(' ');
      output.appendChild(logDiv);
      originalLog.apply(console, args);
    };
    try {
      ${code}
    } catch (error) {
      output.innerHTML = '<div style="color: red;">Error: ' + error.message + '</div>';
    }
  <\/script>
</body>
</html>`);
        iframeDoc.close();
      }
      
      const statusEl = document.getElementById('editorStatus');
      if (statusEl) {
        statusEl.textContent = 'Preview updated';
        setTimeout(() => {
          statusEl.textContent = 'Ready';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to update preview:', error);
    }
  }

  runCode() {
    if (this.options.language === 'php') {
      this.showNotification('PHP code needs to be run on a server', 'info');
      return;
    }
    this.updatePreview();
    this.showNotification('Code executed successfully!', 'success');
  }

  resetCode() {
    this.textarea.value = this.options.initialCode;
    this.updateLineNumbers();
    this.updateStats();
    this.updatePreview();
    this.showNotification('Code reset to original', 'info');
  }

  copyCode() {
    this.textarea.select();
    document.execCommand('copy');
    this.showNotification('Code copied to clipboard!', 'success');
  }

  showNotification(message, type) {
    // Use CourseApp if available, otherwise use fallback
    if (window.CourseApp && typeof window.CourseApp.showNotification === 'function') {
      window.CourseApp.showNotification(message, type);
    } else {
      // Fallback notification
      console.log(`[${type.toUpperCase()}] ${message}`);
      alert(message);
    }
  }

  changeLanguage(language) {
    this.options.language = language;
    this.applySyntaxHighlighting();
    
    // Show/hide preview based on language
    const previewSection = document.getElementById('previewSection');
    if (previewSection) {
      previewSection.style.display = language === 'php' ? 'none' : 'block';
    }
  }

  switchMode(mode) {
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    const editorSection = document.querySelector('.editor-section');
    const previewSection = document.getElementById('previewSection');
    
    if (mode === 'code') {
      editorSection.style.display = 'flex';
      if (previewSection) previewSection.style.display = 'none';
    } else if (mode === 'preview') {
      editorSection.style.display = 'none';
      if (previewSection) previewSection.style.display = 'block';
    } else if (mode === 'split') {
      editorSection.style.display = 'flex';
      if (previewSection) previewSection.style.display = 'block';
    }
  }

  getValue() {
    return this.textarea.value;
  }

  setValue(code) {
    this.textarea.value = code;
    this.updateLineNumbers();
    this.updateStats();
    this.updatePreview();
  }
}

// Export for global use
window.CodeEditor = CodeEditor;
