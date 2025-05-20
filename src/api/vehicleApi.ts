/* eslint-disable no-useless-catch */

import axiosInstance from "./axiosInstance";

export type Vehicle = {
  id: string;
  vehiclePlateNumber: string;
  vehicleType: string;
  vehicleColor: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  userId: string;   
  createdAt?: string;
  updatedAt?: string;
};

export type VehicleResponse = {
  data: Vehicle;
};

export type VehicleListResponse = {
  data: Vehicle[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type VehicleListParams = {
  page?: number;
  limit?: number;
  search?: string;
  year?: number;
};

export type CreateVehicleRequest = {
  vehiclePlateNumber: string;
  vehicleType: string;
  vehicleColor: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
};

export type UpdateVehicleRequest = {
  vehiclePlateNumber?: string;
  vehicleType?: string;
  vehicleColor?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: number;
};

const vehicleApi = {
  getVehicles: async (params: VehicleListParams = {}) => {
    try {
      const response = await axiosInstance.get<VehicleListResponse>(
        "/vehicles",
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserVehicles: async (params: VehicleListParams = {}) => {
    try {
      const response = await axiosInstance.get<VehicleListResponse>(
        "/vehicles/user",
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createVehicle: async (data: CreateVehicleRequest) => {
    try {
      const response = await axiosInstance.post<VehicleResponse>(
        "/vehicles",
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getVehicle: async (id: string) => {
    try {
      const response = await axiosInstance.get<VehicleResponse>(
        `/vehicles/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVehicleByPlateNumber: async (plateNumber: string) => {
    try {
      const response = await axiosInstance.get<VehicleResponse>(
        `/vehicles/plate_number/${plateNumber}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateVehicle: async (id: string, data: UpdateVehicleRequest) => {
    try {
      const response = await axiosInstance.patch<VehicleResponse>(
        `/vehicles/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteVehicle: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default vehicleApi;
