"use client";

import { Check, X, Search, Badge } from "lucide-react";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/lib/instance";
import { Skeleton } from "@/components/ui/skeleton";
import { VerifWarga } from "@/types/user";
import { formatDateVerif } from "@/lib/formated";
import { cn } from "@/lib/utils";
import VerifWargaDialog from "./Verif/Verif-warga-dialog";
import UnverifWargaDialog from "./Unverif/Unverif-warga-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UndoWargaDialog from "./Undo/Undo-warga-dialog";

export default function VerifikasiTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openVerifDialog, setOpenVerifDialog] = useState(false);
  const [openUnverifDialog, setOpenUnverifDialog] = useState(false);
  const [openUndoDialog, setOpenUndoDialog] = useState(false);
  const [user, setUser] = useState<VerifWarga>()
  const [activeTab, setActiveTab] = useState<"Semua" | "Ditolak">("Semua");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading } = useQuery({
    queryKey: ["verif-warga", debouncedSearch, activeTab],
    queryFn: async () => {
      const res = await instance.get("/admin/verif-warga", {
        params: {
          search: debouncedSearch,
          status: activeTab,
        },
      });

      return res.data.data;
    },
  });

  const handleVerifWarga = (user: VerifWarga) => {
    setOpenVerifDialog(true);
    setUser(user);
  };

  const handleUnverifWarga = (user: VerifWarga) => {
    setOpenUnverifDialog(true);
    setUser(user);
  };

  const handleUndoDialog = (user: VerifWarga) => {
    setOpenUndoDialog(true);
    setUser(user);
  };

  return (
    <>
      {/* Tabs untuk 2 Tabel */}
      <Tabs
        defaultValue="Semua"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "Semua" | "Ditolak")}
      >
        <TabsList className="grid grid-cols-2 rounded-lg w-full md:max-w-sm">
          <TabsTrigger value="Semua" className="gap-2 rounded-md">
            <span>Semua</span>
          </TabsTrigger>
          <TabsTrigger value="Ditolak" className="gap-2 rounded-md">
            <span>Ditolak</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter & Search */}
      <Field>
        <InputGroup className="rounded-lg max-w-sm">
          <InputGroupInput
            placeholder="Cari nama, email, no HP, atau no rumah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-3"
          />
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </Field>

      {/* Warga List Card */}
      <div
        className={cn("divide-y rounded-md", data?.length > 0 ? "border" : "")}
      >
        {isLoading ? (
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4"
            >
              {/* Informasi warga */}
              <div className="flex flex-col gap-2 w-full">
                {/* Nama + Badge */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                {/* Email, HP, Rumah */}
                <div className="text-xs flex flex-wrap gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-36" />
                  </div>

                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-28" />
                  </div>

                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>

                {/* Registered date */}
                <Skeleton className="h-3 w-48" />
              </div>

              {/* Button */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>
          ))
        ) : data?.length > 0 ? (
          data?.map((item: VerifWarga) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-[0.9rem]">
                    {item.name}
                  </span>
                  <Badge className="text-[0.65rem] text-background">
                    Menunggu Verifikasi
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Email:{" "}
                    <strong className="text-foreground/80">{item.email}</strong>
                  </span>
                  <span>
                    No HP:{" "}
                    <strong className="text-foreground/80">{item.noHP}</strong>
                  </span>
                  <span>
                    Rumah:{" "}
                    <strong className="text-foreground/80">
                      {item.noRumah}
                    </strong>
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Mendaftar pada: {formatDateVerif(item.createdAt)} WIB
                </span>
                {item.rejectionReason && (
                  <span className="text-xs text-destructive">
                    Alasan: {item.rejectionReason}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!item.rejectionReason ? (
                  <>
                    <Button
                      size="xs"
                      variant="destructive"
                      className="h-8"
                      onClick={() => handleUnverifWarga(item)}
                    >
                      <X className="h-4 w-4 mr-1" /> Tolak
                    </Button>
                    <Button
                      onClick={() => handleVerifWarga(item)}
                      size="xs"
                      className="w-25 h-8"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Verifikasi
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleUndoDialog(item)}
                    size="xs"
                    className="w-40 h-8"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Batalkan Penolakan
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="md:py-60 py-40 text-center w-full flex justify-center">
            <div className="max-w-80">
              <p className="text-sm font-medium text-foreground">
                Tidak ada warga yang ditemukan
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Semua warga sudah diverifikasi atau belum ada pendaftar baru.
              </p>
            </div>
          </div>
        )}
      </div>

      {user && (
        <VerifWargaDialog
          open={openVerifDialog}
          onOpenChange={setOpenVerifDialog}
          user={user}
        />
      )}

      {user && (
        <UnverifWargaDialog
          open={openUnverifDialog}
          onOpenChange={setOpenUnverifDialog}
          user={user}
        />
      )}

      {user && (
        <UndoWargaDialog
          open={openUndoDialog}
          onOpenChange={setOpenUndoDialog}
          user={user}
        />
      )}
    </>
  );
}
