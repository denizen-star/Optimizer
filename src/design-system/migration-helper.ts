/**
 * Design System Migration Helper
 * 
 * This utility helps migrate hardcoded colors to design system values
 * and provides validation for design compliance.
 */

import { DESIGN_SYSTEM } from './theme';

export interface ColorMigration {
  hardcodedColor: string;
  designSystemPath: string;
  replacementValue: string;
  description: string;
}

export interface ComponentMigration {
  filePath: string;
  lineNumber: number;
  originalCode: string;
  suggestedReplacement: string;
  migration: ColorMigration;
}

// Color mapping from hardcoded values to design system paths
export const COLOR_MIGRATIONS: ColorMigration[] = [
  // Activity colors
  {
    hardcodedColor: '#4CAF50',
    designSystemPath: 'colors.activity.individual',
    replacementValue: 'colors.activity.individual',
    description: 'Individual activity color'
  },
  {
    hardcodedColor: '#2196F3',
    designSystemPath: 'colors.activity.networking',
    replacementValue: 'colors.activity.networking',
    description: 'Networking activity color'
  },
  {
    hardcodedColor: '#E91E63',
    designSystemPath: 'colors.activity.couple',
    replacementValue: 'colors.activity.couple',
    description: 'Couple activity color'
  },
  {
    hardcodedColor: '#9E9E9E',
    designSystemPath: 'colors.activity.default',
    replacementValue: 'colors.activity.default',
    description: 'Default activity color'
  },
  
  // Persona colors
  {
    hardcodedColor: '#ff5722',
    designSystemPath: 'colors.persona.jobSearch',
    replacementValue: 'colors.persona.jobSearch',
    description: 'Job search persona color'
  },
  {
    hardcodedColor: '#2196f3',
    designSystemPath: 'colors.persona.working',
    replacementValue: 'colors.persona.working',
    description: 'Working persona color'
  },
  {
    hardcodedColor: '#9c27b0',
    designSystemPath: 'colors.persona.default',
    replacementValue: 'colors.persona.default',
    description: 'Default persona color'
  },
  
  // UI colors
  {
    hardcodedColor: '#FF9800',
    designSystemPath: 'colors.ui.warningOrange',
    replacementValue: 'colors.ui.warningOrange',
    description: 'Warning orange color'
  },
  {
    hardcodedColor: '#E65100',
    designSystemPath: 'colors.ui.warningOrangeDark',
    replacementValue: 'colors.ui.warningOrangeDark',
    description: 'Dark warning orange color'
  },
  {
    hardcodedColor: '#FFF3E0',
    designSystemPath: 'colors.ui.warningOrangeLight',
    replacementValue: 'colors.ui.warningOrangeLight',
    description: 'Light warning orange color'
  },
  {
    hardcodedColor: '#E8F5E8',
    designSystemPath: 'colors.ui.successGreenLight',
    replacementValue: 'colors.ui.successGreenLight',
    description: 'Light success green color'
  },
  {
    hardcodedColor: '#2E7D32',
    designSystemPath: 'colors.ui.successGreenDark',
    replacementValue: 'colors.ui.successGreenDark',
    description: 'Dark success green color'
  },
  {
    hardcodedColor: '#E3F2FD',
    designSystemPath: 'colors.ui.infoBlueLight',
    replacementValue: 'colors.ui.infoBlueLight',
    description: 'Light info blue color'
  },
  {
    hardcodedColor: '#1976D2',
    designSystemPath: 'colors.ui.infoBlueDark',
    replacementValue: 'colors.ui.infoBlueDark',
    description: 'Dark info blue color'
  },
  {
    hardcodedColor: '#FFD700',
    designSystemPath: 'colors.ui.gold',
    replacementValue: 'colors.ui.gold',
    description: 'Gold color'
  },
  
  // Navigation colors
  {
    hardcodedColor: '#2c3e50',
    designSystemPath: 'colors.navigation.background',
    replacementValue: 'colors.navigation.background',
    description: 'Navigation background color'
  },
  
  // Spacing values
  {
    hardcodedColor: '30px',
    designSystemPath: 'spacing.xl',
    replacementValue: 'spacing.xl',
    description: 'Extra large spacing'
  },
];

/**
 * Get migration suggestions for a given hardcoded color
 */
export function getMigrationForColor(hardcodedColor: string): ColorMigration | null {
  return COLOR_MIGRATIONS.find(migration => 
    migration.hardcodedColor.toLowerCase() === hardcodedColor.toLowerCase()
  ) || null;
}

/**
 * Generate replacement code for a hardcoded color
 */
export function generateReplacement(
  originalCode: string,
  hardcodedColor: string,
  migration: ColorMigration
): string {
  // Replace the hardcoded color with the design system reference
  return originalCode.replace(
    hardcodedColor,
    migration.replacementValue
  );
}

/**
 * Validate that a component is using design system colors
 */
export function validateDesignSystemUsage(componentCode: string): {
  violations: Array<{
    line: number;
    hardcodedColor: string;
    suggestion: string;
  }>;
  score: number;
} {
  const lines = componentCode.split('\n');
  const violations: Array<{
    line: number;
    hardcodedColor: string;
    suggestion: string;
  }> = [];

  lines.forEach((line, index) => {
    // Look for hex color patterns
    const hexColorMatches = line.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
    
    if (hexColorMatches) {
      hexColorMatches.forEach(hexColor => {
        const migration = getMigrationForColor(hexColor);
        if (migration) {
          violations.push({
            line: index + 1,
            hardcodedColor: hexColor,
            suggestion: `Replace with ${migration.replacementValue}`
          });
        }
      });
    }
  });

  const totalLines = lines.length;
  const violationCount = violations.length;
  const score = Math.max(0, 100 - (violationCount * 10));

  return { violations, score };
}

/**
 * Get all hardcoded colors that should be migrated
 */
export function getHardcodedColors(): string[] {
  return COLOR_MIGRATIONS.map(migration => migration.hardcodedColor);
}

/**
 * Generate a migration report for a component
 */
export function generateMigrationReport(
  filePath: string,
  componentCode: string
): {
  filePath: string;
  violations: Array<{
    line: number;
    hardcodedColor: string;
    suggestion: string;
    migration: ColorMigration;
  }>;
  score: number;
  recommendations: string[];
} {
  const validation = validateDesignSystemUsage(componentCode);
  const recommendations: string[] = [];

  const violationsWithMigration = validation.violations.map(violation => {
    const migration = getMigrationForColor(violation.hardcodedColor);
    return {
      ...violation,
      migration: migration!
    };
  });

  if (violationsWithMigration.length > 0) {
    recommendations.push(`Found ${violationsWithMigration.length} hardcoded colors that should be migrated to design system`);
    recommendations.push('Import useDesignSystem hook: const { colors, spacing } = useDesignSystem();');
    recommendations.push('Replace hardcoded colors with design system references');
  }

  if (validation.score < 80) {
    recommendations.push('Consider refactoring to improve design system compliance');
  }

  return {
    filePath,
    violations: violationsWithMigration,
    score: validation.score,
    recommendations
  };
}

export default {
  COLOR_MIGRATIONS,
  getMigrationForColor,
  generateReplacement,
  validateDesignSystemUsage,
  getHardcodedColors,
  generateMigrationReport
};
