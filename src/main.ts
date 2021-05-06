/* eslint-disable */
// @ts-ignore
import { defineCustomElements as defineIonPhaser } from "@ion-phaser/core/loader";
// @ts-ignore
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// @ts-ignore
import VueKinesis from "vue-kinesis";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlayCircle,
  faArrowsAltH,
  faSortDown,
  faHome,
  faTable,
  faGamepad,
  faUser,
  faUserFriends,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// @ts-ignore
import VueParticlesBg from "particles-bg-vue";
import { ButtonPlugin } from "@syncfusion/ej2-vue-buttons";
import { enableRipple } from "@syncfusion/ej2-base";
// @ts-ignore
import titleMixin from './mixins/titleMixin'
/* eslint-enable */

// add all icons to the app
library.add(
  faPlayCircle,
  faArrowsAltH,
  faSortDown,
  faHome,
  faTable,
  faGamepad,
  faUser,
  faUserFriends,
  faUsers
)

// integrate all plugins
Vue.use(VueKinesis)
Vue.use(VueSidebarMenu)
Vue.use(VueParticlesBg)
Vue.use(ButtonPlugin)
enableRipple(true)
Vue.mixin(titleMixin)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.config.ignoredElements = [/ion-\w*/]

defineIonPhaser(window)

new Vue({
  router,
  render: (h: (arg0: any) => any) => h(App)
}).$mount('#app')
