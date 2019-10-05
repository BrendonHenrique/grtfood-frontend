import Vue from 'vue'
import Vuex from 'vuex'
import grtfood from './grtfood'
Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      grtfood
    }
  })

  return Store
}
