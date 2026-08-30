"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTime } from "@/lib/formated";
import instance from "@/lib/instance";
import { cn } from "@/lib/utils";
import { INotifications } from "@/types/notification";
import { useQuery } from "@tanstack/react-query";
import { CircleStar, Package } from "lucide-react";



const NotificationLayout = () => {
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const res = await instance.get(
        `/general/notification?status=${"notification"}`,
      );
      return res.data.data;
    },
  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5">
      <h1 className="text-[1.5rem] font-bold">Notifikasi</h1>

      {/* Notification List */}
      <div className="flex flex-col gap-3">
        {isLoadingNotifications ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="rounded-xl py-0">
                <CardContent className="flex gap-3 p-3 md:p-5">
                  <Skeleton className="size-10 shrink-0 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between gap-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-12" />
                    </div>

                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          notifications.map((notification: INotifications) => (
            <Card
              key={notification.id}
              className="relative overflow-visible rounded-xl py-0"
            >
              <CardContent className="flex gap-3 p-3 md:p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {notification.title.includes("poin") ? (
                    <CircleStar className="size-5" />
                  ) : (
                    <Package className="size-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <h2 className="text-sm font-semibold">
                      {notification.title}
                    </h2>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-4 text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </CardContent>
              {notification.reads.length === 0 && (
                <span className="absolute -right-1 -top-1 size-3 rounded-full bg-blue-400" />
              )}
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      <p
        className={cn(
          "text-center text-sm text-muted-foreground",
          notifications?.length === 0 ? "py-30" : "",
        )}
      >
        Tidak ada notifikasi lainnya
      </p>
    </div>
  );
};

export default NotificationLayout;
