import { apiClient } from './apiClient';

export interface CheckResponse {
  exists: boolean;
  message?: string;
}

export interface RegisterMemberPayload {
  full_name: string;
  father_name: string;
  date_of_birth: string;
  gender: string;
  country_code: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password?: string;
  blood_group: string;
  aadhaar_number: string;
  voter_id: string;
  state_id: number;
  parliament_constituency_id: number;
  assembly_constituency_id?: number;
  district_id: number;
  block_id: number;
  village_id?: number | string;
  village_custom?: string;
  address_line1?: string;
  role_id: number | string;
  profile_image?: File | null;
}

export const memberService = {
  checkPhone: async (countryCode: string, phone: string): Promise<CheckResponse> => {
    const res = await apiClient.get(`/members/check-phone?countryCode=${encodeURIComponent(countryCode)}&phone=${encodeURIComponent(phone)}`);
    return res.data.data;
  },

  checkAadhaar: async (aadhaar: string): Promise<CheckResponse> => {
    const res = await apiClient.get(`/members/check-aadhaar?aadhaar=${encodeURIComponent(aadhaar)}`);
    return res.data.data;
  },

  checkVoterId: async (voterId: string): Promise<CheckResponse> => {
    const res = await apiClient.get(`/members/check-voter-id?voterId=${encodeURIComponent(voterId)}`);
    return res.data.data;
  },

  registerMember: async (payload: RegisterMemberPayload) => {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      const val = (payload as any)[key];
      if (val !== undefined && val !== null && val !== '' && !['confirm_password', 'consent_terms'].includes(key)) {
        if (key === 'profile_image' && val instanceof File) {
          formData.append('profile_image', val);
        } else {
          formData.append(key, String(val));
        }
      }
    });

    const response = await apiClient.post('/members/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
