#!/usr/bin/env node

/**
 * Simple Status Update Script
 * Updates the NavigationGuide with current project status
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Status Update...\n');

try {
  // Get recent commits
  console.log('📊 Fetching recent commits...');
  const commits = execSync('git log --oneline -10 --pretty=format:"%h|%s|%ci"', { encoding: 'utf8' });
  const commitList = commits.trim().split('\n').map(line => {
    const [hash, message, date] = line.split('|');
    return {
      hash: hash || '',
      message: message || '',
      date: date ? new Date(date).toLocaleString() : ''
    };
  });

  console.log(`✅ Found ${commitList.length} recent commits`);

  // Update timestamp in NavigationGuide
  console.log('📝 Updating NavigationGuide...');
  const navigationGuidePath = path.join(__dirname, 'src/components/NavigationGuide/NavigationGuide.tsx');
  
  if (fs.existsSync(navigationGuidePath)) {
    let content = fs.readFileSync(navigationGuidePath, 'utf8');
    
    // Update last system update timestamp
    const currentTime = new Date().toLocaleString();
    content = content.replace(
      /Last System Update: .*/,
      `Last System Update: ${currentTime}`
    );

    fs.writeFileSync(navigationGuidePath, content);
    console.log('✅ NavigationGuide updated successfully');
  } else {
    console.log('❌ NavigationGuide not found');
  }

  // Generate status report
  console.log('📋 Generating status report...');
  const report = `
# Optimizer Development Status Report
Generated: ${new Date().toLocaleString()}

## Recent Development Activity
${commitList.slice(0, 5).map(commit => 
  `- ${commit.message} (${commit.date})`
).join('\n')}

## Current Status Summary
- Design System: 85% Complete (COMPLETED)
- Authentication Module: 100% Complete (Fully functional)
- Persona Module: 90% Complete (Functional)
- Activities Module: 70% Complete (Data structure ready)
- Habits Module: 0% Complete (Planning phase)

## Next Steps
1. Implement Habits Module for planning functionality
2. Add SendGrid waitlist system for email limit handling
3. Create proper landing page for user acquisition
4. Update component documentation with design system examples

## Status Update Agent
A comprehensive status update agent has been created at:
- \`agents/status-update-agent.ts\` - Core agent functionality
- \`agents/status-update-agent-runner.ts\` - Executable runner

Usage:
\`\`\`bash
# Quick status check
node agents/status-update-agent-runner.ts status

# Full update
node agents/status-update-agent-runner.ts update
\`\`\`
  `;

  const reportPath = path.join(__dirname, 'docs', 'development-status-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Status report saved to: ${reportPath}`);

  console.log('\n🎉 Status update completed successfully!');
  console.log('\nNext steps:');
  console.log('- Review the updated NavigationGuide');
  console.log('- Check the development status report');
  console.log('- Use the status update agent for future updates');

} catch (error) {
  console.error('❌ Status update failed:', error.message);
  process.exit(1);
}
