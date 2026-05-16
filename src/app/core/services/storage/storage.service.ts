import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class StorageService {
    private platformId = inject(PLATFORM_ID);

    get<T>(key: string): T | null {
        if (isPlatformBrowser(this.platformId)) {
            const value = localStorage.getItem(key);
            return value == null ? null : JSON.parse(value);
        }
        return null;
    }

    set<T>(key: string, value: T): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    remove(key: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(key);
        }
    }
}
