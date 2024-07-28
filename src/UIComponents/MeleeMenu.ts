import { MeleeSequence } from "../Melee/Sequences/sequence";
//@ts-expect-error
import cursor from "../assets/cursor.svg";

export class MeleeMenu {
  public sequences: MeleeSequence[] = [];
  public showSequenceMenu: boolean = false;

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
    <melee-menu \${===showSequenceMenu}>
        <melee-sequence \${seq <=* sequences}>
            <img src=${cursor} style="transform: rotate(90deg) translateX(4px); opacity:\${seq.opacity};" width="16" height="16" />
            <span>\${seq.$index}: \${seq.name}</span>
        </melee-sequence>   
    </melee-menu>
    `;

  public constructor() {}

  static create() {
    return new MeleeMenu();
  }
}

/* 
<sequence-menu \${===showSequenceMenu}>
<div  \${seq <=* sequences} style="display: flex; gap: 8px;">
     <img src="${cursor}" style="transform: rotate(90deg) translateX(4px); opacity:\${seq.opacity};" width="16" height="16" />
    <span>\${seq.$index}: \${seq.name}</span>
</div>
</sequence-menu> */
