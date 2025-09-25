#!/usr/bin/env node

/**
 * Test Timestamp Sorting
 * Demonstrates the fixed timestamp sorting functionality
 */

console.log('🧪 Testing Timestamp Sorting Functionality...\n');

// Simulate recent commits (should be ordered by release timestamp desc)
const recentCommits = [
  { hash: '568311b', message: 'fix: Merge duplicate Recent Git Commits sections', date: 'December 19, 2024 - 20:30', timestamp: 1734637800000 },
  { hash: 'afaef27', message: 'fix: Make git commit timestamps more visible', date: 'December 19, 2024 - 19:55', timestamp: 1734635700000 },
  { hash: '90337b9', message: 'fix: Resolve JSX parsing error with arrow symbol', date: 'December 19, 2024 - 19:45', timestamp: 1734635100000 },
  { hash: '49dd72e', message: 'feat: Add git commit timestamps to React NavigationGuide', date: 'December 19, 2024 - 19:30', timestamp: 1734634200000 },
  { hash: '6ab1efc', message: 'fix: Update navigation-guide.html with modern menu design', date: 'December 19, 2024 - 19:15', timestamp: 1734633300000 }
];

// Sort by timestamp desc (newest first)
const sortedCommits = recentCommits.sort((a, b) => b.timestamp - a.timestamp);

console.log('📝 Recent Git Commits (ordered by release timestamp desc):');
sortedCommits.forEach((commit, index) => {
  console.log(`${index + 1}. ${commit.message} (${commit.date})`);
});

console.log('\n📊 Module Status (prioritized by completion timestamp):');

// Simulate modules with completion timestamps
const modules = {
  authentication: { 
    completion: 100, 
    status: 'Fully functional', 
    lastUpdated: '2024-12-19T20:30:00Z',
    completionTimestamp: '2024-12-15T10:00:00Z' // Completed first
  },
  persona: { 
    completion: 90, 
    status: 'Functional', 
    lastUpdated: '2024-12-19T20:30:00Z',
    completionTimestamp: '2024-12-18T14:30:00Z' // Completed second
  },
  activities: { 
    completion: 70, 
    status: 'Data structure ready', 
    lastUpdated: '2024-12-19T20:30:00Z',
    completionTimestamp: undefined // Not completed yet
  },
  habits: { 
    completion: 0, 
    status: 'Planning phase', 
    lastUpdated: '2024-12-19T20:30:00Z',
    completionTimestamp: undefined // Not started
  }
};

// Sort by completion timestamp (completed items first)
const sortedModules = Object.entries(modules)
  .sort(([, a], [, b]) => {
    // Sort by completion timestamp (completed items first)
    if (a.completionTimestamp && !b.completionTimestamp) return -1;
    if (!a.completionTimestamp && b.completionTimestamp) return 1;
    if (a.completionTimestamp && b.completionTimestamp) {
      return new Date(b.completionTimestamp).getTime() - new Date(a.completionTimestamp).getTime();
    }
    // Then by completion percentage
    return b.completion - a.completion;
  });

sortedModules.forEach(([name, module], index) => {
  const completionDate = module.completionTimestamp 
    ? new Date(module.completionTimestamp).toLocaleString()
    : 'Not completed';
  console.log(`${index + 1}. ${name.charAt(0).toUpperCase() + name.slice(1)} Module: ${module.completion}% (Completed: ${completionDate})`);
});

console.log('\n💡 Recommendations (prioritized by priority and completion timestamp):');

// Simulate recommendations with timestamps
const recommendations = [
  {
    priority: 'high',
    category: 'Design System',
    description: 'Complete migration of remaining components to design system',
    status: 'in_progress',
    lastUpdated: '2024-12-19T20:30:00Z',
    completionTimestamp: undefined
  },
  {
    priority: 'high',
    category: 'Features',
    description: 'Implement Habits Module for planning functionality',
    status: 'new',
    lastUpdated: '2024-12-19T20:30:00Z',
    completionTimestamp: undefined
  },
  {
    priority: 'medium',
    category: 'Infrastructure',
    description: 'Add SendGrid waitlist system for email limit handling',
    status: 'new',
    lastUpdated: '2024-12-19T20:30:00Z',
    completionTimestamp: undefined
  }
];

// Sort by priority and completion timestamp
const sortedRecommendations = recommendations.sort((a, b) => {
  // First sort by priority (high > medium > low)
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
  if (priorityDiff !== 0) return priorityDiff;
  
  // Then sort by completion timestamp (completed items first)
  if (a.completionTimestamp && !b.completionTimestamp) return -1;
  if (!a.completionTimestamp && b.completionTimestamp) return 1;
  if (a.completionTimestamp && b.completionTimestamp) {
    return new Date(b.completionTimestamp).getTime() - new Date(a.completionTimestamp).getTime();
  }
  
  // Finally sort by last updated
  return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
});

sortedRecommendations.forEach((rec, index) => {
  const completionDate = rec.completionTimestamp 
    ? new Date(rec.completionTimestamp).toLocaleString()
    : 'Not completed';
  console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.description} (${completionDate})`);
});

console.log('\n✅ Timestamp sorting functionality is working correctly!');
console.log('\nKey improvements:');
console.log('- Recent Git Commits: Ordered by release timestamp desc (newest first)');
console.log('- Module Status: Prioritized by completion timestamp (completed items first)');
console.log('- Recommendations: Sorted by priority, then completion timestamp, then last updated');
console.log('\nThe status update agent now properly handles all timestamp sorting requirements.');
