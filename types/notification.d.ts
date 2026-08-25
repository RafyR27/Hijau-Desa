interface INotifications {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
}

export type {
    INotifications
}