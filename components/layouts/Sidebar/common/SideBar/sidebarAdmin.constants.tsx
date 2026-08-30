import {
  BookUser,
  CircleHelpIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  Trash2Icon,
  PackageIcon,
  ReceiptTextIcon,
  BanknoteIcon,
  UserCheckIcon,
} from "lucide-react";

const SIDEBAR_ADMIN = {
  navMain: [
    {
      title: "Dasboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Verifikasi Warga",
      url: "/admin/verifikasi-warga",
      icon: <UserCheckIcon />,
    },
    {
      title: "Manajemen Pengguna",
      url: "/admin/users-management",
      icon: <BookUser />,
    },
    {
      title: "Kategori Sampah",
      url: "/admin/waste-categories",
      icon: <Trash2Icon />,
    },
    {
      title: "Katalog Produk",
      url: "/admin/product-catalog",
      icon: <PackageIcon />,
    },
  ],
  documents: [
    {
      title: "Transaksi",
      url: "/admin/transactions",
      icon: <ReceiptTextIcon />,
    },
    {
      title: "Pencairan Dana",
      url: "/admin/reimbursement",
      icon: <BanknoteIcon />,
    },
  ],
  tools: [
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
};

export { SIDEBAR_ADMIN };
