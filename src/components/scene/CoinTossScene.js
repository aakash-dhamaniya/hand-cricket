class CoinTossScene extends Phaser.Scene {
    constructor() {
      super({ key: 'CoinTossScene' });
    }
  
    create() {
      // Create the "Heads" button
      let headsButton = this.add.text(100, 200, 'Heads', { fontSize: '32px', backgroundColor: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => this.selectOption('Heads'));
  
      // Create the "Tails" button
      let tailsButton = this.add.text(300, 200, 'Tails', { fontSize: '32px', backgroundColor: '#f00' })
        .setInteractive()
        .on('pointerdown', () => this.selectOption('Tails'));
  
      // This function is called when either button is clicked
      this.selectOption = (option) => {
        console.log(`${option} selected!`);
        // Add any additional logic here for what happens when an option is selected
      };
    }
  }
  
  // Game configuration
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [CoinTossScene]
  };
  
  // Create the game with the configuration
  const game = new Phaser.Game(config);
  