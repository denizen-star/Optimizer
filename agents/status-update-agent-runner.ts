/**
 * Status Update Agent Runner
 * Executable script to run the status update agent
 */

import { StatusUpdateAgent } from './status-update-agent';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

class StatusUpdateAgentRunner {
  private agent: StatusUpdateAgent;

  constructor() {
    this.agent = new StatusUpdateAgent();
  }

  /**
   * Run the complete status update process
   */
  async runCompleteUpdate(): Promise<void> {
    console.log('🚀 Starting Status Update Agent...\n');

    try {
      // 1. Analyze current project status
      console.log('📊 Analyzing project status...');
      const status = await this.agent.analyzeProjectStatus();
      console.log(`✅ Design System: ${status.designSystem.completion}% complete`);
      console.log(`✅ Modules analyzed: ${Object.keys(status.modules).length} modules`);
      console.log(`✅ Recent commits: ${status.recentCommits.length} commits\n`);

      // 2. Update NavigationGuide
      console.log('📝 Updating NavigationGuide...');
      await this.updateNavigationGuideWithStatus(status);
      console.log('✅ NavigationGuide updated\n');

      // 3. Generate and save report
      console.log('📋 Generating development report...');
      const report = await this.agent.generateReport();
      const reportPath = join(process.cwd(), 'docs', 'development-status-report.md');
      writeFileSync(reportPath, report);
      console.log(`✅ Report saved to: ${reportPath}\n`);

      // 4. Update backlog with new recommendations
      console.log('💡 Updating recommendations...');
      await this.updateBacklogWithRecommendations(status.recommendations);
      console.log('✅ Recommendations updated\n');

      console.log('🎉 Status update completed successfully!');
      console.log('\nNext steps:');
      console.log('- Review the updated NavigationGuide');
      console.log('- Check the development status report');
      console.log('- Implement high-priority recommendations');

    } catch (error) {
      console.error('❌ Status update failed:', error);
      throw error;
    }
  }

  /**
   * Update NavigationGuide with current status
   */
  private async updateNavigationGuideWithStatus(status: any): Promise<void> {
    const navigationGuidePath = join(process.cwd(), 'src/components/NavigationGuide/NavigationGuide.tsx');
    
    try {
      let content = readFileSync(navigationGuidePath, 'utf8');
      
      // Update timestamp
      const currentTime = new Date().toLocaleString();
      content = content.replace(
        /Last System Update: .*/,
        `Last System Update: ${currentTime}`
      );

      // Update design system completion percentage
      content = content.replace(
        /Design System Status: \d+%/,
        `Design System Status: ${status.designSystem.completion}%`
      );

      // Update module statuses
      Object.entries(status.modules).forEach(([moduleName, module]: [string, any]) => {
        const capitalizedName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
        const regex = new RegExp(`${capitalizedName} Module: \\d+%`, 'g');
        content = content.replace(regex, `${capitalizedName} Module: ${module.completion}%`);
      });

      // Update recent commits section
      const recentCommitsSection = this.generateRecentCommitsSection(status.recentCommits);
      content = content.replace(
        /<List dense>[\s\S]*?<\/List>/,
        recentCommitsSection
      );

      writeFileSync(navigationGuidePath, content);
    } catch (error) {
      console.error('Failed to update NavigationGuide:', error);
      throw error;
    }
  }

  /**
   * Generate recent commits section for NavigationGuide (ordered by release timestamp desc)
   */
  private generateRecentCommitsSection(commits: any[]): string {
    // Commits are already sorted by timestamp desc in the agent
    const commitsList = commits.slice(0, 10).map(commit => `
      <ListItem>
        <ListItemText 
          primary="${commit.message}"
          secondary="${commit.date} (${commit.hash})"
          primaryTypographyProps={{ fontSize: '10px' }}
          secondaryTypographyProps={{ fontSize: '9px' }}
        />
      </ListItem>
    `).join('');

    return `
      <List dense>
        ${commitsList}
      </List>
    `;
  }

  /**
   * Generate module status section with completion timestamps
   */
  private generateModuleStatusSection(modules: any): string {
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

    return sortedModules.map(([name, module]) => `
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: module.completion === 100 ? 'colors.status.success' : module.completion >= 70 ? 'colors.status.partial' : 'colors.status.error' }}>
          <Typography variant="h4" sx={{ fontSize: '12px', fontWeight: 'normal', mb: 1 }}>
            ${name.charAt(0).toUpperCase() + name.slice(1)} Module
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '10px', color: 'colors.text.secondary' }}>
            ${module.completion}% Complete
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '9px', color: 'colors.text.secondary', mt: 1 }}>
            ${module.completionTimestamp ? `Completed: ${new Date(module.completionTimestamp).toLocaleString()}` : `Last Updated: ${new Date(module.lastUpdated).toLocaleString()}`}
          </Typography>
        </Paper>
      </Grid>
    `).join('');
  }

  /**
   * Generate recommendations section with proper prioritization
   */
  private generateRecommendationsSection(recommendations: any[]): string {
    const recommendationsList = recommendations.map(rec => `
      <ListItem>
        <ListItemText 
          primary="[${rec.priority.toUpperCase()}] ${rec.description}"
          secondary="${rec.category} | Status: ${rec.status} | Updated: ${new Date(rec.lastUpdated).toLocaleString()}"
          primaryTypographyProps={{ fontSize: '12px' }}
          secondaryTypographyProps={{ fontSize: '10px' }}
        />
      </ListItem>
    `).join('');

    return `
      <List dense>
        ${recommendationsList}
      </List>
    `;
  }

  /**
   * Update backlog with new recommendations
   */
  private async updateBacklogWithRecommendations(recommendations: any[]): Promise<void> {
    const backlogPath = join(process.cwd(), 'docs/feature-backlog/backlog.md');
    
    try {
      let content = readFileSync(backlogPath, 'utf8');
      
      // Add new recommendations if they don't exist
      const newRecommendations = recommendations.filter(rec => rec.status === 'new');
      
      if (newRecommendations.length > 0) {
        const newItems = newRecommendations.map(rec => `
### ${newRecommendations.indexOf(rec) + 4}. ${rec.description}
**Added:** ${new Date().toLocaleString()}  
**Priority:** ${rec.priority.toUpperCase()}  
**Status:** ${rec.status === 'new' ? 'Research Phase' : 'Planning Phase'}

${rec.description} - This recommendation was generated based on current project analysis.

**Category:** ${rec.category}
        `).join('\n');

        // Insert new items before the "Adding New Features" section
        content = content.replace(
          /## Adding New Features/,
          `${newItems}\n---\n\n## Adding New Features`
        );

        // Update statistics
        const currentStats = content.match(/Total Features: (\d+)/);
        if (currentStats) {
          const newTotal = parseInt(currentStats[1]) + newRecommendations.length;
          content = content.replace(/Total Features: \d+/, `Total Features: ${newTotal}`);
        }

        writeFileSync(backlogPath, content);
        console.log(`✅ Added ${newRecommendations.length} new recommendations to backlog`);
      }
    } catch (error) {
      console.error('Failed to update backlog:', error);
    }
  }

  /**
   * Quick status check
   */
  async quickStatus(): Promise<void> {
    console.log('🔍 Quick Status Check...\n');
    
    const status = await this.agent.analyzeProjectStatus();
    
    console.log('📊 Current Status:');
    console.log(`   Design System: ${status.designSystem.completion}% (${status.designSystem.status})`);
    console.log(`   Authentication Module: ${status.modules.authentication.completion}%`);
    console.log(`   Persona Module: ${status.modules.persona.completion}%`);
    console.log(`   Activities Module: ${status.modules.activities.completion}%`);
    console.log(`   Habits Module: ${status.modules.habits.completion}%`);
    
    console.log('\n📝 Recent Activity:');
    status.recentCommits.slice(0, 3).forEach(commit => {
      console.log(`   ${commit.message} (${commit.date})`);
    });
    
    console.log('\n💡 High Priority Recommendations:');
    status.recommendations
      .filter(rec => rec.priority === 'high')
      .forEach(rec => {
        console.log(`   - ${rec.description}`);
      });
  }
}

// CLI Interface
async function main() {
  const runner = new StatusUpdateAgentRunner();
  const command = process.argv[2];

  switch (command) {
    case 'update':
      await runner.runCompleteUpdate();
      break;
    case 'status':
      await runner.quickStatus();
      break;
    case 'help':
      console.log(`
Status Update Agent Runner

Usage:
  node status-update-agent-runner.ts [command]

Commands:
  update    - Run complete status update (analyze, update NavigationGuide, generate report)
  status    - Quick status check
  help      - Show this help message

Examples:
  node status-update-agent-runner.ts update
  node status-update-agent-runner.ts status
      `);
      break;
    default:
      console.log('❌ Unknown command. Use "help" to see available commands.');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export default StatusUpdateAgentRunner;
