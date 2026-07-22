import { api } from './api';

export interface VendorZoneRate {
  zone: string;
  rate: number;
}

export interface VendorShippingSettings {
  flatRate: number | null;
  zoneRates: VendorZoneRate[];
}

export const getVendorShippingSettings = async (): Promise<VendorShippingSettings> => {
  const { data } = await api.get('/vendor/shipping');
  return data;
};

export const updateFlatShippingRate = async (rate: number): Promise<void> => {
  await api.put('/vendor/shipping/flat-rate', { rate });
};

export const clearFlatShippingRate = async (): Promise<void> => {
  await api.delete('/vendor/shipping/flat-rate');
};

export const upsertZoneShippingRate = async (code: string, rate: number): Promise<void> => {
  await api.put(`/vendor/shipping/zones/${code}`, { rate });
};

export const removeZoneShippingRate = async (code: string): Promise<void> => {
  await api.delete(`/vendor/shipping/zones/${code}`);
};
