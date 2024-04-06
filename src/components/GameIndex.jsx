import React from "react";
import { useEffect } from "react";
import Phaser from "phaser";
import Preload from "./scene/Preload";
import Play from "./scene/Play";
import MainMenu from "./scene/MainMenu";
function GameIndex() {
  useEffect(() => {
    const Scene = [Preload, Play,MainMenu];
    const Shared_config = {
      width: 800,
      height: 600,
    };

    const createScene = (scene) => new scene(Shared_config);
    const initScene = () => Scene.map(createScene);
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        perent: "game-container",
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
      parent: "root",
      scene: initScene(),
    };
    const game = new Phaser.Game(config);
    return () => {
      game.destroy(true);
    };
  }, []);
  return <div className="root"></div>;
}

export default GameIndex;
