// tslint:disable
export class MockDataTransfer implements DataTransfer {

    // tslint
    private _items: Map<string, string> = new Map();

    public dropEffect!: string;
    public effectAllowed!: string;
    public files!: FileList;
    public items!: DataTransferItemList;
    public types: string[] = [];
    public clearData(format?: string): boolean {
        throw new Error("Method not implemented.");
    }
    public getData(format: string): string {
        return this._items.get(format) || "";
    }
    public setData(format: string, data: string): boolean {
        this._items.set(format, data);
        this.types.push(format);
        return true;
    }
    public setDragImage(image: Element, x: number, y: number): void {
        throw new Error("Method not implemented.");
    }

}
