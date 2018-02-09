// tslint:disable
export class MockCanvasRenderingContext2D {
    canvas!: HTMLCanvasElement;
    fillStyle!: string | CanvasGradient | CanvasPattern;
    font!: string;
    globalAlpha!: number;
    globalCompositeOperation!: string;
    imageSmoothingEnabled!: boolean;
    lineCap!: string;
    lineDashOffset!: number;
    lineJoin!: string;
    lineWidth!: number;
    miterLimit!: number;
    msFillRule!: CanvasFillRule;
    shadowBlur!: number;
    shadowColor!: string;
    shadowOffsetX!: number;
    shadowOffsetY!: number;
    strokeStyle!: string | CanvasGradient | CanvasPattern;
    textAlign!: string;
    textBaseline!: string;
    mozImageSmoothingEnabled!: boolean;
    webkitImageSmoothingEnabled!: boolean;
    oImageSmoothingEnabled!: boolean;
    beginPath(): void {
        throw new Error('Method not implemented.');
    }
    clearRect(x: number, y: number, w: number, h: number): void {
        throw new Error('Method not implemented.');
    }
    clip(fillRule?: CanvasFillRule): void {
        throw new Error('Method not implemented.');
    }
    createImageData(imageDataOrSw: number | ImageData, sh?: number): ImageData {
        throw new Error('Method not implemented.');
    }
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
        throw new Error('Method not implemented.');
    }
    createPattern(image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement, repetition: string): CanvasPattern {
        throw new Error('Method not implemented.');
    }
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
        throw new Error('Method not implemented.');
    }
    drawFocusIfNeeded(element: Element): void {
        throw new Error('Method not implemented.');
    }
    drawImage(image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number): void;
    drawImage(image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number): void;
    drawImage(image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
    drawImage(image: any, srcX: any, srcY: any, srcW?: any, srcH?: any, dstX?: any, dstY?: any, dstW?: any, dstH?: any) {
        throw new Error('Method not implemented.');
    }
    fill(fillRule?: CanvasFillRule): void {
        throw new Error('Method not implemented.');
    }
    fillRect(x: number, y: number, w: number, h: number): void {
        throw new Error('Method not implemented.');
    }
    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        throw new Error('Method not implemented.');
    }
    getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
        throw new Error('Method not implemented.');
    }
    getLineDash(): number[] {
        throw new Error('Method not implemented.');
    }
    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean {
        throw new Error('Method not implemented.');
    }
    measureText(text: string): TextMetrics {
        throw new Error('Method not implemented.');
    }
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
        throw new Error('Method not implemented.');
    }
    restore(): void {
        throw new Error('Method not implemented.');
    }
    rotate(angle: number): void {
        throw new Error('Method not implemented.');
    }
    save(): void {
        throw new Error('Method not implemented.');
    }
    scale(x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    setLineDash(segments: number[]): void {
        throw new Error('Method not implemented.');
    }
    setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {
        throw new Error('Method not implemented.');
    }
    stroke(path?: Path2D): void {
        throw new Error('Method not implemented.');
    }
    strokeRect(x: number, y: number, w: number, h: number): void {
        throw new Error('Method not implemented.');
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        throw new Error('Method not implemented.');
    }
    transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void {
        throw new Error('Method not implemented.');
    }
    translate(x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    toString(): string {
        throw new Error('Method not implemented.');
    }
    toLocaleString(): string {
        throw new Error('Method not implemented.');
    }
    valueOf(): Object {
        throw new Error('Method not implemented.');
    }
    hasOwnProperty(v: any) {
        throw new Error('Method not implemented.');
    }
    isPrototypeOf(v: Object): boolean {
        throw new Error('Method not implemented.');
    }

    should!: Chai.Assertion;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        throw new Error('Method not implemented.');
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        throw new Error('Method not implemented.');
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    closePath(): void {
        throw new Error('Method not implemented.');
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        throw new Error('Method not implemented.');
    }
    lineTo(x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    moveTo(x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    rect(x: number, y: number, w: number, h: number): void {
        throw new Error('Method not implemented.');
    }

}