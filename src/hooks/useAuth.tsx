
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, createContext, useContext } from 'react';
import authApi, { LoginRequest, RegisterRequest } from '../api/authApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and user in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log(data)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Logged in successfully');
      
      // Redirect based on user role
      if (data.user.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Failed to login');
    }
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful. Please check your email to verify your account.');
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  });

  const login = async (data: LoginRequest) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterRequest) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const usePasswordReset = () => {
  const sendResetEmailMutation = useMutation({
    mutationFn: authApi.sendResetPasswordEmail,
    onSuccess: () => {
      toast.success('Password reset email sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send password reset email');
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => 
      authApi.resetPassword(token, { password }),
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  });

  const sendResetEmail = (email: string) => {
    return sendResetEmailMutation.mutateAsync({ email });
  };

  const resetPassword = (token: string, password: string) => {
    return resetPasswordMutation.mutateAsync({ token, password });
  };

  return {
    sendResetEmail,
    resetPassword,
    isResetEmailLoading: sendResetEmailMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending
  };
};

export const useEmailVerification = () => {
  const sendVerificationEmailMutation = useMutation({
    mutationFn: authApi.sendVerificationEmail,
    onSuccess: () => {
      toast.success('Verification email sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    }
  });

  const verifyEmailMutation = useMutation({
    mutationFn: ({ token, email }: { token: string; email: string }) => 
      authApi.verifyEmail(token, { email }),
    onSuccess: () => {
      toast.success('Email verified successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    }
  });

  const sendVerificationEmail = (email: string) => {
    return sendVerificationEmailMutation.mutateAsync({ email });
  };

  const verifyEmail = (token: string, email: string) => {
    return verifyEmailMutation.mutateAsync({ token, email });
  };

  return {
    sendVerificationEmail,
    verifyEmail,
    isVerificationEmailLoading: sendVerificationEmailMutation.isPending,
    isVerifyEmailLoading: verifyEmailMutation.isPending
  };
};
