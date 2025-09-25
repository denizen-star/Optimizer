import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBreakLine?: boolean;
  children?: React.ReactNode;
}

/**
 * PageHeader Component - Standardized page header following design system
 * 
 * This component enforces the consistent page structure across all pages:
 * - Title (15px, normal weight, centered)
 * - Subtitle (12px, secondary color, centered) 
 * - Break Line (0.05px solid #2c3e50, 30px margin)
 * - Optional content below
 * 
 * Design System Compliance:
 * - No icons in titles (enforced)
 * - Consistent typography hierarchy
 * - Standardized spacing and colors
 * - Plus Jakarta Sans font family
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBreakLine = true,
  children
}) => {
  const { colors, typography, spacing } = useDesignSystem();

  return (
    <Box sx={{ p: 3 }}>
      {/* Title - 15px, normal weight, centered */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center" 
        sx={{ 
          fontSize: typography.fontSizes.title,
          fontWeight: typography.fontWeights.normal,
          color: colors.text.primary
        }}
      >
        {title}
      </Typography>
      
      {/* Subtitle - 12px, secondary color, centered */}
      {subtitle && (
        <Typography 
          variant="subtitle1" 
          align="center" 
          color="text.secondary" 
          gutterBottom 
          sx={{ 
            fontSize: typography.fontSizes.body,
            color: colors.text.secondary
          }}
        >
          {subtitle}
        </Typography>
      )}
      
      {/* Break Line - 0.05px solid #2c3e50, 30px margin */}
      {showBreakLine && (
        <Box sx={{ 
          borderTop: `0.05px solid ${colors.navigation.background}`, 
          margin: `${spacing.xl} 0` 
        }} />
      )}
      
      {/* Optional content */}
      {children}
    </Box>
  );
};

export default PageHeader;
