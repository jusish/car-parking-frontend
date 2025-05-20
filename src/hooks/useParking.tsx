import { useQuery } from "@tanstack/react-query";
import parkingApi, { ParkingListParams } from "../api/parkingApi";

export const useParkings = (params: ParkingListParams = {}) => {
  return useQuery({
    queryKey: ["parkings", params],
    queryFn: () => parkingApi.getParkings(params),
  });
};

export const useParking = (id: string) => {
  return useQuery({
    queryKey: ["parkings", id],
    queryFn: () => parkingApi.getParking(id),
    enabled: !!id,
  });
};
