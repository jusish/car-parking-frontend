/* eslint-disable no-useless-catch */

import axiosInstance from "./axiosInstance";
import { Slot } from "./slotApi";
import { User } from "./userApi";
import { Vehicle } from "./vehicleApi";

export type SlotOrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export type SlotOrder = {
  id: string;
  slotId: string;
  userId: string;
  vehiclePlateNumber: string;
  parkingSlotOrderStatus: SlotOrderStatus;
  createdAt?: string;
  updatedAt?: string;
  slot?: Slot;
  slotCustomer?: User;
  vehicle?: Vehicle;
  slotVehicle?: Vehicle;
};

export type SlotOrderResponse = {
  data: SlotOrder;
};

export type SlotOrderListParams = {
  page?: number;
  limit?: number;
};

export type SlotOrderListResponse = {
  data: SlotOrder[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateSlotOrderRequest = {
  slotId: string;
  vehiclePlateNumber: string;
};

export type UpdateSlotOrderStatusRequest = {
  status: SlotOrderStatus;
};

const slotOrderApi = {
  getSlotOrders: async (params: SlotOrderListParams = {}) => {
    try {
      const response = await axiosInstance.get<SlotOrderListResponse>(
        "/parkingSlot-orders",
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserSlotOrders: async (
    userId: string,
    params: SlotOrderListParams = {}
  ) => {
    try {
      const response = await axiosInstance.get<SlotOrderListResponse>(
        `/parkingSlot-orders/user/${userId}`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSlotOrder: async (data: CreateSlotOrderRequest) => {
    try {
      const response = await axiosInstance.post<SlotOrderResponse>(
        "/parkingSlot-orders",
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getSlotOrder: async (id: string) => {
    try {
      const response = await axiosInstance.get<SlotOrderResponse>(
        `/parkingSlot-orders/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  updateSlotOrderStatus: async (
    id: string,
    data: UpdateSlotOrderStatusRequest
  ) => {
    try {
      const response = await axiosInstance.patch<SlotOrderResponse>(
        `/parkingSlot-orders/${id}/status`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  deleteSlotOrder: async (orderId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/parkingSlot-orders/${orderId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default slotOrderApi;
