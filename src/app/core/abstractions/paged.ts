export abstract class Paged {
    protected _currentPage: number = 0;
    protected _totalPages: number = 1;
    protected _totalCount: number = 1;
    protected _hasNext: boolean = true;
    protected _hasPrevious: boolean = true;

    get TotalCount(): number {
        return this._totalCount;
    }

    get TotalPages(): number {
        return this._totalPages;
    }

    get CurrentPage(): number {
        return this._currentPage;
    }

    get HasNext(): boolean {
        return this._hasNext;
    }

    get HasPrevious(): boolean {
        return this._hasPrevious;
    }
}