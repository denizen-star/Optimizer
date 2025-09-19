/**
 * Email Verification Component
 * Handles email verification from URL parameters
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { CheckCircle, Error, Email, Refresh } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else {
      setStatus('error');
      setErrorMessage('No verification token provided');
    }
  }, [token]);

  const handleVerification = async (verificationToken: string) => {
    setStatus('verifying');
    
    try {
      const success = await verifyEmail(verificationToken);
      
      if (success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Verification failed. The link may be expired or invalid.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    try {
      const success = await resendVerificationEmail(email);
      if (success) {
        setErrorMessage('');
        // Show success message
      } else {
        setErrorMessage('Failed to resend verification email');
      }
    } catch (error) {
      setErrorMessage('Failed to resend verification email');
    }
  };

  if (status === 'verifying') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Verifying Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we verify your email address...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (status === 'success') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="success.main">
            Email Verified Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Your email address has been verified. You can now access all features of Optimizer.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              size="large"
            >
              Continue to Optimizer
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Error state
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Paper sx={{ p: 4, maxWidth: 500 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Error sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="error.main">
            Email Verification Failed
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Common Issues & Solutions:
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Expired Link:</strong> Verification links expire after 24 hours
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Already Used:</strong> This email may already be verified
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Invalid Link:</strong> The link may be corrupted or incomplete
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => token && handleVerification(token)}
            fullWidth
          >
            Try Again
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Email />}
            onClick={() => navigate('/auth-demo')}
            fullWidth
          >
            Request New Verification Email
          </Button>
          
          <Button
            variant="text"
            onClick={() => navigate('/')}
            fullWidth
          >
            Continue to Optimizer
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailVerification;
