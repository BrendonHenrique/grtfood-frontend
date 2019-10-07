<template>
  <q-list class="q-pa-md">
    <q-item clickable v-for="opcao in cardapio.items" :key="opcao">
      <q-btn class="full-width" dense>
        <span style="font-family: 'Dosis', sans-serif;font-size:25px;">
          {{opcao}}
        </span>
      </q-btn>
    </q-item>
    <template v-for="(valor , chave ) in cardapio.multiplos">
      <q-item clickable :key="chave">
        <q-btn class="full-width bg-primary" dense>
          <span class="text-white" style="font-family: 'Dosis', sans-serif;font-size:25px;">
            {{chave}}
          </span>
        </q-btn>
      </q-item>
      <q-item clickable v-for="opcao in valor" :key="opcao">
        <q-btn class="full-width" dense>
          <span style="font-family: 'Dosis', sans-serif;font-size:25px;">
            {{opcao}}
          </span>
        </q-btn>
      </q-item>
    </template>
    <!--  -->
  </q-list>
</template>

<script>
  export default {
    props: ['cardapio']
  }

</script>
