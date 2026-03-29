export type PlanType = 'FREE' | 'ESSENTIAL' | 'PREMIUM';
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionSource = 'MANUAL' | 'WHATSAPP';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  planType: PlanType;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  description: string;
  date: string;
  userId: string;
  categoryId: string;
  source: TransactionSource;
  receiptUrl: string | null;
  deletedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  isDefault: boolean;
  deletedAt: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionsFilters {
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateTransactionPayload {
  type: TransactionType;
  amount: string | number;
  description: string;
  date: string;
  categoryId: string;
  source?: TransactionSource;
  receiptUrl?: string | null;
}

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface CreateCategoryPayload {
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface BillingUrlResponse {
  url: string;
}

export interface DashboardSummary {
  currentBalance: number;
  monthIncome: number;
  monthExpense: number;
  monthlySeries: Array<{
    day: string;
    income: number;
    expense: number;
  }>;
}
