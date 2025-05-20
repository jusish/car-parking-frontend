/* eslint-disable no-useless-catch */

import axiosInstance from './axiosInstance';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  
  data: {
    token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  }
  
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ResetPasswordEmailRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  password: string;
};

export type VerifyEmailRequest = {
  email: string;
};

const authApi = {
  login: async (data: LoginRequest) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (data: RegisterRequest) => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  sendResetPasswordEmail: async (data: ResetPasswordEmailRequest) => {
    try {
      const response = await axiosInstance.post('/auth/send-reset-password-email', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (token: string, data: ResetPasswordRequest) => {
    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  verifyEmail: async (token: string, data: VerifyEmailRequest) => {
    try {
      const response = await axiosInstance.post(`/auth/verify-email/${token}`, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  
  sendVerificationEmail: async (data: ResetPasswordEmailRequest) => {
    try {
      const response = await axiosInstance.post('/auth/send-verification-email', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;
