# Diff Details

Date : 2024-08-09 16:41:40

Directory c:\\programming\\game systems\\battle system\\src

Total : 57 files,  3467 codes, 161 comments, 414 blanks, all 4042 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/BattleEvents/BattleEvent.ts](/src/BattleEvents/BattleEvent.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/BattleEvents/Events/AttackMeter.ts](/src/BattleEvents/Events/AttackMeter.ts) | TypeScript | 34 | 0 | 3 | 37 |
| [src/BattleEvents/Events/CastMatterEvent.ts](/src/BattleEvents/Events/CastMatterEvent.ts) | TypeScript | 36 | 0 | 5 | 41 |
| [src/BattleEvents/Events/DissolveEvent.ts](/src/BattleEvents/Events/DissolveEvent.ts) | TypeScript | 57 | 1 | 8 | 66 |
| [src/BattleEvents/Events/GetMenuSelection.ts](/src/BattleEvents/Events/GetMenuSelection.ts) | TypeScript | 21 | 0 | 1 | 22 |
| [src/BattleEvents/Events/KnifeThrow.ts](/src/BattleEvents/Events/KnifeThrow.ts) | TypeScript | 40 | 0 | 4 | 44 |
| [src/BattleEvents/Events/LungeEvent.ts](/src/BattleEvents/Events/LungeEvent.ts) | TypeScript | 41 | 2 | 6 | 49 |
| [src/BattleEvents/Events/MoveActorsToNearestTile.ts](/src/BattleEvents/Events/MoveActorsToNearestTile.ts) | TypeScript | -1 | 1 | 0 | 0 |
| [src/BattleEvents/Events/RangedAttack.ts](/src/BattleEvents/Events/RangedAttack.ts) | TypeScript | 28 | 0 | 5 | 33 |
| [src/BattleEvents/Events/RangedLoadEvent.ts](/src/BattleEvents/Events/RangedLoadEvent.ts) | TypeScript | 17 | 0 | 3 | 20 |
| [src/BattleEvents/Events/applyEffect.ts](/src/BattleEvents/Events/applyEffect.ts) | TypeScript | 23 | 0 | 4 | 27 |
| [src/BattleEvents/Events/castTime.ts](/src/BattleEvents/Events/castTime.ts) | TypeScript | 37 | 0 | 5 | 42 |
| [src/BattleEvents/Events/checkIfEnemyDead.ts](/src/BattleEvents/Events/checkIfEnemyDead.ts) | TypeScript | 74 | 1 | 9 | 84 |
| [src/BattleEvents/Events/closeBattleMenu.ts](/src/BattleEvents/Events/closeBattleMenu.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [src/BattleEvents/Events/closeInventory.ts](/src/BattleEvents/Events/closeInventory.ts) | TypeScript | 35 | 2 | 4 | 41 |
| [src/BattleEvents/Events/endBattle.ts](/src/BattleEvents/Events/endBattle.ts) | TypeScript | 16 | 0 | 4 | 20 |
| [src/BattleEvents/Events/itemEffectEvent.ts](/src/BattleEvents/Events/itemEffectEvent.ts) | TypeScript | 64 | 7 | 10 | 81 |
| [src/BattleEvents/Events/magicBulletEffect.ts](/src/BattleEvents/Events/magicBulletEffect.ts) | TypeScript | 38 | 0 | 7 | 45 |
| [src/BattleEvents/Events/magicBulletEvent.ts](/src/BattleEvents/Events/magicBulletEvent.ts) | TypeScript | 57 | 0 | 8 | 65 |
| [src/BattleEvents/Events/magicIncantation.ts](/src/BattleEvents/Events/magicIncantation.ts) | TypeScript | 46 | 2 | 6 | 54 |
| [src/BattleEvents/Events/magicPose.ts](/src/BattleEvents/Events/magicPose.ts) | TypeScript | 26 | 2 | 5 | 33 |
| [src/BattleEvents/Events/meleeAttack.ts](/src/BattleEvents/Events/meleeAttack.ts) | TypeScript | 69 | 3 | 11 | 83 |
| [src/BattleEvents/Events/moveCamera.ts](/src/BattleEvents/Events/moveCamera.ts) | TypeScript | 19 | 0 | 4 | 23 |
| [src/BattleEvents/Events/pipelineTextMessageEvent.ts](/src/BattleEvents/Events/pipelineTextMessageEvent.ts) | TypeScript | 27 | 1 | 5 | 33 |
| [src/BattleEvents/Events/showInventory.ts](/src/BattleEvents/Events/showInventory.ts) | TypeScript | 35 | 2 | 7 | 44 |
| [src/BattleEvents/Events/timeEffectEvent.ts](/src/BattleEvents/Events/timeEffectEvent.ts) | TypeScript | 42 | 0 | 6 | 48 |
| [src/BattleManager.ts](/src/BattleManager.ts) | TypeScript | 229 | 9 | 32 | 270 |
| [src/Entities/attackMeter.ts](/src/Entities/attackMeter.ts) | TypeScript | 114 | 5 | 22 | 141 |
| [src/Entities/bandit.ts](/src/Entities/bandit.ts) | TypeScript | 152 | 36 | 23 | 211 |
| [src/Entities/knife.ts](/src/Entities/knife.ts) | TypeScript | 35 | 0 | 4 | 39 |
| [src/Entities/magicBullet.ts](/src/Entities/magicBullet.ts) | TypeScript | 35 | 0 | 4 | 39 |
| [src/Entities/player.ts](/src/Entities/player.ts) | TypeScript | 209 | 5 | 25 | 239 |
| [src/Entities/selector.ts](/src/Entities/selector.ts) | TypeScript | 37 | 2 | 10 | 49 |
| [src/Menu/options.ts](/src/Menu/options.ts) | TypeScript | 53 | -3 | 3 | 53 |
| [src/UI.ts](/src/UI.ts) | TypeScript | 87 | 5 | 9 | 101 |
| [src/UIComponents/inventory.ts](/src/UIComponents/inventory.ts) | TypeScript | 302 | 9 | 30 | 341 |
| [src/assets/bulleteffect.ts](/src/assets/bulleteffect.ts) | TypeScript | 31 | 0 | 2 | 33 |
| [src/assets/magicbullet.ts](/src/assets/magicbullet.ts) | TypeScript | 31 | 0 | 2 | 33 |
| [src/assets/matterMagicanimation.ts](/src/assets/matterMagicanimation.ts) | TypeScript | 75 | 0 | 2 | 77 |
| [src/assets/playeranimations.ts](/src/assets/playeranimations.ts) | TypeScript | 184 | 0 | 12 | 196 |
| [src/assets/potionEffectAnimation.ts](/src/assets/potionEffectAnimation.ts) | TypeScript | 95 | 0 | 2 | 97 |
| [src/assets/resource.ts](/src/assets/resource.ts) | TypeScript | 89 | 18 | 6 | 113 |
| [src/assets/timeAnimations.ts](/src/assets/timeAnimations.ts) | TypeScript | 95 | 0 | 2 | 97 |
| [src/assets/timeeffect.ts](/src/assets/timeeffect.ts) | TypeScript | 35 | 0 | 2 | 37 |
| [src/lib/Actions/flash.ts](/src/lib/Actions/flash.ts) | TypeScript | 71 | 0 | 13 | 84 |
| [src/lib/ExFSM.ts](/src/lib/ExFSM.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [src/lib/Keyboard/Keyboard.ts](/src/lib/Keyboard/Keyboard.ts) | TypeScript | 24 | 0 | 8 | 32 |
| [src/lib/Keyboard/keybindings/meleeBindings.ts](/src/lib/Keyboard/keybindings/meleeBindings.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/lib/Keyboard/keybindings/meleeTarget.ts](/src/lib/Keyboard/keybindings/meleeTarget.ts) | TypeScript | 23 | 0 | 5 | 28 |
| [src/lib/Keyboard/keybindings/menuBinding.ts](/src/lib/Keyboard/keybindings/menuBinding.ts) | TypeScript | 1 | 0 | -1 | 0 |
| [src/lib/Keyboard/keybindings/noBindings.ts](/src/lib/Keyboard/keybindings/noBindings.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/lib/Keyboard/keybindings/playerBinding.ts](/src/lib/Keyboard/keybindings/playerBinding.ts) | TypeScript | 2 | 0 | -1 | 1 |
| [src/lib/Keyboard/keybindings/selectorBinding.ts](/src/lib/Keyboard/keybindings/selectorBinding.ts) | TypeScript | 18 | 0 | 3 | 21 |
| [src/lib/Keyboard/keybindings/targetSelect.ts](/src/lib/Keyboard/keybindings/targetSelect.ts) | TypeScript | 1 | 1 | -1 | 1 |
| [src/lib/Keyboard/keyboard.ts](/src/lib/Keyboard/keyboard.ts) | TypeScript | -21 | 0 | -7 | -28 |
| [src/lib/incantation.ts](/src/lib/incantation.ts) | TypeScript | 544 | 48 | 66 | 658 |
| [src/main.ts](/src/main.ts) | TypeScript | 10 | 2 | 3 | 15 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details