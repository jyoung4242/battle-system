import { Material } from "excalibur";
import { Bandit } from "../../Entities/bandit";
import { Player } from "../../Entities/player";
import { EventAction } from "../BattleEvent";
import { Resources } from "../../assets/resource";
import { model } from "../../UI";

export class DissolveEvent extends EventAction {
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
                color.a = 1.0;
            }
            
            color.rgb = textureColor.rgb * color.a;
        }`,
    });
  }

  init(): Promise<void> {
    return new Promise(async resolve => {
      this.who.graphics.material = this.dissolveMaterial as Material;
      console.log("dissolving");

      const interval = setInterval(() => {
        this.who.graphics.material?.update(shader => {
          shader.trySetUniformFloat("u_rate", this.dissolveRate);
          this.dissolveRate -= 0.01;
          if (this.dissolveRate <= 0) {
            console.log("dissolved");
            clearInterval(interval);
            this.who.graphics.material = null;
            setTimeout(() => {
              this.who.kill();
            }, 500);
            resolve();
          }
        });
      }, 100);
    });
  }
}
