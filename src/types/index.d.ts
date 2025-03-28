export interface UserType {
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
