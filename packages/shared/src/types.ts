export interface ApiListResponse<T> {
  items: T[];
  total: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: MemberStatus;
  notes?: string;
}

export type MemberStatus = "ACTIVE" | "TRIAL" | "FROZEN" | "DELINQUENT" | "CANCELED";

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "ANNUAL" | "DROP_IN";
  creditsPerPeriod?: number;
  contractMonths?: number;
  cancellationPolicy?: string;
  freezeRules?: string;
  taxRate?: number;
  active: boolean;
}

export interface ClassEvent {
  id: string;
  startAt: string;
  endAt: string;
  location: string;
  room?: string;
  capacity: number;
  status: "SCHEDULED" | "CANCELED" | "COMPLETED";
  template?: {
    name: string;
    category?: string;
  };
}
