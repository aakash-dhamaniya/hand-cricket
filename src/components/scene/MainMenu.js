import Phaser from "phaser";
class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "mainMenu" });
  }

  create() {
    this.add.image(0, 0, "mainbg").setOrigin(0);
    const playWithCpuButton = this.add
      .image(400, 300, "cpu_button")
      .setScale(0.1);
    const playWithFriendButton = this.add
      .image(600, 300, "firendButton")
      .setScale(0.1);
    playWithCpuButton.setInteractive({ useHandCursor: true });
    playWithFriendButton.setInteractive({ useHandCursor: true });
    playWithCpuButton.on("pointerdown", () => {
      // Transition to the Play scene (with CPU logic)
      const playerTurn = this.randomToss();
     
      this.scene.start("CoinTossScene", { mode: "cpu", playerTurn }); // Pass data to Play scene
    });
  }
  randomToss() {
    let plyaers = ["player1", "player2"];
    const turn = Phaser.Math.Between(0, 1);
    return plyaers[turn];
  }
}
export default MainMenu;
