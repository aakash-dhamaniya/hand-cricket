import Phaser from "phaser";
class CoinTossScene extends Phaser.Scene {
  constructor() {
    super({ key: "CoinTossScene" });
    this.coin = ["Head", "Tails"];
  }
  create() {
    // Create the "Heads" button

    const { mode, playerTurn } = this.scene.settings.data;
    if (playerTurn === "player1") {
      this.createButtons();
    } else {
      this.add.text(0, 400, "wait for player two to select....", {
        fontSize: "50px",
        color: "white",
      });
      const tossResult = this.botTurn();
      if (tossResult) {
        const choose = this.botDesicion();
        console.log("bot choose=>>",choose);
        if(choose==="bat"){
          this.scene.start("play", {
            currentBatting: "player2",
            currentBowlling: "player1",
          });
          return
        }
        if(choose==="bowl"){
          this.scene.start("play", {
            currentBatting: "player1",
            currentBowlling: "player2",
          });
        }
        
      } else {
        this.iningPopup();
      }
    }
    console.log(mode, playerTurn);
  }
  createButtons() {
    let headsButton = this.add
      .text(100, 200, "Head", { fontSize: "32px", backgroundColor: "#0f0" })
      .setInteractive()
      .on("pointerdown", () => this.selectOption("Head"));

    // Create the "Tails" button
    let tailsButton = this.add
      .text(300, 200, "Tails", { fontSize: "32px", backgroundColor: "#f00" })
      .setInteractive()
      .on("pointerdown", () => this.selectOption("Tails"));

    // This function is called when either button is clicked
    this.selectOption = (option) => {
      console.log(`${option} selected!`);
      const tossResult = this.tossCoin(option);
      console.log(tossResult);
      if (tossResult) {
        this.iningPopup();
      }
      else{
       const decision= this.botDesicion()
        if(decision==="bat"){
          this.scene.start("play", {
            currentBatting: "player2",
            currentBowlling: "player1",
          });
        }
        else{
          this.scene.start("play", {
            currentBatting: "player1",
            currentBowlling: "player2",
          });
        }
       console.log("botDecision",decision); 
      }
      console.log(tossResult);

      // Add any additional logic here for what happens when an option is selected
    };
  }
  botTurn() {
    const botChoose = Phaser.Math.Between(1, 2);
    return this.tossCoin(this.coin[botChoose]);
  }
  tossCoin(option) {
    const flipResuilt = Phaser.Math.Between(0, 1);

    if (option === this.coin[flipResuilt]) {
      return true;
    } else {
      return false;
    }
  }
  botDesicion() {
    const batBall = ["bat", "bowl"];
    const decision = Phaser.Math.Between(0, 1);
    return batBall[decision];
  }
  iningPopup() {
    // Create a container for the popup
    var container = this.add.container(400, 300);

    // Create a white background
    var background = this.add.graphics();
    background.fillStyle(0xffffff);
    background.fillRect(-150, -100, 300, 200);
    container.add(background);

    // Add text
    var text = this.add.text(
      0,
      -50,
      "You have won the toss! Choose batting or bowling:",
      { fontFamily: "Arial", fontSize: "16px", color: "#000", align: "center" }
    );
    text.setOrigin(0.5);
    container.add(text);

    // Add buttons
    var batButton = this.add.text(-50, 0, "Bat", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#000",
      backgroundColor: "#fff",
      padding: { x: 10, y: 5 },
    });
    batButton.setOrigin(0.5);
    batButton.setInteractive();
    batButton.on("pointerdown", function () {
      console.log("You chose to bat!");
    
      this.scene.start("play", {
        currentBatting: "player1",
        currentBowlling: "player2",
      });
      // Close the popup
      container.destroy();
    },this);
    container.add(batButton);

    var bowlButton = this.add.text(50, 0, "Bowling", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#000",
      backgroundColor: "#fff",
      padding: { x: 10, y: 5 },
    });
    bowlButton.setOrigin(0.5);
    bowlButton.setInteractive();
    bowlButton.on("pointerdown", function () {
      console.log("You chose to bowl!");
      
      this.scene.start("play", {
        currentBatting: "player2",
        currentBowlling: "player1",
      });
      // Close the popup
      container.destroy();
    },this);
    container.add(bowlButton);
  }
}

export default CoinTossScene;
