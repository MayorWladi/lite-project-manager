export interface SocialLink {
  url: string;
  // We can infer the type (linkedin, instagram, github) from the URL later in the UI
}

export interface Collaborator {
  id: string;
  name: string;
  role: { en: string; es: string };
  socials?: SocialLink[];
}

export const collaborators: Collaborator[] = [
  {
    id: "wladimir-sanvicente",
    name: "Wladimir Sanvicente",
    role: { en: "Lead Developer", es: "Desarrollador Principal" },
    socials: [
      // Example data - User can replace with real links
      { url: "https://www.linkedin.com/in/wladimir-sanvicente/" },
      { url: "https://github.com/MayorWladi/" },
    ]
  },
  {
    id: "rafael-trejo",
    name: "Rafael Trejo",
    role: { en: "Sound Designer", es: "Diseñador de Sonido" },
    socials: [
      // Example data
      { url: "https://instagram.com/el.ragus" }
    ]
  }
];
