import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';


@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private _messageService: MessageService) { }

    private _add(severity: string, summary: string, detail: string): void {
        this._messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 })
    }

    success(summary: string, detail: string): void {
        this._add('success', summary, detail);
    }

    info(summary: string, detail: string): void {
        this._add('info', summary, detail);
    }

    error(summary: string, detail: string): void {
        this._add('error', summary, detail);
    }

    warning(summary: string, detail: string): void {
        this._add('warn', summary, detail);
    }
}
