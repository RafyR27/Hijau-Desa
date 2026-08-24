import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  destructive?: boolean;
  onClick?: () => void;
  href?: string;
}

const SettingsItem = ({
  icon,
  title,
  description,
  destructive = false,
  onClick,
  href
}: SettingsItemProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="w-full h-auto min-h-18 px-4 py-3 rounded-none justify-start text-left hover:bg-muted/50"
      nativeButton={!href}
      render={href ? <Link href={href} /> : undefined}
    >
      {React.cloneElement(icon as React.ReactElement)}

      <div className="flex-1 min-w-0 ml-3">
        <p className={`font-semibold ${destructive ? "text-destructive" : ""}`}>
          {title}
        </p>

        {description && (
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>

      <ChevronRight
        className={`size-5 shrink-0 ${destructive ? "text-destructive" : "text-muted-foreground"}`}
      />
    </Button>
  );
};

export default SettingsItem
