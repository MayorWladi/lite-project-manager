export interface Collaborator {
  id: string;
  name: string;
  role: { en: string; es: string };
  socials?: string[];
}

export const collaborators: Collaborator[] = [
  {
    id: "wladimir-sanvicente",
    name: "Wladimir Sanvicente",
    role: { en: "Lead Developer", es: "Desarrollador Principal" },
    socials: [
      "https://www.linkedin.com/in/wladimir-sanvicente/",
      "https://github.com/MayorWladi/",
    ]
  },
  {
    id: "rafael-trejo",
    name: "Rafael Trejo",
    role: { en: "Sound Designer", es: "Diseñador de Sonido" },
    socials: [
      "https://instagram.com/el.ragus"
    ]
  }
];
