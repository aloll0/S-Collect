export type VendorStatus = 'pending' | 'approved' | 'suspended';

export type VendorTab = 'pending' | 'all' | 'suspended';

export type ActiveFilter = 'all' | 'active' | 'inactive';

export interface Vendor {
  id: number;
  businessName: string;
  owner: string;
  email: string;
  submittedDate: string;
  category: string;
  status: VendorStatus;
  /** Only relevant for approved vendors */
  revenue?: number;
  orders?: number;
  active?: boolean;
}
