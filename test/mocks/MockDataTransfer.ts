export class MockDataTransfer implements DataTransfer{
    
    
    private _items = []
    
    dropEffect: string;
    effectAllowed: string;
    files: FileList;
    items: DataTransferItemList;
    types: string[] = [];
    clearData(format?: string): boolean {
        throw new Error('Method not implemented.');
    }
    getData(format: string): string {
        return this._items[format];
    }
    setData(format: string, data: string): boolean {
        this._items[format] = data;
        this.types.push(format);
        return true;
    }
    setDragImage(image: Element, x: number, y: number): void {
        throw new Error('Method not implemented.');
    }

}