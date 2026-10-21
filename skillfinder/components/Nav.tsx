"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { BookingIcon, CloseIcon, LogoutIcon, ProfileIcon, SearchIcon, ServicesIcon } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/services/AuthService";
import { readForm } from "@/lib/utils";

export const Nav = () => {
  const { profile } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false); // search bar: icon first, expands on tap

  const search = (e: React.FormEvent<HTMLFormElement>) => {
    const { values } = readForm(e);
    router.push(`/?q=${encodeURIComponent(values.q.trim())}`);
  };

  const link = "flex items-center gap-1 text-sm font-medium text-clay hover:text-ochre";
  return (
    <header className="sticky top-0 z-10 border-b border-sage/30 bg-linen/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        {!open && <Logo />}
        <div className={`flex items-center gap-3 ${open ? "w-full" : ""}`}>
          <form onSubmit={search} className="flex flex-1 items-center justify-end gap-1">
            {open && (
              <input name="q" autoFocus placeholder="Search trade, name or city"
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                className="w-full rounded-full border-2 border-sage bg-cream px-4 py-1.5 text-sm text-clay outline-none sm:max-w-xs" />
            )}
            <button type={open ? "submit" : "button"} onClick={() => setOpen(true)} aria-label="Search"
              className="rounded-full border-2 border-sage p-2 text-sage-dark hover:bg-cream"><SearchIcon size={16} /></button>
            {open && <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="p-2 text-muted"><CloseIcon size={16} /></button>}
          </form>
          {!open && (profile ? (
            <>
              {profile.role === "artisan" && <Link href="/services" className={link}><ServicesIcon size={16} /><span className="hidden sm:inline">Services</span></Link>}
              <Link href="/bookings" className={link}><BookingIcon size={16} /><span className="hidden sm:inline">Bookings</span></Link>
              <Link href="/profile" className={link}><ProfileIcon size={16} /><span className="hidden sm:inline">Profile</span></Link>
              <button onClick={authService.signOut} aria-label="Sign out" className={link}><LogoutIcon size={16} /></button>
            </>
          ) : <Link href="/login" className="btn !py-1.5">Sign in</Link>)}
        </div>
      </nav>
    </header>
  );
};
