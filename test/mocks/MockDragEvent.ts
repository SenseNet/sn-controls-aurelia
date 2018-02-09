import { MockDataTransfer } from "./MockDataTransfer";
// tslint:disable
export class MockDragEvent implements DragEvent {
    public propagationStopped: boolean = false;
    public immediatePropagationStopped: boolean = false;
    public dataTransfer: MockDataTransfer = new MockDataTransfer();
    public initDragEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget, dataTransferArg: DataTransfer): void {
        throw new Error("Method not implemented.");
    }
    public msConvertURL(file: File, targetType: string, targetURL?: string): void {
        throw new Error("Method not implemented.");
    }
    public altKey!: boolean;
    public button!: number;
    public buttons!: number;
    public clientX!: number;
    public clientY!: number;
    public ctrlKey!: boolean;
    public fromElement!: Element;
    public layerX!: number;
    public layerY!: number;
    public metaKey!: boolean;
    public movementX!: number;
    public movementY!: number;
    public offsetX!: number;
    public offsetY!: number;
    public pageX!: number;
    public pageY!: number;
    public relatedTarget!: EventTarget;
    public screenX!: number;
    public screenY!: number;
    public shiftKey!: boolean;
    public toElement!: Element;
    public which!: number;
    public x!: number;
    public y!: number;
    public getModifierState(keyArg: string): boolean {
        throw new Error("Method not implemented.");
    }
    public initMouseEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget): void {
        throw new Error("Method not implemented.");
    }
    public detail!: number;
    public view!: Window;
    public initUIEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number): void {
        throw new Error("Method not implemented.");
    }
    public bubbles!: boolean;
    public cancelable!: boolean;
    public cancelBubble!: boolean;
    public currentTarget!: EventTarget;
    public defaultPrevented: boolean = false;
    public eventPhase!: number;
    public isTrusted!: boolean;
    public returnValue!: boolean;
    public srcElement!: Element;
    public target!: EventTarget;
    public timeStamp!: number;
    public type!: string;
    public scoped!: boolean;
    public initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean): void {
        throw new Error("Method not implemented.");
    }
    public preventDefault(): void {
        this.defaultPrevented = true;
    }
    public stopImmediatePropagation(): void {
        this.immediatePropagationStopped = true;
    }
    public stopPropagation(): void {
        this.propagationStopped = true;
    }
    public deepPath(): EventTarget[] {
        throw new Error("Method not implemented.");
    }
    public AT_TARGET!: number;
    public BUBBLING_PHASE!: number;
    public CAPTURING_PHASE!: number;

}
