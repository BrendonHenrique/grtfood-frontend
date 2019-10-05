<template>
  <div>
    <!-- Menu lateral do cardapio -->
    <q-drawer side="right" style="text-align:center;" v-model="leftDrawerOpen" show-if-above bordered 
    :width="400" content-class="bg-grey-2">

      <grtfood-cardapio-header />

      <grtfood-menu-de-opcoes :cardapio="cardapio" />

      <!-- Trigger que abre dialog para realizar pedido -->
        <div class="fixed-bottom">
          <q-btn label="Pedir" class="full-width text-grey-9 bg-grey-4 text-h5 text-thin " 
          @click="fazerPedido = true" />
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
  import API from '../api/api'
  import grtfoodStoreController from '../controllers/grtfoodStoreController'

  export default {
    data() {
      return {
        leftDrawerOpen: true,
        cardapio: {},
        fazerPedido: false,
      }
    },
    mounted() {
      this.getCardapios()
    },
    methods: {
      updateFazerPedido(event){
        this.fazerPedido = event;
      },
      getCardapios() {
        API.connect().then((api) => {
          api.getCardapio().then(cardapio => {
            grtfoodStoreController.updateCardapio(cardapio)
            this.cardapio = grtfoodStoreController.getCardapio()
          })
        });
      }
    },
    components:{
      'grtfood-criador-de-pedidos': require('./grtfoodCriadorDePedidos').default,
      'grtfood-menu-de-opcoes': require('./grtfoodMenuDeOpcoes').default,
      'grtfood-cardapio-header': require('./grtfoodCardapioHeader').default
    }

  }

</script>

<style>

</style>
