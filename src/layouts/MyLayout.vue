<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <grtfood-header>
      Grt Food
      <template v-slot:drawerButton>
        <q-btn class="lt-md" @click="leftDrawerOpen= !leftDrawerOpen" icon="menu" round glossy />
      </template>
    </grtfood-header>
    <!--  -->

    <!-- Menu lateral com cardapio -->
    <grtfood-menu-cardapio
      :leftDrawerOpen="leftDrawerOpen"
      @updateParentLeftDrawerOpen="updateParentLeftDrawerOpen"
    />
    <!--  -->

    <!-- lista com os pedidos -->
    <grtfood-lista-de-pedidos />
    <!--  -->
  </q-layout>
</template>

<script>
export default {
  name: "MyLayout",
  data() {
    return {
      leftDrawerOpen: true
    };
  },
  components: {
    "grtfood-header": require("./Header").default,
    "grtfood-menu-cardapio": require("../components/grtfoodCardapio").default,
    "grtfood-lista-de-pedidos": require("../components/grtfoodListaDePedidos")
      .default
  },
  methods: {
    updateParentLeftDrawerOpen(event) {
      this.leftDrawerOpen = event;
    }
  }
};
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Dosis|Vibes&display=swap');
</style>
