# Optimizer - Technology Stack Documentation

## 🏗️ **Architecture Overview**

Optimizer is a modular React-based personal planning application with a Node.js backend, PostgreSQL database, and session-based authentication.

---

## 🖥️ **Frontend Technologies**

### **React 19.1.1**
- **Usage**: Main UI framework for all 5 modules
- **Modules**: All frontend components across Login, Persona, Activities, Schedule, Goal Tracking
- **Key Features**: Functional components, hooks, context API
- **Documentation**: https://react.dev/
- **Troubleshooting**: 
  - React DevTools extension for debugging
  - Common issue: State not updating → Check if state is being mutated directly
  - Performance issues → Use React.memo() and useMemo() for optimization

### **TypeScript 4.9.5**
- **Usage**: Type safety across entire frontend codebase
- **Modules**: All modules use TypeScript interfaces and types
- **Key Features**: Strong typing, interface definitions, compile-time error checking
- **Documentation**: https://www.typescriptlang.org/
- **Troubleshooting**:
  - Type errors → Check interface definitions in `/types` folders
  - Build errors → Run `npm run type-check` to isolate TypeScript issues

### **Material-UI (MUI) 7.3.2**
- **Usage**: UI component library and design system
- **Modules**: Primary UI components for all user-facing interfaces
- **Key Components**: Forms, buttons, navigation, data display
- **Documentation**: https://mui.com/
- **Troubleshooting**:
  - Styling conflicts → Use `sx` prop instead of CSS classes
  - Theme issues → Check theme provider configuration

### **Zustand 5.0.8**
- **Usage**: Lightweight state management
- **Modules**: Store management for each module (authStore, userStore, etc.)
- **Key Features**: Simple API, TypeScript support, minimal boilerplate
- **Documentation**: https://github.com/pmndrs/zustand
- **Troubleshooting**:
  - State not persisting → Check store subscription
  - Async actions → Use proper async/await in store actions

### **React Router DOM 6.30.1**
- **Usage**: Client-side routing and navigation
- **Modules**: Navigation between Login, Persona, Activities, Schedule, Goal Tracking
- **Key Features**: Nested routes, protected routes, programmatic navigation
- **Documentation**: https://reactrouter.com/
- **Troubleshooting**:
  - Routes not matching → Check route path definitions
  - Navigation issues → Use `useNavigate()` hook properly

---

## 🔧 **Backend Technologies**

### **Node.js + Express**
- **Usage**: RESTful API server and middleware
- **Modules**: API endpoints for all 5 modules
- **Key Features**: Middleware, routing, session management
- **Documentation**: https://expressjs.com/
- **Troubleshooting**:
  - CORS issues → Configure cors middleware properly
  - Middleware order → Ensure session middleware comes before auth middleware
  - Memory leaks → Use proper error handling and cleanup

### **PostgreSQL**
- **Usage**: Primary database for all application data
- **Modules**: User data, personas, activities, schedules, goal tracking
- **Key Features**: ACID compliance, JSON support, UUID primary keys
- **Documentation**: https://www.postgresql.org/docs/
- **Troubleshooting**:
  - Connection issues → Check connection string and database status
  - Query performance → Use EXPLAIN ANALYZE for slow queries
  - UUID issues → Ensure uuid-ossp extension is installed

### **Session-Based Authentication**
- **Usage**: User authentication and session management
- **Modules**: Login and Member Management module
- **Key Features**: Secure cookies, session storage, automatic cleanup
- **Libraries**: express-session, connect-pg-simple
- **Troubleshooting**:
  - Sessions not persisting → Check cookie configuration
  - Session store errors → Verify PostgreSQL session table exists
  - CSRF issues → Implement proper CSRF protection

---

## 📧 **Email Services**

### **SendGrid**
- **Usage**: Email delivery for verification, password reset, notifications
- **Modules**: Login and Member Management module
- **Key Features**: Transactional emails, templates, delivery analytics
- **Documentation**: https://docs.sendgrid.com/
- **Setup Required**:
  - SendGrid account and API key
  - Verified sender identity
  - Email templates configuration
- **Troubleshooting**:
  - Email not sending → Check API key and sender verification
  - Delivery issues → Monitor SendGrid dashboard for bounces/blocks
  - Template errors → Validate template syntax and variables

---

## 🗃️ **Data Management**

### **UUID Primary Keys**
- **Usage**: All database tables use UUID instead of SERIAL
- **Benefits**: Distributed system compatibility, security, no collision risk
- **Implementation**: PostgreSQL uuid-ossp extension
- **Troubleshooting**:
  - UUID generation errors → Ensure `CREATE EXTENSION "uuid-ossp"` is run
  - Performance → Use proper indexing on UUID columns

### **JSONB Data Types**
- **Usage**: Store flexible data structures (preferences, activity metadata)
- **Modules**: User profiles, activity details, persona characteristics
- **Benefits**: Schema flexibility, efficient querying
- **Troubleshooting**:
  - Query performance → Use GIN indexes on JSONB columns
  - Data validation → Implement proper JSON schema validation

---

## 🧪 **Development Tools**

### **Testing Framework**
- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + Supertest
- **Documentation**: https://testing-library.com/
- **Troubleshooting**:
  - Test failures → Check test environment configuration
  - Async test issues → Use proper async/await patterns

### **Development Environment**
- **Package Manager**: npm
- **Build Tool**: Create React App (CRA)
- **Development Server**: React dev server + Express server
- **Troubleshooting**:
  - Port conflicts → Change default ports in package.json
  - Hot reload issues → Clear node_modules and reinstall

---

## 🚀 **Deployment & Infrastructure**

### **Netlify (Frontend)**
- **Usage**: Static site hosting for React application
- **Features**: Continuous deployment, form handling, redirects
- **Documentation**: https://docs.netlify.com/
- **Troubleshooting**:
  - Build failures → Check build logs and dependencies
  - Routing issues → Configure `_redirects` file for SPA

### **Database Hosting**
- **Recommended**: Heroku Postgres, AWS RDS, or DigitalOcean Managed Databases
- **Requirements**: PostgreSQL 12+ with uuid-ossp extension
- **Troubleshooting**:
  - Connection limits → Monitor and optimize connection pooling
  - Performance → Regular maintenance and query optimization

---

## 📊 **Module-Specific Technology Usage**

### **1. Login and Member Management**
- Frontend: React forms, MUI components, Zustand auth store
- Backend: Express routes, bcrypt password hashing, express-session
- Database: Users, sessions, profiles tables with UUID PKs
- Email: SendGrid for verification and password reset

### **2. Persona Module**
- Frontend: Multi-step forms, decision tree visualization
- Backend: Persona algorithms, decision tree logic
- Database: Personas, decision_tree_responses tables
- Data: XML-based question configuration

### **3. Activities Module**
- Frontend: Search/filter components, activity browser
- Backend: Activity CRUD operations, search algorithms
- Database: Activities table with JSONB metadata
- Data: JSON-based activity catalog

### **4. Schedule Management**
- Frontend: Calendar components, drag-drop scheduling
- Backend: Schedule generation algorithms, conflict resolution
- Database: Schedules, schedule_items tables
- Integration: Potential calendar API integrations

### **5. Goal Tracking**
- Frontend: Progress visualization, analytics dashboards
- Backend: Progress calculation engines, reporting
- Database: Goals, goal_progress, achievements tables
- Analytics: Chart.js or similar for data visualization

---

## 🔍 **Common Troubleshooting Patterns**

### **Database Issues**
1. Connection problems → Check connection string and firewall
2. Migration errors → Run migrations in correct order
3. Query timeouts → Add appropriate indexes

### **Authentication Issues**
1. Session not persisting → Check cookie settings and HTTPS
2. CORS errors → Configure cors middleware properly
3. Password validation → Check bcrypt implementation

### **Frontend Issues**
1. Component not re-rendering → Check state management
2. API calls failing → Check network tab and backend logs
3. Build errors → Clear cache and reinstall dependencies

### **Email Issues**
1. SendGrid authentication → Verify API key and sender
2. Template rendering → Check variable substitution
3. Delivery problems → Monitor SendGrid activity feed

---

*Created: December 19, 2024 - 19:45*
*Last Updated: December 19, 2024 - 19:45*
*Version: 1.0*
