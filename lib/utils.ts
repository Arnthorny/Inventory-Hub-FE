import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function updateOptions(options: RequestInit) {
  const update = { ...options };
  update.headers = {
    ...update.headers,
  };
  return update;
}

export default function fetcher(
  url: string | URL | Request,
  options: RequestInit
) {
  return fetch(url, updateOptions(options));
}
