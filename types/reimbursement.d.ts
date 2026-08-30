interface ReimbursementItem {
  id: number;
  ownerId: string;
  owner: string;
  noHP: string | null;
  pointsClaimed: string;
  amountRupiah: string;
  date: Date;
  status: boolean;
};

export type { ReimbursementItem };
