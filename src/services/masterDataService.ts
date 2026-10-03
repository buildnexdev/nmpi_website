import { apiClient } from './apiClient';

export interface StateOption {
  id: number;
  name_en: string;
  name_ta: string;
  code: string;
}

export interface ParliamentOption {
  id: number;
  state_id: number;
  name_en: string;
  name_ta: string;
  code: string;
}

export interface AssemblyOption {
  id: number;
  parliament_constituency_id: number | null;
  name_en: string;
  name_ta: string;
}

export interface DistrictOption {
  id: number;
  lgd_code: number;
  name_en: string;
  name_ta: string;
  code: string;
}

export interface BlockOption {
  id: number;
  district_id: number;
  lgd_code: number;
  name_en: string;
  name_ta: string;
}

export interface VillageOption {
  id: number;
  district_id: number;
  block_id: number;
  lgd_code: number;
  name_en: string;
  name_ta: string;
}

export interface RoleOption {
  id: number;
  name: string;
  description: string;
}

export const masterDataService = {
  getStates: async (): Promise<StateOption[]> => {
    const response = await apiClient.get('/master-data/states');
    return response.data.data || [];
  },

  getParliaments: async (stateId: number = 1): Promise<ParliamentOption[]> => {
    const response = await apiClient.get(`/master-data/parliaments?stateId=${stateId}`);
    return response.data.data || [];
  },

  getAssemblies: async (parliamentId?: number): Promise<AssemblyOption[]> => {
    const url = parliamentId ? `/master-data/assemblies?parliamentId=${parliamentId}` : '/master-data/assemblies';
    const response = await apiClient.get(url);
    return response.data.data || [];
  },

  getDistricts: async (): Promise<DistrictOption[]> => {
    const response = await apiClient.get('/master-data/districts');
    return response.data.data || [];
  },

  getBlocks: async (districtId: number): Promise<BlockOption[]> => {
    const response = await apiClient.get(`/master-data/blocks?districtId=${districtId}`);
    return response.data.data || [];
  },

  getVillages: async (blockId: number): Promise<VillageOption[]> => {
    const response = await apiClient.get(`/master-data/villages?blockId=${blockId}`);
    return response.data.data || [];
  },

  getRoles: async (): Promise<RoleOption[]> => {
    const response = await apiClient.get('/master-data/roles');
    return response.data.data || [];
  },
};
