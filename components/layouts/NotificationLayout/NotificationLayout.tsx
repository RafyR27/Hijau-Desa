"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SessionUser } from "@/types/user";
import { Package } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Produk Baru Tersedia!",
    description:
      "Produk Baru: Beras Organik 5kg kini tersedia di katalog! Tukarkan poinmu sekarang.",
    time: "Baru saja",
    unread: true,
  },
];

const NotificationLayout = ({ user }: { user?: SessionUser }) => {
  return (
    <div className="w-full min-h-screen flex flex-col gap-5">
      <h1 className="text-[1.5rem] font-bold">Notifikasi</h1>

      {/* Notification List */}
      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`overflow-hidden rounded-xl py-0 ${
              notification.unread ? "border-l-5 border-l-primary" : ""
            }`}
          >
            <CardContent className="flex gap-3 px-3 py-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Package className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xs font-semibold">
                    {notification.title}
                  </h2>

                  <span className="shrink-0 text-[9px] text-muted-foreground">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-4 text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Tidak ada notifikasi lainnya
      </p>
    </div>
  );
};

export default NotificationLayout;
