import { goto } from "$app/navigation";
import { type ClassValue, clsx } from "clsx";
import { i18n } from "./i18n";
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

export function withSearchParameters(url: URL, key: string, value: string): URL {
    const urlString = url.toString();
    const newUrl = new URL(urlString);
    newUrl.searchParams.set(key, value);
    return newUrl;
}

export function localizedGoto(currentUrl: string, path: string, options?: { invalidateAll?: boolean }) {
    const language = i18n.getLanguageFromUrl(new URL(currentUrl));
    const localisedPath = i18n.resolveRoute(path, language);
    goto(localisedPath, options);
}