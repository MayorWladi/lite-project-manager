/**
 * app/utils/helpers/storage.ts
 * 
 * Envoltorios seguros para localStorage.
 * Previene crashes (DOMException) si el almacenamiento local está deshabilitado
 * (ej. Safari Modo Privado) o si la cuota de almacenamiento se excede.
 */

export const safeSetItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`No se pudo guardar en localStorage para la clave "${key}". Es posible que estés en Modo Privado o el almacenamiento esté lleno.`, error);
  }
};

export const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
    return null;
  } catch (error) {
    console.warn(`No se pudo leer localStorage para la clave "${key}".`, error);
    return null;
  }
};

export const safeRemoveItem = (key: string): void => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`No se pudo eliminar de localStorage la clave "${key}".`, error);
  }
};
