import events from "events";

export default class CMMController {
  private static instance: CMMController;
  private constructor() {}

  private emitter = new events.EventEmitter();

  static getInstance(): CMMController {
    if (!CMMController.instance) {
      CMMController.instance = new CMMController();
    }
    return CMMController.instance;
  }

  public sub(listener: any): any {
    return this.emitter.on("workOrder", listener);
  }

  public unsub(listener: any): any {
    return this.emitter.off("workOrder", listener);
  }

  public addOrUpdate(): void {
    this.emitter.emit("workOrder", "UPDATED");
  }
}
