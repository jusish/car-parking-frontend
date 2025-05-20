
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import slotOrderApi, { 
  SlotOrderListParams, 
  CreateSlotOrderRequest, 
  UpdateSlotOrderStatusRequest 
} from '../api/slotOrderApi';
import { toast } from 'sonner';

export const useSlotOrders = (params: SlotOrderListParams = {}) => {
  return useQuery({
    queryKey: ['slotOrders', params],
    queryFn: () => slotOrderApi.getSlotOrders(params)
  });
};

export const useUserSlotOrders = (userId: string, params: SlotOrderListParams = {}) => {
  return useQuery({
    queryKey: ['userSlotOrders', userId, params],
    queryFn: () => slotOrderApi.getUserSlotOrders(userId, params),
    enabled: !!userId
  });
};

export const useSlotOrder = (id: string) => {
  return useQuery({
    queryKey: ['slotOrder', id],
    queryFn: () => slotOrderApi.getSlotOrder(id),
    enabled: !!id
  });
};

export const useCreateSlotOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSlotOrderRequest) => slotOrderApi.createSlotOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotOrders'] });
      queryClient.invalidateQueries({ queryKey: ['userSlotOrders'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Parking slot reserved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reserve parking slot');
    }
  });
};
export const useDeleteSlotOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => slotOrderApi.deleteSlotOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotOrders'] });
      queryClient.invalidateQueries({ queryKey: ['userSlotOrders'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Parking slot reserved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reserve parking slot');
    }
  });
};

export const useUpdateSlotOrderStatus = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateSlotOrderStatusRequest) => slotOrderApi.updateSlotOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotOrders'] });
      queryClient.invalidateQueries({ queryKey: ['userSlotOrders'] });
      queryClient.invalidateQueries({ queryKey: ['slotOrder', id] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Order status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  });
};
