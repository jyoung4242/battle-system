import { EasingFunctions, Vector } from "excalibur";
import { Player } from "../../Entities/player";
import { Bandit } from "../../Entities/bandit";

type directions = "Up" | "Down" | "Left" | "Right";
export class LungeEvent {
  constructor(public who: Player | Bandit, public destination: Vector, public distancefromTarget: number) {}

  init(pipeline: any): Promise<void> {
    const newDir = findDirection(this.destination, this.who.pos);
    return new Promise(async resolve => {
      const target = (this.who as Player).currentTarget;
      if (!target) return;
      const originalPosition = this.who.pos.clone();
      const distanceBetween = (this.who as Player).pos.distance(target.pos);
      const distancetoMove = this.distancefromTarget - distanceBetween;
      const differenceVector = (this.who as Player).pos.sub(target.pos);
      const differenceVectorNormalized = differenceVector.normalize();
      const targetVector = differenceVectorNormalized.scale(distancetoMove);
      let cameraPosition = differenceVector.scale(0.5);
      cameraPosition = cameraPosition.negate();
      console.log(cameraPosition);

      let camera = this.who.scene?.camera;
      if (!camera) return;
      camera.clearAllStrategies();
      camera.move(camera.pos.add(cameraPosition), 250, EasingFunctions.EaseInOutCubic);
      (this.who as Player | Bandit).actions.easeTo(this.who.pos.add(targetVector), 250, EasingFunctions.EaseInCubic);
      pipeline.cameraPosition = camera.pos.add(cameraPosition);
      pipeline.originalPosition = originalPosition.clone();
      await camera.zoomOverTime(4, 750, EasingFunctions.EaseInOutCubic);
      resolve();
    });
  }
}

function findDirection(to: Vector, from: Vector): directions {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Movement is more horizontal
    return dx > 0 ? "Right" : "Left";
  } else {
    // Movement is more vertical
    return dy > 0 ? "Down" : "Up";
  }
}
