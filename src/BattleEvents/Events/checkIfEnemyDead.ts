import { EasingFunctions, Material } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { player, Player, playerIdleBattle } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { Resources } from "../../assets/resource";
import { model } from "../../UI";

export class CheckForEnemeyDead extends EventAction {
  dissolveRate = 1.0;
  dissolveMaterial;
  constructor(public who: Bandit | Player) {
    super();
    this.dissolveMaterial = model.engineRef?.graphicsContext.createMaterial({
      name: "dissolve",
      images: {
        dissolve: Resources.dissolveTexture,
      },
      fragmentSource: `#version 300 es
    
        precision mediump float;
        uniform float u_rate;
        uniform sampler2D u_graphic;
        uniform sampler2D dissolve;
    
        in vec2 v_uv; 
        out vec4 color;
    
        void main() { 
            //sample noise texture
            vec4 textureColor = texture(u_graphic, v_uv);
            vec4 dissolveColor = texture(dissolve, v_uv);
            if(dissolveColor.r >= u_rate){
                color.a = 0.0;
            }else{
                if(textureColor.a == 0.0){
                    color.a = 0.0;
                }else{
                    color.a = 1.0;
                }
                
            }
            
            color.rgb = textureColor.rgb * color.a;
        }`,
    });
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      if (this.who.hp <= 0) {
        this.who.graphics.material = this.dissolveMaterial as Material;
        this.who.animationFSM.set("idle", this.who);
        const interval = setInterval(() => {
          this.who.graphics.material?.update(shader => {
            shader.trySetUniformFloat("u_rate", this.dissolveRate);
          });

          this.dissolveRate -= 0.1;
          if (this.dissolveRate <= 0) {
            clearInterval(interval);
            setTimeout(async () => {
              const particIndex = player.battleManager?.participants.findIndex(p => p === this.who);
              if (particIndex && particIndex > -1) player.battleManager?.participants.splice(particIndex, 1);
              const turnindex = model.turnorder.findIndex(t => t === this.who);
              if (turnindex > -1) model.turnorder.splice(turnindex, 1);
              this.who.kill();
              this.who.graphics.material = null;
              model.engineRef?.currentScene.camera.clearAllStrategies();
              await model.engineRef?.currentScene.camera.move(player.pos, 750, EasingFunctions.EaseInOutCubic);
              model.engineRef?.currentScene.camera.strategy.lockToActor(player);
              if (player.animationFSM.get() != playerIdleBattle) player.animationFSM.set("battleIdle", player);
              player.battleManager?.endTurn();
            }, 500);
            resolve();
          }
        }, 100);
      } else {
        player.battleManager?.endTurn();
        resolve();
      }
    });
  }
}
