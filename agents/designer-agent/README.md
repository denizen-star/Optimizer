# 🎨 Designer Agent

A comprehensive design compliance validation agent that ensures engineering teams adhere to the established design principles of the Optimizer application.

## Overview

The Designer Agent continuously monitors code changes and validates compliance with the design system, providing real-time feedback and automated fixes for common design violations.

## Features

### 🔍 **Comprehensive Validation**
- **Typography Rules**: Validates font families, sizes, and hierarchy
- **Color Compliance**: Ensures consistent use of design system colors
- **Component Standards**: Validates button styling, spacing, and consistency
- **Accessibility**: Checks for proper contrast and focus indicators
- **Icon Usage**: Prevents inappropriate icon usage in titles and headings

### 🚀 **Automated Monitoring**
- **Real-time Validation**: Continuous monitoring of code changes
- **Batch Processing**: Validates entire directories and projects
- **Smart Filtering**: Excludes test files and build artifacts
- **Performance Optimized**: Efficient scanning with minimal overhead

### 🔧 **Auto-Fix Capabilities**
- **Icon Removal**: Automatically removes icons from titles
- **Case Correction**: Converts ALL CAPS to proper case
- **Color Standardization**: Suggests design system colors
- **Spacing Normalization**: Applies consistent spacing rules

### 📊 **Rich Reporting**
- **Multiple Formats**: JSON, HTML, and console reports
- **Compliance Scoring**: 0-100 compliance score
- **Violation Tracking**: Detailed violation history
- **Recommendations**: Actionable improvement suggestions

## Quick Start

### Installation

```bash
# Navigate to the designer agent directory
cd agents/designer-agent

# Install dependencies
npm install
```

### Basic Usage

```bash
# Start the agent with default settings
npm start

# Start with custom configuration
npm run dev

# Generate compliance report
npm run validate

# Enable auto-fixing
npm run auto-fix
```

### Programmatic Usage

```typescript
import { DesignerAgentRunner, startDesignerAgent } from './agents/designer-agent';

// Quick start with default config
const runner = await startDesignerAgent();

// Custom configuration
const runner = await startDesignerAgent({
  watchDirectories: ['src/components', 'src/modules'],
  checkInterval: 10000,
  autoFix: true,
  reportFormat: 'html'
});

// Validate specific file
const result = await runner.validateFile('src/components/MyComponent.tsx');

// Get compliance report
const report = runner.getComplianceReport();
```

## Design Rules

### 🚫 **Typography Rules**

| Rule | Severity | Description |
|------|----------|-------------|
| `no-icons-in-titles` | Error | Never use icons or emojis in titles, headings, or section headers |
| `no-all-caps` | Error | Never use ALL CAPS text anywhere in the application |
| `font-family-consistency` | Error | Use Plus Jakarta Sans font family consistently |
| `font-size-hierarchy` | Warning | Follow the established font size hierarchy: 15px → 13px → 12px → 10px |

### 🎨 **Color Rules**

| Rule | Severity | Description |
|------|----------|-------------|
| `primary-text-color` | Error | Use #212529 for primary text color |
| `secondary-text-color` | Warning | Use #6C757D for secondary text and buttons |
| `button-background-color` | Error | Use #93C5FD for button background color |
| `background-color-consistency` | Warning | Use #FFFFFF for main background, #F8F9FA for cards |

### 🔘 **Component Rules**

| Rule | Severity | Description |
|------|----------|-------------|
| `button-font-size` | Error | All buttons must use 10px font size |
| `button-padding` | Warning | Use consistent button padding: 5px 12px |
| `button-border-radius` | Warning | Use consistent border radius: 15px |

### 📏 **Spacing Rules**

| Rule | Severity | Description |
|------|----------|-------------|
| `consistent-spacing` | Warning | Use design system spacing values: 5px, 10px, 15px, 20px, 30px |

### ♿ **Accessibility Rules**

| Rule | Severity | Description |
|------|----------|-------------|
| `color-contrast` | Error | Ensure sufficient color contrast for accessibility |
| `focus-indicators` | Warning | Include focus indicators for interactive elements |

## Configuration

### AgentConfig Interface

```typescript
interface AgentConfig {
  watchDirectories: string[];     // Directories to monitor
  excludePatterns: string[];     // Patterns to exclude
  checkInterval: number;          // Check interval in milliseconds
  autoFix: boolean;              // Enable automatic fixing
  reportFormat: 'json' | 'html' | 'console'; // Report format
}
```

### Default Configuration

```typescript
const DEFAULT_CONFIG: AgentConfig = {
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
```

## CLI Usage

### Basic Commands

```bash
# Start with default settings
npx ts-node index.ts

# Watch specific directories
npx ts-node index.ts --watch src,public

# Set custom check interval
npx ts-node index.ts --interval 10000

# Enable auto-fixing
npx ts-node index.ts --auto-fix

# Generate HTML report
npx ts-node index.ts --format html

# Show help
npx ts-node index.ts --help
```

### Command Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--watch <dirs>` | Comma-separated list of directories to watch | `--watch src,public` |
| `--interval <ms>` | Check interval in milliseconds | `--interval 10000` |
| `--auto-fix` | Enable automatic fixing of violations | `--auto-fix` |
| `--format <format>` | Report format: json, html, console | `--format html` |
| `--help` | Show help message | `--help` |

## API Reference

### DesignerAgent Class

```typescript
class DesignerAgent extends EventEmitter {
  start(): void;
  stop(): void;
  validateFile(filePath: string): Promise<DesignValidationResult>;
  validateDirectory(dirPath: string): Promise<DesignValidationResult[]>;
  getComplianceReport(): ComplianceReport;
  getStatus(): AgentStatus;
}
```

### DesignerAgentRunner Class

```typescript
class DesignerAgentRunner {
  constructor(config: AgentConfig);
  start(): Promise<void>;
  stop(): void;
  runValidation(): Promise<void>;
  validateFile(filePath: string): Promise<DesignValidationResult>;
  getStatus(): AgentStatus;
  getComplianceReport(): ComplianceReport;
}
```

## Events

The Designer Agent emits the following events:

| Event | Description | Payload |
|-------|-------------|---------|
| `agent:started` | Agent has started | None |
| `agent:stopped` | Agent has stopped | None |
| `validation:complete` | File validation completed | `DesignValidationResult` |

## Examples

### Example 1: Basic Validation

```typescript
import { DesignerAgent } from './agents/designer-agent';

const agent = new DesignerAgent();
agent.start();

// Validate a specific file
const result = await agent.validateFile('src/components/MyComponent.tsx');

if (!result.passed) {
  console.log(`Found ${result.violations.length} violations`);
  result.violations.forEach(violation => {
    console.log(`${violation.severity}: ${violation.message}`);
    console.log(`Suggestion: ${violation.suggestion}`);
  });
}
```

### Example 2: Continuous Monitoring

```typescript
import { startDesignerAgent } from './agents/designer-agent';

const runner = await startDesignerAgent({
  watchDirectories: ['src/components'],
  checkInterval: 10000,
  autoFix: true,
  reportFormat: 'html'
});

// Agent will continuously monitor and auto-fix violations
```

### Example 3: Custom Validation Rules

```typescript
import { DesignerAgent } from './agents/designer-agent';

const agent = new DesignerAgent();

// Add custom event listeners
agent.on('validation:complete', (result) => {
  if (result.score < 80) {
    console.log(`⚠️ Low compliance score: ${result.score}/100`);
  }
});

agent.start();
```

## Integration

### With CI/CD Pipeline

```yaml
# .github/workflows/design-compliance.yml
name: Design Compliance Check

on: [push, pull_request]

jobs:
  design-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run design compliance check
        run: |
          cd agents/designer-agent
          npm run validate
      - name: Upload compliance report
        uses: actions/upload-artifact@v2
        with:
          name: design-compliance-report
          path: agents/designer-agent/reports/
```

### With Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "cd agents/designer-agent && npm run validate"
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Agent not starting**
   - Check if Node.js is installed
   - Verify TypeScript is available
   - Ensure all dependencies are installed

2. **No violations detected**
   - Check if files are in the correct directories
   - Verify file extensions are supported (.tsx, .ts, .jsx, .js, .css, .scss)
   - Ensure files contain actual content

3. **Auto-fix not working**
   - Check if auto-fix is enabled in configuration
   - Verify file permissions
   - Review violation types (some violations cannot be auto-fixed)

### Debug Mode

```bash
# Enable debug logging
DEBUG=designer-agent npx ts-node index.ts

# Verbose output
npx ts-node index.ts --verbose
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Run the designer agent to validate your changes
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Design System Documentation

The Designer Agent validates compliance with the Optimizer Design System. For complete design system documentation, refer to:

- **Master Design Documentation**: [../../docs/design-system/design-system-master.md](../../docs/design-system/design-system-master.md) - Consolidated design system reference
- **Technical Implementation**: [../../docs/design-system/design-system.md](../../docs/design-system/design-system.md) - Technical implementation details
- **Design System Overview**: [../../docs/design-system/index.md](../../docs/design-system/index.md) - Complete documentation index

## Support

For questions or issues:
- Create an issue in the repository
- Check the troubleshooting section
- Review the design system documentation
- Consult the master design documentation for design decisions
