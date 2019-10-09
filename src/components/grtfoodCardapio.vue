<template>
  <div>
    <!-- Menu lateral do cardapio -->
    <q-drawer side="right" style="text-align:center;" 
    @hide="$emit('updateParentLeftDrawerOpen',childLeftDrawerOpen)"
    v-model="childLeftDrawerOpen" show-if-above bordered 
    :width="250" content-class="bg-grey-2">

      <grtfood-cardapio-header />
      <grtfood-menu-de-opcoes :cardapio="cardapio" />
      <!-- Trigger que abre dialog para realizar pedido -->
      <q-btn label="Pedir" class="full-width text-grey-9 bg-grey-4 text-h5 text-thin " 
      @click="fazerPedido = true" />
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
    props:['leftDrawerOpen'],
    data() {
      return {
        cardapio: {},
        fazerPedido: false,
        childLeftDrawerOpen: this.leftDrawerOpen
      }
    },
    created() { 
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
    },
    watch:{
      leftDrawerOpen(newValue){
        this.childLeftDrawerOpen = newValue
      },
    }
  }
</script> 