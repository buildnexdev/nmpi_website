import { apiClient, asArray } from './apiClient';

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
    return asArray<StateOption>(response.data?.data);
  },

  getParliaments: async (stateId?: number): Promise<ParliamentOption[]> => {
    const qs = stateId && stateId > 0 ? `?stateId=${stateId}` : '';
    const response = await apiClient.get(`/master-data/parliaments${qs}`);
    return asArray<ParliamentOption>(response.data?.data);
  },

  getAssemblies: async (parliamentId?: number): Promise<AssemblyOption[]> => {
    const url = parliamentId ? `/master-data/assemblies?parliamentId=${parliamentId}` : '/master-data/assemblies';
    const response = await apiClient.get(url);
    return asArray<AssemblyOption>(response.data?.data);
  },

  getDistricts: async (): Promise<DistrictOption[]> => {
    const response = await apiClient.get('/master-data/districts');
    return asArray<DistrictOption>(response.data?.data);
  },

  getBlocks: async (districtId: number): Promise<BlockOption[]> => {
    const response = await apiClient.get(`/master-data/blocks?districtId=${districtId}`);
    return asArray<BlockOption>(response.data?.data);
  },

  getVillages: async (blockId: number): Promise<VillageOption[]> => {
    const response = await apiClient.get(`/master-data/villages?blockId=${blockId}`);
    return asArray<VillageOption>(response.data?.data);
  },

  getRoles: async (): Promise<RoleOption[]> => {
    const response = await apiClient.get('/master-data/roles');
    return asArray<RoleOption>(response.data?.data);
  },
};
