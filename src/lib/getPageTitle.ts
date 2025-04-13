import { SITE_TITLE_SHORT } from "@data/config";

/**
 * Devuelve el título de la página basado en el slug.
 * Si no es una entrada de blog, devuelve un título predeterminado.
 */
export function getPageTitle(slug: string, entryTitle?: string): string {
  if (entryTitle) {
    return entryTitle;
  }

  // Si el slug es "index", devolver solo el título corto del sitio
  if (slug.toLowerCase() === "index") {
    return SITE_TITLE_SHORT;
  }

  // Si no hay título de entrada, usa el nombre de la página como fallback
  const fallbackTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return `${fallbackTitle} - ${SITE_TITLE_SHORT}`;
}