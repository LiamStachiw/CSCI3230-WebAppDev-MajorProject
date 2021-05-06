<template>
    <div>
      <div ref="game" id="game" class="game">
      </div>
      <div class="scoreForm" id="scoreForm">
        <h4>Submit your score!</h4>
        <form @submit.prevent="saveScore">
          <table>
            <tbody>
              <tr>
                <td>
                  <label for="name">Name:</label>
                </td>
                <td>
                  <input type="text" v-model="model.name" id="name">
                </td>
              </tr>
              <tr>
                <td>
                  <label for="scoreInput">Final Score:</label>
                </td>
                <td>
                  <input id="scoreInput" type="text" v-model="model.score" readonly>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <input type="submit" variant="success">
          </div>
        </form>
      </div>
      <div class="controls">
        <table style="width:40%;margin:auto">
          <tr>
            <th>Action</th>
            <th>Control</th>
          </tr>
          <tr>
            <td>Move Left</td>
            <td>A, Left Arrow, K</td>
          </tr>
          <tr>
            <td>Move Right</td>
            <td>D, Right Arrow, ;</td>
          </tr>
          <tr>
            <td>Fire</td>
            <td>Forward Slash, Insert, Spacebar </td>
          </tr>
        </table>
      </div>
    </div>
</template>

<style lang="scss">
.controls {
  font-family: 'Press Start 2P', cursive;
  color: white;
  padding-top: 15rem;
}

.scoreForm {
  font-family: 'Press Start 2P', cursive;
  color: white;
  padding-top: 0.5rem;
}

.scoreForm table {
  margin-left: auto;
  margin-right: auto;
}
</style>

<script>
import api from '@/api'
// import phaser package and image assets
import Phaser from 'phaser'
import playerImg from '../assets/sprites/player.png'
import playerLeftImg from '../assets/sprites/playerLeft.png'
import playerRightImg from '../assets/sprites/playerRight.png'
import player2Img from '../assets/sprites/player2.png'
import player2LeftImg from '../assets/sprites/player2Left.png'
import player2RightImg from '../assets/sprites/player2Right.png'
import playerLaserImg from '../assets/sprites/laserGreen.png'
import enemyShipImg from '../assets/sprites/enemyShip.png'
import backgroundImg from '../assets/sprites/starBackground.png'
import explosionSheet from '../assets/sprites/explosion.png'
import gameOverBackground from '../assets/sprites/gameOver.png'

//  const numPlayers = this.$route.query.numPlayers

// creating a class for the laser to use
class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'playerLaser')
  }

  fire (x, y) {
    this.body.reset(x, y)

    this.setActive(true)
    this.setVisible(true)

    this.setVelocityY(-600)
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta)

    if (this.y <= 0) {
      this.setActive(false)
      this.setVisible(false)
    }
  }
}

// creating a class for the group of player lasers to use
class PlayerLaserGroup extends Phaser.Physics.Arcade.Group {
  constructor (scene) {
    super(scene.physics.world, scene)

    this.createMultiple({
      classType: Laser,
      frameQuantity: 1, // This variable controls how many lasers the player is able to shoot at a time
      active: false,
      visible: false,
      key: 'playerLaser'
    })
  }

  // called when a laser is to be fired
  fireLaser (x, y) {
    const laser = this.getFirstDead(false)
    if (laser) {
      laser.fire(x, y)
    }
  }
}

// creating a class for the group of player lasers to use
class Player2LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor (scene) {
    super(scene.physics.world, scene)

    this.createMultiple({
      classType: Laser,
      frameQuantity: 1, // This variable controls how many lasers the player is able to shoot at a time
      active: false,
      visible: false,
      key: 'playerLaser'
    })
  }

  // called when a laser is to be fired
  fireLaser (x, y) {
    const laser = this.getFirstDead(false)
    if (laser) {
      laser.fire(x, y)
    }
  }
}

// creating a class for the group of player lasers to use
class Player3LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor (scene) {
    super(scene.physics.world, scene)

    this.createMultiple({
      classType: Laser,
      frameQuantity: 1, // This variable controls how many lasers the player is able to shoot at a time
      active: false,
      visible: false,
      key: 'playerLaser'
    })
  }

  // called when a laser is to be fired
  fireLaser (x, y) {
    const laser = this.getFirstDead(false)
    if (laser) {
      laser.fire(x, y)
    }
  }
}

// Base class for the enemy ships
class EnemyShip extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'enemyShip')

    this.isDead = false

    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosionSheet', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    })
  }

  // called when the enemy ship is to play its death animation
  deathAnimation () {
    // play the explosion animation
    this.play('explosion')

    // set the enemy ship to be inactive when the animation is finished playing
    this.on('animationcomplete', function () {
      this.setActive(false)
    })
  }
}

// class for the group of enemy ships
class EnemyShipGroup extends Phaser.Physics.Arcade.Group {
  constructor (scene, x, y) {
    super(scene.physics.world, scene)

    this.x = x
    this.y = y

    this.createMultiple({
      classType: EnemyShip,
      frameQuantity: 40,
      active: true,
      visible: true,
      key: 'enemyShip',
      setScale: {
        x: 0.5,
        y: 0.5
      },
      gridAlign: {
        width: 10,
        height: 4,
        cellWidth: 60,
        cellHeight: 40,
        x: x,
        y: y
      }
    })
  }
}

// creating a GameScene class to be used as the game itself
class GameScene extends Phaser.Scene {
  // called when the player loses the game
  gameOver () {
    this.gameOverBg.visible = true

    this.gameOverText.visible = true

    this.finalScoreText.text = 'Final Score: ' + this.score
    this.finalScoreText.visible = true

    this.P1L.enabled = false
    this.P1R.enabled = false
    this.P1F.enabled = false
    this.P2L.enabled = false
    this.P2R.enabled = false
    this.P2F.enabled = false
    this.P3L.enabled = false
    this.P3R.enabled = false
    this.P3F.enabled = false

    this.input.keyboard.disableGlobalCapture()

    document.getElementById('scoreForm').style.display = 'block'
    document.getElementById('scoreInput').value = this.score
  }

  // used when a laser is to be fired
  shootLaser () {
    this.playerLaserGroup.fireLaser(this.player.x, this.player.y - 20)
  }

  shootLaser2 () {
    this.player2LaserGroup.fireLaser(this.player2.x, this.player2.y - 20)
  }

  shootLaser3 () {
    this.player3LaserGroup.fireLaser(this.player3.x, this.player3.y - 20)
  }

  // called before the game is loaded
  preload () {
    // load the image assets
    this.load.image('player', playerImg)
    this.load.image('playerLeft', playerLeftImg)
    this.load.image('playerRight', playerRightImg)
    this.load.image('player2', player2Img)
    this.load.image('player2Left', player2LeftImg)
    this.load.image('player2Right', player2RightImg)
    this.load.image('player3', player2Img)
    this.load.image('player3Left', player2LeftImg)
    this.load.image('player3Right', player2RightImg)
    this.load.image('playerLaser', playerLaserImg)
    this.load.image('enemyShip', enemyShipImg)
    this.load.image('background', backgroundImg)
    this.load.image('gameOver', gameOverBackground)
    this.load.spritesheet('explosionSheet', explosionSheet, { frameWidth: 128, frameHeight: 128 })
  }

  // used to make the playable character
  makePlayer (x, y) {
    const url = new URLSearchParams(window.location.search)
    const param = url.get('numPlayers')
    // add the image sprite to the player object
    if (param === '1') {
      this.player = this.add.sprite(x, y, 'player').setOrigin(0.5, 1)
      this.player2 = this.add.sprite(x * 3, y, 'player2').setOrigin(0.5, 1)
      this.player3 = this.add.sprite(x * 3, y, 'player3').setOrigin(0.5, 1)
    } else if (param === '2') {
      this.player = this.add.sprite(x, y, 'player').setOrigin(0.5, 1)
      this.player2 = this.add.sprite(x, y, 'player2').setOrigin(0.5, 1)
      this.player3 = this.add.sprite(x * 3, y, 'player3').setOrigin(0.5, 1)
    } else if (param === '3') {
      this.player = this.add.sprite(x, y, 'player').setOrigin(0.5, 1)
      this.player2 = this.add.sprite(x, y, 'player2').setOrigin(0.5, 1)
      this.player3 = this.add.sprite(x, y, 'player3').setOrigin(0.5, 1)
    }

    // create the death animation for the player
    this.player.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosionSheet', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    })

    this.player2.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosionSheet', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    })

    this.player3.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosionSheet', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    })

    // create a list of properties for the player
    this.player.properties = {}
    this.player.properties.speed = 2.5
    this.player.properties.laserSpeed = 5
    this.player.properties.maxLasers = 1

    this.player2.properties = {}
    this.player2.properties.speed = 2.5
    this.player2.properties.laserSpeed = 5
    this.player2.properties.maxLasers = 1

    this.player3.properties = {}
    this.player3.properties.speed = 2.5
    this.player3.properties.laserSpeed = 5
    this.player3.properties.maxLasers = 1
  }

  // used whenever an enemy ship is hit by a laser
  enemyHit (laser, enemy) {
    // if the enemy that is hit is not already dead (ie. not playing it's death animation or set to be inactive)
    if (!enemy.isDead) {
      // play the death animation
      enemy.deathAnimation()

      // increase the score by 10
      this.score += 10
      this.scoreText.setText('Score: ' + this.score)

      // reset the laser
      laser.setVelocityY(0)
      laser.body.reset(0, 0)
      laser.setActive(false)
      laser.setVisible(false)

      // set the enemy to be considered dead
      enemy.isDead = true
    }
  }

  // used to create the game itself
  create () {
    const url = new URLSearchParams(window.location.search)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const param = url.get('numPlayers')
    // variables
    this.enemyMovingRight = true // is the enemy moving right
    this.enemyMovingDown = false // is the enemy set to move down
    this.enemyMoveSpeed = 25 // controls the speed at which the enemy ships move
    this.enemySpeedIncrement = 5 // controls how much the enemy ships' speed increases on a new wave
    this.enemyDownDistance = 40 // controls how far down the enemy moves
    this.enemyDownSteps = 0 // used to count how many times the enemy group has moved down
    this.enemySpawnX = this.sys.canvas.width / 10 // the X value of where to spawn the enemy ships
    this.enemySpawnY = this.sys.canvas.height / 8 // the Y value of where to spawn the enemy ships

    this.playerDeathIsPlaying = false // is the death animation playing for the player
    this.playerIsDead = false // is the player dead

    this.score = 0 // used to keep track of the player's score

    // set the background
    this.add.tileSprite(400, 300, 800, 600, 'background')

    // create the score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' })

    // make a laser group
    this.playerLaserGroup = new PlayerLaserGroup(this)
    this.player2LaserGroup = new Player2LaserGroup(this)
    this.player3LaserGroup = new Player3LaserGroup(this)

    // make an enemy group
    this.enemyShipGroup = new EnemyShipGroup(this, this.enemySpawnX, this.enemySpawnY)

    // make the player objects
    this.makePlayer(this.sys.canvas.width / 2, this.sys.canvas.height - 5)

    // set the player scale to an appropriate size
    this.player.scale = 0.6
    this.player2.scale = 0.6
    this.player3.scale = 0.6

    // set the keys the appropriate keycodes
    // player 1
    this.P1L = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    this.P1R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    this.P1F = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.INSERT)

    // player 2
    this.P2L = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.P2R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.P2F = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH)

    // player 3
    this.P3L = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    this.P3R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEMICOLON)
    this.P3F = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // add overlap (coillision) detection between sprites
    this.physics.add.overlap(this.playerLaserGroup, this.enemyShipGroup, this.enemyHit, null, this)
    this.physics.add.overlap(this.player2LaserGroup, this.enemyShipGroup, this.enemyHit, null, this)
    this.physics.add.overlap(this.player3LaserGroup, this.enemyShipGroup, this.enemyHit, null, this)

    // create the background for the game over screen
    this.gameOverBg = this.add.image(400, 300, 'gameOver')
    this.gameOverBg.setAlpha(0.5)
    this.gameOverBg.visible = false

    // create the game over text
    this.gameOverText = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 3, 'Game Over', { fontSize: '32px', fill: '#FFF' })
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.visible = false

    // create the final score text for the game over screen
    this.finalScoreText = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'Final Score: ', { fontSize: '32px', fill: '#FFF' })
    this.finalScoreText.setOrigin(0.5)
    this.finalScoreText.visible = false
  }

  // update() is called once every frame
  update () {
    const url = new URLSearchParams(window.location.search)
    const param = url.get('numPlayers')

    if (param === '1') {
      /*
    *   Player1 Movement
    */
      // if the user is pressing the 'right' key and the player is within the screen
      if (this.P1R.isDown && this.player.x < this.sys.canvas.width - this.player.displayWidth * this.player.originX && !this.playerIsDead) {
        // move the player to the right and change the sprite
        this.player.x += this.player.properties.speed
        this.player.setTexture('playerRight')
        // if the user is pressing the 'left' key and the player is within the screen
      } else if (this.P1L.isDown && this.player.x > 0 + this.player.displayWidth * this.player.originX && !this.playerIsDead) {
        // move the player to the left and change the sprite
        this.player.x -= this.player.properties.speed
        this.player.setTexture('playerLeft')
      } else if (!this.playerIsDead) {
        this.player.setTexture('player')
      }

      /*
    *   Player Firing
    */
      if (Phaser.Input.Keyboard.JustDown(this.P1F) && !this.playerIsDead) {
        this.shootLaser()
      }
    } else if (param === '2') {
      /*
    *   Player1 Movement
    */
      // if the user is pressing the 'right' key and the player is within the screen
      if (this.P1R.isDown && this.player.x < this.sys.canvas.width - this.player.displayWidth * this.player.originX && !this.playerIsDead) {
        // move the player to the right and change the sprite
        this.player.x += this.player.properties.speed
        this.player.setTexture('playerRight')
        // if the user is pressing the 'left' key and the player is within the screen
      } else if (this.P1L.isDown && this.player.x > 0 + this.player.displayWidth * this.player.originX && !this.playerIsDead) {
        // move the player to the left and change the sprite
        this.player.x -= this.player.properties.speed
        this.player.setTexture('playerLeft')
      } else if (!this.playerIsDead) {
        this.player.setTexture('player')
      }

      /*
      *   Player2 Movement
      */
      // if the user is pressing the 'right' key and the player is within the screen
      if (this.P2R.isDown && this.player2.x < this.sys.canvas.width - this.player2.displayWidth * this.player2.originX && !this.playerIsDead) {
        // move the player to the right and change the sprite
        this.player2.x += this.player2.properties.speed
        this.player2.setTexture('player2Right')
        // if the user is pressing the 'left' key and the player is within the screen
      } else if (this.P2L.isDown && this.player2.x > 0 + this.player2.displayWidth * this.player2.originX && !this.playerIsDead) {
        // move the player to the left and change the sprite
        this.player2.x -= this.player2.properties.speed
        this.player2.setTexture('player2Left')
      } else if (!this.playerIsDead) {
        this.player2.setTexture('player2')
      }

      /*
    *   Player Firing
    */
      if (Phaser.Input.Keyboard.JustDown(this.P1F) && !this.playerIsDead) {
        this.shootLaser()
      }

      if (Phaser.Input.Keyboard.JustDown(this.P2F) && !this.player2IsDead) {
        this.shootLaser2()
      }
    } else if (param === '3') {
      /*
    *   Player1 Movement
    */
      // if the user is pressing the 'right' key and the player is within the screen
      if (this.P1R.isDown && this.player.x < this.sys.canvas.width - this.player.displayWidth * this.player.originX && !this.playerIsDead) {
        // move the player to the right and change the sprite
        this.player.x += this.player.properties.speed
        this.player.setTexture('playerRight')
        // if the user is pressing the 'left' key and the player is within the screen
      } else if (this.P1L.isDown && this.player.x > 0 + this.player.displayWidth * this.player.originX && !this.playerIsDead) {
        // move the player to the left and change the sprite
        this.player.x -= this.player.properties.speed
        this.player.setTexture('playerLeft')
      } else if (!this.playerIsDead) {
        this.player.setTexture('player')
      }

      /*
      *   Player2 Movement
      */
      // if the user is pressing the 'right' key and the player is within the screen
      if (this.P2R.isDown && this.player2.x < this.sys.canvas.width - this.player2.displayWidth * this.player2.originX && !this.playerIsDead) {
        // move the player to the right and change the sprite
        this.player2.x += this.player2.properties.speed
        this.player2.setTexture('player2Right')
        // if the user is pressing the 'left' key and the player is within the screen
      } else if (this.P2L.isDown && this.player2.x > 0 + this.player2.displayWidth * this.player2.originX && !this.playerIsDead) {
        // move the player to the left and change the sprite
        this.player2.x -= this.player2.properties.speed
        this.player2.setTexture('player2Left')
      } else if (!this.playerIsDead) {
        this.player2.setTexture('player2')
      }

      /*
     *   Player3 Movement
     */
      // if the user is pressing the 'right' key and the player is within the screen
      if (this.P3R.isDown && this.player3.x < this.sys.canvas.width - this.player3.displayWidth * this.player3.originX && !this.playerIsDead) {
        // move the player to the right and change the sprite
        this.player3.x += this.player3.properties.speed
        this.player3.setTexture('player3Right')
        // if the user is pressing the 'left' key and the player is within the screen
      } else if (this.P3L.isDown && this.player3.x > 0 + this.player3.displayWidth * this.player3.originX && !this.playerIsDead) {
        // move the player to the left and change the sprite
        this.player3.x -= this.player3.properties.speed
        this.player3.setTexture('player3Left')
      } else if (!this.playerIsDead) {
        this.player3.setTexture('player3')
      }

      /*
    *   Player Firing
    */
      if (Phaser.Input.Keyboard.JustDown(this.P1F) && !this.playerIsDead) {
        this.shootLaser()
      }

      if (Phaser.Input.Keyboard.JustDown(this.P2F) && !this.player2IsDead) {
        this.shootLaser2()
      }

      if (Phaser.Input.Keyboard.JustDown(this.P3F) && !this.player3IsDead) {
        this.shootLaser3()
      }
    }

    /*
    *   Enemy Movement
    */
    // if the enemy is moving right and is still on the screen
    if (this.enemyMovingRight && this.enemyShipGroup.getChildren()[39].x < this.sys.canvas.width - this.enemyShipGroup.getChildren()[39].displayWidth * this.enemyShipGroup.getChildren()[39].originX) {
      this.enemyShipGroup.setVelocityX(this.enemyMoveSpeed)
    // if the enemy is moving left and is still on the screen
    } else if (!this.enemyMovingRight && this.enemyShipGroup.getChildren()[0].x > 0 + this.enemyShipGroup.getChildren()[0].displayWidth * this.enemyShipGroup.getChildren()[0].originX) {
      this.enemyShipGroup.setVelocityX(-this.enemyMoveSpeed)
    } else {
      this.enemyMovingDown = true
      this.enemyShipGroup.setVelocityX(0)
    }

    // if the enemy is set to move down
    if (this.enemyMovingDown) {
      this.enemyShipGroup.incY(this.enemyDownDistance)
      this.enemyDownSteps += 1
      this.enemyMovingDown = false
      this.enemyMovingRight = !this.enemyMovingRight
    }

    // if the enemy has completed enough down steps
    if (this.enemyDownSteps === 7) {
      this.enemyShipGroup.setVelocityX(0)

      if (!this.playerDeathIsPlaying) {
        this.playerDeathIsPlaying = true
        this.playerIsDead = true
        this.player.play('explosion')
        this.player2.play('explosion')
        this.player3.play('explosion')
      }
    }

    /*
    *   Enemy checking
    */
    // if there are no ships alive in the ship group
    if (this.enemyShipGroup.getFirstAlive() == null) {
      // reset the down counter and increase the move speed
      this.enemyDownSteps = 0
      this.enemyMoveSpeed += this.enemySpeedIncrement

      // clear all children from the ship group, and spawn a new set of children
      this.enemyShipGroup.clear(true, true)
      this.enemyShipGroup.createMultiple({
        classType: EnemyShip,
        frameQuantity: 40,
        active: true,
        visible: true,
        key: 'enemyShip',
        setScale: {
          x: 0.5,
          y: 0.5
        },
        gridAlign: {
          width: 10,
          height: 4,
          cellWidth: 60,
          cellHeight: 40,
          x: this.enemySpawnX,
          y: this.enemySpawnY
        }
      })
    }

    /*
    *   Game State Checking
    */
    // check if the player is dead
    if (this.playerIsDead) {
      this.gameOver()
    }
  }
}

// export the data
export default {
  data () {
    return {
      game: null,
      model: {}
    }
  },
  methods: {
    async saveScore (e) {
      e.preventDefault()
      this.model.score = document.getElementById('scoreInput').value

      await api.createHighscore(this.model)
      console.log('Score submitted')
      this.model = {}
      this.$router.push('scores')
    }
  },
  mounted () {
    if (localStorage.getItem('reloaded')) {
      localStorage.removeItem('reloaded')
    } else {
      localStorage.setItem('reloaded', '1')
      location.reload()
    }

    window.onload = function () {
      document.getElementById('scoreForm').style.display = 'none'
    }

    // create the config for the game
    const config = {
      parent: this.$refs.game,
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 }
        }
      },
      scene: GameScene
    }
    // create the game
    this.game = new Phaser.Game(config)
  }
}
</script>
