/**
 * Enhanced Design Agent Validation
 * 
 * Improved validation with better accuracy, reduced false positives,
 * and comprehensive design system compliance checking.
 */

const fs = require('fs');
const path = require('path');

// Enhanced design rules with better accuracy
const ENHANCED_DESIGN_RULES = {
  // Typography rules (improved accuracy)
  noIconsInTitles: {
    pattern: /<.*?>\s*[🎯⚙️🔧📊📈📉🎨🎭🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]/,
    severity: 'error',
    message: 'No icons in titles or headings',
    context: 'title'
  },
  
  noAllCaps: {
    pattern: /\b[A-Z]{4,}\b/,
    severity: 'error', 
    message: 'No ALL CAPS text (4+ consecutive capitals)',
    context: 'text'
  },
  
  fontFamilyConsistency: {
    pattern: /fontFamily:\s*['"](?!.*Plus Jakarta Sans)[^'"]*['"]/,
    severity: 'error',
    message: 'Use Plus Jakarta Sans font family',
    context: 'styling'
  },
  
  // Color rules (improved accuracy)
  hardcodedColors: {
    pattern: /#[0-9A-Fa-f]{6}(?![A-Fa-f0-9])/,
    severity: 'warning',
    message: 'Hardcoded color found - should use design system',
    context: 'styling',
    exceptions: ['#FFFFFF', '#000000', '#2c3e50'] // Allow some common colors
  },
  
  // Button rules (improved accuracy - only target actual buttons)
  buttonFontSize: {
    pattern: /<Button[^>]*fontSize:\s*['"](?!10px)[^'"]*['"]/,
    severity: 'error',
    message: 'Buttons should use 10px font size',
    context: 'button'
  },
  
  // Design system usage rules
  missingDesignSystemImport: {
    pattern: /(?:useDesignSystem|colors\.|spacing\.)/,
    severity: 'info',
    message: 'Consider using design system values',
    context: 'import',
    reverse: true // This rule checks for missing usage
  },
  
  // Accessibility rules
  missingAriaLabels: {
    pattern: /<Button[^>]*(?!aria-label)[^>]*>/,
    severity: 'warning',
    message: 'Consider adding aria-label for accessibility',
    context: 'accessibility'
  }
};

// Component-specific validation
const COMPONENT_RULES = {
  'PageHeader': {
    requiredProps: ['title'],
    recommendedProps: ['subtitle', 'showBreakLine']
  },
  'StatusChip': {
    requiredProps: ['status', 'label'],
    validStatuses: ['functional', 'partial', 'error', 'success', 'info', 'warning']
  },
  'ContentCard': {
    recommendedProps: ['title', 'variant', 'status']
  }
};

function validateFileEnhanced(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];
    
    // Extract component name from file path
    const fileName = path.basename(filePath, '.tsx');
    const componentRules = COMPONENT_RULES[fileName] || {};
    
    Object.entries(ENHANCED_DESIGN_RULES).forEach(([ruleName, rule]) => {
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          // Check if this is a false positive
          if (isFalsePositive(line, ruleName)) {
            return;
          }
          
          violations.push({
            rule: ruleName,
            severity: rule.severity,
            line: index + 1,
            message: rule.message,
            content: line.trim(),
            context: rule.context
          });
        }
      });
    });
    
    // Component-specific validation
    if (componentRules.requiredProps) {
      const missingProps = validateComponentProps(content, componentRules);
      violations.push(...missingProps);
    }
    
    return {
      file: filePath,
      violations,
      score: violations.length === 0 ? 100 : Math.max(0, 100 - (violations.length * 8)),
      component: fileName
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

function isFalsePositive(line, ruleName) {
  // Reduce false positives
  switch (ruleName) {
    case 'buttonFontSize':
      // Don't flag Typography components
      return line.includes('<Typography') || line.includes('variant=');
    
    case 'hardcodedColors':
      // Don't flag comments or documentation
      return line.trim().startsWith('//') || line.trim().startsWith('*');
    
    case 'noAllCaps':
      // Don't flag CSS properties or hex codes
      return line.includes('color:') || line.includes('#') || line.includes('backgroundColor:');
    
    default:
      return false;
  }
}

function validateComponentProps(content, rules) {
  const violations = [];
  
  if (rules.requiredProps) {
    rules.requiredProps.forEach(prop => {
      if (!content.includes(prop)) {
        violations.push({
          rule: 'missingRequiredProp',
          severity: 'warning',
          line: 0,
          message: `Missing required prop: ${prop}`,
          content: '',
          context: 'component'
        });
      }
    });
  }
  
  return violations;
}

function validateDirectoryEnhanced(dirPath) {
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
          results.push(validateFileEnhanced(fullPath));
        }
      });
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }
  
  scanDirectory(dirPath);
  return results;
}

function generateEnhancedReport(results) {
  console.log('\n🎨 Enhanced Design Compliance Report');
  console.log('=====================================');
  
  const totalFiles = results.length;
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
  const filesWithViolations = results.filter(r => r.violations.length > 0).length;
  const averageScore = totalFiles > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalFiles) : 100;
  
  console.log(`📊 Overall Score: ${averageScore}/100`);
  console.log(`📁 Files Scanned: ${totalFiles}`);
  console.log(`⚠️  Total Violations: ${totalViolations}`);
  console.log(`📄 Files with Issues: ${filesWithViolations}`);
  
  // Group violations by type and context
  const violationsByContext = {};
  const violationsBySeverity = {};
  
  results.forEach(result => {
    result.violations.forEach(violation => {
      violationsByContext[violation.context] = (violationsByContext[violation.context] || 0) + 1;
      violationsBySeverity[violation.severity] = (violationsBySeverity[violation.severity] || 0) + 1;
    });
  });
  
  if (Object.keys(violationsByContext).length > 0) {
    console.log('\n📋 Violations by Context:');
    Object.entries(violationsByContext).forEach(([context, count]) => {
      console.log(`  ${context}: ${count}`);
    });
  }
  
  if (Object.keys(violationsBySeverity).length > 0) {
    console.log('\n📋 Violations by Severity:');
    Object.entries(violationsBySeverity).forEach(([severity, count]) => {
      const icon = severity === 'error' ? '🚨' : severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`  ${icon} ${severity}: ${count}`);
    });
  }
  
  // Show component-specific results
  const componentResults = results.filter(r => r.component && r.component !== 'index');
  if (componentResults.length > 0) {
    console.log('\n🧩 Component Analysis:');
    componentResults.forEach(result => {
      const status = result.score >= 90 ? '✅' : result.score >= 70 ? '⚠️' : '🚨';
      console.log(`  ${status} ${result.component}: ${result.score}/100 (${result.violations.length} issues)`);
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
        const icon = violation.severity === 'error' ? '🚨' : violation.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`     ${icon} Line ${violation.line}: ${violation.message}`);
        if (violation.content) {
          console.log(`        ${violation.content}`);
        }
      });
    });
  }
  
  // Enhanced recommendations
  console.log('\n💡 Enhanced Recommendations:');
  if (totalViolations > 0) {
    if (violationsBySeverity.error > 0) {
      console.log('  🔧 Fix all error-level violations immediately');
    }
    if (violationsBySeverity.warning > 0) {
      console.log('  📝 Address warning-level violations for better consistency');
    }
    if (violationsByContext.styling > 0) {
      console.log('  🎨 Use design system colors and typography consistently');
    }
    if (violationsByContext.accessibility > 0) {
      console.log('  ♿ Improve accessibility with ARIA labels and proper semantics');
    }
    if (violationsByContext.component > 0) {
      console.log('  🧩 Ensure all required component props are provided');
    }
  } else {
    console.log('  ✅ All files are compliant with enhanced design system rules!');
  }
  
  return {
    totalFiles,
    totalViolations,
    filesWithViolations,
    averageScore,
    violationsByContext,
    violationsBySeverity,
    componentResults,
    results
  };
}

// Main execution
function main() {
  const targetDir = process.argv[2] || './src/components';
  
  console.log('🎨 Enhanced Design Agent Validation Starting...');
  console.log(`📁 Target directory: ${targetDir}`);
  
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Directory not found: ${targetDir}`);
    process.exit(1);
  }
  
  const results = validateDirectoryEnhanced(targetDir);
  const report = generateEnhancedReport(results);
  
  // Save enhanced report
  const reportPath = path.join(__dirname, 'enhanced-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Enhanced report saved to: ${reportPath}`);
  
  // Exit with error code if there are critical violations
  const errorCount = report.violationsBySeverity.error || 0;
  process.exit(errorCount > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = {
  validateFileEnhanced,
  validateDirectoryEnhanced,
  generateEnhancedReport,
  ENHANCED_DESIGN_RULES,
  COMPONENT_RULES
};
