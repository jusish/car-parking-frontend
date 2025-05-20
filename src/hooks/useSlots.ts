
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import slotApi, {
  SlotListParams,
  CreateSlotRequest,
  CreateManySlotRequest,
  UpdateSlotRequest
} from '../api/slotApi';
import { toast } from 'sonner';

export const useSlots = (params: SlotListParams = {}) => {
  return useQuery({
    queryKey: ['slots', params],
    queryFn: () => slotApi.getSlots(params)
  });
};

export const useSlot = (id: string) => {
  return useQuery({
    queryKey: ['slot', id],
    queryFn: () => slotApi.getSlot(id),
    enabled: !!id
  });
};

export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSlotRequest) => slotApi.createSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Parking slot created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create parking slot');
    }
  });
};

export const useCreateManySlots = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateManySlotRequest) => slotApi.createManySlots(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Multiple parking slots created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create parking slots');
    }
  });
};

export const useUpdateSlot = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateSlotRequest) => slotApi.updateSlot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['slot', id] });
      toast.success('Parking slot updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update parking slot');
    }
  });
};

export const useDeleteSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => slotApi.deleteSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Parking slot deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete parking slot');
    }
  });
};
