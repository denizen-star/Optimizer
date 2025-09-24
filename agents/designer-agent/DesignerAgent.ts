/**
 * Designer Agent - Validates Engineering Compliance with Design Principles
 * 
 * This agent monitors and validates that all code changes comply with the
 * established design system and design principles of the Optimizer application.
 */

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

export interface DesignViolation {
  id: string;
  type: 'typography' | 'color' | 'spacing' | 'component' | 'accessibility';
  severity: 'error' | 'warning' | 'info';
  file: string;
  line: number;
  message: string;
  suggestion: string;
  rule: string;
}

export interface DesignValidationResult {
  file: string;
  violations: DesignViolation[];
  score: number; // 0-100
  passed: boolean;
}

export interface AgentStatus {
  isActive: boolean;
  lastCheck: Date;
  totalFilesScanned: number;
  violationsFound: number;
  complianceScore: number;
}

export class DesignerAgent extends EventEmitter {
  private isActive: boolean = false;
  private designRules: DesignRule[] = [];
  private validationHistory: DesignValidationResult[] = [];
  private status: AgentStatus;

  constructor() {
    super();
    this.status = {
      isActive: false,
      lastCheck: new Date(),
      totalFilesScanned: 0,
      violationsFound: 0,
      complianceScore: 100
    };
    this.initializeDesignRules();
  }

  /**
   * Initialize all design rules based on the design system
   */
  private initializeDesignRules(): void {
    this.designRules = [
      // Typography Rules
      new TypographyRule('no-icons-in-titles', 'error', 
        'Never use icons or emojis in titles, headings, or section headers',
        /<.*?>\s*[🎯⚙️🔧📊📈📉🎨🎭🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋🏌🏍🏎🏏🏐🏑🏒🏓🏔🏕🏖🏗🏘🏙🏚🏛🏜🏝🏞🏟🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳🏴🏵🏶🏷🏸🏹🏺🏻🏼🏽🏾🏿]/,
        'Remove all icons and emojis from titles. Use clean text only.'
      ),
      
      new TypographyRule('no-all-caps', 'error',
        'Never use ALL CAPS text anywhere in the application',
        /[A-Z]{3,}/,
        'Replace ALL CAPS with proper capitalization.'
      ),

      new TypographyRule('font-family-consistency', 'error',
        'Use Plus Jakarta Sans font family consistently',
        /fontFamily:\s*['"](?!.*Plus Jakarta Sans)[^'"]*['"]/,
        'Use Plus Jakarta Sans font family as specified in the design system.'
      ),

      new TypographyRule('font-size-hierarchy', 'warning',
        'Follow the established font size hierarchy: 15px → 13px → 12px → 10px',
        /fontSize:\s*['"](?!1[035]px|12px)[^'"]*['"]/,
        'Use only approved font sizes: 15px, 13px, 12px, or 10px.'
      ),

      // Color Rules
      new ColorRule('primary-text-color', 'error',
        'Use #212529 for primary text color',
        /color:\s*['"](?!.*#212529)[^'"]*['"]/,
        'Use #212529 for primary text color as specified in the design system.'
      ),

      new ColorRule('secondary-text-color', 'warning',
        'Use #6C757D for secondary text and buttons',
        /color:\s*['"](?!.*#6C757D)[^'"]*['"]/,
        'Use #6C757D for secondary text and buttons.'
      ),

      new ColorRule('button-background-color', 'error',
        'Use #93C5FD for button background color',
        /backgroundColor:\s*['"](?!.*#93C5FD)[^'"]*['"]/,
        'Use #93C5FD for button background color.'
      ),

      new ColorRule('background-color-consistency', 'warning',
        'Use #FFFFFF for main background, #F8F9FA for cards',
        /backgroundColor:\s*['"](?!.*#FFFFFF|#F8F9FA)[^'"]*['"]/,
        'Use approved background colors: #FFFFFF for main, #F8F9FA for cards.'
      ),

      // Button Rules
      new ComponentRule('button-font-size', 'error',
        'All buttons must use 10px font size',
        /fontSize:\s*['"](?!10px)[^'"]*['"]/,
        'Use 10px font size for all buttons.'
      ),

      new ComponentRule('button-padding', 'warning',
        'Use consistent button padding: 5px 12px',
        /padding:\s*['"](?!.*5px\s+12px)[^'"]*['"]/,
        'Use consistent button padding: 5px 12px.'
      ),

      new ComponentRule('button-border-radius', 'warning',
        'Use consistent border radius: 15px',
        /borderRadius:\s*['"](?!15px)[^'"]*['"]/,
        'Use 15px border radius for all buttons.'
      ),

      // Spacing Rules
      new SpacingRule('consistent-spacing', 'warning',
        'Use design system spacing values: 5px, 10px, 15px, 20px, 30px',
        /(?:margin|padding|gap):\s*['"](?!.*(?:5px|10px|15px|20px|30px))[^'"]*['"]/,
        'Use approved spacing values from the design system.'
      ),

      // Accessibility Rules
      new AccessibilityRule('color-contrast', 'error',
        'Ensure sufficient color contrast for accessibility',
        /color:\s*['"](?:#000000|#FFFFFF)['"]/,
        'Ensure sufficient color contrast for accessibility compliance.'
      ),

      new AccessibilityRule('focus-indicators', 'warning',
        'Include focus indicators for interactive elements',
        /&:focus/,
        'Add focus indicators for better accessibility.'
      )
    ];
  }

  /**
   * Start the designer agent
   */
  public start(): void {
    this.isActive = true;
    this.status.isActive = true;
    this.emit('agent:started');
    console.log('🎨 Designer Agent started - Monitoring design compliance...');
  }

  /**
   * Stop the designer agent
   */
  public stop(): void {
    this.isActive = false;
    this.status.isActive = false;
    this.emit('agent:stopped');
    console.log('🎨 Designer Agent stopped');
  }

  /**
   * Validate a single file for design compliance
   */
  public async validateFile(filePath: string): Promise<DesignValidationResult> {
    if (!this.isActive) {
      throw new Error('Designer Agent is not active');
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const violations: DesignViolation[] = [];
      
      // Run all design rules against the file content
      for (const rule of this.designRules) {
        const ruleViolations = rule.validate(content, filePath);
        violations.push(...ruleViolations);
      }

      const score = this.calculateComplianceScore(violations);
      const result: DesignValidationResult = {
        file: filePath,
        violations,
        score,
        passed: violations.filter(v => v.severity === 'error').length === 0
      };

      this.validationHistory.push(result);
      this.updateStatus(result);
      
      this.emit('validation:complete', result);
      return result;

    } catch (error) {
      console.error(`Error validating file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Validate all files in a directory
   */
  public async validateDirectory(dirPath: string): Promise<DesignValidationResult[]> {
    const results: DesignValidationResult[] = [];
    const files = this.getRelevantFiles(dirPath);

    for (const file of files) {
      try {
        const result = await this.validateFile(file);
        results.push(result);
      } catch (error) {
        console.error(`Error validating ${file}:`, error);
      }
    }

    return results;
  }

  /**
   * Get design compliance report
   */
  public getComplianceReport(): {
    status: AgentStatus;
    recentViolations: DesignViolation[];
    complianceScore: number;
    recommendations: string[];
  } {
    const recentViolations = this.validationHistory
      .flatMap(r => r.violations)
      .filter(v => v.severity === 'error')
      .slice(0, 10);

    const recommendations = this.generateRecommendations();

    return {
      status: this.status,
      recentViolations,
      complianceScore: this.status.complianceScore,
      recommendations
    };
  }

  /**
   * Get agent status
   */
  public getStatus(): AgentStatus {
    return this.status;
  }

  /**
   * Calculate compliance score based on violations
   */
  private calculateComplianceScore(violations: DesignViolation[]): number {
    if (violations.length === 0) return 100;
    
    const errorCount = violations.filter(v => v.severity === 'error').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    
    const errorPenalty = errorCount * 10;
    const warningPenalty = warningCount * 5;
    
    return Math.max(0, 100 - errorPenalty - warningPenalty);
  }

  /**
   * Update agent status
   */
  private updateStatus(result: DesignValidationResult): void {
    this.status.lastCheck = new Date();
    this.status.totalFilesScanned++;
    this.status.violationsFound += result.violations.length;
    this.status.complianceScore = this.calculateOverallComplianceScore();
  }

  /**
   * Calculate overall compliance score
   */
  private calculateOverallComplianceScore(): number {
    if (this.validationHistory.length === 0) return 100;
    
    const totalScore = this.validationHistory.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / this.validationHistory.length);
  }

  /**
   * Get relevant files for validation
   */
  private getRelevantFiles(dirPath: string): string[] {
    const files: string[] = [];
    const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'];
    
    const scanDirectory = (dir: string) => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDirectory(fullPath);
          } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dir}:`, error);
      }
    };

    scanDirectory(dirPath);
    return files;
  }

  /**
   * Generate recommendations based on violations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const recentViolations = this.validationHistory
      .flatMap(r => r.violations)
      .slice(-20);

    const violationTypes = recentViolations.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (violationTypes.typography > 0) {
      recommendations.push('Review typography rules: Remove icons from titles, avoid ALL CAPS, use consistent font sizes');
    }

    if (violationTypes.color > 0) {
      recommendations.push('Review color usage: Use design system colors consistently (#212529, #6C757D, #93C5FD)');
    }

    if (violationTypes.component > 0) {
      recommendations.push('Review component styling: Ensure consistent button styling and spacing');
    }

    if (violationTypes.accessibility > 0) {
      recommendations.push('Review accessibility: Ensure proper color contrast and focus indicators');
    }

    return recommendations;
  }
}

/**
 * Base class for design rules
 */
abstract class DesignRule {
  constructor(
    public id: string,
    public severity: 'error' | 'warning' | 'info',
    public description: string,
    public pattern: RegExp,
    public suggestion: string
  ) {}

  abstract validate(content: string, filePath: string): DesignViolation[];
}

/**
 * Typography-specific design rules
 */
class TypographyRule extends DesignRule {
  validate(content: string, filePath: string): DesignViolation[] {
    const violations: DesignViolation[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (this.pattern.test(line)) {
        violations.push({
          id: `${this.id}-${i}`,
          type: 'typography',
          severity: this.severity,
          file: filePath,
          line: i + 1,
          message: this.description,
          suggestion: this.suggestion,
          rule: this.id
        });
      }
    }

    return violations;
  }
}

/**
 * Color-specific design rules
 */
class ColorRule extends DesignRule {
  validate(content: string, filePath: string): DesignViolation[] {
    const violations: DesignViolation[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (this.pattern.test(line)) {
        violations.push({
          id: `${this.id}-${i}`,
          type: 'color',
          severity: this.severity,
          file: filePath,
          line: i + 1,
          message: this.description,
          suggestion: this.suggestion,
          rule: this.id
        });
      }
    }

    return violations;
  }
}

/**
 * Component-specific design rules
 */
class ComponentRule extends DesignRule {
  validate(content: string, filePath: string): DesignViolation[] {
    const violations: DesignViolation[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (this.pattern.test(line)) {
        violations.push({
          id: `${this.id}-${i}`,
          type: 'component',
          severity: this.severity,
          file: filePath,
          line: i + 1,
          message: this.description,
          suggestion: this.suggestion,
          rule: this.id
        });
      }
    }

    return violations;
  }
}

/**
 * Spacing-specific design rules
 */
class SpacingRule extends DesignRule {
  validate(content: string, filePath: string): DesignViolation[] {
    const violations: DesignViolation[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (this.pattern.test(line)) {
        violations.push({
          id: `${this.id}-${i}`,
          type: 'spacing',
          severity: this.severity,
          file: filePath,
          line: i + 1,
          message: this.description,
          suggestion: this.suggestion,
          rule: this.id
        });
      }
    }

    return violations;
  }
}

/**
 * Accessibility-specific design rules
 */
class AccessibilityRule extends DesignRule {
  validate(content: string, filePath: string): DesignViolation[] {
    const violations: DesignViolation[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (this.pattern.test(line)) {
        violations.push({
          id: `${this.id}-${i}`,
          type: 'accessibility',
          severity: this.severity,
          file: filePath,
          line: i + 1,
          message: this.description,
          suggestion: this.suggestion,
          rule: this.id
        });
      }
    }

    return violations;
  }
}

export default DesignerAgent;
