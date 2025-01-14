'use client';

import { usePathname } from "next/navigation";
import NavBarre from "./navBarre/page";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Liste des routes où la NavBarre ne doit pas apparaître
  const hideNavBarOnRoutes = ["/", "/login", "/register"];
  const shouldShowNavBar = !hideNavBarOnRoutes.includes(pathname);

  return (
    <>
      {/* Affiche la NavBarre uniquement si elle est nécessaire */}
      {shouldShowNavBar && <NavBarre />}
      {children}
    </>
  );
}
