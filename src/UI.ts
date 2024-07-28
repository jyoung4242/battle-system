import { Actor, Color, Engine, Rectangle, Tile, TileMap, Vector } from "excalibur";
//@ts-expect-error
import cursor from "./assets/cursor.svg";
import { sndPlugin } from "./main";
import { Bandit } from "./Entities/bandit";
import { Player, player } from "./Entities/player";
import { flashing } from "./assets/flashingtileanimations";
import { selector, Selector } from "./Entities/selector";
import { mainOptions, menuOptions } from "./Menu/options";
import { UI } from "@peasy-lib/peasy-ui";
import { MeleeSequence } from "./Melee/Sequences/sequence";

//Components
import { MeleeMenu } from "./UIComponents/MeleeMenu";

let soundPlaying: boolean = false;

export const model = {
  MeleeMenu,
  meleeMenu: undefined as undefined | MeleeMenu,
  meleedefault: {},
  showSequenceMenu: true,
  sequences: [new MeleeSequence("mySeq")] as any[],
  engineRef: undefined as Engine | undefined,
  registerEngine: (engine: Engine) => {
    //@ts-ignore
    model.engineRef = engine;
  },
  showSubmenu: false,
  showBattleQueue: false,
  showBattleMenu: false,
  turnorder: [] as Actor[],

  get battleMenuLeft() {
    if (model.showSubmenu) return 25;
    else return 200;
  },
  get currentTurn() {
    return this.turnorder[0] as Bandit | Player;
  },
  battlemenu: mainOptions,
  cursorIndex: 0,
  get currentBattleItem() {
    return this.battlemenu[this.cursorIndex];
  },
  showMessageText: false,
  messageText: "",
};
export const template = `
<style> 
    
    canvas{ 
        position: fixed; 
        top:50%; 
        left:50%; 
        transform: translate(-50% , -50%); 
    }
    ui-layer{ 
        position: fixed; 
        width: 800px;
        height: 600px;
        top:50%; 
        left:50%; 
        transform: translate(-50% , -50%); 
    }
    battle-queu{ 
        background-color: #ffffff70;
        position: fixed; 
        width: 400px;
        height:50px;
        top:5%; 
        left:50%; 
        transform: translate(-50% , 0%);
        border: 2px solid white; 
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 4px;
        overflow: hidden;
        padding-left: 2px;
    }

    .avatar:first-child{
        transform: scale(1.25);
        border: 2px solid red;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }    
        100% { transform: scale(1); }
    }

    .avatar{ 
        width: 34px;
        image-rendering: pixelated;
        border: 1px solid white;
        overflow: hidden;
    }

    player-card{
        background-color: #ffffff70;
        color: #333355;
        font-family: 'testfont';
        font-size: 26px;
        position: fixed; 
        width: 150px;
        height:200px;
        bottom: 204px;
        left:0; 
        border: 4px solid white; 
        border-radius: 0 20px 20px 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        overflow: hidden;
    }
    
    .cardavatar{ 
            margin-left: 20px;
            width: 64px;
            image-rendering: pixelated;
            border: 1px solid white;
            overflow: hidden;
    }

    battle-menu{
        background-color: #ffffff70;
        color: #333355;
        font-family: 'testfont';
        font-size: 26px;
        position: fixed; 
        width: 400px;
        height:200px;
        bottom: 0;
        left:0; 
        border: 4px solid white; 
        border-radius: 0 20px 0 0;
        
    }
    .battlegrid{
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(11, 1fr);
    }

    battlemenu-title{
        grid-column-start: 2;
        grid-column-end: 7;
        grid-row-start: 2;
        grid-row-end: 2;
        display: flex;
    }

    battlemenu-options{
        grid-column-start: 4;
        grid-column-end: 7;
        grid-row-start: 4;
        grid-row-end: 9;
    }

    .underlined{
        text-decoration: underline;
    }

    .disabled{
      color: #999999;
      cursor: not-allowed;
      
    }

     .cursor{
        position : absolute;
        width: 25px;
        height: 25px;
        top: -5px;
        left: -53px;
        z-index: 1;
        opacity: 1;
    }

    .menuoption{
        display: block;
        position: relative;
        transition: display 0.2s;      
    }
    .menuoption.pui-adding, .menuoption.pui-removing{
        display: none;
    }

    message-text{
     background-color: #ffffff70;
        color: #333355;
        font-family: 'testfont';
        font-size: 26px;
        position: fixed; 
        width: 387px;
        height:75px;
        bottom: 0;
        right:0; 
        border: 4px solid white; 
        border-radius: 20px 0 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
</style> 
<div> 
    
    <canvas id='cnv'> </canvas> 
    <ui-layer>
        <battle-queu \${===showBattleQueue}>
            <div class="avatar" style="background-color: \${avatar.avatarbackground};" \${avatar <=* turnorder:id}>
                <img src="\${avatar.avatar}" width="32" height="32"/>
            </div>
        </battle-queu>
        
        <battle-menu \${===showBattleMenu} class="battlegrid">  
            
            <battlemenu-title> \${currentTurn.name}'s Turn </battlemenu-title>
            <battlemenu-options>
                <div class="menuoption \${opt.styleText} \${opt.getDisableText}" \${opt <=* battlemenu} >\${opt.name}\${opt.submenu}
                  <div class="cursor" \${===opt.hasFocus}>
                      <img src="${cursor}" style="transform: rotate(90deg);"/>
                  </div>
                </div>
            </battlemenu-options>
        </battle-menu>
        
        <\${MeleeMenu:meleeMenu === meleedefault }>

        <player-card \${===showBattleQueue}>
            <div class="cardavatar" style="background-color: \${currentTurn.avatarbackground};" >
                <img src="\${currentTurn.avatar}" width="64" height="64"/>
            </div>
            <div style="margin-left: 20px;"> \${currentTurn.name} </div>
            <div style="margin-left: 20px;"> \${currentTurn.hp}/\${currentTurn.hpmax} </div>

        </player-card>

        <message-text \${===showMessageText}>
          <div> \${messageText} </div>    
        </message-text>

    </ui-layer>
</div>`;

export function moveCursorUp() {
  if (!soundPlaying) {
    sndPlugin.playSound("blip");
    soundPlaying = true;
    setTimeout(() => {
      soundPlaying = false;
    }, 100);
    const currentIndex = model.currentBattleItem.index;
    const nextIndex = currentIndex != 0 ? currentIndex - 1 : model.currentBattleItem.totalIndexes - 1;
    model.cursorIndex = nextIndex;
    manageFocus();
  }
}

export function moveCursorDown() {
  if (!soundPlaying) {
    sndPlugin.playSound("blip");
    soundPlaying = true;
    setTimeout(() => {
      soundPlaying = false;
    }, 100);
    const currentIndex = model.currentBattleItem.index;
    const nextIndex = currentIndex != model.currentBattleItem.totalIndexes - 1 ? currentIndex + 1 : 0;
    model.cursorIndex = nextIndex;
    manageFocus();
  }
}

export function moveCursorRight() {
  if (!soundPlaying) {
    sndPlugin.playSound("blip");
    soundPlaying = true;
    setTimeout(() => {
      soundPlaying = false;
    }, 100);
    const currentItem = model.currentBattleItem;
    if (currentItem.hasSubmenu) {
      //model.battlemenu = currentItem.hasSubmenu;
      model.battlemenu = [];
      UI.queue(() => {
        model.battlemenu = [...(currentItem.hasSubmenu as menuOptions)];
        manageFocus();
      });
      model.cursorIndex = 0;
    }
  }
}

export function moveCursorLeft() {
  if (!soundPlaying) {
    sndPlugin.playSound("blip");
    soundPlaying = true;
    setTimeout(() => {
      soundPlaying = false;
    }, 100);
    const currentItem = model.currentBattleItem;
    if (currentItem.hasParent) {
      ///model.battlemenu = currentItem.hasParent;
      model.battlemenu = [];
      UI.queue(() => {
        model.battlemenu = [...(currentItem.hasParent as menuOptions)];
        manageFocus();
      });
      model.cursorIndex = 0;
    }
  }
}

export function menuSelect(engine: Engine) {
  if (!soundPlaying) {
    if (model.currentBattleItem.isDisabled) {
      sndPlugin.playSound("badtile");
      return;
    }
    sndPlugin.playSound("blip");
    soundPlaying = true;
    setTimeout(() => {
      soundPlaying = false;
    }, 100);
    //model.currentBattleItem.action(engine);
    const menuCustomevent = new CustomEvent("battleMenuSelection", {
      detail: {
        engine: engine,
        selection: model.currentBattleItem.name,
      },
    });
    document.dispatchEvent(menuCustomevent);
  }
}

function manageFocus() {
  if (model.battlemenu.length > 0) {
    model.battlemenu.forEach(el => {
      el.hasFocus = false;
      el.styleText = "";
    });
    model.battlemenu[model.cursorIndex].hasFocus = true;
    model.battlemenu[model.cursorIndex].styleText = "underlined";
    return "";
  }
}

/*

<style>
          sequence-menu{
            
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
        </style>

        <sequence-menu \${===showSequenceMenu}>
            <div  \${seq <=* sequences} style="display: flex; gap: 8px;">
                 <img src="${cursor}" style="transform: rotate(90deg) translateX(4px); opacity:\${seq.opacity};" width="16" height="16" />
                <span>\${seq.$index}: \${seq.name}</span>
            </div>
        </sequence-menu>

*/
