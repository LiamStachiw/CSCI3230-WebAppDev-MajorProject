<template>
  <div class="home page">
    <kinesis-container>
      <kinesis-element :strength="10" type="depth">
        <img alt="Game Logo"
             src="../assets/logo.png"
             ref="/src/views/Home.vue" />
      </kinesis-element>
    </kinesis-container>
    <ejs-button cssClass='e-info' v-on:click.native='btnPlay1'><font-awesome-icon icon="user" />[1 Player]</ejs-button>
    <ejs-button cssClass='e-info' v-on:click.native='btnPlay2'><font-awesome-icon icon="user-friends" />[2 Players]</ejs-button>
    <ejs-button cssClass='e-info' v-on:click.native='btnPlay3'><font-awesome-icon icon="users" />[3 Players]</ejs-button>
    <h1>About</h1>
    <p>This is a modern take on the very classic Space Invaders. The main objective of the game is to defend your home planet from the oncoming waves of enemy ships. The player can control their ship by using the arrow keys to move, and the space key to shoot. Upon defeating an entire wave of enemy ships, a new wave will spawn, which moves at increasingly faster speeds. The game is endless, and your main goal as the player is to achieve the highest score possible!</p>
  </div>
</template>

<style lang="scss">
.home {
  font-family: 'Press Start 2P', cursive;
  color: white;
  padding-top: 10rem;
}
body {
  background-color: #050507;
}
p {
  margin-left: 10rem;
  margin-right: 10rem;
}
.e-btn {
  margin: 25px 5px 20px 20px;
  font-family: 'Press Start 2P', cursive;
}
</style>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
import { ButtonPlugin } from '@syncfusion/ej2-vue-buttons'

Vue.use(ButtonPlugin)

export default class Home extends Vue {
  // 1 player button
  btnPlay1 () {
    super.$router.push({ path: 'game', query: { numPlayers: '1' } })
  }

  // 2 players button
  btnPlay2 () {
    super.$router.push({ path: 'game', query: { numPlayers: '2' } })
    //  super.$router.push({ path: 'game', name: 'game', params: { numPlayers: '2' } })
  }

  // 3 players button
  btnPlay3 () {
    super.$router.push({ path: 'game', query: { numPlayers: '3' } })
  }
}
</script>
