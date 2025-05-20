/* eslint-disable no-useless-catch */
import axiosInstance from "./axiosInstance";

export type Parking = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ParkingResponse = {
  data: Parking;
};

export type ParkingListParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ParkingListResponse = {
  data: Parking[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

const parkingApi = {
  getParkings: async (params: ParkingListParams = {}) => {
    try {
      const response = await axiosInstance.get<ParkingListResponse>(
        "/parking",
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getParking: async (id: string) => {
    try {
      const response = await axiosInstance.get<ParkingResponse>(
        `/parking/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default parkingApi;
