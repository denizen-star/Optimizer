# Optimizer Design System

**Version:** 1.0.0  
**Last Updated:** December 19, 2024

## Overview

The Optimizer Design System provides a centralized, consistent approach to styling and typography across the entire application. This system ensures visual consistency, maintainability, and adherence to design principles.

## Core Principles

### 🚫 No Icons in Titles
- **Rule:** Never add icons to titles, headings, or section headers unless specifically requested by the user
- **Rationale:** Clean, professional appearance without visual clutter
- **Example:** Use "Time Allocation Tuner" instead of "⚙️ Time Allocation Tuner"

### 🚫 No All Caps Text
- **Rule:** Never use ALL CAPS text anywhere in the application
- **Rationale:** Better readability and modern typography standards
- **Example:** Use "Fully Functional" instead of "FULLY FUNCTIONAL"

### 🎨 Consistent Typography
- **Font Family:** Plus Jakarta Sans (with fallbacks)
- **Hierarchy:** 15px → 13px → 12px → 10px
- **Weight:** Normal (400) for all text elements

### 🔘 Standardized Buttons
- **Font Size:** 10px
- **Color:** #6C757D
- **Padding:** 5px 12px
- **Border Radius:** 15px
- **Background:** #93C5FD (when contained)

## Typography Scale

| Element | Font Size | Usage |
|---------|-----------|--------|
| Title | 15px | Main page titles |
| Subtitle | 13px | Section headers |
| Body | 12px | Regular content |
| Small | 10px | Buttons, labels, descriptions |

## Color Palette

### Primary Colors
- **Primary Text:** #212529
- **Secondary Text:** #6C757D
- **Link Color:** #007BFF
- **Background:** #FFFFFF
- **Card Background:** #F8F9FA
- **Section Background:** #FFFFFF

### Interactive Colors
- **Button Background:** #93C5FD
- **Button Text:** #6C757D
- **Button Hover:** #1F2937
- **Accent (Teal):** #14B8A6
- **Status Success:** #D1ECF1
- **Status Warning:** #F8D7DA

### Navigation Colors (Preserved from Current App)
- **Navigation Background:** #2c3e50 (Dark blue-gray)
- **Navigation Text:** #FFFFFF
- **Navigation Icons:** #FFFFFF

## Usage

### Basic Setup
```tsx
import { DesignSystemProvider } from './design-system';

function App() {
  return (
    <DesignSystemProvider>
      {/* Your app content */}
    </DesignSystemProvider>
  );
}
```

### Using Design System Hook
```tsx
import { useDesignSystem } from './design-system';

function MyComponent() {
  const { colors, typography, helpers } = useDesignSystem();
  
  return (
    <Button sx={helpers.getButtonStyles('contained')}>
      My Button
    </Button>
  );
}
```

### Typography Examples
```tsx
// ✅ Correct - Clean title without icons
<Typography variant="h1" sx={{ fontSize: '15px' }}>
  Time Allocation Tuner
</Typography>

// ❌ Incorrect - Title with icon
<Typography variant="h1" sx={{ fontSize: '15px' }}>
  ⚙️ Time Allocation Tuner
</Typography>
```

### Button Examples
```tsx
// ✅ Correct - Consistent button styling
<Button
  variant="contained"
  sx={{
    fontSize: '10px',
    color: '#6C757D',
    backgroundColor: '#93C5FD',
    padding: '5px 12px',
    borderRadius: '15px',
    '&:hover': {
      backgroundColor: '#1F2937',
      color: '#FFFFFF'
    }
  }}
>
  Save Changes
</Button>

// ❌ Incorrect - Button with icon (unless specifically requested)
<Button startIcon={<Save />}>
  Save Changes
</Button>
```

## Implementation Guidelines

### For New Components
1. Import the design system hook: `import { useDesignSystem } from './design-system';`
2. Use consistent typography sizes and colors
3. Avoid icons in titles and headings
4. Use the helper functions for consistent styling

### For Existing Components
1. Update to use the centralized theme
2. Remove icons from titles and headings
3. Replace ALL CAPS text with proper capitalization
4. Ensure button consistency across all components

### For Future Development
1. Always reference this design system for styling decisions
2. Follow the established typography hierarchy
3. Maintain color consistency
4. Avoid adding icons unless specifically requested by the user

## File Structure

```
src/design-system/
├── index.ts          # Main exports and quick reference
├── theme.ts          # MUI theme configuration and constants
├── hooks.ts          # Custom hooks for accessing design system
├── provider.tsx      # Theme provider component
└── README.md         # This documentation
```

## Migration Checklist

- [ ] Update App.tsx to use new theme
- [ ] Remove icons from all component titles
- [ ] Replace ALL CAPS text with proper capitalization
- [ ] Standardize all button styles
- [ ] Update typography hierarchy across components
- [ ] Test visual consistency across all pages
- [ ] Update documentation and style guides

## Support

For questions about the design system or to request changes, please reference this documentation and follow the established patterns. The design system is designed to be maintainable and consistent across all current and future functionality.
