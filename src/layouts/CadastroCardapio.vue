<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <grtfood-header>Grt Food Manager</grtfood-header>
    <!--  -->

    <q-page-container>
      <div class="container">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Cardápio do dia</div>
            <div class="text-subtitle2">o que vamos comer hoje?</div>
          </q-card-section>

          <q-card-section>
            <q-list class>
              <q-item tag="label" v-ripple v-for="(item,idx) in cardapio.items" :key="item">
                <q-item-section>
                  <q-item-label>{{item}}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-btn round color="deep-orange" icon="delete_outline" @click="removeItem(idx)" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input outlined v-model="item" label="Adicionar Item" @keyup.enter="addItem">
                    <template v-slot:after>
                      <q-btn round icon="add" @click="addItem" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list class>
              <template v-for="( opcoes,multiplo) in cardapio.multiplos">
                <q-item tag="label" v-ripple :key="multiplo+'add'">
                  <q-item-section>
                    <q-item-label>{{multiplo}}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-btn
                      round
                      @click="removeMultiplo(multiplo)"
                      color="deep-orange"
                      icon="delete_outline"
                    />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple v-for="(op,idx) in opcoes" :inset-level="1" :key="op">
                  <q-item-section>
                    <q-item-label>{{op}}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-btn
                      round
                      color="deep-orange"
                      icon="delete_outline"
                      @click="removeSubItem(multiplo,idx)"
                    />
                  </q-item-section>
                </q-item>
                <q-item :inset-level="1" :key="multiplo">
                  <q-item-section>
                    <q-input
                      outlined
                      v-model="subItem"
                      label="Adicionar Subitem"
                      @keyup.enter="addSubItem(multiplo)"
                    >
                      <template v-slot:after>
                        <q-btn round icon="add" @click="addSubItem(multiplo)" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>
              </template>
              <q-item>
                <q-item-section>
                  <q-input
                    outlined
                    v-model="multiploTxt"
                    label="Adicionar Item multiplo"
                    @keyup.enter="addMultiplo"
                  >
                    <template v-slot:after>
                      <q-btn round icon="add" @click="addMultiplo" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn class="bg-primary text-white" @click="atualizarCardapio">Criar/Atualizar Cardapio</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import API from "../api/api";
export default {
  data() {
    return {
      left: false,
      item: "",
      multiploTxt: "",
      subItem: "",
      cardapio: {}
    };
  },
  mounted() {
    API.connect().then(api => {
      api
        .getCardapio()
        .then(
          cardapio =>
            (this.cardapio = cardapio ? cardapio : { items: [], multiplos: {} })
        );
    });
  },
  methods: {
    addItem() {
      if (!this.item) return;
      this.cardapio.items.push(this.item);
      this.item = "";
    },
    removeItem(indice) {
      this.cardapio.items.splice(indice, 1);
      this.item = "";
    },
    addMultiplo() {
      if (!this.multiploTxt) return;
      this.$set(this.cardapio.multiplos, this.multiploTxt, []);
      this.multiploTxt = "";
    },
    removeMultiplo(multiplo) {
      this.$delete(this.cardapio.multiplos, multiplo);
    },
    addSubItem(multiplo) {
      if (!this.subItem) return;
      this.cardapio.multiplos[multiplo].push(this.subItem);
      this.subItem = "";
    },
    removeSubItem(multiplo, idx) {
      this.cardapio.multiplos[multiplo].splice(idx, 1);
    },
    atualizarCardapio() {
      API.connect().then(api => {
        api.setCardapio(this.cardapio);
      });
    }
  },
  components: {
    "grtfood-header": require("./Header").default
  }
};
</script>
<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Dosis|Vibes&display=swap');
</style>