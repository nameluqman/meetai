import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) { //cn for classname
  return twMerge(clsx(inputs))
}
