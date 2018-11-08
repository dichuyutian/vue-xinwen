// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Login from './Login'

import router from './router'
import ElementUI from 'element-ui' 
import 'element-ui/lib/theme-chalk/index.css';
//富文本编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
    // use
Vue.use(mavonEditor)

import VueHighcharts from 'vue-highcharts'; 
Vue.use(VueHighcharts)

Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  data:{
    currentComponent:'Login'
  },
  created(){
    let user = JSON.parse(localStorage.getItem('user'));
    if(user&& user.id){
      this.currentComponent = 'App'
    }else{
      this.currentComponent = 'Login'
    }
  },
  methods:{
 
    moreChart() {
        var options = this.getMoreOptions(this.type);
 
        if (this.chart) {
            this.chart.destroy();
        };
    // 初始化 Highcharts 图表
    this.chart = new Highcharts.Chart('highcharts-more', options);
    }
  },
  router,
  components: { App,Login },
  template: `<component v-bind:is="currentComponent"></component>`
})
window.vm = vm;