/* eslint-disable no-useless-catch */

import axiosInstance from "./axiosInstance";

export type ParkingSlotSize = "SMALL" | "MEDIUM" | "LARGE" | string;
export type ParkingSlotStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export type Slot = {
  id: string;
  parkingSlotNumber: string;
  parkingSlotSize: ParkingSlotSize;
  parkingSlotStatus: ParkingSlotStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type SlotResponse = {
  data: {
    id: string;
    parkingSlotNumber: string;
    parkingSlotSize: ParkingSlotSize;
    parkingSlotStatus: ParkingSlotStatus;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type SlotListParams = {
  page?: number;
  limit?: number;
  search?: string;
  slotSize?: ParkingSlotSize;
  slotStatus?: ParkingSlotStatus;
};

export type SlotListResponse = {
  data: Slot[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateSlotRequest = {
  slotSize: ParkingSlotSize;
  parkingId: string;
};

export type CreateManySlotRequest = {
  numberOfSlots: number;
  slotSize: ParkingSlotSize;
};

export type UpdateSlotRequest = {
  slotSize?: ParkingSlotSize;
  slotStatus?: ParkingSlotStatus;
};

const slotApi = {
  getSlots: async (params: SlotListParams = {}) => {
    try {
      const response = await axiosInstance.get<SlotListResponse>(
        "/parkingSlots",
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSlot: async (data: CreateSlotRequest) => {
    try {
      const response = await axiosInstance.post<SlotResponse>(
        "/parkingSlots",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createManySlots: async (data: CreateManySlotRequest) => {
    try {
      const response = await axiosInstance.post<Slot[]>(
        "/parkingSlots/many",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSlot: async (id: string) => {
    try {
      const response = await axiosInstance.get<SlotResponse>(
        `/parkingSlots/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSlot: async (id: string, data: UpdateSlotRequest) => {
    try {
      const response = await axiosInstance.patch<SlotResponse>(
        `/parkingSlots/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSlot: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/parkingSlots/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default slotApi;
