"use client";

import {
  LegacyColumnDef,
  getCoreRowModel,
  useLegacyTable,
} from "@tanstack/react-table/legacy";
import { flexRender } from "@tanstack/react-table";
import {
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Funnel,
  ShieldCheck,
  Store,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export interface RoleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface StatusOption {
  value: string;
  label: string;
}

type DataTableProps<TData extends RowData> = {
  columns: LegacyColumnDef<TData>[];
  data: TData[];

  roleOptions?: RoleOption[];
  statusOptions?: StatusOption[];

  searchPlaceholder?: string;
  emptyMessage?: string;

  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;

  rowCount: number;

  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
};

const DEFAULT_ROLE_OPTIONS: RoleOption[] = [
  {
    value: "warga",
    label: "Warga",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "petugas",
    label: "Petugas",
    icon: <Wrench className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "warung",
    label: "Warung",
    icon: <Store className="h-4 w-4 text-muted-foreground" />,
  },
  {
    value: "admin",
    label: "Admin",
    icon: <ShieldCheck className="h-4 w-4 text-muted-foreground" />,
  },
];

const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  {
    value: "aktif",
    label: "Aktif",
  },
  {
    value: "diblokir",
    label: "Diblokir",
  },
];

export function DataTable<TData extends RowData>({
  columns,
  data,
  roleOptions = DEFAULT_ROLE_OPTIONS,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  searchPlaceholder = "Cari nama atau email...",
  emptyMessage = "Tidak ada data yang ditemukan.",
  pagination,
  onPaginationChange,
  rowCount,
  columnFilters,
  onColumnFiltersChange,
}: DataTableProps<TData>) {
  const table = useLegacyTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange,
    onColumnFiltersChange,
  });

  const roleColumn = table.getColumn("role");
  const statusColumn = table.getColumn("status");
  const nameEmailColumn = table.getColumn("name&email");
  const selectedRoles = (roleColumn?.getFilterValue() as string[]) ?? [];
  const selectedStatus = statusColumn?.getFilterValue() ?? "";
  const searchValue = (nameEmailColumn?.getFilterValue() as string) ?? "";

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  const start = rowCount === 0 ? 0 : pageIndex * pageSize + 1;

  const end = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-4">
        <div className="relative w-full sm:max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => nameEmailColumn?.setFilterValue(e.target.value)}
            className="rounded-lg"
          />
          {searchValue && (
            <button
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => nameEmailColumn?.setFilterValue("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="w-full flex gap-3 justify-between md:justify-start">
          {roleOptions && roleOptions.length > 0 && roleColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="gap-2 cursor-pointer shrink-0 rounded-lg"
                  >
                    <Funnel className="h-4 w-4 text-muted-foreground" />
                    Filter Role
                    {selectedRoles.length > 0 && (
                      <Badge
                        variant="outline"
                        className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {selectedRoles.length}
                      </Badge>
                    )}
                  </Button>
                }
              />
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {roleOptions.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      className="cursor-pointer gap-2"
                      checked={selectedRoles.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const newRoles = checked
                          ? [...selectedRoles, option.value]
                          : selectedRoles.filter((r) => r !== option.value);
                        roleColumn?.setFilterValue(
                          newRoles.length > 0 ? newRoles : undefined,
                        );
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}

                  {selectedRoles.length > 0 && (
                    <>
                      <Separator />
                      <Button
                        className="mt-1 w-full cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => roleColumn?.setFilterValue(undefined)}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Hapus Filter
                      </Button>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {statusOptions && statusOptions.length > 0 && statusColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="gap-2 cursor-pointer shrink-0 rounded-lg"
                  >
                    <Funnel className="h-4 w-4 text-muted-foreground" />
                    Status
                    <Badge variant="outline" className="ml-1">
                      {statusOptions.find(
                        (option) => option.value === selectedStatus,
                      )?.label ?? "Aktif"}
                    </Badge>
                  </Button>
                }
              />
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={selectedStatus}
                  onValueChange={(value) => {
                    statusColumn.setFilterValue(value);
                  }}
                >
                  {statusOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-xs uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan <span className="font-medium">{start}</span> -{" "}
          <span className="font-medium">{end}</span> dari{" "}
          <span className="font-medium">{rowCount}</span> pengguna
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
