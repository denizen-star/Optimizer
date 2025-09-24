/**
 * Designer Agent Runner - Manages the designer agent lifecycle and monitoring
 */

import { DesignerAgent, DesignValidationResult, AgentStatus } from './DesignerAgent';
import * as fs from 'fs';
import * as path from 'path';

export interface AgentConfig {
  watchDirectories: string[];
  excludePatterns: string[];
  checkInterval: number; // milliseconds
  autoFix: boolean;
  reportFormat: 'json' | 'html' | 'console';
}

export class DesignerAgentRunner {
  private agent: DesignerAgent;
  private config: AgentConfig;
  private watchTimer?: NodeJS.Timeout;
  private isRunning: boolean = false;

  constructor(config: AgentConfig) {
    this.agent = new DesignerAgent();
    this.config = config;
    this.setupEventHandlers();
  }

  /**
   * Start the designer agent runner
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Designer Agent Runner is already running');
      return;
    }

    this.isRunning = true;
    this.agent.start();

    console.log('🎨 Designer Agent Runner started');
    console.log(`📁 Watching directories: ${this.config.watchDirectories.join(', ')}`);
    console.log(`⏱️  Check interval: ${this.config.checkInterval}ms`);

    // Initial validation
    await this.runValidation();

    // Set up periodic validation
    this.watchTimer = setInterval(async () => {
      await this.runValidation();
    }, this.config.checkInterval);
  }

  /**
   * Stop the designer agent runner
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log('Designer Agent Runner is not running');
      return;
    }

    this.isRunning = false;
    this.agent.stop();

    if (this.watchTimer) {
      clearInterval(this.watchTimer);
      this.watchTimer = undefined;
    }

    console.log('🎨 Designer Agent Runner stopped');
  }

  /**
   * Run validation on all watched directories
   */
  public async runValidation(): Promise<void> {
    console.log('🔍 Running design compliance validation...');

    const allResults: DesignValidationResult[] = [];

    for (const dir of this.config.watchDirectories) {
      if (fs.existsSync(dir)) {
        const results = await this.agent.validateDirectory(dir);
        allResults.push(...results);
      }
    }

    // Generate report
    await this.generateReport(allResults);

    // Auto-fix if enabled
    if (this.config.autoFix) {
      await this.attemptAutoFix(allResults);
    }
  }

  /**
   * Validate a specific file
   */
  public async validateFile(filePath: string): Promise<DesignValidationResult> {
    return await this.agent.validateFile(filePath);
  }

  /**
   * Get agent status
   */
  public getStatus(): AgentStatus {
    return this.agent.getStatus();
  }

  /**
   * Get compliance report
   */
  public getComplianceReport() {
    return this.agent.getComplianceReport();
  }

  /**
   * Setup event handlers for the agent
   */
  private setupEventHandlers(): void {
    this.agent.on('agent:started', () => {
      console.log('✅ Designer Agent started successfully');
    });

    this.agent.on('agent:stopped', () => {
      console.log('⏹️  Designer Agent stopped');
    });

    this.agent.on('validation:complete', (result: DesignValidationResult) => {
      if (result.violations.length > 0) {
        console.log(`⚠️  Found ${result.violations.length} design violations in ${result.file}`);
        console.log(`📊 Compliance score: ${result.score}/100`);
      }
    });
  }

  /**
   * Generate compliance report
   */
  private async generateReport(results: DesignValidationResult[]): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: results.length,
      totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
      averageScore: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 100,
      filesWithViolations: results.filter(r => r.violations.length > 0).length,
      violationsByType: this.groupViolationsByType(results),
      topViolations: this.getTopViolations(results),
      recommendations: this.generateRecommendations(results)
    };

    // Save report based on format
    switch (this.config.reportFormat) {
      case 'json':
        await this.saveJsonReport(report);
        break;
      case 'html':
        await this.saveHtmlReport(report);
        break;
      case 'console':
      default:
        this.displayConsoleReport(report);
        break;
    }
  }

  /**
   * Group violations by type
   */
  private groupViolationsByType(results: DesignValidationResult[]): Record<string, number> {
    const violations = results.flatMap(r => r.violations);
    return violations.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Get top violations
   */
  private getTopViolations(results: DesignValidationResult[]): Array<{rule: string, count: number}> {
    const violations = results.flatMap(r => r.violations);
    const ruleCounts = violations.reduce((acc, v) => {
      acc[v.rule] = (acc[v.rule] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(ruleCounts)
      .map(([rule, count]) => ({ rule, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(results: DesignValidationResult[]): string[] {
    const recommendations: string[] = [];
    const violations = results.flatMap(r => r.violations);

    const errorCount = violations.filter(v => v.severity === 'error').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;

    if (errorCount > 0) {
      recommendations.push(`🚨 ${errorCount} critical design violations found. Please fix these immediately.`);
    }

    if (warningCount > 0) {
      recommendations.push(`⚠️  ${warningCount} design warnings found. Consider addressing these for better consistency.`);
    }

    const typographyViolations = violations.filter(v => v.type === 'typography').length;
    if (typographyViolations > 0) {
      recommendations.push('📝 Review typography: Remove icons from titles, avoid ALL CAPS, use consistent font sizes');
    }

    const colorViolations = violations.filter(v => v.type === 'color').length;
    if (colorViolations > 0) {
      recommendations.push('🎨 Review colors: Use design system colors consistently (#212529, #6C757D, #93C5FD)');
    }

    const componentViolations = violations.filter(v => v.type === 'component').length;
    if (componentViolations > 0) {
      recommendations.push('🔧 Review components: Ensure consistent button styling and spacing');
    }

    return recommendations;
  }

  /**
   * Save JSON report
   */
  private async saveJsonReport(report: any): Promise<void> {
    const reportPath = path.join(process.cwd(), 'agents/designer-agent/reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const filename = `design-compliance-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(reportPath, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📄 JSON report saved to: ${filepath}`);
  }

  /**
   * Save HTML report
   */
  private async saveHtmlReport(report: any): Promise<void> {
    const reportPath = path.join(process.cwd(), 'agents/designer-agent/reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }

    const html = this.generateHtmlReport(report);
    const filename = `design-compliance-${new Date().toISOString().split('T')[0]}.html`;
    const filepath = path.join(reportPath, filename);
    
    fs.writeFileSync(filepath, html);
    console.log(`📄 HTML report saved to: ${filepath}`);
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(report: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design Compliance Report</title>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 20px; background: #F8F9FA; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .score { font-size: 48px; font-weight: bold; color: ${report.averageScore >= 80 ? '#14B8A6' : report.averageScore >= 60 ? '#F8D7DA' : '#F8D7DA'}; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: #F8F9FA; padding: 15px; border-radius: 10px; text-align: center; }
        .violations { margin: 20px 0; }
        .violation-item { background: #F8F9FA; padding: 10px; margin: 5px 0; border-radius: 5px; }
        .recommendations { background: #D1ECF1; padding: 15px; border-radius: 10px; margin: 20px 0; }
        .recommendation { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Design Compliance Report</h1>
            <div class="score">${report.averageScore}/100</div>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <h3>${report.totalFiles}</h3>
                <p>Files Scanned</p>
            </div>
            <div class="stat-card">
                <h3>${report.totalViolations}</h3>
                <p>Total Violations</p>
            </div>
            <div class="stat-card">
                <h3>${report.filesWithViolations}</h3>
                <p>Files with Issues</p>
            </div>
        </div>

        <div class="violations">
            <h2>Top Violations</h2>
            ${report.topViolations.map(v => `
                <div class="violation-item">
                    <strong>${v.rule}</strong> - ${v.count} occurrences
                </div>
            `).join('')}
        </div>

        <div class="recommendations">
            <h2>Recommendations</h2>
            ${report.recommendations.map(r => `
                <div class="recommendation">${r}</div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Display console report
   */
  private displayConsoleReport(report: any): void {
    console.log('\n🎨 Design Compliance Report');
    console.log('========================');
    console.log(`📊 Overall Score: ${report.averageScore}/100`);
    console.log(`📁 Files Scanned: ${report.totalFiles}`);
    console.log(`⚠️  Total Violations: ${report.totalViolations}`);
    console.log(`📄 Files with Issues: ${report.filesWithViolations}`);
    
    if (Object.keys(report.violationsByType).length > 0) {
      console.log('\n📋 Violations by Type:');
      Object.entries(report.violationsByType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }

  /**
   * Attempt to auto-fix violations
   */
  private async attemptAutoFix(results: DesignValidationResult[]): Promise<void> {
    console.log('🔧 Attempting to auto-fix violations...');
    
    for (const result of results) {
      if (result.violations.length === 0) continue;

      try {
        await this.autoFixFile(result);
      } catch (error) {
        console.error(`Error auto-fixing ${result.file}:`, error);
      }
    }
  }

  /**
   * Auto-fix a specific file
   */
  private async autoFixFile(result: DesignValidationResult): Promise<void> {
    let content = fs.readFileSync(result.file, 'utf8');
    let modified = false;

    for (const violation of result.violations) {
      if (violation.severity === 'error') {
        // Apply auto-fixes based on violation type
        switch (violation.rule) {
          case 'no-icons-in-titles':
            // Remove common icons and emojis from titles
            content = content.replace(/[🎯⚙️🔧📊📈📉🎨🎭🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]/g, '');
            modified = true;
            break;
          case 'no-all-caps':
            // Convert ALL CAPS to proper case
            content = content.replace(/\b[A-Z]{3,}\b/g, (match) => {
              return match.charAt(0) + match.slice(1).toLowerCase();
            });
            modified = true;
            break;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(result.file, content);
      console.log(`✅ Auto-fixed violations in ${result.file}`);
    }
  }
}

export default DesignerAgentRunner;
