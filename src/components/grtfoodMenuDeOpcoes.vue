<template>
  <q-card-section>
    <q-list class="q-pa-sm">
      <q-item clickable v-for="opcao in cardapio.items" :key="opcao">
        <q-btn class="full-width" dense>
          <span style="font-family: 'Dosis', sans-serif;font-size:28px;">{{opcao}}</span>
        </q-btn>
      </q-item>
      <template v-for="(valor , chave ) in cardapio.multiplos">
        <q-item clickable :key="chave">
          <q-btn class="full-width bg-primary" dense>
            <span
              class="text-white"
              style="font-family: 'Dosis', sans-serif;font-size:25px;"
            >{{chave}}</span>
          </q-btn>
        </q-item>
        <q-item clickable v-for="opcao in valor" :key="opcao">
          <q-btn class="full-width" dense>
            <span style="font-family: 'Dosis', sans-serif;font-size:28px;">{{opcao}}</span>
          </q-btn>
        </q-item>
      </template>
    </q-list>
  </q-card-section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      cardapio: "grtfood/getCardapio"
    })
  }
};
</script>
