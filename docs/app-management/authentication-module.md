# Authentication Module

## Overview

The Authentication Module is an independent, portable authentication system designed to be used across different applications. It provides complete user authentication functionality including registration, login, email verification, and security tracking.

## Features

- ✅ **User Registration & Login**: Complete user account management
- ✅ **Email Verification**: Working email verification system
- ✅ **Password Management**: Password reset and change functionality
- ✅ **Session Management**: Secure session handling
- ✅ **Security Tracking**: Comprehensive authentication event tracking
- ✅ **User Management**: Admin interface for user management
- ✅ **Email Service**: Built-in email service for notifications

## Module Structure

```
authentication-module/
├── components/           # React components
│   ├── AuthDemo/        # Authentication demo component
│   ├── EmailVerification/ # Email verification component
│   └── UserManagement/  # User management component
├── services/            # Business logic services
│   ├── authTrackingService.ts
│   └── simpleEmailService.ts
├── hooks/               # React hooks
│   └── useAuth.ts      # Main authentication hook
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
├── AuthenticationModule.ts # Main module class
├── index.ts            # Module exports
└── README.md           # This file
```

## Usage

### Basic Setup

```typescript
import { AuthenticationModule } from './modules/authentication-module';

// Initialize the module
const authModule = new AuthenticationModule();
await authModule.initialize();

// Get the authentication hook
const useAuth = authModule.getAuthHook();
```

### Using in React Components

```typescript
import { useAuth } from './modules/authentication-module';

function LoginComponent() {
  const { login, signup, logout, user, isAuthenticated } = useAuth();
  
  const handleLogin = async (credentials) => {
    const success = await login(credentials);
    if (success) {
      console.log('Login successful');
    }
  };
  
  return (
    // Your login form JSX
  );
}
```

### Using Authentication Components

```typescript
import { AuthDemo, EmailVerification, UserManagement } from './modules/authentication-module';

function App() {
  return (
    <div>
      <AuthDemo />
      <EmailVerification />
      <UserManagement />
    </div>
  );
}
```

## API Reference

### Authentication Hook (`useAuth`)

The main hook provides the following methods:

#### Methods
- `login(credentials: LoginCredentials): Promise<boolean>`
- `signup(data: SignupData): Promise<boolean>`
- `logout(): Promise<void>`
- `resetPassword(email: string): Promise<boolean>`
- `changePassword(oldPassword: string, newPassword: string): Promise<boolean>`
- `updateProfile(updates: Partial<User>): Promise<boolean>`
- `verifyEmail(token: string): Promise<boolean>`
- `resendVerificationEmail(email: string): Promise<boolean>`
- `enableTwoFactor(): Promise<boolean>`
- `disableTwoFactor(): Promise<boolean>`
- `refreshToken(): Promise<boolean>`
- `getAuthEvents(): any[]`
- `getAuthStats(): any`

#### State
- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state
- `error: string | null` - Error messages

### Services

#### AuthTrackingService
Tracks all authentication events for security monitoring.

#### SimpleEmailService
Handles email sending for verification and notifications.

## Configuration

### Environment Variables

```bash
# Email service configuration
REACT_APP_FROM_EMAIL=noreply@yourapp.com

# Weather API (optional)
REACT_APP_WEATHER_API_KEY=your_weather_api_key
```

### Module Initialization

```typescript
const authModule = new AuthenticationModule();

// Get module information
const info = authModule.getModuleInfo();
console.log(info);

// Check if ready
if (authModule.isReady()) {
  // Module is initialized
}
```

## Dependencies

- React 18+
- Material-UI (MUI) v7
- Zustand (for state management)
- date-fns (for date handling)

## Development

### For Authentication Team

This module is designed to be worked on independently. The team can:

1. **Modify authentication logic** in `services/`
2. **Update UI components** in `components/`
3. **Add new features** without affecting the main app
4. **Test independently** using the AuthDemo component

### Testing

Use the AuthDemo component to test all authentication functionality:

```typescript
import { AuthDemo } from './modules/authentication-module';

// This component provides a complete testing interface
<AuthDemo />
```

## Security Features

- ✅ **Password Security**: Secure password handling
- ✅ **Session Management**: Secure session tokens
- ✅ **Email Verification**: Required email verification
- ✅ **Security Tracking**: All events logged for monitoring
- ✅ **User Management**: Admin controls for user management
- ✅ **Error Handling**: Comprehensive error handling

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, Facebook, etc.)
- [ ] Advanced security features
- [ ] Multi-tenant support
- [ ] Advanced user roles and permissions

## Support

This module is designed to be self-contained and portable. It can be easily moved to other projects or maintained by a dedicated authentication team.

## Version

Current version: 1.0.0  
**Created:** December 19, 2024 - 19:32  
**Last Updated:** December 19, 2024 - 19:32

## License

Part of the Optimizer application suite.
