#!/usr/bin/env npx ts-node

/**
 * Start Agents - Main entry point for starting all agents
 */

import { AgentManager, DEFAULT_AGENT_MANAGER_CONFIG } from './agent-manager';
import { AgentConfig } from './designer-agent';

interface StartAgentsConfig {
  designer?: boolean;
  monitoring?: boolean;
  config?: Partial<AgentConfig>;
}

async function startAgents(config: StartAgentsConfig = {}): Promise<void> {
  console.log('🤖 Starting Optimizer Agents...');
  console.log('================================');

  // Create agent manager configuration
  const agentManagerConfig = {
    ...DEFAULT_AGENT_MANAGER_CONFIG,
    agents: {
      designer: config.designer !== false ? {
        ...DEFAULT_AGENT_MANAGER_CONFIG.agents.designer!,
        ...config.config
      } : undefined
    },
    monitoring: {
      ...DEFAULT_AGENT_MANAGER_CONFIG.monitoring,
      enabled: config.monitoring !== false
    }
  };

  // Create and start agent manager
  const agentManager = new AgentManager(agentManagerConfig);

  // Set up event handlers
  agentManager.on('manager:started', () => {
    console.log('✅ Agent Manager started successfully');
  });

  agentManager.on('manager:stopped', () => {
    console.log('⏹️  Agent Manager stopped');
  });

  agentManager.on('agent:validation', ({ agent, result }) => {
    if (result.violations.length > 0) {
      console.log(`⚠️  ${agent} found ${result.violations.length} violations in ${result.file}`);
    }
  });

  agentManager.on('agent:alert', ({ agent, status }) => {
    console.log(`🚨 Alert: ${agent} is in error state`);
  });

  agentManager.on('monitoring:health-check', (healthStatus) => {
    const runningAgents = healthStatus.agents.filter(a => a.status === 'running').length;
    const errorAgents = healthStatus.agents.filter(a => a.status === 'error').length;
    
    if (errorAgents > 0) {
      console.log(`⚠️  Health Check: ${runningAgents} running, ${errorAgents} errors`);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down agents...');
    agentManager.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down agents...');
    agentManager.stop();
    process.exit(0);
  });

  try {
    await agentManager.start();
    
    // Display system status
    const systemStatus = agentManager.getSystemStatus();
    console.log('\n📊 System Status:');
    console.log(`   Total Agents: ${systemStatus.totalAgents}`);
    console.log(`   Running: ${systemStatus.runningAgents}`);
    console.log(`   Errors: ${systemStatus.errorAgents}`);
    console.log(`   Last Activity: ${systemStatus.lastActivity.toLocaleString()}`);
    
    console.log('\n🎯 Agents are running. Press Ctrl+C to stop.');
    
    // Keep the process alive
    setInterval(() => {
      // Heartbeat to keep the process alive
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error starting agents:', error);
    process.exit(1);
  }
}

// CLI interface
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const config: StartAgentsConfig = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--no-designer':
        config.designer = false;
        break;
      case '--no-monitoring':
        config.monitoring = false;
        break;
      case '--watch':
        if (args[i + 1]) {
          config.config = {
            ...config.config,
            watchDirectories: args[i + 1].split(',')
          };
          i++;
        }
        break;
      case '--interval':
        if (args[i + 1]) {
          config.config = {
            ...config.config,
            checkInterval: parseInt(args[i + 1])
          };
          i++;
        }
        break;
      case '--auto-fix':
        config.config = {
          ...config.config,
          autoFix: true
        };
        break;
      case '--format':
        if (args[i + 1]) {
          config.config = {
            ...config.config,
            reportFormat: args[i + 1] as 'json' | 'html' | 'console'
          };
          i++;
        }
        break;
      case '--help':
        console.log(`
🤖 Optimizer Agents - Centralized Agent Management

Usage: npx ts-node agents/start-agents.ts [options]

Options:
  --no-designer      Disable the designer agent
  --no-monitoring     Disable monitoring system
  --watch <dirs>      Comma-separated list of directories to watch
  --interval <ms>     Check interval in milliseconds (default: 30000)
  --auto-fix          Enable automatic fixing of violations
  --format <format>   Report format: json, html, console (default: console)
  --help             Show this help message

Examples:
  npx ts-node agents/start-agents.ts
  npx ts-node agents/start-agents.ts --no-designer
  npx ts-node agents/start-agents.ts --watch src,public --interval 10000
  npx ts-node agents/start-agents.ts --auto-fix --format html

Available Agents:
  🎨 Designer Agent    - Validates design compliance
  📊 Monitor Agent     - System health monitoring
  🔍 Validator Agent   - Code quality validation
        `);
        process.exit(0);
        break;
    }
  }

  await startAgents(config);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { startAgents, StartAgentsConfig };
export default startAgents;
