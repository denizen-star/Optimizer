import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { PageHeader, StatusChip, ContentCard } from '../../design-system';
import { useDesignSystem } from '../../design-system';

/**
 * DesignSystemDemo Component
 * 
 * This component demonstrates the proper usage of the new design system components:
 * - PageHeader: Standardized page structure
 * - StatusChip: Status indicators with design system colors
 * - ContentCard: Content containers with consistent styling
 * 
 * This serves as both a demo and a reference for developers.
 */
const DesignSystemDemo: React.FC = () => {
  const { colors, spacing } = useDesignSystem();

  return (
    <Box sx={{ p: 3 }}>
      {/* PageHeader Demo */}
      <PageHeader
        title="Design System Components Demo"
        subtitle="Demonstrating the new standardized components and design system integration"
        showBreakLine={true}
      >
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: colors.text.secondary }}>
          All components follow the design system guidelines and use centralized colors and typography.
        </Typography>
      </PageHeader>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* StatusChip Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ContentCard
            title="StatusChip Component"
            subtitle="Standardized status indicators"
            variant="elevated"
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <StatusChip status="functional" label="Functional" />
              <StatusChip status="partial" label="Partial" />
              <StatusChip status="error" label="Error" />
              <StatusChip status="success" label="Success" />
              <StatusChip status="info" label="Info" />
              <StatusChip status="warning" label="Warning" />
            </Box>
            
            <Typography variant="body2" sx={{ fontSize: '10px', color: colors.text.secondary }}>
              StatusChip components automatically use design system colors and maintain consistent styling.
            </Typography>
          </ContentCard>
        </Grid>

        {/* ContentCard Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ContentCard
            title="ContentCard Variants"
            subtitle="Different card styles and status indicators"
            variant="outlined"
            status="info"
          >
            <Typography variant="body2" sx={{ mb: 2 }}>
              ContentCard supports multiple variants and status indicators:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '10px' }}>
                • Default: Standard card with light shadow
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '10px' }}>
                • Elevated: Enhanced shadow for emphasis
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '10px' }}>
                • Outlined: Border-only styling
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '10px' }}>
                • Status indicators: Colored left border
              </Typography>
            </Box>
          </ContentCard>
        </Grid>

        {/* Design System Colors Demo */}
        <Grid size={{ xs: 12 }}>
          <ContentCard
            title="Design System Colors"
            subtitle="Centralized color palette demonstration"
            variant="elevated"
            status="success"
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: colors.activity.individual, 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                    Individual Activity
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: colors.activity.networking, 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                    Networking Activity
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: colors.activity.couple, 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                    Couple Activity
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: colors.persona.jobSearch, 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                    Job Search Persona
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </ContentCard>
        </Grid>

        {/* Usage Guidelines */}
        <Grid size={{ xs: 12 }}>
          <ContentCard
            title="Usage Guidelines"
            subtitle="How to properly use the design system components"
            variant="default"
            status="functional"
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', mb: 1 }}>
                  PageHeader Usage:
                </Typography>
                <Box component="pre" sx={{ 
                  backgroundColor: colors.background.card, 
                  p: 1, 
                  borderRadius: '5px',
                  fontSize: '10px',
                  overflow: 'auto'
                }}>
{`<PageHeader
  title="Page Title"
  subtitle="Optional subtitle"
  showBreakLine={true}
>
  {/* Optional content */}
</PageHeader>`}
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', mb: 1 }}>
                  StatusChip Usage:
                </Typography>
                <Box component="pre" sx={{ 
                  backgroundColor: colors.background.card, 
                  p: 1, 
                  borderRadius: '5px',
                  fontSize: '10px',
                  overflow: 'auto'
                }}>
{`<StatusChip 
  status="functional" 
  label="Status Text"
  size="small"
/>`}
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', mb: 1 }}>
                  ContentCard Usage:
                </Typography>
                <Box component="pre" sx={{ 
                  backgroundColor: colors.background.card, 
                  p: 1, 
                  borderRadius: '5px',
                  fontSize: '10px',
                  overflow: 'auto'
                }}>
{`<ContentCard
  title="Card Title"
  subtitle="Optional subtitle"
  variant="elevated"
  status="info"
>
  {/* Card content */}
</ContentCard>`}
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 'bold', mb: 1 }}>
                  Design System Hook:
                </Typography>
                <Box component="pre" sx={{ 
                  backgroundColor: colors.background.card, 
                  p: 1, 
                  borderRadius: '5px',
                  fontSize: '10px',
                  overflow: 'auto'
                }}>
{`const { colors, spacing, typography } = useDesignSystem();

// Use design system values
sx={{ 
  backgroundColor: colors.activity.individual,
  padding: spacing.md,
  fontSize: typography.fontSizes.body
}}`}
                </Box>
              </Grid>
            </Grid>
          </ContentCard>
        </Grid>
      </Grid>

      {/* Design System Validation Status */}
      <ContentCard
        title="Design System Validation"
        subtitle="Current compliance status"
        variant="elevated"
        status="success"
        sx={{ mt: 3 }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <StatusChip status="success" label="PageHeader Component" />
          <StatusChip status="success" label="StatusChip Component" />
          <StatusChip status="success" label="ContentCard Component" />
          <StatusChip status="success" label="Color Migration" />
          <StatusChip status="success" label="Design Agent Integration" />
        </Box>
        
        <Typography variant="body2" sx={{ fontSize: '10px', color: colors.text.secondary }}>
          All new components follow design system guidelines and pass validation checks.
          Use the design agent validation script to ensure ongoing compliance.
        </Typography>
      </ContentCard>
    </Box>
  );
};

export default DesignSystemDemo;
