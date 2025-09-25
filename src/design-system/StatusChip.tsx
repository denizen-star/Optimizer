import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: 'functional' | 'partial' | 'error' | 'success' | 'info' | 'warning';
  size?: 'small' | 'medium';
}

/**
 * StatusChip Component - Standardized status indicator following design system
 * 
 * Design System Compliance:
 * - Uses design system colors for status indication
 * - Consistent typography (10px font size)
 * - Standard border radius (15px)
 * - No icons unless specifically requested
 * - Plus Jakarta Sans font family
 */
export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'small',
  label,
  ...props
}) => {
  const { colors, typography, borderRadius } = useDesignSystem();

  const getStatusStyles = () => {
    switch (status) {
      case 'functional':
        return {
          backgroundColor: colors.status.functional,
          color: colors.text.primary,
          borderColor: colors.accent.teal,
        };
      case 'partial':
        return {
          backgroundColor: colors.status.partial,
          color: colors.text.primary,
          borderColor: colors.ui.warningOrange,
        };
      case 'error':
        return {
          backgroundColor: colors.status.error,
          color: colors.text.primary,
          borderColor: colors.ui.error,
        };
      case 'success':
        return {
          backgroundColor: colors.status.success,
          color: colors.text.primary,
          borderColor: colors.accent.teal,
        };
      case 'info':
        return {
          backgroundColor: colors.accent.blue,
          color: colors.background.default,
          borderColor: colors.accent.blue,
        };
      case 'warning':
        return {
          backgroundColor: colors.ui.warningOrangeLight,
          color: colors.text.primary,
          borderColor: colors.ui.warningOrange,
        };
      default:
        return {
          backgroundColor: colors.background.card,
          color: colors.text.secondary,
          borderColor: colors.text.secondary,
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <Chip
      label={label}
      size={size}
      variant="outlined"
      sx={{
        fontSize: typography.fontSizes.small,
        fontWeight: typography.fontWeights.normal,
        borderRadius: borderRadius.medium,
        backgroundColor: statusStyles.backgroundColor,
        color: statusStyles.color,
        borderColor: statusStyles.borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        '& .MuiChip-label': {
          fontSize: typography.fontSizes.small,
          fontWeight: typography.fontWeights.normal,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default StatusChip;
