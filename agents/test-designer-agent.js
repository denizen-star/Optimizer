/**
 * Test Designer Agent - Simple JavaScript test to demonstrate functionality
 */

// Mock the designer agent functionality for demonstration
class MockDesignerAgent {
  constructor() {
    this.isActive = false;
    this.violations = [];
  }

  start() {
    this.isActive = true;
    console.log('🎨 Designer Agent started - Monitoring design compliance...');
  }

  stop() {
    this.isActive = false;
    console.log('🎨 Designer Agent stopped');
  }

  validateFile(filePath, content) {
    const violations = [];
    
    // Check for icons in titles
    if (content.includes('🎯') || content.includes('⚙️') || content.includes('📊')) {
      violations.push({
        type: 'typography',
        severity: 'error',
        message: 'Icons found in titles - Remove all icons and emojis from titles',
        suggestion: 'Use clean text only in titles and headings',
        line: this.findLine(content, '🎯')
      });
    }

    // Check for ALL CAPS
    if (content.match(/[A-Z]{3,}/)) {
      violations.push({
        type: 'typography',
        severity: 'error',
        message: 'ALL CAPS text found - Never use ALL CAPS text',
        suggestion: 'Use proper capitalization instead',
        line: this.findLine(content, /[A-Z]{3,}/)
      });
    }

    // Check for incorrect font sizes
    if (content.includes('fontSize: \'14px\'') || content.includes('fontSize: "14px"')) {
      violations.push({
        type: 'typography',
        severity: 'warning',
        message: 'Non-standard font size found',
        suggestion: 'Use design system font sizes: 15px, 13px, 12px, or 10px',
        line: this.findLine(content, 'fontSize')
      });
    }

    // Check for incorrect colors
    if (content.includes('color: \'#000000\'') || content.includes('color: "#000000"')) {
      violations.push({
        type: 'color',
        severity: 'error',
        message: 'Non-standard color found',
        suggestion: 'Use design system colors: #212529 for primary, #6C757D for secondary',
        line: this.findLine(content, 'color')
      });
    }

    const score = violations.length === 0 ? 100 : Math.max(0, 100 - (violations.length * 20));
    
    return {
      file: filePath,
      violations,
      score,
      passed: violations.filter(v => v.severity === 'error').length === 0
    };
  }

  findLine(content, pattern) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (typeof pattern === 'string') {
        if (lines[i].includes(pattern)) {
          return i + 1;
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(lines[i])) {
          return i + 1;
        }
      }
    }
    return 1;
  }

  getStatus() {
    return {
      isActive: this.isActive,
      lastCheck: new Date(),
      totalFilesScanned: 1,
      violationsFound: this.violations.length,
      complianceScore: 85
    };
  }
}

// Test the designer agent
function testDesignerAgent() {
  console.log('🧪 Testing Designer Agent...');
  console.log('============================');

  const agent = new MockDesignerAgent();
  agent.start();

  // Test files with violations
  const testFiles = [
    {
      path: 'src/components/TestComponent.tsx',
      content: `
import React from 'react';

const TestComponent = () => {
  return (
    <div>
      <h1>🎯 Time Allocation Tuner</h1>
      <p>This is a TEST COMPONENT</p>
      <button style={{ fontSize: '14px', color: '#000000' }}>
        Click Me
      </button>
    </div>
  );
};

export default TestComponent;
      `
    },
    {
      path: 'src/components/GoodComponent.tsx',
      content: `
import React from 'react';

const GoodComponent = () => {
  return (
    <div>
      <h1>Time Allocation Tuner</h1>
      <p>This is a good component</p>
      <button style={{ fontSize: '10px', color: '#6C757D' }}>
        Click Me
      </button>
    </div>
  );
};

export default GoodComponent;
      `
    }
  ];

  // Validate each test file
  testFiles.forEach(file => {
    console.log(`\n📄 Validating: ${file.path}`);
    const result = agent.validateFile(file.path, file.content);
    
    console.log(`📊 Compliance Score: ${result.score}/100`);
    console.log(`✅ Passed: ${result.passed ? 'Yes' : 'No'}`);
    
    if (result.violations.length > 0) {
      console.log(`⚠️  Violations Found: ${result.violations.length}`);
      result.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. [${violation.severity.toUpperCase()}] ${violation.message}`);
        console.log(`      Line ${violation.line}: ${violation.suggestion}`);
      });
    } else {
      console.log('✅ No violations found - Design compliance achieved!');
    }
  });

  // Display agent status
  const status = agent.getStatus();
  console.log('\n📊 Agent Status:');
  console.log(`   Active: ${status.isActive}`);
  console.log(`   Files Scanned: ${status.totalFilesScanned}`);
  console.log(`   Violations Found: ${status.violationsFound}`);
  console.log(`   Compliance Score: ${status.complianceScore}/100`);

  agent.stop();
  console.log('\n✅ Designer Agent test completed!');
}

// Run the test
testDesignerAgent();
