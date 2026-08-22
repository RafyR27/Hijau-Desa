"use client"

import { NavbarProfile } from "@/components/commons/Navigation/Navigation";
import { SessionUser } from "@/types/user";

export default function ProfileKeamananLayout({ user }: { user?: SessionUser }) {
    return (
      <div className="w-full min-h-screen relative">
        <NavbarProfile />

        <div className="w-full flex justify-center">
          <div className="px-5 pt-1 w-full lg:max-w-3xl space-y-5">
            <h2 className="font-bold text-xl text-center">Keamanan</h2>

            
          </div>
        </div>
      </div>
    );
}