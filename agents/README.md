# 🤖 Optimizer Agents

A comprehensive agent system for the Optimizer application that ensures design compliance, code quality, and system monitoring.

## Overview

The Optimizer Agents system provides automated validation and monitoring capabilities to ensure that all development work adheres to established design principles and maintains high code quality standards.

## 🎨 Designer Agent

The Designer Agent is the core component that validates engineering compliance with design principles.

### Features

- **Real-time Validation**: Continuously monitors code changes for design compliance
- **Comprehensive Rules**: Validates typography, colors, components, spacing, and accessibility
- **Auto-fix Capabilities**: Automatically fixes common design violations
- **Rich Reporting**: Generates detailed compliance reports in multiple formats

### Design Rules Validated

#### Typography Rules
- ✅ No icons in titles or headings
- ✅ No ALL CAPS text anywhere
- ✅ Consistent font family (Plus Jakarta Sans)
- ✅ Proper font size hierarchy (15px → 13px → 12px → 10px)

#### Color Rules
- ✅ Primary text color (#212529)
- ✅ Secondary text color (#6C757D)
- ✅ Button background color (#93C5FD)
- ✅ Background color consistency

#### Component Rules
- ✅ Button font size (10px)
- ✅ Button padding (5px 12px)
- ✅ Button border radius (15px)
- ✅ Consistent spacing values

#### Accessibility Rules
- ✅ Color contrast compliance
- ✅ Focus indicators for interactive elements

## 🚀 Quick Start

### Start All Agents

```bash
# Start all agents with default configuration
npx ts-node agents/start-agents.ts

# Start with custom configuration
npx ts-node agents/start-agents.ts --watch src,public --interval 10000
```

### Start Designer Agent Only

```bash
# Start designer agent
npx ts-node agents/designer-agent/index.ts

# Start with auto-fix enabled
npx ts-node agents/designer-agent/index.ts --auto-fix --format html
```

## 📁 File Structure

```
agents/
├── designer-agent/           # Designer Agent implementation
│   ├── DesignerAgent.ts     # Core agent logic
│   ├── DesignerAgentRunner.ts # Agent lifecycle management
│   ├── index.ts             # Main entry point
│   ├── package.json         # Agent dependencies
│   └── README.md            # Detailed documentation
├── agent-manager.ts         # Centralized agent management
├── start-agents.ts          # Main entry point for all agents
├── test-designer-agent.js   # Test script for demonstration
└── README.md               # This file
```

## 🔧 Configuration

### Agent Manager Configuration

```typescript
interface AgentManagerConfig {
  agents: {
    designer?: AgentConfig;
  };
  monitoring: {
    enabled: boolean;
    interval: number;
    alertThreshold: number;
  };
}
```

### Designer Agent Configuration

```typescript
interface AgentConfig {
  watchDirectories: string[];     // Directories to monitor
  excludePatterns: string[];     // Patterns to exclude
  checkInterval: number;          // Check interval in milliseconds
  autoFix: boolean;              // Enable automatic fixing
  reportFormat: 'json' | 'html' | 'console'; // Report format
}
```

## 📊 Monitoring & Reporting

### Real-time Monitoring

The agent system provides continuous monitoring with:
- **Health Checks**: Regular status checks for all agents
- **Alert System**: Notifications for errors and compliance issues
- **Performance Metrics**: Tracking of validation speed and accuracy

### Report Formats

1. **Console Reports**: Real-time output to terminal
2. **JSON Reports**: Machine-readable format for CI/CD integration
3. **HTML Reports**: Rich, visual reports for stakeholders

### Compliance Scoring

- **Score Range**: 0-100
- **Error Penalty**: -10 points per error
- **Warning Penalty**: -5 points per warning
- **Perfect Score**: 100 (no violations)

## 🎯 Usage Examples

### Basic Validation

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
  });
}
```

### Continuous Monitoring

```typescript
import { startAgents } from './agents/start-agents';

const runner = await startAgents({
  designer: true,
  monitoring: true,
  config: {
    watchDirectories: ['src/components'],
    checkInterval: 10000,
    autoFix: true,
    reportFormat: 'html'
  }
});
```

### CI/CD Integration

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
      - name: Run design compliance check
        run: |
          npx ts-node agents/designer-agent/index.ts --format json
      - name: Upload compliance report
        uses: actions/upload-artifact@v2
        with:
          name: design-compliance-report
          path: agents/designer-agent/reports/
```

## 🔍 Validation Examples

### ✅ Good Code (Compliant)

```tsx
import React from 'react';
import { Button, Typography } from '@mui/material';

const MyComponent = () => {
  return (
    <div>
      <Typography variant="h1" sx={{ fontSize: '15px' }}>
        Time Allocation Tuner
      </Typography>
      <Button
        variant="contained"
        sx={{
          fontSize: '10px',
          color: '#6C757D',
          backgroundColor: '#93C5FD',
          padding: '5px 12px',
          borderRadius: '15px'
        }}
      >
        Save Changes
      </Button>
    </div>
  );
};
```

### ❌ Bad Code (Non-compliant)

```tsx
import React from 'react';
import { Button, Typography } from '@mui/material';

const MyComponent = () => {
  return (
    <div>
      <Typography variant="h1" sx={{ fontSize: '15px' }}>
        🎯 Time Allocation Tuner
      </Typography>
      <Button
        variant="contained"
        sx={{
          fontSize: '14px',
          color: '#000000',
          backgroundColor: '#FF0000',
          padding: '10px 20px',
          borderRadius: '5px'
        }}
      >
        SAVE CHANGES
      </Button>
    </div>
  );
};
```

## 🚨 Common Violations

### Typography Violations
- **Icons in titles**: Remove all emojis and icons from headings
- **ALL CAPS text**: Use proper capitalization
- **Wrong font sizes**: Use only 15px, 13px, 12px, or 10px
- **Wrong font family**: Use Plus Jakarta Sans

### Color Violations
- **Wrong primary color**: Use #212529 for primary text
- **Wrong secondary color**: Use #6C757D for secondary text
- **Wrong button color**: Use #93C5FD for button background
- **Wrong background**: Use #FFFFFF for main, #F8F9FA for cards

### Component Violations
- **Wrong button font size**: Use 10px for all buttons
- **Wrong button padding**: Use 5px 12px consistently
- **Wrong border radius**: Use 15px for all buttons
- **Inconsistent spacing**: Use design system values

## 🛠️ Troubleshooting

### Common Issues

1. **Agent not starting**
   - Check Node.js installation
   - Verify TypeScript availability
   - Ensure all dependencies are installed

2. **No violations detected**
   - Check file paths and extensions
   - Verify content contains actual code
   - Review exclusion patterns

3. **Auto-fix not working**
   - Enable auto-fix in configuration
   - Check file permissions
   - Review violation types

### Debug Mode

```bash
# Enable debug logging
DEBUG=designer-agent npx ts-node agents/designer-agent/index.ts

# Verbose output
npx ts-node agents/designer-agent/index.ts --verbose
```

## 📈 Performance

### Optimization Features

- **Efficient Scanning**: Only processes relevant file types
- **Smart Caching**: Avoids re-scanning unchanged files
- **Batch Processing**: Validates multiple files simultaneously
- **Minimal Overhead**: Lightweight monitoring with low resource usage

### Resource Usage

- **Memory**: ~10-20MB per agent
- **CPU**: <1% during idle, 2-5% during validation
- **Disk**: Minimal (only for reports and logs)

## 🔮 Future Enhancements

### Planned Features

1. **Additional Agents**
   - Code Quality Agent
   - Performance Agent
   - Security Agent

2. **Enhanced Monitoring**
   - Real-time dashboards
   - Historical trend analysis
   - Predictive compliance scoring

3. **Advanced Auto-fix**
   - Machine learning-based suggestions
   - Context-aware fixes
   - Custom rule creation

## 📚 Documentation

- [Designer Agent Documentation](./designer-agent/README.md)
- [Design System Documentation](../docs/tech-stack/design-system.md)
- [API Reference](./designer-agent/README.md#api-reference)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Run the designer agent to validate your changes
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For questions or issues:
- Create an issue in the repository
- Check the troubleshooting section
- Review the design system documentation
- Contact the development team

---

**🎨 Design Compliance Made Simple** - Ensuring your code always follows the design principles!
