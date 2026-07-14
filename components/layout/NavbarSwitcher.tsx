"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import ClasesNav from '../clases/ClasesNav';

export default function NavbarSwitcher() {
  const pathname = usePathname();

  // Detectamos si la ruta actual pertenece al ecosistema de Clases 1a1 / Apps Educativas / Comunidad
  const esEcosistemaClases = 
    pathname?.startsWith('/clases') || 
    pathname?.startsWith('/comunidad') || 
    pathname?.startsWith('/apps/testimonios') || 
    pathname?.startsWith('/apps/educativas');

  if (esEcosistemaClases) {
    return <ClasesNav />;
  }

  // Para todo lo demás (Home, About, Arkham, Books, etc.), mostramos el menú original de Royalfa
  return <Navbar />;
}