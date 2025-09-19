# Optimizer

**Advanced Personal Time Management and Schedule Optimization Application**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)

## Overview

Optimizer is a sophisticated React-based application designed for personal time management and schedule optimization. It provides intelligent persona-based scheduling, time allocation tuning, and comprehensive analytics to help users optimize their daily routines and achieve better work-life balance.

## Features

### 🎯 **Persona-Based Planning**
- Multiple persona profiles for different life phases
- Customizable persona selection and management
- Context-aware scheduling based on personal preferences

### ⚙️ **Time Allocation Tuner**
- Fine-tune time distribution across activities
- Individual, networking, and couple activity breakdowns
- Real-time allocation adjustments with visual feedback

### 📅 **Smart Schedule Generation**
- AI-powered schedule optimization
- Export schedules in multiple formats (PDF, images)
- Adaptive scheduling based on preferences and constraints

### 📊 **Analytics Dashboard**
- Comprehensive activity tracking and analysis
- Visual insights into time usage patterns
- Performance metrics and optimization suggestions

## Technology Stack

- **Frontend**: React 19+ with TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Emotion (CSS-in-JS)
- **Charts**: Built-in analytics components
- **Export**: HTML2Canvas, jsPDF

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd optimizer

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Create production build
npm run build

# The build folder will contain optimized production files
```

## Project Structure

```
src/
├── components/           # React components
│   ├── AnalyticsDashboard/
│   ├── PersonaSelector/
│   ├── ScheduleViewer/
│   └── TimeAllocationTuner/
├── services/            # Business logic and API services
│   ├── activityTrackingService.ts
│   ├── calendarService.ts
│   ├── conflictResolutionService.ts
│   ├── creativeSuggestionsService.ts
│   ├── exportService.ts
│   ├── travelTimeService.ts
│   └── weatherService.ts
├── store/               # State management
│   └── useStore.ts
├── types/               # TypeScript type definitions
├── modules/             # Feature modules
│   ├── activities-module/
│   └── persona-module/
└── App.tsx              # Main application component
```

## Usage

### 1. **Select Your Persona**
Choose from available personas that match your lifestyle and goals.

### 2. **Tune Your Allocations**
Use the Time Allocation Tuner to adjust how you want to spend your time across different activity categories.

### 3. **Generate Schedule**
Let Optimizer create an optimized schedule based on your preferences and constraints.

### 4. **Track & Analyze**
Monitor your progress and analyze patterns using the comprehensive analytics dashboard.

## Configuration

The application supports various configuration options through:
- Persona modules in `src/modules/persona-module/`
- Activity data in `src/modules/activities-module/`
- Service configurations in `src/services/`

## Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (use with caution)

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For support and questions, please contact the development team.

---

**Built with ❤️ for better time management and life optimization**