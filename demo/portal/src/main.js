import Vue from 'vue';
import App from './App';
import router from './router'
import store from './store'
import {fetch as fetchPolyfill} from 'whatwg-fetch'
import { registerMicroApps, setDefaultMountApp, start } from 'qiankun';

import './assets/css/reset.css'

Vue.config.productionTip = false

let app = null;

function render({ appContent, loading }) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading,
          },
        });
      },
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

function initApp() {
  render({ appContent: '', loading: true });
}

const request = (url) => {
  fetchPolyfill(url, {
    referrerPolicy: 'origin-when-cross-origin',
  })
}

initApp();


let msg = {
  data: {
    userInfo: store.state.userInfo,
    fns:[
      function getMicro(){
        return store.state.micro
       }
    ]
  }
};


registerMicroApps(
  [
    { name: 'vue app1', 
      entry: '//localhost:7101', 
      render, 
      activeRule: genActiveRule('/demo1'),
      props:msg
    }
  ],
);

setDefaultMountApp('/demo1');

start({ prefetch: false, jsSandbox: false,fetch:request});

