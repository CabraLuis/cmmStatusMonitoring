import events from "events";

export default class CMMController {
  private static instance: CMMController;
  private constructor() {}

  private emitter = new events.EventEmitter();
  private parts: string[] = [];

  static getInstance(): CMMController {
    if (!CMMController.instance) {
      CMMController.instance = new CMMController();
    }
    return CMMController.instance;
  }

  public sub(listener: any): any {
    return this.emitter.on("part", listener);
  }

  public unsub(listener: any): any {
    return this.emitter.off("part", listener);
  }

  public addPart(part: string): void {
    //Add Part with Prisma
    // this.parts.push(part);
    this.emitter.emit("part", part);
  }

  public getParts(): string[] {
    // Get parts with Prisma
    return this.parts;
  }
}
