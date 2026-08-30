"use client";

import { LegacyColumnDef } from "@tanstack/react-table/legacy";
import {
  MoreHorizontal,
  ShieldCheck,
  Store,
  Trash2,
  Users,
  UserRoundKey,
  UserRoundPen,
  Wrench,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import EditUserDialog from "./EditUser/Edit-user-dialog";
import { useState } from "react";
import ResetPassUserDialog from "./ResetPassUser/ResetPass-user-dialog";
import { ProfileData } from "@/types/user";
import { cn } from "@/lib/utils";
import BannedUserDialog from "./BannedUser/Banned-user-dialog";
import UnbannedUserDialog from "./UnbannedUser/Unbanned-user-dialog";

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return <Badge variant="outline">Admin</Badge>;
    case "petugas":
      return <Badge variant="outline">Petugas</Badge>;
    case "warung":
      return <Badge variant="outline">Warung Mitra</Badge>;
    default:
      return <Badge variant="outline">Warga</Badge>;
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <ShieldCheck className="h-4 w-4 text-muted-foreground" />;
    case "petugas":
      return <Wrench className="h-4 w-4 text-muted-foreground" />;
    case "warung":
      return <Store className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Users className="h-4 w-4 text-muted-foreground" />;
  }
};

/**
 * Kolom untuk Tabel Warga & Warung Mitra
 */
export const wargaWarungColumns: LegacyColumnDef<ProfileData, unknown>[] = [
  {
    id: "name&email",
    header: () => <div>Nama &amp; Email</div>,
    accessorFn: (row) => `${row.user.name} ${row.user.email}`,
    filterFn: "includesString",
    cell: ({ row }) => {
      const nama = row.original.user.name;
      const email = row.original.user.email;

      return (
        <div className="flex flex-col gap-0.5">
          <p className="font-medium text-foreground">{nama}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      );
    },
  },
  {
    id: "role",
    accessorFn: (row) => row.user.role,
    header: () => <div>Role</div>,
    filterFn: (row, id, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true;
      const role = row.getValue(id) as string;
      return filterValue.includes(role);
    },
    cell: ({ row }) => {
      const role = row.original.user.role;
      return (
        <div className="flex items-center gap-2">
          {getRoleIcon(role)}
          {getRoleBadge(role)}
        </div>
      );
    },
  },
  {
    id: "phone",
    accessorFn: (row) => row.user.noHP ?? "-",
    header: () => <div>No. Handphone</div>,
    cell: ({ row }) => {
      const phone = row.original.user.noHP;
      if (!phone) return <span className="text-muted-foreground">-</span>;
      const formatted = phone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
      return <div className="text-muted-foreground">{formatted}</div>;
    },
  },
  {
    id: "rumah",
    accessorFn: (row) => row.user.noRumah ?? "-",
    header: () => <div>No. Rumah / Lokasi</div>,
    cell: ({ row }) => {
      const rumah = row.original.user.noRumah;
      if (!rumah) return <span className="text-muted-foreground">-</span>;
      return <div className="text-muted-foreground">{rumah}</div>;
    },
  },
  {
    id: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.original.user.status;
      return (
        <Badge
          variant={status === "Aktif" ? "secondary" : "destructive"}
          className={cn(status === "Aktif" ? "text-white" : "")}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "info",
    header: () => <div>Saldo / Poin</div>,
    cell: ({ row }) => {
      const role = row.original.user.role;
      if (role === "warung") {
        const saldo = row.original.poinWarung?.saldoRupiah ?? 0;
        return (
          <span className="text-xs font-medium text-emerald-600">
            Rp {saldo.toLocaleString("id-ID")}
          </span>
        );
      }
      if (role === "warga") {
        const poin = row.original.poin?.saldo ?? 0;
        return (
          <span className="text-xs font-medium text-blue-600">{poin} Poin</span>
        );
      }
      return <span className="text-xs text-muted-foreground">-</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      if (row.original.user.status === "Diblokir"){
        return <UserActionsUnban user={row.original} />
      } 

      return <UserActions user={row.original} />;
    },
  },
];

/**
 * Kolom untuk Tabel Petugas & Administrator
 */
export const petugasAdminColumns: LegacyColumnDef<ProfileData, unknown>[] = [
  {
    id: "name&email",
    header: () => <div>Nama &amp; Email</div>,
    accessorFn: (row) => `${row.user.name} ${row.user.email}`,
    filterFn: "includesString",
    cell: ({ row }) => {
      const nama = row.original.user.name;
      const email = row.original.user.email;

      return (
        <div className="flex flex-col gap-0.5">
          <p className="font-medium text-foreground">{nama}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      );
    },
  },
  {
    id: "role",
    accessorFn: (row) => row.user.role,
    header: () => <div>Role</div>,
    filterFn: (row, id, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true;
      const role = row.getValue(id) as string;
      return filterValue.includes(role);
    },
    cell: ({ row }) => {
      const role = row.original.user.role;
      return (
        <div className="flex items-center gap-2">
          {getRoleIcon(role)}
          {getRoleBadge(role)}
        </div>
      );
    },
  },
  {
    id: "phone",
    accessorFn: (row) => row.user.noHP ?? "-",
    header: () => <div>No. Handphone</div>,
    cell: ({ row }) => {
      const phone = row.original.user.noHP;
      if (!phone) return <span className="text-muted-foreground">-</span>;
      const formatted = phone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
      return <div className="text-muted-foreground">{formatted}</div>;
    },
  },
  {
    id: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.original.user.status;
      return (
        <Badge
          variant={status === "Aktif" ? "secondary" : "destructive"}
          className={cn(status === "Aktif" ? "text-white" : "")}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "createdAt",
    header: () => <div>Terdaftar Sejak</div>,
    cell: ({ row }) => {
      const date = row.original.user.createdAt;
      if (!date) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="text-muted-foreground text-xs">
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      if (row.original.user.status === "Diblokir") {
        return <UserActionsUnban user={row.original} />;
      } 

      return <UserActions user={row.original} />;
    },
  },
];

// Fallback default columns
export const columns = wargaWarungColumns;

const UserActions = ({ user }: { user: ProfileData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);

  const handleEdit = () => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleResetPassword = () => {
    setSelectedUser(user);
    setResetOpen(true);
  };

  const handleBan = () => {
    setSelectedUser(user);
    setBanOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex cursor-pointer justify-between"
              onClick={handleEdit}
            >
              Edit
              <UserRoundPen />
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex cursor-pointer justify-between"
              onClick={handleResetPassword}
            >
              Reset Password
              <UserRoundKey />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex cursor-pointer justify-between"
              variant="destructive"
              onClick={handleBan}
            >
              Blokir
              <Ban />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedUser && (
        <EditUserDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          user={selectedUser}
        />
      )}

      {selectedUser && (
        <ResetPassUserDialog
          open={resetOpen}
          onOpenChange={setResetOpen}
          user={selectedUser}
        />
      )}

      {selectedUser && (
        <BannedUserDialog
          open={banOpen}
          onOpenChange={setBanOpen}
          user={selectedUser}
        />
      )}
    </>
  );
};

const UserActionsUnban = ({ user }: { user: ProfileData }) => {
  const [unbanOpen, setUnbanOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);

  const handleUnband = () => {
    setSelectedUser(user);
    setUnbanOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex cursor-pointer justify-between"
              variant="destructive"
              onClick={handleUnband}
            >
              Buka blokir
              <Trash2 />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>


      {selectedUser && (
        <UnbannedUserDialog
          open={unbanOpen}
          onOpenChange={setUnbanOpen}
          user={selectedUser}
        />
      )}
    </>
  );
};
