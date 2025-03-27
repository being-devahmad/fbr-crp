import {
  BarChart3,
  FileText,
  Home,
  LucideShoppingBag,
  Users,
  UsersIcon,
} from "lucide-react";

// Define menu items in a JSON structure
export const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
    match: (pathname: string) => pathname === "/dashboard",
  },
  {
    id: "accounts",
    title: "Accounts",
    icon: Users,
    href: "/dashboard/accounts",
    match: (pathname: string) => pathname.startsWith("/dashboard/accounts"),
  },
  {
    id: "invoices",
    title: "Invoices",
    icon: FileText,
    href: "/dashboard/invoices",
    match: (pathname: string) => pathname.startsWith("/dashboard/invoices"),
  },
  {
    id: "reports",
    title: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
    match: (pathname: string) => pathname.startsWith("/dashboard/reports"),
    children: [
      {
        title: "Sales Report",
        href: "/dashboard/reports/sales",
        match: (pathname: string) => pathname === "/dashboard/reports/sales",
      },
      // {
      //     title: "Purchase Report",
      //     href: "/dashboard/reports/purchase",
      //     match: (pathname: string) => pathname === "/dashboard/reports/purchase",
      // },
    ],
  },
  {
    id: "products",
    title: "Prodcuts",
    icon: LucideShoppingBag,
    href: "/dashboard/products",
    match: (pathname: string) => pathname.startsWith("/dashboard/products"),
  },
  {
    id: "users",
    title: "Users",
    icon: UsersIcon,
    href: "/dashboard/users",
    match: (pathname: string) => pathname.startsWith("/dashboard/users"),
  },
];
