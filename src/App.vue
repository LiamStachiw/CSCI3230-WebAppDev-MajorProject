<template>
  <div id="app">
    <particles-bg color="#FFFFFF" num=50 type="cobweb" :bg=true />
    <sidebar-menu :menu="menu" :collapsed="collapsed">
      <span slot="toggle-icon"><font-awesome-icon icon="arrows-alt-h" /></span>
      <span slot="dropdown-icon"><font-awesome-icon icon="sort-down" /></span>
    </sidebar-menu>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Space+Mono&display=swap");
@import "../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";

#app {
  font-family: "Space Mono", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
</style>

<script>
export default {
  // title of site
  title: 'Space Invaders',
  data () {
    return {
      // sidebar props:
      menu: [
        {
          href: '/',
          title: 'Home Page',
          icon: {
            element: 'font-awesome-icon',
            attributes: {
              // icon props:
              icon: 'home'
            }
          }
        },
        {
          title: 'Play Game',
          icon: {
            element: 'font-awesome-icon',
            attributes: {
              // icon props:
              icon: 'play-circle'
            }
          },
          // dropdown menu
          child: [
            {
              href: '/game?numPlayers=1',
              title: '1 Player',
              icon: {
                element: 'font-awesome-icon',
                attributes: {
                  // icon props:
                  icon: 'user'
                }
              }
            },
            {
              href: '/game?numPlayers=2',
              title: '2 Players',
              icon: {
                element: 'font-awesome-icon',
                attributes: {
                  // icon props:
                  icon: 'user-friends'
                }
              }
            },
            {
              href: '/game?numPlayers=3',
              title: '3 Players',
              icon: {
                element: 'font-awesome-icon',
                attributes: {
                  // icon props:
                  icon: 'users'
                }
              }
            }
          ]
        },
        {
          href: '/scores',
          title: 'High Scores',
          icon: {
            element: 'font-awesome-icon',
            attributes: {
              // icon props:
              icon: 'table'
            }
          }
        }
      ],
      collapsed: true
    }
  }
}
</script>
