import Phaser from "phaser";
import background from "../../asset/Designer.png";
import mainmenubg from "../../asset/menubg.png";
import playwithFriendButton from "../../asset/friend_button.png";
import playwithCpuButton from "../../asset/cpu_button.png";
import ball from "../../asset/cricket-ball.png";
import bat from "../../asset/cricket-bat.png";
class Preload extends Phaser.Scene {
  constructor() {
    super("preLoadScene");
  }
  preload() {
    this.load.image("background", background);
    this.load.image("mainbg", mainmenubg);
    this.load.image("cpu_button", playwithCpuButton);
    this.load.image("firendButton", playwithFriendButton);
    this.load.image("ball", ball);
    this.load.image("bat", bat);
  }
  create() {
    this.scene.start("mainMenu");
  }
}
export default Preload;
