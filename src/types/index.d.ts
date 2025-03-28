export interface UserType {
  image: string | undefined;
  name: string ;
  _id: Key | null | undefined;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string; // Optional since it may be empty
}

export interface Invoice {
  _id: string;
  account: Account;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceType: "simple" | "detailed" | "tax";
  status: "pending" | "paid" | "cancelled";
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    rate: number;
    total: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  payment: {
    expense: number;
    discount: number;
    subTotal: number;
    total: number;
  };
  shipping?: {
    barCode: string;
    cartons: number;
    bags: number;
    notes: string;
  };
  createdAt: string;
}

export interface InvoiceItem {
  id: number;
  productId: string | number;
  productName: string;
  categoryId: string | number;
  categoryName: string;
  barCode: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface InvoiceFormState {
  // Basic invoice info
  invoiceNumber: string;
  selectedAccount: string;
  contactNumber: string;
  cnic: string;
  creditLimit: string;
  city: string;
  invoiceType: string;

  // Product form
  productName: string;
  selectedProduct: string;
  selectedCategory: string;
  quantity: string;
  rate: string;
  barCode: string;

  // Shipping info
  cartons: string;
  bags: string;
  notes: string;

  // Payment info
  expense: string;
  discount: string;

  // Items
  invoiceItems: InvoiceItem[];

  // Form state
  isSubmitting: boolean;
}


export interface PaginationData {
  totalRecords: number
  totalPages: number
  currentPage: number
  limit: number
}

export interface ApiResponse {
  users: UserType[]
  pagination: PaginationData
}