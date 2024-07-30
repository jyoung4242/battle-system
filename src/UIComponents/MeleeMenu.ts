import { MeleeSequence } from "../Melee/Sequences/sequence";
//@ts-expect-error
import cursor from "../assets/cursor.svg";

export class MeleeMenu {
  public state: { sequences: MeleeSequence[]; showSequenceMenu: boolean };

  public static template = `
    <style>
        melee-menu {
            display: flex;
            flex-direction: column;
            gap: 8px;
            background-color: #ffffffD0;
            color: #333355;
            font-family: 'testfont';
            font-size: 20px;
            position: fixed; 
            width: auto;
            height:auto;
            bottom: 100px;
            left:250px;
            border: 4px solid white; 
            border-radius: 20px;
            padding: 10px;
            text-align: center;
        }

        melee-sequence {
            display: flex;
            gap: 8px;
        }
    </style>
    <melee-menu \${===state.showSequenceMenu}>
        <melee-sequence \${seq <=* state.sequences}>
            <img src=${cursor} style="transform: rotate(90deg) translateX(4px); opacity:\${seq.opacity};" width="16" height="16" />
            <span>\${seq.$index}: \${seq.name}</span>
        </melee-sequence>   
    </melee-menu>
    `;

  public constructor(state: { sequences: MeleeSequence[]; showSequenceMenu: boolean }) {
    this.state = state;
  }

  static create(state: { sequences: MeleeSequence[]; showSequenceMenu: boolean }) {
    return new MeleeMenu(state);
  }
}
