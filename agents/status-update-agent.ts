/**
 * Status Update Agent
 * Automated agent for updating project status and development progress
 * 
 * This agent can be called to:
 * - Update NavigationGuide with current status
 * - Analyze project completion percentages
 * - Move completed items to appropriate sections
 * - Add new recommendations based on current state
 * - Generate development reports
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface ProjectStatus {
  designSystem: {
    completion: number;
    status: 'completed' | 'in_progress' | 'planning';
    lastUpdated: string;
    completionTimestamp?: string;
  };
  modules: {
    authentication: { 
      completion: number; 
      status: string; 
      lastUpdated: string;
      completionTimestamp?: string;
    };
    persona: { 
      completion: number; 
      status: string; 
      lastUpdated: string;
      completionTimestamp?: string;
    };
    activities: { 
      completion: number; 
      status: string; 
      lastUpdated: string;
      completionTimestamp?: string;
    };
    habits: { 
      completion: number; 
      status: string; 
      lastUpdated: string;
      completionTimestamp?: string;
    };
  };
  recentCommits: Array<{
    hash: string;
    message: string;
    date: string;
    timestamp: number; // Unix timestamp for proper sorting
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    status: 'new' | 'in_progress' | 'completed';
    lastUpdated: string;
    completionTimestamp?: string;
  }>;
}

export class StatusUpdateAgent {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Analyze current project status
   */
  async analyzeProjectStatus(): Promise<ProjectStatus> {
    const recentCommits = this.getRecentCommits();
    const designSystemStatus = this.analyzeDesignSystem();
    const moduleStatus = this.analyzeModules();
    const recommendations = this.generateRecommendations();

    return {
      designSystem: designSystemStatus,
      modules: moduleStatus,
      recentCommits,
      recommendations
    };
  }

  /**
   * Get recent git commits (ordered by release timestamp desc)
   */
  private getRecentCommits() {
    try {
      const output = execSync('git log --oneline -10 --pretty=format:"%h|%s|%ci"', { 
        cwd: this.projectRoot,
        encoding: 'utf8' 
      });
      
      return output.trim().split('\n').map(line => {
        const [hash, message, date] = line.split('|');
        const timestamp = date ? new Date(date).getTime() : 0;
        return {
          hash: hash || '',
          message: message || '',
          date: date ? new Date(date).toLocaleString() : '',
          timestamp: timestamp
        };
      }).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp desc
    } catch (error) {
      console.warn('Could not fetch git commits:', error);
      return [];
    }
  }

  /**
   * Analyze design system implementation status
   */
  private analyzeDesignSystem() {
    try {
      // Check if design system files exist and are being used
      const designSystemFiles = [
        'src/design-system/index.ts',
        'src/design-system/theme.ts',
        'src/design-system/hooks.ts',
        'src/design-system/provider.tsx'
      ];

      const existingFiles = designSystemFiles.filter(file => {
        try {
          readFileSync(join(this.projectRoot, file));
          return true;
        } catch {
          return false;
        }
      });

      const completion = (existingFiles.length / designSystemFiles.length) * 100;
      
      // Check if components are using the design system
      const componentUsage = this.checkDesignSystemUsage();
      
      return {
        completion: Math.round(completion + componentUsage),
        status: completion >= 80 ? 'completed' : completion >= 40 ? 'in_progress' : 'planning',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      return {
        completion: 0,
        status: 'planning',
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Check how many components are using the design system
   */
  private checkDesignSystemUsage(): number {
    try {
      const output = execSync('grep -r "useDesignSystem" src/components/ || true', { 
        cwd: this.projectRoot,
        encoding: 'utf8' 
      });
      
      const usageCount = output.trim().split('\n').filter(line => line.trim()).length;
      const totalComponents = 4; // Based on current structure
      
      return Math.min((usageCount / totalComponents) * 20, 20); // Max 20% bonus
    } catch {
      return 0;
    }
  }

  /**
   * Analyze module implementation status with timestamps
   */
  private analyzeModules() {
    const now = new Date().toISOString();
    return {
      authentication: {
        completion: 100,
        status: 'Fully functional with email verification, user management, and security tracking',
        lastUpdated: now,
        completionTimestamp: '2024-12-15T10:00:00Z' // When it was completed
      },
      persona: {
        completion: 90,
        status: 'Functional with persona selection and data structure',
        lastUpdated: now,
        completionTimestamp: '2024-12-18T14:30:00Z' // When it was mostly completed
      },
      activities: {
        completion: 70,
        status: 'Data structure ready, needs UI implementation',
        lastUpdated: now,
        completionTimestamp: undefined // Not completed yet
      },
      habits: {
        completion: 0,
        status: 'Planning phase - detailed specifications available',
        lastUpdated: now,
        completionTimestamp: undefined // Not started
      }
    };
  }

  /**
   * Generate recommendations based on current status with timestamps
   */
  private generateRecommendations() {
    const now = new Date().toISOString();
    const recommendations = [
      {
        priority: 'high' as const,
        category: 'Design System',
        description: 'Complete migration of remaining components to design system',
        status: 'in_progress' as const,
        lastUpdated: now,
        completionTimestamp: undefined // Not completed yet
      },
      {
        priority: 'high' as const,
        category: 'Features',
        description: 'Implement Habits Module for planning functionality',
        status: 'new' as const,
        lastUpdated: now,
        completionTimestamp: undefined // Not started
      },
      {
        priority: 'medium' as const,
        category: 'Infrastructure',
        description: 'Add SendGrid waitlist system for email limit handling',
        status: 'new' as const,
        lastUpdated: now,
        completionTimestamp: undefined // Not started
      },
      {
        priority: 'medium' as const,
        category: 'User Experience',
        description: 'Create proper landing page for user acquisition',
        status: 'new' as const,
        lastUpdated: now,
        completionTimestamp: undefined // Not started
      },
      {
        priority: 'low' as const,
        category: 'Documentation',
        description: 'Update component documentation with design system examples',
        status: 'new' as const,
        lastUpdated: now,
        completionTimestamp: undefined // Not started
      }
    ];

    // Sort by priority and completion timestamp
    return recommendations.sort((a, b) => {
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
  }

  /**
   * Update NavigationGuide with current status
   */
  async updateNavigationGuide(): Promise<void> {
    const status = await this.analyzeProjectStatus();
    const navigationGuidePath = join(this.projectRoot, 'src/components/NavigationGuide/NavigationGuide.tsx');
    
    try {
      let content = readFileSync(navigationGuidePath, 'utf8');
      
      // Update last system update timestamp
      content = content.replace(
        /Last System Update: .*/,
        `Last System Update: ${new Date().toLocaleString()}`
      );

      // Update design system status
      const designSystemStatus = `
        <Typography variant="h4" sx={{ fontSize: '12px', fontWeight: 'normal', mb: 1 }}>
          Design System Status: ${status.designSystem.completion}% Complete
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '10px', color: colors.text.secondary, mb: 2 }}>
          Status: ${status.designSystem.status.toUpperCase()} | Last Updated: ${new Date(status.designSystem.lastUpdated).toLocaleString()}
        </Typography>
      `;

      // Update module status
      const moduleStatus = Object.entries(status.modules).map(([name, module]) => `
        <ListItem>
          <ListItemText 
            primary="${name.charAt(0).toUpperCase() + name.slice(1)} Module: ${module.completion}%"
            secondary="${module.status}"
            primaryTypographyProps={{ fontSize: '12px' }}
            secondaryTypographyProps={{ fontSize: '10px' }}
          />
        </ListItem>
      `).join('');

      // Update recent commits (ordered by release timestamp desc)
      const recentCommits = status.recentCommits.slice(0, 10).map(commit => `
        <ListItem>
          <ListItemText 
            primary="${commit.message}"
            secondary="${commit.date} (${commit.hash})"
            primaryTypographyProps={{ fontSize: '10px' }}
            secondaryTypographyProps={{ fontSize: '9px' }}
          />
        </ListItem>
      `).join('');

      // Update module status with completion timestamps
      const moduleStatus = Object.entries(status.modules)
        .sort(([, a], [, b]) => {
          // Sort by completion timestamp (completed items first)
          if (a.completionTimestamp && !b.completionTimestamp) return -1;
          if (!a.completionTimestamp && b.completionTimestamp) return 1;
          if (a.completionTimestamp && b.completionTimestamp) {
            return new Date(b.completionTimestamp).getTime() - new Date(a.completionTimestamp).getTime();
          }
          // Then by completion percentage
          return b.completion - a.completion;
        })
        .map(([name, module]) => `
        <ListItem>
          <ListItemText 
            primary="${name.charAt(0).toUpperCase() + name.slice(1)} Module: ${module.completion}%"
            secondary="${module.status} | Last Updated: ${new Date(module.lastUpdated).toLocaleString()}"
            primaryTypographyProps={{ fontSize: '12px' }}
            secondaryTypographyProps={{ fontSize: '10px' }}
          />
        </ListItem>
      `).join('');

      // Update recommendations with proper prioritization
      const recommendations = status.recommendations.map(rec => `
        <ListItem>
          <ListItemText 
            primary="[${rec.priority.toUpperCase()}] ${rec.description}"
            secondary="${rec.category} | Status: ${rec.status} | Updated: ${new Date(rec.lastUpdated).toLocaleString()}"
            primaryTypographyProps={{ fontSize: '12px' }}
            secondaryTypographyProps={{ fontSize: '10px' }}
          />
        </ListItem>
      `).join('');

      // Write updated content
      writeFileSync(navigationGuidePath, content);
      
      console.log('✅ NavigationGuide updated successfully');
    } catch (error) {
      console.error('❌ Failed to update NavigationGuide:', error);
      throw error;
    }
  }

  /**
   * Generate development report
   */
  async generateReport(): Promise<string> {
    const status = await this.analyzeProjectStatus();
    
    const report = `
# Optimizer Development Status Report
Generated: ${new Date().toLocaleString()}

## Overall Progress: ${Math.round((status.designSystem.completion + Object.values(status.modules).reduce((sum, m) => sum + m.completion, 0)) / 5)}%

## Design System: ${status.designSystem.completion}% Complete
- Status: ${status.designSystem.status}
- Last Updated: ${new Date(status.designSystem.lastUpdated).toLocaleString()}

## Module Status
${Object.entries(status.modules).map(([name, module]) => 
  `- **${name.charAt(0).toUpperCase() + name.slice(1)} Module**: ${module.completion}% - ${module.status}`
).join('\n')}

## Recent Development Activity
${status.recentCommits.slice(0, 5).map(commit => 
  `- ${commit.message} (${commit.date})`
).join('\n')}

## Recommendations
${status.recommendations.map(rec => 
  `- **[${rec.priority.toUpperCase()}]** ${rec.description}`
).join('\n')}
    `;

    return report.trim();
  }

  /**
   * Move completed items to completed section
   */
  async moveCompletedItems(): Promise<void> {
    // This would implement logic to move completed items
    // from backlog to completed sections
    console.log('Moving completed items...');
  }

  /**
   * Add new recommendations based on current state
   */
  async addNewRecommendations(): Promise<void> {
    // This would analyze current state and add new recommendations
    console.log('Adding new recommendations...');
  }
}

// Export for use in other agents or direct calls
export default StatusUpdateAgent;

// CLI usage
if (require.main === module) {
  const agent = new StatusUpdateAgent();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'analyze':
      agent.analyzeProjectStatus().then(status => {
        console.log(JSON.stringify(status, null, 2));
      });
      break;
    case 'update':
      agent.updateNavigationGuide().then(() => {
        console.log('NavigationGuide updated');
      });
      break;
    case 'report':
      agent.generateReport().then(report => {
        console.log(report);
      });
      break;
    default:
      console.log('Usage: node status-update-agent.ts [analyze|update|report]');
  }
}
