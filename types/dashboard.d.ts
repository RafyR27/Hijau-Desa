interface TransactionItem {
  id: string;
  type: "masuk" | "keluar";
  title: string;
  dateKey: string;
  monthYear: string;
  dateLabel: string;
  time: string;
  poin: string;
  weight?: string;
  status: string;
}


export type { TransactionItem };