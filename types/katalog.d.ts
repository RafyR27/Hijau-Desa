interface KatalogItem {
  id: number | string;
  image?: string | null;
  namaProduct: string;
  hargaPoin: number;
  isActive: boolean;
}

export type { KatalogItem };