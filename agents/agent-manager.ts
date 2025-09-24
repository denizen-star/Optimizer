/**
 * Agent Manager - Centralized management system for all agents
 */

import { EventEmitter } from 'events';
import { DesignerAgentRunner, AgentConfig } from './designer-agent';

export interface AgentInfo {
  id: string;
  name: string;
  type: 'designer' | 'validator' | 'monitor';
  status: 'running' | 'stopped' | 'error';
  lastActivity: Date;
  config: any;
}

export interface AgentManagerConfig {
  agents: {
    designer?: AgentConfig;
  };
  monitoring: {
    enabled: boolean;
    interval: number;
    alertThreshold: number;
  };
}

export class AgentManager extends EventEmitter {
  private agents: Map<string, any> = new Map();
  private config: AgentManagerConfig;
  private monitoringTimer?: NodeJS.Timeout;
  private isRunning: boolean = false;

  constructor(config: AgentManagerConfig) {
    super();
    this.config = config;
  }

  /**
   * Start the agent manager
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Agent Manager is already running');
      return;
    }

    this.isRunning = true;
    console.log('🤖 Agent Manager starting...');

    // Start configured agents
    if (this.config.agents.designer) {
      await this.startDesignerAgent();
    }

    // Start monitoring if enabled
    if (this.config.monitoring.enabled) {
      this.startMonitoring();
    }

    console.log('✅ Agent Manager started successfully');
    this.emit('manager:started');
  }

  /**
   * Stop the agent manager
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log('Agent Manager is not running');
      return;
    }

    this.isRunning = false;
    console.log('🛑 Agent Manager stopping...');

    // Stop all agents
    for (const [id, agent] of this.agents) {
      try {
        if (agent.stop) {
          agent.stop();
        }
      } catch (error) {
        console.error(`Error stopping agent ${id}:`, error);
      }
    }

    // Stop monitoring
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = undefined;
    }

    this.agents.clear();
    console.log('✅ Agent Manager stopped');
    this.emit('manager:stopped');
  }

  /**
   * Start the designer agent
   */
  private async startDesignerAgent(): Promise<void> {
    try {
      const { DesignerAgentRunner } = await import('./designer-agent');
      const runner = new DesignerAgentRunner(this.config.agents.designer!);
      await runner.start();
      
      this.agents.set('designer', runner);
      console.log('🎨 Designer Agent started');
      
      // Set up event forwarding
      runner.on('validation:complete', (result) => {
        this.emit('agent:validation', { agent: 'designer', result });
      });

    } catch (error) {
      console.error('Error starting Designer Agent:', error);
      this.emit('agent:error', { agent: 'designer', error });
    }
  }

  /**
   * Start monitoring system
   */
  private startMonitoring(): void {
    this.monitoringTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.monitoring.interval);

    console.log(`📊 Monitoring started (interval: ${this.config.monitoring.interval}ms)`);
  }

  /**
   * Perform health check on all agents
   */
  private performHealthCheck(): void {
    const healthStatus = {
      timestamp: new Date(),
      agents: [] as AgentInfo[]
    };

    for (const [id, agent] of this.agents) {
      try {
        const status = this.getAgentStatus(id, agent);
        healthStatus.agents.push(status);

        // Check for alerts
        if (status.status === 'error') {
          this.emit('agent:alert', { agent: id, status });
        }

      } catch (error) {
        console.error(`Health check failed for agent ${id}:`, error);
        healthStatus.agents.push({
          id,
          name: this.getAgentName(id),
          type: this.getAgentType(id),
          status: 'error',
          lastActivity: new Date(),
          config: {}
        });
      }
    }

    this.emit('monitoring:health-check', healthStatus);
  }

  /**
   * Get agent status
   */
  private getAgentStatus(id: string, agent: any): AgentInfo {
    let status: 'running' | 'stopped' | 'error' = 'stopped';
    let lastActivity = new Date();

    try {
      if (agent.getStatus) {
        const agentStatus = agent.getStatus();
        status = agentStatus.isActive ? 'running' : 'stopped';
        lastActivity = agentStatus.lastCheck || new Date();
      }
    } catch (error) {
      status = 'error';
    }

    return {
      id,
      name: this.getAgentName(id),
      type: this.getAgentType(id),
      status,
      lastActivity,
      config: this.config.agents[id as keyof typeof this.config.agents] || {}
    };
  }

  /**
   * Get agent name
   */
  private getAgentName(id: string): string {
    const names: Record<string, string> = {
      designer: 'Designer Agent',
      validator: 'Validator Agent',
      monitor: 'Monitor Agent'
    };
    return names[id] || 'Unknown Agent';
  }

  /**
   * Get agent type
   */
  private getAgentType(id: string): 'designer' | 'validator' | 'monitor' {
    const types: Record<string, 'designer' | 'validator' | 'monitor'> = {
      designer: 'designer',
      validator: 'validator',
      monitor: 'monitor'
    };
    return types[id] || 'monitor';
  }

  /**
   * Get all agent information
   */
  public getAgentsInfo(): AgentInfo[] {
    const agents: AgentInfo[] = [];
    
    for (const [id, agent] of this.agents) {
      agents.push(this.getAgentStatus(id, agent));
    }
    
    return agents;
  }

  /**
   * Get specific agent
   */
  public getAgent(id: string): any {
    return this.agents.get(id);
  }

  /**
   * Check if agent is running
   */
  public isAgentRunning(id: string): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;
    
    try {
      if (agent.getStatus) {
        return agent.getStatus().isActive;
      }
    } catch (error) {
      return false;
    }
    
    return false;
  }

  /**
   * Get overall system status
   */
  public getSystemStatus(): {
    isRunning: boolean;
    totalAgents: number;
    runningAgents: number;
    errorAgents: number;
    lastActivity: Date;
  } {
    const agents = this.getAgentsInfo();
    const runningAgents = agents.filter(a => a.status === 'running').length;
    const errorAgents = agents.filter(a => a.status === 'error').length;
    const lastActivity = agents.reduce((latest, agent) => {
      return agent.lastActivity > latest ? agent.lastActivity : latest;
    }, new Date(0));

    return {
      isRunning: this.isRunning,
      totalAgents: agents.length,
      runningAgents,
      errorAgents,
      lastActivity
    };
  }
}

// Default configuration
export const DEFAULT_AGENT_MANAGER_CONFIG: AgentManagerConfig = {
  agents: {
    designer: {
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
      checkInterval: 30000,
      autoFix: false,
      reportFormat: 'console'
    }
  },
  monitoring: {
    enabled: true,
    interval: 60000, // 1 minute
    alertThreshold: 0.8 // 80% compliance threshold
  }
};

export default AgentManager;
