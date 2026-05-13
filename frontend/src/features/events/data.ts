import type { Event } from "./types";

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Semana Acadêmica de TI",
    description: "Palestras e workshops com profissionais do mercado e pesquisadores da área de tecnologia.",
    date: "20–24 mai 2026",
    location: "Auditório Principal",
    category: "palestra",
  },
  {
    id: 2,
    title: "Workshop de React & TypeScript",
    description: "Mão na massa com as principais ferramentas do desenvolvimento frontend moderno.",
    date: "27 mai 2026",
    location: "Lab. de Informática 3",
    category: "workshop",
  },
  {
    id: 3,
    title: "Seminário de Inteligência Artificial",
    description: "Apresentação de trabalhos de pesquisa em IA, visão computacional e PLN.",
    date: "3 jun 2026",
    location: "Bloco B — Sala 204",
    category: "seminário",
  },
  {
    id: 4,
    title: "Hackathon CampusConnect",
    description: "48 horas para criar soluções tecnológicas para desafios reais do campus.",
    date: "14–15 jun 2026",
    location: "Centro de Inovação",
    category: "outro",
  },
];
