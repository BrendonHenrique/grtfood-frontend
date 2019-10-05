<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Header -->
    <grtfood-header>
      Grt Food
    </grtfood-header>
    <!--  -->
    
    <!-- Menu lateral com cardapio -->
    <grtfood-menu-cardapio />
    <!--  -->

    <!-- lista com os pedidos -->
    <grtfood-lista-de-pedidos />
    <!--  -->

  </q-layout>
</template>

<script>
  export default {
    name: 'MyLayout',
    components: {
      'grtfood-header': require('./Header').default,
      'grtfood-menu-cardapio': require('../components/grtfoodCardapio').default,
      'grtfood-lista-de-pedidos': require('../components/grtfoodListaDePedidos').default,
    }
  }
</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css?family=Dosis|Vibes&display=swap');
</style>
