import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";

  const cleanDate = dateStr.split("T")[0];

  const [year, month, day] = cleanDate.split("-");

  if (!year || !month || !day) return "-";

  return `${day}/${month}/${year}`;
}
export function calcAge(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
export function parseCharacteristic(desc: string) {
  if (!desc) return { descricao: "", nota: 5 };
  const [descricao, notaStr] = desc.split(" | ");
  const nota = notaStr ? parseInt(notaStr, 10) : 5;
  return { descricao, nota: isNaN(nota) ? 5 : nota };
}

export function formatCharacteristic(descricao: string, nota: number) {
  return `${descricao} | ${nota}`;
}

export function capitalizeName(str: string) {
  const exceptions = ["de", "da", "do", "das", "dos", "na", "no", "nas", "nos", "em", "e"];

  const endsWithSpace = str.endsWith(" ");

  const formatted = str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index > 0 && exceptions.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return endsWithSpace ? formatted : formatted;
}

export function simpleCapitalize(str: string) {
  if (!str) return "";
  const endsWithSpace = str.endsWith(" ");

  const lower = str.toLowerCase();
  const formatted = lower.charAt(0).toUpperCase() + lower.slice(1);

  return formatted;
}