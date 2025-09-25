/**
 * Simple Design Agent Validation Runner
 * 
 * This script runs basic design validation without TypeScript compilation
 */

const fs = require('fs');
const path = require('path');

// Design rules for validation
const DESIGN_RULES = {
  // Typography rules
  noIconsInTitles: {
    pattern: /[🎯⚙️🔧📊📈📉🎨🎭🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]/,
    severity: 'error',
    message: 'No icons in titles or headings'
  },
  
  noAllCaps: {
    pattern: /\b[A-Z]{3,}\b/,
    severity: 'error', 
    message: 'No ALL CAPS text'
  },
  
  fontFamilyConsistency: {
    pattern: /fontFamily:\s*['"](?!.*Plus Jakarta Sans)[^'"]*['"]/,
    severity: 'error',
    message: 'Use Plus Jakarta Sans font family'
  },
  
  // Color rules
  hardcodedColors: {
    pattern: /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/,
    severity: 'warning',
    message: 'Hardcoded color found - should use design system'
  },
  
  // Button rules
  buttonFontSize: {
    pattern: /fontSize:\s*['"](?!10px)[^'"]*['"]/,
    severity: 'error',
    message: 'Buttons should use 10px font size'
  }
};

function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];
    
    Object.entries(DESIGN_RULES).forEach(([ruleName, rule]) => {
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          violations.push({
            rule: ruleName,
            severity: rule.severity,
            line: index + 1,
            message: rule.message,
            content: line.trim()
          });
        }
      });
    });
    
    return {
      file: filePath,
      violations,
      score: violations.length === 0 ? 100 : Math.max(0, 100 - (violations.length * 10))
    };
    
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return {
      file: filePath,
      violations: [],
      score: 0,
      error: error.message
    };
  }
}

function validateDirectory(dirPath) {
  const results = [];
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  
  function scanDirectory(dir) {
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          results.push(validateFile(fullPath));
        }
      });
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }
  
  scanDirectory(dirPath);
  return results;
}

function generateReport(results) {
  console.log('\n🎨 Design Compliance Report');
  console.log('========================');
  
  const totalFiles = results.length;
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
  const filesWithViolations = results.filter(r => r.violations.length > 0).length;
  const averageScore = totalFiles > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalFiles) : 100;
  
  console.log(`📊 Overall Score: ${averageScore}/100`);
  console.log(`📁 Files Scanned: ${totalFiles}`);
  console.log(`⚠️  Total Violations: ${totalViolations}`);
  console.log(`📄 Files with Issues: ${filesWithViolations}`);
  
  // Group violations by type
  const violationsByType = {};
  results.forEach(result => {
    result.violations.forEach(violation => {
      violationsByType[violation.severity] = (violationsByType[violation.severity] || 0) + 1;
    });
  });
  
  if (Object.keys(violationsByType).length > 0) {
    console.log('\n📋 Violations by Severity:');
    Object.entries(violationsByType).forEach(([severity, count]) => {
      const icon = severity === 'error' ? '🚨' : '⚠️';
      console.log(`  ${icon} ${severity}: ${count}`);
    });
  }
  
  // Show files with violations
  const filesWithIssues = results.filter(r => r.violations.length > 0);
  if (filesWithIssues.length > 0) {
    console.log('\n📄 Files with Violations:');
    filesWithIssues.forEach(result => {
      console.log(`\n  📁 ${result.file}`);
      console.log(`     Score: ${result.score}/100`);
      result.violations.forEach(violation => {
        const icon = violation.severity === 'error' ? '🚨' : '⚠️';
        console.log(`     ${icon} Line ${violation.line}: ${violation.message}`);
        console.log(`        ${violation.content}`);
      });
    });
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (totalViolations > 0) {
    console.log('  🔧 Fix all error-level violations immediately');
    console.log('  📝 Consider addressing warning-level violations for better consistency');
    console.log('  🎨 Use design system colors instead of hardcoded values');
    console.log('  📖 Follow the design system guidelines in docs/design-system/');
  } else {
    console.log('  ✅ All files are compliant with design system rules!');
  }
  
  return {
    totalFiles,
    totalViolations,
    filesWithViolations,
    averageScore,
    violationsByType,
    results
  };
}

// Main execution
function main() {
  const targetDir = process.argv[2] || './src/components';
  
  console.log('🎨 Design Agent Validation Starting...');
  console.log(`📁 Target directory: ${targetDir}`);
  
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Directory not found: ${targetDir}`);
    process.exit(1);
  }
  
  const results = validateDirectory(targetDir);
  const report = generateReport(results);
  
  // Save report to file
  const reportPath = path.join(__dirname, 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  // Exit with error code if there are critical violations
  const errorCount = report.violationsByType.error || 0;
  process.exit(errorCount > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = {
  validateFile,
  validateDirectory,
  generateReport,
  DESIGN_RULES
};
