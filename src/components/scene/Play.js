import Phaser from "phaser";
class Play extends Phaser.Scene {
  constructor() {
    super({ key: "play" });
    this.isDisaplayingNumber = false;
    this.turn = "player1";
    this.player1Score = 0;
    this.player2Score = 0;
    this.currentBatting = "player1";
    this.currentBolling = "player2";
    this.inning = 1;
    const matchStates = {
      innning: 1,
      currentBatting: this.currentBatting,
      currentBalling: this.currentBalling,
    };
    this.over = 0;
    this.scoreX = 31;
    this.scorey = 210;
    this.inningChangeIs = false;
    this.gameOver = false;
    this.score = 0;
    this.battingCount = 0;
    // this.player1;
    // this.player2;
  }

  create() {
    const image = this.add.image(0, 0, "background").setOrigin(0, 0);
    this.createButtons(this);
    //create boards for player and enemy
    this.input.on(
      "pointerdown",
      (location) => {
        // console.log(location.x, location.y);
      },
      this
    );
    this.createBoard();
    this.inningPopup = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );
    this.inningPopup.setVisible(false); // Initially hide the popup
    this.inningText = this.add.text(0, 0, "Inning Change!", {
      fontSize: 50,
      color: "black",
    });
    this.inningText.setOrigin(0.5, 0.5); // Center the text within the container
    this.inningPopup.add(this.inningText);
  }

  createButtons(scene) {
    const buttonWidth = 100; // Width of each button
    const buttonHeight = 40; // Height of each button
    const buttonPadding = 10; // Space between buttons
    const startY = scene.scale.height - buttonHeight - 20; // Position buttons 20px above the bottom of the screen
    const totalButtonsWidth = 6 * buttonWidth + 5 * buttonPadding; // Total width all buttons will occupy
    const startX = (scene.scale.width - totalButtonsWidth + 100) / 2; // Center buttons horizontally

    // Create each button
    for (let i = 1; i <= 6; i++) {
      let button = scene.add
        .rectangle(
          startX + (i - 1) * (buttonWidth + buttonPadding),
          startY,
          buttonWidth,
          buttonHeight,
          0xffffff // White background
        )
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.showNumberOnBoard(i));

      // Add text to button
      scene.add
        .text(button.x, button.y, String(i), {
          font: "20px Arial",
          fill: "#000",
        })
        .setOrigin(0.5, 0.5);
    }
  }
  async showNumberOnBoard(number) {
    // console.log("player==>", this.turn);
    if (this.isDisaplayingNumber) return;

    this.player1 = number;
    this.isDisaplayingNumber = true;

    if (this.turn === "player1") {
      const enemyValue = await this.botTurn();
      const roundWinner = this.CalculateRoundWinner(this.player1, enemyValue);
      // console.log(roundWinner);

      this.displayNumber(
        this.playerBoard.width / 2,
        this.playerBoard.y,
        this.player1
      );
      return;
    }

    // if (this.turn === "player2") {
    //   this.displayNumber(this.playerBoard.width + 550, this.playerBoard.y);
    //   this.turn = "player1";
    //   return;
    // }
  }

  createBoard() {
    this.playerBoard = this.add
      .rectangle(0, this.scale.height / 2, 300, 500, 0xffffff, 0.5)
      .setOrigin(0, 0.5);
    this.enemyBoard = this.add
      .rectangle(
        this.scale.width - 150,
        this.scale.height / 2,
        300,
        500,
        0xffffff,
        0.5
      )
      .setOrigin(0.5);
    // console.log(this.playerBoard.width);
    //plyer one text

    this.add
      .text(this.playerBoard.x, this.playerBoard.y - 250, "Plyer 1", {
        font: "50px bold",
        fill: "#000000",
      })
      .setOrigin(0, 0);
    //player two text
    this.add
      .text(this.enemyBoard.x - 150, this.playerBoard.y - 250, "Plyer 2", {
        font: "50px bold",
        fill: "#000000",
      })
      .setOrigin(0, 0);
    //for adding icons after player text//
    //enemy
    this.playerTwoStatebat = this.add.sprite(
      this.enemyBoard.x + 10,
      this.playerBoard.y - 225,
      "bat"
    );
    this.playerTwoStateball = this.add.sprite(
      this.enemyBoard.x + 10,
      this.playerBoard.y - 225,
      "ball"
    );
    this.playerTwoStatebat.setVisible(false);
    this.playerTwoStateball.setVisible(true);
    //player
    this.playerOneSateIbat = this.add.sprite(
      this.playerBoard.x + 150,
      this.playerBoard.y - 225,
      "bat"
    );
    this.playerOneSateIball = this.add.sprite(
      this.playerBoard.x + 150,
      this.playerBoard.y - 225,
      "ball"
    );
    this.playerOneSateIball.setVisible(false);
    this.playerOneSateIbat.setVisible(true);
    //scores

    this.scoreText = this.add.text(
      this.cameras.main.centerX - 25,
      50,
      `Score: ${this.score}`,
      {
        fontSize: 32,
        color: "green",
      }
    );
  }
  displayNumber(width, y, run) {
    let numberText = this.add.text(width, y, String(run), {
      font: "40px Arial",
      fill: "#000",
    });
    this.distroyNumber(numberText);
  }
  distroyNumber(numberText) {
    this.time.delayedCall(2000, () => {
      numberText.destroy("resolve");
      this.isDisaplayingNumber = false;
    });
  }
  botTurn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const number = Phaser.Math.Between(1, 6);
        this.displayNumber(
          this.playerBoard.width + 550,
          this.playerBoard.y,
          number
        );
        this.turn = "player1";

        resolve(number);
      }, 0);
    });
  }
  CalculateRoundWinner(player1, player2) {
    if (player1 === player2) {
      this.over++;
      this.updateFinalScore();
      this.score = 0;
      this.scoreText.setText(`Score: ${this.score}`);
      if (this.inning === 2) {
        this.gameOverPopup();
      }
      if (this.inning === 1) {
        this.swapBatting();
        console.log(this.currentBatting, this.currentBolling);
      }

      return { name: "player1", run: "out" };
    } else {
      this.over++;
      this.increaseScore(player1);
      return { name: "player1", run: player1 };
    }
  }
  swapBatting() {
    this.over = 0;
    console.log(this.playerOneStateIcon);
    this.playerTwoStateball.setVisible(false);
    this.playerTwoStatebat.setVisible(true);
    this.playerOneSateIball.setVisible(true);
    this.playerOneSateIbat.setVisible(false);
    this.currentBatting = "player2";
    this.currentBolling = "player1";
    this.inningChangePopup("inning Change");
  }
  inningChangePopup(text) {
    this.inningPopup.setVisible(true); // Make the popup visible
    // Optional: Add a timer to automatically hide the popup after a delay (e.g., 2 seconds)
    this.inningText.setText(`${text}`);
    this.time.delayedCall(4000, () => this.inningPopup.setVisible(false));
  }
   gameOverPopup() {
    debugger
    const winner =
      this.player1 > this.player2 ? "player one won" : "player two won";
    this.inningChangePopup(winner);
  }
  increaseScore(points) {
    console.log(points);
    this.score += points;

    this.updateScoreText();
  }
  updateScoreText() {
    this.scoreText.setText(`Score: ${this.score}`);
  }
  updateFinalScore() {
    if (
      (this.inning === 1 && this.currentBatting === "player1") ||
      (this.inning === 2 && this.currentBatting === "player1")
    ) {
      this.player1Score = this.score;
    }
    if (
      (this.inning === 1 && this.currentBatting === "player2") ||
      (this.inning === 2 && this.currentBatting === "player2")
    ) {
      this.player2Score = this.score;
    }

    console.log("Scores are=>>>>", this.player1Score, this.player2Score);
   
  }

  update() {
    if (this.over === 6) {
      if(this.inning===1){
        this.updateFinalScore();
        this.score = 0;
        this.scoreText.setText(`Score: ${this.score}`);
        this.inning++;
        this.over = 0;
        this.swapBatting();
        return
      }
      if (this.inning === 2) {
        this.updateFinalScore();
        this.gameOverPopup();
        // this.scene.start("mainMenu")
      }
    }
    // if (this.inning === 2) {
    //   if (!this.inningChangeIs) {
    //     this.inningChangeIs = true;
    //     this.swapBatting();
    //   }
    // }
  }
}
export default Play;
