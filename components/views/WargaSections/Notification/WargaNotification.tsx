"use client";

import NotificationLayout from "@/components/layouts/NotificationLayout/NotificationLayout";
import { SessionUser } from "@/types/user";

const WargaNotification = ({ user }: { user?: SessionUser }) => {
  return (
    <NotificationLayout user={user} />
  );
};

export default WargaNotification;
