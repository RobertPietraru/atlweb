import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function tryParseFloat(value: string): number | null {
    try {
        return parseFloat(value);
    } catch (error) {
        return null;
    }
}

export function tryParseInt(value: string): number | null {
    try {
        return parseInt(value);
    } catch (error) {
        return null;
    }
}
