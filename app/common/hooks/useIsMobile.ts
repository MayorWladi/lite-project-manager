import { useState, useEffect } from "react";

/**
 * Hook personalizado para detectar si la pantalla actual corresponde a un dispositivo móvil.
 * @param breakpoint El ancho máximo en píxeles para considerar que es móvil (por defecto 768px, que corresponde a 'md' en Tailwind).
 * @returns boolean `true` si es móvil, `false` si es escritorio.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Verificar estado inicial en el cliente
    checkIsMobile();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
