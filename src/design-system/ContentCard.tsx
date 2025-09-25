import React from 'react';
import { Card, CardProps, CardContent, CardHeader, Typography } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface ContentCardProps extends CardProps {
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
  status?: 'functional' | 'partial' | 'error' | 'success' | 'info' | 'warning';
}

/**
 * ContentCard Component - Standardized content container following design system
 * 
 * Design System Compliance:
 * - Uses design system colors and spacing
 * - Consistent typography hierarchy
 * - Standard border radius (15px)
 * - Proper shadows and elevation
 * - No icons in titles unless specifically requested
 * - Plus Jakarta Sans font family
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  showHeader = true,
  variant = 'default',
  status,
  children,
  sx,
  ...props
}) => {
  const { colors, typography, spacing, borderRadius, shadows } = useDesignSystem();

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          boxShadow: shadows.medium,
          border: 'none',
        };
      case 'outlined':
        return {
          boxShadow: 'none',
          border: `1px solid ${colors.text.secondary}`,
        };
      default:
        return {
          boxShadow: shadows.light,
          border: 'none',
        };
    }
  };

  const getStatusStyles = () => {
    if (!status) return {};
    
    switch (status) {
      case 'functional':
        return {
          borderLeft: `4px solid ${colors.accent.teal}`,
        };
      case 'partial':
        return {
          borderLeft: `4px solid ${colors.ui.warningOrange}`,
        };
      case 'error':
        return {
          borderLeft: `4px solid ${colors.ui.error}`,
        };
      case 'success':
        return {
          borderLeft: `4px solid ${colors.accent.teal}`,
        };
      case 'info':
        return {
          borderLeft: `4px solid ${colors.accent.blue}`,
        };
      case 'warning':
        return {
          borderLeft: `4px solid ${colors.ui.warningOrange}`,
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();
  const statusStyles = getStatusStyles();

  return (
    <Card
      sx={{
        borderRadius: borderRadius.medium,
        backgroundColor: colors.background.card,
        ...variantStyles,
        ...statusStyles,
        ...sx,
      }}
      {...props}
    >
      {showHeader && (title || subtitle) && (
        <CardHeader
          title={
            title && (
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: typography.fontSizes.body,
                  fontWeight: typography.fontWeights.normal,
                  color: colors.text.primary,
                }}
              >
                {title}
              </Typography>
            )
          }
          subheader={
            subtitle && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSizes.small,
                  color: colors.text.secondary,
                }}
              >
                {subtitle}
              </Typography>
            )
          }
          sx={{
            padding: `${spacing.sm} ${spacing.md}`,
            '& .MuiCardHeader-title': {
              fontSize: typography.fontSizes.body,
              fontWeight: typography.fontWeights.normal,
              color: colors.text.primary,
            },
            '& .MuiCardHeader-subheader': {
              fontSize: typography.fontSizes.small,
              color: colors.text.secondary,
            },
          }}
        />
      )}
      
      <CardContent
        sx={{
          padding: `${spacing.sm} ${spacing.md}`,
          '&:last-child': {
            paddingBottom: spacing.sm,
          },
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default ContentCard;
