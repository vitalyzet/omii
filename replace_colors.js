const fs = require('fs');
const path = require('path');

const replacements = [
  // Primary (Teal)
  { regex: /#005944/gi, replacement: '#108474' },
  { regex: /#2563EB/gi, replacement: '#108474' },
  { regex: /#3E42A5/gi, replacement: '#108474' },
  { regex: /#7C3AED/gi, replacement: '#108474' },
  { regex: /#6D28D9/gi, replacement: '#108474' },
  { regex: /#7B3FF2/gi, replacement: '#108474' },
  { regex: /blue-600/g, replacement: '[#108474]' },
  { regex: /blue-700/g, replacement: '[#0e7063]' },
  { regex: /indigo-500/g, replacement: '[#108474]' },
  
  // Secondary / Accent (Orange)
  { regex: /#D94600/gi, replacement: '#fea74f' },
  { regex: /orange-600/g, replacement: '[#fea74f]' },
  { regex: /orange-50/g, replacement: '[#fff6ef]' },
  
  // Success / Green
  { regex: /#10B981/gi, replacement: '#008060' },
  { regex: /#22c55e/gi, replacement: '#008060' },
  { regex: /#16a34a/gi, replacement: '#006c51' },
  { regex: /#139E69/gi, replacement: '#008060' },
  
  // Light Backgrounds for Primary
  { regex: /#ebf3ff/gi, replacement: '#eef7f5' },
  { regex: /#F0F9FF/gi, replacement: '#eef7f5' },
  { regex: /blue-50/g, replacement: '[#eef7f5]' },
  
  // Borders for Primary
  { regex: /#d6e6ff/gi, replacement: '#bce0da' },
  { regex: /blue-100/g, replacement: '[#bce0da]' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated colors in ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
console.log('Done replacing colors.');
