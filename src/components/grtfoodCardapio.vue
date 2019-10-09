<template>
  <div>
    <!-- Menu lateral do cardapio -->
    <q-drawer
      side="right"
      style="text-align:center;"
      @hide="$emit('updateParentLeftDrawerOpen',childLeftDrawerOpen)"
      v-model="childLeftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      content-class="bg-grey-2"
    >
      <grtfood-cardapio-header />
      <grtfood-menu-de-opcoes style="padding-bottom:4rem" />
      <!-- Trigger que abre dialog para realizar pedido -->
      <div class="fixed-bottom">
        <q-btn
          label="Pedir"
          v-if="getPossibilidadeDeFazerPedidos"
          class="full-width text-grey-9 bg-grey-4 text-h5 text-thin"
          @click="fazerPedido = true"
        />
        <q-banner
          v-else
          rounded
          class="bg-purple-8 text-subtitle1 text-white"
        >Pedidos encerrados por hoje 😢</q-banner>
      </div>
      <!--  -->
    </q-drawer>
    <!--  -->
    <!-- Dialog para inserir o pedido  -->
    <grtfood-criador-de-pedidos :fazerPedido="fazerPedido" @updateFazerPedido="updateFazerPedido" />
    <!--  -->
  </div>
</template>

<script>
import API from "../api/api";
import grtfoodStoreController from "../controllers/grtfoodStoreController";
import { mapState, mapGetters } from "vuex";

export default {
  props: ["leftDrawerOpen"],
  data() {
    return {
      fazerPedido: false,
      childLeftDrawerOpen: this.leftDrawerOpen
    };
  },
  created() {
    this.getCardapios();
  },
  computed: {
    ...mapGetters({
      getCardapio: "grtfood/getCardapio",
      getPossibilidadeDeFazerPedidos: "grtfood/getPossibilidadeDeFazerPedidos"
    })
  },
  methods: {
    updateFazerPedido(event) {
      this.fazerPedido = event;
    },
    getCardapios() {
      API.connect().then(api => {
        api.getCardapio().then(cardapio => {
          this.$store.commit("grtfood/updateCardapio", cardapio);
        });
      });
    }
  },
  components: {
    "grtfood-criador-de-pedidos": require("./grtfoodCriadorDePedidos").default,
    "grtfood-menu-de-opcoes": require("./grtfoodMenuDeOpcoes").default,
    "grtfood-cardapio-header": require("./grtfoodCardapioHeader").default
  },
  watch: {
    leftDrawerOpen(newValue) {
      this.childLeftDrawerOpen = newValue;
    }
  }
};
</script> 