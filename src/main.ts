import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, TileMap } from "excalibur";
import { loader, mapSS } from "./assets/resource";
import { player } from "./Entities/player";
import { bandit1, bandit2, bandit3 } from "./Entities/bandit";
import { model, template } from "./UI";
import { JsfxrResource } from "@excaliburjs/plugin-jsfxr";
import { sounds } from "./lib/sounds";
import { KeyboardManager } from "./lib/Keyboard/Keyboard";
import { SelectorBinding } from "./lib/Keyboard/keybindings/selectorBinding";
import { PlayerBinding } from "./lib/Keyboard/keybindings/playerBinding";
import { GameMenuControl } from "./lib/Keyboard/keybindings/menuBinding";
import { noBindings } from "./lib/Keyboard/keybindings/noBindings";
import { TargetBinding } from "./lib/Keyboard/keybindings/targetSelect";
import { MeleeBindings } from "./lib/Keyboard/keybindings/meleeBindings";
import { MeleeTarget } from "./lib/Keyboard/keybindings/meleeTarget";
import { IncantationSounds } from "./lib/incantation";

export let sndPlugin = new JsfxrResource();
sndPlugin.init(); //initializes the JSFXR library
for (const sound in sounds) {
  sndPlugin.loadSoundConfig(sound, sounds[sound]);
}
for (const sound in IncantationSounds) {
  sndPlugin.loadSoundConfig(sound, IncantationSounds[sound]);
}

await UI.create(document.body, model, template).attached;
const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.Fixed, // the display mode
  pixelArt: true, // turn off anti-aliasing
});
model.registerEngine(game);

export const myKeyboardManager = new KeyboardManager(game);
myKeyboardManager.registerOwner(new SelectorBinding());
myKeyboardManager.registerOwner(new PlayerBinding());
myKeyboardManager.registerOwner(new GameMenuControl());
myKeyboardManager.registerOwner(new noBindings());
myKeyboardManager.registerOwner(new TargetBinding());
myKeyboardManager.registerOwner(new MeleeBindings());
myKeyboardManager.registerOwner(new MeleeTarget());
//myKeyboardManager.setOwner("player");

//@ts-ignore
model.inventory.model.init(myKeyboardManager, game);

const tilemap = new TileMap({
  tileWidth: 16,
  tileHeight: 16,
  rows: 10,
  columns: 10,
});

for (let tile of tilemap.tiles) {
  tile.addGraphic(mapSS.getSprite(0, 0));
}

await game.start(loader);
//@ts-ignore
model.instruction.model.binding(myKeyboardManager);
//@ts-ignore
model.instruction.model.state.isShowing = true;

game.currentScene.onPreUpdate = () => {
  myKeyboardManager.update();
};

game.add(tilemap);
game.add(player);
game.add(bandit1);
game.add(bandit2);
game.add(bandit3);

console.log(myKeyboardManager);
