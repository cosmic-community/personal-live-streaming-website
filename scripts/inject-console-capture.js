const fs = require('fs');
const path = require('path');

function injectConsoleScript() {
  const buildDir = path.join(process.cwd(), '.next');
  const outDir = path.join(process.cwd(), 'out');
  
  // Check if we're using static export (out directory) or server build
  const targetDir = fs.existsSync(outDir) ? outDir : buildDir;
  
  if (!fs.existsSync(targetDir)) {
    console.log('No build directory found. Skipping console capture injection.');
    return;
  }

  const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
  
  function injectIntoHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only inject if not already present
    if (!content.includes('dashboard-console-capture.js')) {
      // Try to inject before closing head tag, or before closing body tag as fallback
      if (content.includes('</head>')) {
        content = content.replace('</head>', `  ${scriptTag}\n</head>`);
      } else if (content.includes('</body>')) {
        content = content.replace('</body>', `  ${scriptTag}\n</body>`);
      } else {
        // If neither head nor body tags found, append to end
        content += `\n${scriptTag}`;
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`Injected console capture script into: ${filePath}`);
    }
  }
  
  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDirectory(fullPath);
      } else if (file.endsWith('.html')) {
        injectIntoHtml(fullPath);
      }
    });
  }
  
  try {
    walkDirectory(targetDir);
    console.log('Console capture script injection completed.');
  } catch (error) {
    console.error('Error injecting console capture script:', error);
  }
}

// Run the injection
injectConsoleScript();