"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Store, Users, Wrench } from "lucide-react";
import { DataTable, RoleOption } from "./data-table";
import { wargaWarungColumns, petugasAdminColumns } from "./columns";
import AddUserDialog from "./AddUser/Add-user-dialog";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import instance from "@/lib/instance";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";

const WARGA_WARUNG_ROLES: RoleOption[] = [
  {
    value: "warga",
    label: "Warga",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "warung",
    label: "Warung Mitra",
    icon: <Store className="h-4 w-4 text-muted-foreground" />,
  },
];

const PETUGAS_ADMIN_ROLES: RoleOption[] = [
  {
    value: "petugas",
    label: "Petugas",
    icon: <Wrench className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "admin",
    label: "Admin",
    icon: <ShieldCheck className="h-4 w-4 text-muted-foreground" />,
  },
];

export default function UsersManagementView() {
  const [activeTab, setActiveTab] = useState<"warga-warung" | "petugas-admin">(
    "warga-warung",
  );

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const search =
    (columnFilters.find((filter) => filter.id === "name&email")
      ?.value as string) ?? "";

  const selectedRoles =
    (columnFilters.find((filter) => filter.id === "role")?.value as string[]) ??
    [];

  const selectedStatus =
    (columnFilters.find((filter) => filter.id === "status")?.value as string) ??
    "aktif";

  const defaultTabRoles =
    activeTab === "warga-warung" ? ["warga", "warung"] : ["petugas", "admin"];

  const effectiveRoles =
    selectedRoles.length > 0 ? selectedRoles : defaultTabRoles;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, debouncedSearch, selectedRoles.join(",")]);

  const { data } = useQuery({
    queryKey: [
      "admin-users",
      pagination,
      effectiveRoles,
      debouncedSearch,
      selectedStatus,
    ],
    queryFn: async () => {
      const response = await instance.get("/admin/user", {
        params: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          roles: effectiveRoles.join(","),
          search: debouncedSearch,
          status: selectedStatus,
        },
      });

      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 p-4 py-6 md:p-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Manajemen Pengguna
              </h2>
              <p className="text-sm text-muted-foreground">
                Kelola data akun warga, warung mitra, petugas operasional, dan
                administrator.
              </p>
            </div>
            <AddUserDialog />
          </div>

          {/* Tabs untuk 2 Tabel */}
          <Tabs
            defaultValue="warga-warung"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "warga-warung" | "petugas-admin")
            }
          >
            <TabsList className="grid grid-cols-2 rounded-lg w-full md:max-w-sm">
              <TabsTrigger value="warga-warung" className="gap-2 rounded-md">
                <span>Warga &amp; Warung</span>
              </TabsTrigger>
              <TabsTrigger value="petugas-admin" className="gap-2 rounded-md">
                <span>Petugas &amp; Admin</span>
              </TabsTrigger>
            </TabsList>

            {/* Tabel 1: Warga & Warung */}
            <TabsContent value="warga-warung">
              <DataTable
                columns={wargaWarungColumns}
                data={data?.data ?? []}
                roleOptions={WARGA_WARUNG_ROLES}
                searchPlaceholder="Cari nama, email warga atau warung..."
                emptyMessage="Tidak ada data warga atau warung yang ditemukan."
                pagination={pagination}
                onPaginationChange={setPagination}
                rowCount={data?.pagination.totalUsers ?? 0}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
              />
            </TabsContent>

            {/* Tabel 2: Petugas & Admin */}
            <TabsContent value="petugas-admin">
              <DataTable
                columns={petugasAdminColumns}
                data={data?.data ?? []}
                roleOptions={PETUGAS_ADMIN_ROLES}
                searchPlaceholder="Cari nama, email petugas atau admin..."
                emptyMessage="Tidak ada data petugas atau admin yang ditemukan."
                pagination={pagination}
                onPaginationChange={setPagination}
                rowCount={data?.pagination.totalUsers ?? 0}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
