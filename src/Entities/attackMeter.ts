import { Actor, Vector, Engine, Rectangle, Color } from "excalibur";
import { myKeyboardManager } from "../main";

export class AttackMeter extends Actor {
  marker = new Rectangle({
    width: 200,
    height: 200,
    color: Color.Transparent,
    lineWidth: 2,
    strokeColor: Color.White,
  });

  targetOuter = new Rectangle({
    width: 30,
    height: 30,
    color: Color.Transparent,
    lineWidth: 2,
    strokeColor: Color.Blue,
  });

  targetInner = new Rectangle({
    width: 10,
    height: 10,
    color: Color.Transparent,
    lineWidth: 2,
    strokeColor: Color.Blue,
  });

  result: any;

  duration: number = 750;
  rotations: number = 1.5;
  steps: number = 750 / 16.6;
  sizeStep: number = 0.1;
  rotationStep: number = 0.5;
  currentStep: number = 0;
  isRunning: boolean = true;

  constructor(position: Vector) {
    super({
      width: 16,
      height: 16,
    });
    this.z = 1000;
    this.pos = position;

    const markerActor = new Actor({
      name: "marker",
      width: 200,
      height: 200,
      rotation: 0,
    });

    markerActor.graphics.use(this.marker);
    this.addChild(markerActor);

    const targetOuterActor = new Actor({
      name: "targetOuter",
      width: 30,
      height: 30,
    });
    targetOuterActor.graphics.use(this.targetOuter);
    this.addChild(targetOuterActor);

    const targetInnerActor = new Actor({
      name: "targetInner",
      width: 10,
      height: 10,
    });
    targetInnerActor.graphics.use(this.targetInner);
    this.addChild(targetInnerActor);
  }

  stop() {
    this.isRunning = false;

    myKeyboardManager.setOwner("none");
    this.result = {
      size: this.marker.width,
      difference1: this.targetOuter.width - this.marker.width,
      difference2: this.marker.width - this.targetInner.width,
    };
    const attackEvent: CustomEvent = new CustomEvent("attackResult", {
      detail: {
        result: this.result,
      },
    });
    document.dispatchEvent(attackEvent);
  }

  onInitialize(engine: Engine) {}

  init() {
    // set duration
    this.duration = 1250;

    // set steps
    this.steps = this.duration / 16.6;

    // set rotations
    this.rotations = Math.random() * 1 + 1;
    this.rotationStep = (Math.PI * this.rotations) / this.steps;

    // set size step
    this.sizeStep = (200 - 14) / this.steps;
    this.marker.height = this.steps * this.sizeStep;
    this.marker.width = this.steps * this.sizeStep;

    // set rotation step
    this.marker.rotation = this.steps * this.rotationStep;

    this.currentStep = 0;

    myKeyboardManager.setOwner("meleeTarget", this);
    this.isRunning = true;
  }

  onPreUpdate(engine: Engine, delta: number): void {
    if (this.isRunning) {
      if (this.currentStep < this.steps) {
        this.currentStep++;
        this.marker.height -= this.sizeStep;
        this.marker.width -= this.sizeStep;
        this.marker.rotation -= this.rotationStep;
      } else {
        this.isRunning = false;
        console.log("attack done: missed");
        myKeyboardManager.setOwner("none");
        const attackEvent: CustomEvent = new CustomEvent("attackResult", {
          detail: {
            result: undefined,
          },
        });
        document.dispatchEvent(attackEvent);
      }
    }
  }
}
