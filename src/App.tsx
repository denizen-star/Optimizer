import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PersonaSelector from './components/PersonaSelector/PersonaSelector';
import TimeAllocationTuner from './components/TimeAllocationTuner/TimeAllocationTuner';
import ScheduleViewer from './components/ScheduleViewer/ScheduleViewer';
import AnalyticsDashboard from './components/AnalyticsDashboard/AnalyticsDashboard';
import NavigationGuide from './components/NavigationGuide/NavigationGuide';
import { AuthDemo, EnhancedSignup, EmailTest, EmailVerification, UserManagement, AuthActivity } from './modules/authentication-module';
import DatabaseQuery from './modules/authentication-module/components/DatabaseQuery/DatabaseQuery';
import { useStore } from './store/useStore';
import { DesignSystemProvider, useDesignSystem, DropdownMenu } from './design-system';
import './App.css';

// Design system theme is now imported from design-system/theme.ts

function AppContent() {
  const { colors } = useDesignSystem();
  
  const {
    selectedPersona,
    personas,
    timeAllocation,
    currentSchedule,
    activities,
    isLoading,
    setSelectedPersona,
    setTimeAllocation,
    loadPersonas,
    generateSchedule,
    exportSchedule,
  } = useStore();

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  const handlePersonaSelect = (persona: any) => {
    setSelectedPersona(persona);
  };

  const handleAllocationChange = (allocation: any) => {
    setTimeAllocation(allocation);
  };

  const handleExportSchedule = async () => {
    try {
      await generateSchedule();
      const filename = await exportSchedule();
      console.log('Schedule exported:', filename);
    } catch (error) {
      console.error('Failed to export schedule:', error);
    }
  };

  const handleResetDefaults = () => {
    const defaultAllocation = {
      individual_activities_percent: 16.0,
      networking_social_percent: 21.6,
      couple_activities_percent: 23.8,
      individual_breakdown: {
        running_percent: 27.0,
        personal_development_percent: 19.0,
        fitness_grooming_percent: 35.0,
        reflection_planning_percent: 19.0,
      },
      networking_breakdown: {
        professional_networking_percent: 24.0,
        social_activities_percent: 50.0,
        professional_dev_networking_percent: 18.0,
        other_social_percent: 8.0,
      },
      couple_breakdown: {
        daily_meals_percent: 29.0,
        evening_together_percent: 25.0,
        weekend_activities_percent: 25.0,
        breakfast_together_percent: 13.0,
        household_together_percent: 8.0,
      },
    };
    setTimeAllocation(defaultAllocation);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <DropdownMenu />

      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: colors.background.default, // #FFFFFF from Navigation Guide
        py: 0
      }}>
        <Routes>
              <Route 
                path="/" 
                element={
                  <PersonaSelector
                    personas={personas}
                    selectedPersona={selectedPersona}
                    onPersonaSelect={handlePersonaSelect}
                    loading={isLoading}
                  />
                } 
              />
              <Route 
                path="/navigation-guide" 
                element={<NavigationGuide />} 
              />
          <Route 
            path="/tuner" 
            element={
              selectedPersona ? (
                <TimeAllocationTuner
                  timeAllocation={timeAllocation}
                  onAllocationChange={handleAllocationChange}
                  onExportSchedule={handleExportSchedule}
                  onResetDefaults={handleResetDefaults}
                  loading={isLoading}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
              <Route 
                path="/schedule" 
                element={
                  selectedPersona ? (
                    <ScheduleViewer
                      schedule={currentSchedule}
                      persona={selectedPersona}
                      loading={isLoading}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  selectedPersona ? (
                    <AnalyticsDashboard
                      activities={activities}
                      persona={selectedPersona}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/auth-activity" 
                element={
                  selectedPersona ? (
                    <AuthActivity showStats={true} maxEvents={100} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/auth-demo" 
                element={<AuthDemo />} 
              />
              <Route 
                path="/signup" 
                element={<EnhancedSignup />} 
              />
              <Route 
                path="/email-test" 
                element={<EmailTest />} 
              />
              <Route 
                path="/verify-email/:token" 
                element={<EmailVerification />} 
              />
              <Route 
                path="/users" 
                element={
                  selectedPersona ? (
                    <UserManagement />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/database-query" 
                element={<DatabaseQuery />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <DesignSystemProvider>
      <Router>
        <AppContent />
      </Router>
    </DesignSystemProvider>
  );
}

export default App;
