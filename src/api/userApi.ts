/* eslint-disable no-useless-catch */

import axiosInstance from "./axiosInstance";

export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type UserResponse = {
  data: User;
};

export type UserListParams = {
  page?: number;
  limit?: number;
};

export type UserListResponse = {
  data: User[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const userApi = {
  getUsers: async (params: UserListParams = {}) => {
    try {
      const response = await axiosInstance.get<UserListResponse>("/user", {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (data: CreateUserRequest) => {
    try {
      const response = await axiosInstance.post<UserResponse>("/user", data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getUser: async (id: string) => {
    try {
      const response = await axiosInstance.get<UserResponse>(`/user/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id: string, data: UpdateUserRequest) => {
    try {
      const response = await axiosInstance.put<UserResponse>(
        `/user/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;
