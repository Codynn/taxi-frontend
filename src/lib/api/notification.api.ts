import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export const useSaveFcmToken = () => {
  return useMutation({
    mutationFn: async (fcmToken: string) => {
      const response = await api.post("/fcm/token", { fcmToken });
      return response.data;
    },
  });
};

export const useDeleteFcmToken = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/fcm/token");
      return response.data;
    },
  });
};
