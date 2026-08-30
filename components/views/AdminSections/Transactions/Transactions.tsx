"use client";

import { useState } from "react";
import { SessionUser } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownLeft, ArrowUpRight, Search, Download } from "lucide-react";

interface TransactionsProps {
  user?: SessionUser;
}

export default function TransactionsView({ user }: TransactionsProps) {
  const [currentTab, setCurrentTab] = useState("all");
  const [search, setSearch] = useState("");

  const dummyTransactions = [
    { id: "TRX-001", type: "setor", user: "Budi Santoso", actor: "Petugas Ahmad", item: "Plastik PET (5.2 kg)", points: "+260 Poin", date: "28 Agu 2026, 06:10" },
    { id: "TRX-002", type: "tukar", user: "Siti Rahmawati", actor: "Warung Berkah", item: "Beras Premium 5kg", points: "-150 Poin", date: "27 Agu 2026, 17:30" },
    { id: "TRX-003", type: "setor", user: "Ahmad Dahlan", actor: "Petugas Ahmad", item: "Kardus Bekas (12.0 kg)", points: "+360 Poin", date: "27 Agu 2026, 15:45" },
    { id: "TRX-004", type: "tukar", user: "Budi Santoso", actor: "Warung Berkah", item: "Minyak Goreng 1L", points: "-40 Poin", date: "27 Agu 2026, 11:20" },
    { id: "TRX-005", type: "setor", user: "Dewi Lestari", actor: "Petugas Hendra", item: "Minyak Jelantah (2.0 L)", points: "+200 Poin", date: "26 Agu 2026, 09:15" },
  ];

  const filtered = dummyTransactions.filter((trx) => {
    const matchSearch = trx.user.toLowerCase().includes(search.toLowerCase()) || trx.id.toLowerCase().includes(search.toLowerCase());
    if (currentTab === "all") return matchSearch;
    return matchSearch && trx.type === currentTab;
  });

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
            <Button
              variant="outline"
              className="flex items-center gap-2 self-start sm:self-auto"
            >
              <Download className="h-4 w-4" /> Ekspor Data (CSV)
            </Button>
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
                placeholder="Cari ID transaksi atau nama..."
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
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">
                            {item.id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.date}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.type === "setor" ? (
                            <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-600/20 hover:bg-emerald-600/20 gap-1">
                              <ArrowDownLeft className="h-3 w-3" /> Setor
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 hover:bg-blue-600/20 gap-1">
                              <ArrowUpRight className="h-3 w-3" /> Tukar Sembako
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">{item.user}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {item.actor}
                        </td>
                        <td className="px-6 py-4">{item.item}</td>
                        <td
                          className={`px-6 py-4 text-right font-bold ${item.type === "setor" ? "text-emerald-600" : "text-blue-600"}`}
                        >
                          {item.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
