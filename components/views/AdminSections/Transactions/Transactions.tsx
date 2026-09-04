"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { formatDateVerif } from "@/lib/formated";


interface TransactionItem {
  id: string;
  jenis: "setor" | "tukar";
  warga: string;
  anggota: string;
  detailItem: string;
  poin: string;
  amountRupiah: number;
  createdAt: string;
}

interface TransactionsResponse {
  transaksi: TransactionItem[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

const FILTER_MAP: Record<string, string> = {
  all: "Semua",
  setor: "Setor",
  tukar: "Tukar",
};

export default function TransactionsView() {
  const [currentTab, setCurrentTab] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageIndex(0);
  }, [currentTab, debouncedSearch]);

  const { data, isLoading } = useQuery<TransactionsResponse>({
    queryKey: ["admin-transactions", pageIndex, pageSize, currentTab, debouncedSearch],
    queryFn: async () => {
      const res = await instance.get("/admin/riwayat", {
        params: {
          pageIndex,
          pageSize,
          filter: FILTER_MAP[currentTab] || "Semua",
          search: debouncedSearch,
        },
      });
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });

  const transaksi = data?.transaksi ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-10 p-4 py-6 md:p-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Riwayat Semua Transaksi
              </h2>
              <p className="text-sm text-muted-foreground">
                Audit log menyeluruh aktivitas setor sampah warga dan penukaran
                sembako di warung mitra.
              </p>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="all" onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-3 rounded-lg w-full md:max-w-sm">
                <TabsTrigger value="all" className={"rounded-lg"}>Semua</TabsTrigger>
                <TabsTrigger value="setor" className={"rounded-lg"}>Setor Sampah</TabsTrigger>
                <TabsTrigger value="tukar" className={"rounded-lg"}>Tukar Poin</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama warga atau petugas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="py-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 border-b text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">ID & Waktu</th>
                      <th className="px-6 py-3">Jenis</th>
                      <th className="px-6 py-3">Warga</th>
                      <th className="px-6 py-3">Petugas / Warung</th>
                      <th className="px-6 py-3">Detail Item</th>
                      <th className="px-6 py-3 text-right">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-5 w-20 rounded-full" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-28" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-28" />
                          </td>
                          <td className="px-6 py-4">
                            <Skeleton className="h-4 w-36" />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : transaksi.length > 0 ? (
                      transaksi.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-foreground max-w-40 truncate">
                              {item.id}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDateVerif(new Date(item.createdAt))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.jenis === "setor" ? (
                              <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 hover:bg-emerald-600/20 gap-1">
                                <ArrowDownLeft className="h-3 w-3" /> Setor
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 hover:bg-blue-600/20 gap-1">
                                <ArrowUpRight className="h-3 w-3" /> Tukar Sembako
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium">{item.warga}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {item.anggota}
                          </td>
                          <td className="px-6 py-4">{item.detailItem}</td>
                          <td
                            className={`px-6 py-4 text-right font-bold ${item.jenis === "setor" ? "text-emerald-600" : "text-blue-600"}`}
                          >
                            {item.poin}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>
                          <div className="py-20 text-center flex flex-col items-center gap-2">
                            <Inbox className="h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm font-medium text-foreground">
                              Belum ada transaksi
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {debouncedSearch
                                ? `Tidak ditemukan transaksi untuk "${debouncedSearch}".`
                                : "Data transaksi akan muncul di sini."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!isLoading && total > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground max-w-30">
                    Menampilkan{" "}
                    <span className="font-medium text-foreground">
                      {pageIndex * pageSize + 1}
                    </span>
                    –
                    <span className="font-medium text-foreground">
                      {Math.min((pageIndex + 1) * pageSize, total)}
                    </span>{" "}
                    dari{" "}
                    <span className="font-medium text-foreground">{total}</span>{" "}
                    transaksi
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                      disabled={pageIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {pageIndex + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={pageIndex >= totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
