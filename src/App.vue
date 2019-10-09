<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
Vue.prototype.$eventBus = new Vue();
import Api, { jrpc } from "./api/api.js";
export default {
  name: "App",
  created() {
    Api.connect().then(() => {
      jrpc.dispatch("view.updateEstadoCardapio", estado => {
        //console.log(estado
        this.$store.commit("grtfood/updatePossibilidadeDeFazerPedidos", estado);
      });
      jrpc.dispatch("view.updateCardapio", cardapio => {
        //console.log(estado))
        console.log("commitou");
        this.$store.commit("grtfood/updateCardapio", cardapio);
      });
      jrpc.dispatch("view.updatePedidos", pedidos => {
        //console.log(estado)
        this.$store.commit("grtfood/updatePedidos", pedidos);
      });
    });
  }
};
</script>
