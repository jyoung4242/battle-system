import { Engine, KeyEvent, Keys, Subscription } from "excalibur";
import { ExState } from "../lib/ExFSM";
import { KeyboardManager } from "../lib/Keyboard/Keyboard";

//@ts-expect-error
import potion from "../assets/redpotion.png";
//@ts-expect-error
import key from "../assets/key.png";
//@ts-expect-error
import book from "../assets/boook.png";
//@ts-expect-error
import coin from "../assets/coin.png";

type InventorySlot = {
  name?: string;
  qty?: number;
  isHighlighted?: boolean;
  sprite?: string;
  isEmpty: boolean;
  hotkey: number;
};

type InventoryItem = {
  name: string;
  qty: number;
  sprite: string;
};

type InventoryState = {
  isShowing: boolean;
  inventory: Record<string, InventoryItem>;
};

export class Inventory {
  public state: InventoryState = {
    isShowing: false,
    inventory: {
      Potion: {
        name: "Potion",
        qty: 3,
        sprite: potion,
      },
      Book: {
        name: "Book",
        qty: 1,
        sprite: book,
      },
      Key: {
        name: "Key",
        qty: 2,
        sprite: key,
      },
      Coin: {
        name: "Coin",
        qty: 42,
        sprite: coin,
      },
    },
  };
  slots: InventorySlot[] = [
    { isEmpty: true, hotkey: 1 },
    { isEmpty: true, hotkey: 2 },
    { isEmpty: true, hotkey: 3 },
    { isEmpty: true, hotkey: 4 },
  ];
  keyboardManager: KeyboardManager | undefined;
  engine: Engine | undefined;

  public static template = `
    <style>
        inventory-component {
            width: 500px;
            height: 250px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 4px solid white;
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        rel-div > span {
            position: absolute;
            padding : 8px;
            font-size: 24px;
            color: whitesmoke;
            font-family: 'testfont';
        }

        .hotkeyLabel{
            position: absolute;
            top: 46px;
            left: 0px;
            font-size: 16px;
            color: whitesmoke;
            font-family: 'testfont';
        }

        rel-div {
            position: relative;
            width: 100%;
            height: 100%;
        }

        slot-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px
        }

        slot-unit{
            position: relative;
            width:85px;
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 4px solid white;
            border-radius: 20px;
            image-rendering: pixelated;
            padding: 2px;
        }

        component-label {
            width: 100%;
            position: absolute;
            font-size: 14px;
            color: whitesmoke;
            font-family: 'testfont';
            bottom: -22px;
            left: 0px;
            text-align: center;
        }

        .hotkey-label{
            font-size: 18px;
            position: absolute;
            width: 100%; 
            text-align: center;
            top: -28px;
            font-weight: bold;
        }

    </style>
    <inventory-component \${===state.isShowing}>
        <rel-div>
            <span>Inventory</span>
            <span class="hotkeyLabel">Hotkeys: </span>
            <slot-container>
                <slot-unit  name="inventory" \${slot<=*slots} style="\${highlight == slot.isHighlighted}">
                <hot-key class="hotkey-label">\${slot.hotkey}</hot-key>
                    <empty-component \${===slot.isEmpty}></empty-component>
                    <loaded-component \${!==slot.isEmpty}>
                        
                        <img src="\${slot.sprite}" width="75px height="75px"/>
                        <component-label>
                        \${slot.name}  qty: \${slot.qty}
                        </component-label>
                    </loaded-component>
                </slot-unit>
            </slot-container>
        </rel-div>
        
    </inventory-component>
    `;

  constructor(state: { inventory: Record<string, InventoryItem>; isShowing: boolean }) {
    this.state = state;

    setInterval(() => {
      this.update();
    }, 100);
  }

  static create(state: { inventory: Record<string, InventoryItem>; isShowing: boolean }) {
    return new Inventory(state);
  }

  init(binding: KeyboardManager, engine: Engine) {
    this.keyboardManager = binding;
    if (!this.keyboardManager.isRegistered("inventory")) this.keyboardManager.registerOwner(new inventoryBinding());
    this.engine = engine;
  }

  enableBinding() {
    console.log("binding inventory");

    this.keyboardManager?.setOwner("inventory", this);
  }

  addItem(item: InventoryItem) {
    if (this.state.inventory[item.name]) {
      //exists
      this.state.inventory[item.name].qty += item.qty;
    } else {
      this.state.inventory[item.name] = item;
    }
  }

  useItem(item: InventoryItem) {
    console.log("using item: ", item);

    if (!item.name) return;
    if (this.state.inventory[item.name]) {
      this.state.inventory[item.name].qty -= 1;
      if (this.state.inventory[item.name].qty <= 0) {
        this.state.inventory[item.name].qty = 0;
      }
    }
  }

  update() {
    if (this.state.isShowing == false) return;
    //check if inventory of a slot is empty
    this.slots.forEach(slot => {
      if (!slot.name) return;
      if (this.state.inventory[slot.name]) {
        if (this.state.inventory[slot.name].qty <= 0) {
          //clean out inventory slot
          slot.name = "";
          slot.qty = 0;
          slot.isHighlighted = false;
          slot.isEmpty = true;
        }
      }
    });

    //check all good inventory to see if assigned to slot
    Object.keys(this.state.inventory).forEach(key => {
      const item = this.state.inventory[key];
      if (item.qty > 0) {
        const slot = this.slots.find(slot => slot.name == item.name);
        if (slot) {
          slot.name = item.name;
          slot.qty = item.qty;
          slot.isEmpty = false;
          slot.sprite = item.sprite;
        } else {
          //find next empty slot and assign it
          const emptySlot = this.slots.find(slot => slot.isEmpty);
          if (emptySlot) {
            emptySlot.name = item.name;
            emptySlot.qty = item.qty;
            emptySlot.isEmpty = false;
            emptySlot.sprite = item.sprite;
          }
        }
      }
    });
  }
}

class inventoryBinding extends ExState {
  handler: Subscription | undefined;
  constructor() {
    super("inventory");
  }
  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    const invenotry = params[1][0] as Inventory;

    this.handler = engine.input.keyboard.on("press", (evt: KeyEvent) => {
      if (evt.key === Keys.Digit1) {
        const itemName = invenotry.slots[0].name;
        if (!itemName) return;
        const item = invenotry.state.inventory[itemName];
        invenotry.useItem(item);
        const event = new CustomEvent("itemSelected", {
          detail: {
            item,
            status: "selected",
          },
        });
        document.dispatchEvent(event);
      }
      if (evt.key === Keys.Digit2) {
        const itemName = invenotry.slots[1].name;
        if (!itemName) return;
        const item = invenotry.state.inventory[itemName];
        invenotry.useItem(item);
        const event = new CustomEvent("itemSelected", {
          detail: {
            item,
            status: "selected",
          },
        });
        document.dispatchEvent(event);
      }
      if (evt.key === Keys.Digit3) {
        const itemName = invenotry.slots[2].name;
        if (!itemName) return;
        const item = invenotry.state.inventory[itemName];
        invenotry.useItem(item);
        const event = new CustomEvent("itemSelected", {
          detail: {
            item,
            status: "selected",
          },
        });
        document.dispatchEvent(event);
      }
      if (evt.key === Keys.Digit4) {
        const itemName = invenotry.slots[3].name;
        if (!itemName) return;
        const item = invenotry.state.inventory[itemName];
        invenotry.useItem(item);
        const event = new CustomEvent("itemSelected", {
          detail: {
            item,
            status: "selected",
          },
        });
        document.dispatchEvent(event);
      }
      if (evt.key === Keys.Escape) {
        invenotry.state.isShowing = !invenotry.state.isShowing;
        invenotry.keyboardManager?.setOwner("main");
        const event = new CustomEvent("itemSelected", {
          detail: {
            item: null,
            status: "cancel",
          },
        });
        document.dispatchEvent(event);
      }
    });
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    this.handler?.close();
  }
}
