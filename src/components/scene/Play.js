import Phaser from "phaser";
class Play extends Phaser.Scene {
  constructor() {
    super({ key: "play" });
    this.isDisaplayingNumber = false;
    this.turn = "player1";
    this.player1Score = 0;
    this.player2Score = 0;
    this.currentBatting = null;
    this.currentBolling = null;
    this.inning = 1;
    this.over = 0;
    this.scoreX = 31;
    this.scorey = 210;
    this.inningChangeIs = false;
    this.gameOver = false;
    this.score = 0;
    this.battingCount = 0;
    this.player1ScoreX = 25;
    this.plyaer2ScoreX = 750;
    // this.player1;
    // this.player2;
  }
  // init() {
  //   const currentBatting = this.scene.data.get("currentBatting");
  //   const currentBowling = this.scene.data.get("currentBowling");
  //   console.log(currentBatting, currentBowling);
  // }
  create() {
    const { currentBatting, currentBowlling } = this.scene.settings.data;

    this.currentBatting = currentBatting;
    this.currentBolling = currentBowlling;

    this.add.image(0, 0, "background").setOrigin(0, 0);
    this.createButtons(this);
    //create boards for player and enemy

    this.createBoard();
    this.inningPopup = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );
    this.inningPopup.setVisible(false); // Initially hide the popup
    this.inningText = this.add.text(0, 0, "Inning Change!", {
      fontSize: "45px", // Increase the font size
      fontWeight: "bold", // Make the text bold
      color: "black",
    });
    let popupBackground = this.add.rectangle(0, 0, 400, 150, 0xffffff, 0.5);
    popupBackground.setOrigin(0.5, 0.5);
    this.inningText.setOrigin(0.5, 0.5); // Center the text within the container
    this.inningPopup.add([popupBackground, this.inningText]);
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
    console.log(1);
    console.log(this.player1Score, this.player2Score);
    // console.log("player==>", this.turn);
    if (this.isDisaplayingNumber) return;

    this.player1 = number;
    this.isDisaplayingNumber = true;

    if (this.turn === "player1") {
      const enemyValue = await this.botTurn();
      let roundWinner = this.CalculateRoundWinner(this.player1, enemyValue);

      this.displayNumber(
        this.playerBoard.width / 2,
        this.playerBoard.y,
        this.player1
      );
      return;
    }
  }
  displayRun(runDetails) {
    if (runDetails.name === "player1") {
      this.add.text(this.player1ScoreX, 200, runDetails.run, {
        font: "50px bold",
        fill: "#000000",
      });
      this.player1ScoreX += 30;
    } else {
      this.add.text(this.plyaer2ScoreX, 200, runDetails.run, {
        font: "50px bold",
        fill: "#000000",
      });
      this.plyaer2ScoreX += 30;
    }
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
    this.playerOneSateIbat.setVisible(false);
    this.playerTwoStateball.setVisible(false);
    this.playerTwoStatebat.setVisible(false);
    //scores
    this.initializeicons();
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
  //this will set icons for ball or bat
  initializeicons() {

    if (this.currentBatting === "player1") {
      this.playerOneSateIbat.setVisible(true);
      this.playerTwoStateball.setVisible(true)
    } else {
      this.playerTwoStatebat.setVisible(true);
      this.playerOneSateIball.setVisible(true)
      
    }
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

      if (this.inning === 1) {
        this.swapBatting();
        console.log(this.currentBatting, this.currentBolling);

        return;
      }
      if (this.inning === 2) {
        this.gameOverPopup();
      }
      return { name: "player1", run: "out" };
    } else {
      this.over++;

      if (
        (this.inning === 1 && this.currentBatting === "player1") ||
        (this.inning === 2 && this.currentBatting === "player1")
      ) {
        this.increaseScore(player1, "player1");
        this.displayRun({ name: "player1", run: player1 });
      }
      if (
        (this.inning === 1 && this.currentBatting === "player2") ||
        (this.inning === 2 && this.currentBatting === "player2")
      ) {
        this.increaseScore(player2, "player2");
        this.displayRun({ name: "player2", run: player2 });
      }
    }
  }
  swapBatting() {
    this.over = 0;
    console.log(this.playerOneStateIcon);

    if (this.currentBatting === "player1") {
      this.currentBatting = "player2";
      this.currentBolling = "player1";
      this.playerOneSateIball.setVisible(true);
      this.playerOneSateIbat.setVisible(false);
      //for player 2
      this.playerTwoStateball.setVisible(false);
      this.playerTwoStatebat.setVisible(true);
    } else {
      this.currentBatting = "player1";
      this.currentBolling = "player2";
      this.playerTwoStateball.setVisible(true);
      this.playerTwoStatebat.setVisible(false);
      //player 1
      this.playerOneSateIball.setVisible(false);
      this.playerOneSateIbat.setVisible(true);
    }

    this.inning++;
    this.inningChangePopup("inning Change");
  }
  inningChangePopup(text) {
    this.inningPopup.setVisible(true); // Make the popup visible
    // Optional: Add a timer to automatically hide the popup after a delay (e.g., 2 seconds)
    this.inningText.setText(`${text}`);
    this.time.delayedCall(4000, () => this.inningPopup.setVisible(false));
  }
  gameOverPopup() {
    let winner =
      this.player1Score > this.player2Score
        ? "player one won"
        : "player two won";
    if (this.player1Score === this.player2Score) {
      winner = "Tie";
    }
    this.inningChangePopup(winner);
    setTimeout(() => {
      this.reSetObjects();
      this.scene.start("mainMenu");
    }, 3000);
  }
  increaseScore(points, playerText) {
    console.log(points);
    this.score += points;

    this.updateScoreText(playerText);
  }
  updateScoreText(playerText) {
    this.scoreText.setText(`${playerText} Score: ${this.score}`);
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
  reSetObjects() {
    this.isDisaplayingNumber = false;
    this.turn = "player1";
    this.player1Score = 0;
    this.player2Score = 0;
    this.currentBatting = null;
    this.currentBolling = null;
    this.inning = 1;
    this.over = 0;
    this.scoreX = 31;
    this.scorey = 210;
    this.inningChangeIs = false;
    this.gameOver = false;
    this.score = 0;
    this.battingCount = 0;
    this.player1ScoreX = 25;
    this.plyaer2ScoreX = 750;
  }
  update() {
    console.log(this.inning);
    if (this.over === 6) {
      if (this.inning === 1) {
        this.updateFinalScore();
        this.score = 0;
        this.scoreText.setText(`Score: ${this.score}`);

        this.over = 0;
        this.swapBatting();
        return;
      }
      if (this.inning === 2) {
        console.log("innning change2");
        this.updateFinalScore();
        this.gameOverPopup();
        // this.scene.start("mainMenu")
      }
    }
  }
}
export default Play;
