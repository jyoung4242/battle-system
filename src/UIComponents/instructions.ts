import { Engine, KeyEvent, Keys, Subscription } from "excalibur";
import { ExState } from "../lib/ExFSM";
import { KeyboardManager } from "../lib/Keyboard/Keyboard";

export class InstructionsComponent {
  closeInstructions = () => {
    console.log("close instructions");

    this.km?.setOwner("player");
    this.state.isShowing = false;
    console.log(this.km);
  };

  km: KeyboardManager | undefined;

  state: { isShowing: boolean } = {
    isShowing: false,
  };

  public static template = `
  <style>
  instruction-component{
    width: 800px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50% , -50%);
    background-color: #ffffffd0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1px;
    z-index: 100;
    color: #1111ee;
    font-family: 'testfont';
    font-size: 18px;
    
  }
  </style>
<instruction-component \${===state.isShowing}>
    <p style="text-decoration: underline; font-size: 24px;">Instructions</p>
    <p>Use Arrow Keys for navigation</p>
    <p>Use Enter Key for selection</p>
     <p>Use Escape Key to cancel</p>
    <p>For Inventory, use 1-4 as Hotkeys</p>
    <p>For the attack meter, time your enter press when the outer rectangle</p>
    <p>is inside the target rectangles</p>
    <p>For the incantation, use Arrow Keys and Enter key to enter the sequence</p>
    <p>at the proper time</p>
    <p>Ranged and Melee attacks use Attack Meter, spells use Incantatios</P>

    <button \${click@=>closeInstructions}>Close</button>
</instruction-component>
`;

  constructor(state: { isShowing: boolean }) {
    this.state = state;
    document.addEventListener(
      "instructionsClick",
      (e: Event) => {
        this.closeInstructions();
      },
      { once: true }
    );
  }

  binding = (KM: KeyboardManager) => {
    this.km = KM;
    this.km.registerOwner(new instructionBinding());
    this.km.setOwner("instructions", this);
    console.log(this.km);
  };

  static create(state: { isShowing: boolean }): InstructionsComponent {
    return new InstructionsComponent(state);
  }
}

class instructionBinding extends ExState {
  handler: Subscription | undefined;
  constructor() {
    super("instructions");
  }

  enter(_previous: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;

    this.handler = engine.input.keyboard.on("press", (evt: KeyEvent) => {
      if (evt.key === Keys.Enter) {
        const event = new CustomEvent("instructionsClick");
        document.dispatchEvent(event);
      }
    });
  }
  exit(_next: ExState | null, ...params: any): void | Promise<void> {
    const engine = params[0] as Engine;
    this.handler?.close();
  }
}
