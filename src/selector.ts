import { Actor, Color, Engine, Rectangle, Tile, Vector } from "excalibur";
import { myKeyboardManager, sndPlugin } from "./main";
import { player } from "./player";
import { disableMenu } from "./Menu/options";

export class Selector extends Actor {
  selectorRect: Rectangle;
  availableTileRect: Rectangle;
  keypresslatch: boolean = false;
  constructor(startingposition: Vector, public availableTiles: Tile[]) {
    super({
      x: startingposition.x,
      y: startingposition.y + 8,
      width: 16,
      height: 16,
    });
    this.z = 1;
    //selector.anchor = new Vector(0, 0);
    this.name = "selector";

    this.selectorRect = new Rectangle({
      width: 16,
      height: 16,
      color: Color.fromRGB(0, 255, 0, 0.6),
    });
    this.availableTileRect = new Rectangle({
      width: 16,
      height: 16,
      color: Color.fromRGB(255, 255, 255, 0.6),
    });

    this.graphics.use(this.selectorRect);
  }

  onInitialize(engine: Engine) {
    console.log(this.availableTiles);
    console.log(this.availableTileRect);

    this.availableTiles.forEach(tile => {
      tile.addGraphic(this.availableTileRect);
    });
  }

  setAvailableTiles(tiles: Tile[]) {
    this.availableTiles = tiles;
  }

  setPosition(position: Vector) {
    this.pos.x = position.x;
    this.pos.y = position.y + 8;
  }

  changeColor(color: Color) {
    this.selectorRect.color = color;
  }

  moveUp(engine: Engine) {
    const tilemap = engine.currentScene.tileMaps[0];
    const currentTile: Tile | undefined = tilemap.tiles.find(tile => tile.pos.x == this.pos.x - 8 && tile.pos.y == this.pos.y - 8);
    if (currentTile) {
      const nexttileIndex = tilemap.tiles.findIndex(tile => tile.x == currentTile.x && tile.y == currentTile.y - 1);
      if (nexttileIndex == -1) {
        sndPlugin.playSound("badtile");
        return;
      }
      const nexttile = tilemap.tiles[nexttileIndex];
      this.moveSelector(engine, nexttile);
    }
  }
  moveDown(engine: Engine) {
    const tilemap = engine.currentScene.tileMaps[0];

    const currentTile: Tile | undefined = tilemap.tiles.find(tile => tile.pos.x == this.pos.x - 8 && tile.pos.y == this.pos.y - 8);
    if (currentTile) {
      const nexttileIndex = tilemap.tiles.findIndex(tile => tile.x == currentTile.x && tile.y == currentTile.y + 1);
      if (nexttileIndex == -1) {
        sndPlugin.playSound("badtile");
        return;
      }
      const nexttile = tilemap.tiles[nexttileIndex];
      this.moveSelector(engine, nexttile);
    }
  }
  moveLeft(engine: Engine) {
    const tilemap = engine.currentScene.tileMaps[0];
    const currentTile: Tile | undefined = tilemap.tiles.find(tile => tile.pos.x == this.pos.x - 8 && tile.pos.y == this.pos.y - 8);

    if (currentTile) {
      const nexttileIndex = tilemap.tiles.findIndex(tile => tile.x == currentTile.x - 1 && tile.y == currentTile.y);
      if (nexttileIndex == -1) {
        sndPlugin.playSound("badtile");
        return;
      }
      const nexttile = tilemap.tiles[nexttileIndex];
      this.moveSelector(engine, nexttile);
    }
  }
  moveRight(engine: Engine) {
    const tilemap = engine.currentScene.tileMaps[0];
    const currentTile: Tile | undefined = tilemap.tiles.find(tile => tile.pos.x == this.pos.x - 8 && tile.pos.y == this.pos.y - 8);
    if (currentTile) {
      const nexttileIndex = tilemap.tiles.findIndex(tile => tile.x == currentTile.x + 1 && tile.y == currentTile.y);
      if (nexttileIndex == -1) {
        sndPlugin.playSound("badtile");
        return;
      }
      const nexttile = tilemap.tiles[nexttileIndex];
      this.moveSelector(engine, nexttile);
    }
  }

  moveSelector(engine: Engine, tile: Tile) {
    sndPlugin.playSound("tileblip");
    this.pos.x = tile.pos.x + 8;
    this.pos.y = tile.pos.y + 8;
    this.checkTile(engine);
  }

  checkTile(engine: Engine) {
    const tilemap = engine.currentScene.tileMaps[0];
    const currentTile: Tile | undefined = tilemap.tiles.find(tile => tile.pos.x == this.pos.x - 8 && tile.pos.y == this.pos.y - 8);

    if (currentTile) {
      if (this.availableTiles.includes(currentTile)) {
        this.changeColor(Color.fromRGB(0, 255, 0, 0.6));
      } else {
        this.changeColor(Color.fromRGB(255, 0, 0, 0.6));
      }
    }
  }

  selectTile(engine: Engine) {
    const tilemap = engine.currentScene.tileMaps[0];
    const currentTile: Tile | undefined = tilemap.tiles.find(tile => tile.pos.x == this.pos.x - 8 && tile.pos.y == this.pos.y - 8);
    if (!currentTile) return;
    player.newTileLocation(this);
    this.availableTiles.forEach(tile => {
      tile.removeGraphic(this.availableTileRect);
    });
    myKeyboardManager.setOwner("battlemenu");
    engine.currentScene.remove(this);
    disableMenu();
  }

  cancelSelection(engine: Engine) {
    this.availableTiles.forEach(tile => {
      tile.removeGraphic(this.availableTileRect);
    });
    myKeyboardManager.setOwner("battlemenu");
    engine.currentScene.remove(this);
  }
}

export let selector: Selector;

setTimeout(() => {
  selector = new Selector(new Vector(0, 0), []);
}, 1000);
