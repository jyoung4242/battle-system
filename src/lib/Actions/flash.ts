import { Color, Action, Entity, Material, GraphicsComponent, Actor } from "excalibur";

export class Flash implements Action {
  private _graphics: GraphicsComponent;
  private _duration: number;
  private _stopped: boolean = false;
  private _started: boolean = false;
  private _color: Color;
  private _elapsedTime: number = 0;
  private _entity: Entity;
  private _material: Material | undefined;

  constructor(entity: Entity, color: Color, duration: number = 1000) {
    this._graphics = entity.get(GraphicsComponent);
    this._color = color;
    this._duration = duration;
    this._entity = entity;
    this._material = this._entity.scene?.engine.graphicsContext.createMaterial({
      name: "flash-material",
      fragmentSource: `#version 300 es
        precision mediump float;

        uniform float u_time_ms; // Time in milliseconds
        uniform float u_duration_ms; // Overall duration of the transition in milliseconds
        uniform sampler2D u_graphic; // The texture
        uniform vec4 u_color; // The color to blend from

        in vec2 v_uv; // The texture coordinates
        out vec4 color; // The output color

        void main() {
            float blendFactor = clamp(u_time_ms / u_duration_ms, 0.0, 1.0); // Blend factor based on time and duration
            vec4 textureColor = texture(u_graphic, v_uv); // Sample the texture
            color = mix(u_color, textureColor, blendFactor); // Blend between the color and the texture
        }`,
    });
    console.log("this._material", this._material);
  }

  public update(delta: number): void {
    if (!this._started) {
      this._started = true;
      this._elapsedTime = 0;
      (this._entity as Actor).graphics.material = this._material as Material;
    }
    if (!this._graphics) {
      return;
    }

    this._elapsedTime += delta;

    if (this._graphics) {
      console.log("updating");
      this._material?.update(shader => {
        shader.trySetUniformFloatColor("u_color", this._color);
        shader.trySetUniformInt("u_duration_ms", this._duration);
      });
    }

    if (this.isComplete()) {
      console.log("complete");
      console.log("entity", this._entity);

      //this._graphics.remove("flash-material");
    }
  }

  public isComplete(): boolean {
    return this._stopped || this._elapsedTime >= this._duration;
  }

  public stop(): void {
    if (this._graphics) {
      this._graphics.visible = true;
    }
    this._stopped = true;
  }

  public reset() {
    this._started = false;
    this._stopped = false;
    this._elapsedTime = 0;
  }
}
