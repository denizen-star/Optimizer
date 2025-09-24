/**
 * Designer Agent - Main entry point
 * 
 * This module provides the main interface for the Designer Agent system
 * that validates engineering compliance with design principles.
 */

export { DesignerAgent, DesignViolation, DesignValidationResult, AgentStatus } from './DesignerAgent';
export { DesignerAgentRunner, AgentConfig } from './DesignerAgentRunner';

// Default configuration
export const DEFAULT_CONFIG: AgentConfig = {
  watchDirectories: [
    'src/components',
    'src/modules',
    'src/design-system'
  ],
  excludePatterns: [
    'node_modules',
    '.git',
    'dist',
    'build',
    '*.test.*',
    '*.spec.*'
  ],
  checkInterval: 30000, // 30 seconds
  autoFix: false,
  reportFormat: 'console'
};

// Quick start function
export async function startDesignerAgent(config?: Partial<AgentConfig>): Promise<DesignerAgentRunner> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const runner = new DesignerAgentRunner(finalConfig);
  await runner.start();
  return runner;
}

// CLI interface
export async function runDesignerAgentCLI(): Promise<void> {
  const args = process.argv.slice(2);
  const config: Partial<AgentConfig> = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--watch':
        if (args[i + 1]) {
          config.watchDirectories = args[i + 1].split(',');
          i++;
        }
        break;
      case '--interval':
        if (args[i + 1]) {
          config.checkInterval = parseInt(args[i + 1]);
          i++;
        }
        break;
      case '--auto-fix':
        config.autoFix = true;
        break;
      case '--format':
        if (args[i + 1]) {
          config.reportFormat = args[i + 1] as 'json' | 'html' | 'console';
          i++;
        }
        break;
      case '--help':
        console.log(`
🎨 Designer Agent - Design Compliance Validator

Usage: npx ts-node agents/designer-agent/index.ts [options]

Options:
  --watch <dirs>     Comma-separated list of directories to watch
  --interval <ms>    Check interval in milliseconds (default: 30000)
  --auto-fix         Enable automatic fixing of violations
  --format <format>  Report format: json, html, console (default: console)
  --help            Show this help message

Examples:
  npx ts-node agents/designer-agent/index.ts
  npx ts-node agents/designer-agent/index.ts --watch src,public --interval 10000
  npx ts-node agents/designer-agent/index.ts --auto-fix --format html
        `);
        process.exit(0);
        break;
    }
  }

  try {
    const runner = await startDesignerAgent(config);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Designer Agent...');
      runner.stop();
      process.exit(0);
    });

    console.log('🎨 Designer Agent is running. Press Ctrl+C to stop.');
    
  } catch (error) {
    console.error('❌ Error starting Designer Agent:', error);
    process.exit(1);
  }
}

// Export default
export default DesignerAgentRunner;
