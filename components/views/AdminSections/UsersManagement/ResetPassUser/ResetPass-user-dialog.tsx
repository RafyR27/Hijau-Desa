"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileData } from "@/types/user";
import { ShieldAlert } from "lucide-react";

const ResetPassUserDialog = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileData | null;
}) => {
    const handleSendResetLink = () => {
      // Implement the logic to send the reset link here
      console.log(`Sending reset link to ${user?.user?.email}`);
      onOpenChange(false); 
    }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pb-2">
            <ShieldAlert className="w-5 h-5" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to reset password for{" "}
            <span className="font-semibold">{user?.user?.name}</span>?
          </DialogDescription>
          <DialogDescription>
            A password reset link will be sent to{" "}
            <span className="font-semibold">{user?.user?.email}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" className="p-4 cursor-pointer" variant="outline">
                Close
              </Button>
            }
          />
          <Button type="button" className="p-4 cursor-pointer" onClick={handleSendResetLink}>
            Send reset link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassUserDialog;
