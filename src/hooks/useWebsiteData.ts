import { api } from "@/lib/axios";
import {
  ContactDetails,
  Story,
  Value,
  WebsiteData,
} from "@/types/website.types";
import { useQuery } from "@tanstack/react-query";

export const usePublicWebsiteData = () =>
  useQuery({
    queryKey: ["cms-website-data"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get<{
        success: boolean;
        data: WebsiteData | null;
      }>("/cms/website-data");
      return res.data.data;
    },
  });

export const usePublicContact = () =>
  useQuery({
    queryKey: ["cms-contact"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get<{
        success: boolean;
        data: ContactDetails | null;
      }>("/cms/contact-details");
      return res.data.data;
    },
  });

export const usePublicValues = () =>
  useQuery({
    queryKey: ["cms-values"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Value[] }>(
        "/cms/values",
      );
      return res.data.data;
    },
  });

export const usePublicStories = () =>
  useQuery({
    queryKey: ["cms-stories"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Story[] }>(
        "/cms/stories",
      );
      return res.data.data;
    },
  });
