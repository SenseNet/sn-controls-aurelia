import { MockDataTransfer } from './MockDataTransfer';

export class MockDragEvent implements DragEvent {
    propagationStopped: boolean = false;
    immediatePropagationStopped: boolean = false;
    dataTransfer: MockDataTransfer = new MockDataTransfer();
    initDragEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget, dataTransferArg: DataTransfer): void {
        throw new Error('Method not implemented.');
    }
    msConvertURL(file: File, targetType: string, targetURL?: string): void {
        throw new Error('Method not implemented.');
    }
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    fromElement: Element;
    layerX: number;
    layerY: number;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
    toElement: Element;
    which: number;
    x: number;
    y: number;
    getModifierState(keyArg: string): boolean {
        throw new Error('Method not implemented.');
    }
    initMouseEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number, screenXArg: number, screenYArg: number, clientXArg: number, clientYArg: number, ctrlKeyArg: boolean, altKeyArg: boolean, shiftKeyArg: boolean, metaKeyArg: boolean, buttonArg: number, relatedTargetArg: EventTarget): void {
        throw new Error('Method not implemented.');
    }
    detail: number;
    view: Window;
    initUIEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, viewArg: Window, detailArg: number): void {
        throw new Error('Method not implemented.');
    }
    bubbles: boolean;
    cancelable: boolean;
    cancelBubble: boolean;
    currentTarget: EventTarget;
    defaultPrevented: boolean = false;
    eventPhase: number;
    isTrusted: boolean;
    returnValue: boolean;
    srcElement: Element;
    target: EventTarget;
    timeStamp: number;
    type: string;
    scoped: boolean;
    initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean): void {
        throw new Error('Method not implemented.');
    }
    preventDefault(): void {
        this.defaultPrevented = true;
    }
    stopImmediatePropagation(): void {
        this.immediatePropagationStopped = true;
    }
    stopPropagation(): void {
        this.propagationStopped = true;
    }
    deepPath(): EventTarget[] {
        throw new Error('Method not implemented.');
    }
    AT_TARGET: number;
    BUBBLING_PHASE: number;
    CAPTURING_PHASE: number;

}