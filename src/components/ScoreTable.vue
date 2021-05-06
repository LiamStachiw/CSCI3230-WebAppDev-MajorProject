<template>
<div class="scoretable">
        <h1>High Scores</h1>
        <img id="player" v-on:click="playanimation()" src="../assets/sprites/player.png">
        <img id="player2" v-on:click="playanimation2()" src="../assets/sprites/player.png">
        <img id="player3" v-on:click="playanimation3()" src="../assets/sprites/player.png">
        <table id="highscoretable">
            <tr v-bind:key="score.id" v-for="score in scores">
                <td><p>{{score.name}}</p></td>
                <td><p>{{score.score}}</p></td>
            </tr>
        </table>
    </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'ScoreTable',
  props: {
    scores: Array
  },
  methods: {
    playanimation () {
      let id = null
      const ship = $('#player')
      let size = 50
      clearInterval(id)
      id = setInterval(function () {
        if (size === 350) {
          clearInterval(id)
        } else {
          size--
          ship.css('height', size + 'px')
        }
      }, 5)
    },
    playanimation2 () {
      let id = null
      const ship = $('#player2')
      let size = 50
      clearInterval(id)
      id = setInterval(function () {
        if (size === 350) {
          clearInterval(id)
        } else {
          size--
          ship.css('height', size + 'px')
        }
      }, 5)
    },
    playanimation3 () {
      let id = null
      const ship = $('#player3')
      let size = 50
      clearInterval(id)
      id = setInterval(function () {
        if (size === 350) {
          clearInterval(id)
        } else {
          size--
          ship.css('height', size + 'px')
        }
      }, 5)
    }

  }
}
</script>

<style lang="scss">
.scoretable h1{
    font-family: 'Press Start 2P', cursive;
    font-size:250%
}
#highscoretable {
    margin-left: auto;
    margin-right: auto;
    color: white;
    font-family: 'Press Start 2P', cursive;
    padding-top:2rem;
}

#highscoretable tr:first-child{
    background: -webkit-linear-gradient(#1617e9, #0ac4f5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
#highscoretable tr:nth-child(2){
    background: -webkit-linear-gradient(#f20d0d, #f88907);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
#highscoretable tr:nth-child(3){
    background: -webkit-linear-gradient(#cbff00, #1ce3b1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

#highscoretable td {
    font-size: 200%;
    padding-top:1rem;
}

.scoretable img{
    margin-right: auto;
    margin-left:auto;
    padding: 3px;
}
</style>
