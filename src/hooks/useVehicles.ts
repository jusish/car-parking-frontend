
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vehicleApi, { 
  VehicleListParams, 
  CreateVehicleRequest, 
  UpdateVehicleRequest 
} from '../api/vehicleApi';
import { toast } from 'sonner';

export const useVehicles = (params: VehicleListParams = {}) => {
  return useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleApi.getVehicles(params)
  });
};

export const useUserVehicles = (params: VehicleListParams = {}) => {
  return useQuery({
    queryKey: ['userVehicles', params],
    queryFn: () => vehicleApi.getUserVehicles(params)
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleApi.getVehicle(id),
    enabled: !!id
  });
};

export const useVehicleByPlateNumber = (plateNumber: string) => {
  return useQuery({
    queryKey: ['vehicle', 'plateNumber', plateNumber],
    queryFn: () => vehicleApi.getVehicleByPlateNumber(plateNumber),
    enabled: !!plateNumber
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVehicleRequest) => vehicleApi.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['userVehicles'] });
      toast.success('Vehicle created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create vehicle');
    }
  });
};

export const useUpdateVehicle = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateVehicleRequest) => vehicleApi.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['userVehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      toast.success('Vehicle updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update vehicle');
    }
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['userVehicles'] });
      toast.success('Vehicle deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete vehicle');
    }
  });
};
