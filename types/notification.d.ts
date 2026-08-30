interface INotifications {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
  reads: {
    id: number;
  }[];
}

export type { INotifications };
