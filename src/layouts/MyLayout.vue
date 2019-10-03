<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-h6 q-mt-sm">
          <q-btn round class='q-mb-sm  q-mx-sm shadow-2' size="20px">
            <q-img src="https://image.flaticon.com/icons/svg/926/926255.svg" style="width: 60px;" />
          </q-btn>
          <span style="font-family: 'Vibes', cursive;font-size:35px;margin-left:35px;">
            Grt Food
          </span>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <!--  -->

    <!-- Menu lateral do cardapio -->
    <q-drawer side="right" v-model="leftDrawerOpen" show-if-above bordered :width="400" content-class="bg-grey-2">
      <q-item-label header style="text-align:center; font-size:20px;margin-top:20px;">
        <span style="font-family: 'Dosis', sans-serif; font-size:35px;">
          Cardápio
        </span>
      </q-item-label>
      <!--  -->
      <q-list class="q-pa-md">
        <!-- Opções do menu vao aqui no array cardapio -->
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
              <span style="font-family: 'Dosis', sans-serif;font-size:25px;">
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
      <!-- Trigger abre dialog para realizar pedido -->
      <div class="fixed-bottom">
        <q-btn label="Pedir" class="full-width text-grey-9 bg-grey-4 text-h5 text-thin " @click="fazerPedido = true" />
      </div>
      <!--  -->
    </q-drawer>
    <!--  -->

    <!-- Menu de pedidos -->
    <q-dialog v-model="fazerPedido" @show="resetaFormulario">
      <q-card style="width: 500px; max-width: 80vw;">
        <!-- Header do menu -->
        <q-card-section>
          <div class="text-h6">Faça seu pedido</div>
        </q-card-section>
        <!--  -->
        <!-- Conteudo do dialog -->
        <q-card-section>
          <!-- select de nomes -->
          <q-select filled v-model="usuarioSelecionado" use-input input-debounce="0" label="Informe seu nome"
            :options="opcoesDeNomes" @filter="filterFn" style="width: 450px">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!--  -->
          <!-- Check box  -->
          <q-option-group v-model="pedidoItemsGroup" :options="itemsOptions" color="green" type="checkbox" />
          <!--  -->
          <!-- Options -->
          <div v-for="(multiplosOptions,idx) in multiplosOptionsGroup" :key="multiplosOptions.nome">
            <q-banner inline-actions class="text-white bg-primary">
              {{multiplosOptions.nome}} <i style="float:right">Selecione um item!</i>
            </q-banner>
            <q-option-group v-model="pedidoMultiplosGroup[idx]" :options="multiplosOptions.options" color="red" />
          </div>
          <!--  -->
        </q-card-section>
        <!--  -->
        <q-card-actions align="right">
          <q-btn flat label="Confirmar pedido" color="primary" v-close-popup @click="confirmarPedido" />
        </q-card-actions>

      </q-card>
    </q-dialog>
    <!--  -->

    <!-- Modais de avisos -->
    <sweet-modal icon="success" ref="sucessModal">
      Pedido realizado com sucesso!
    </sweet-modal>
    <sweet-modal icon="warning" ref="warningModal">
      Pedido cancelado!
    </sweet-modal>
    <!--  -->

    <!-- Modal do pedido -->
    <sweet-modal modal-theme="dark" overlay-theme="dark" ref="pedidoModal">
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>Single line item</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item with caption</q-item-label>
            <q-item-label caption>Caption</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label overline>OVERLINE</q-item-label>
            <q-item-label>Item with caption</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </sweet-modal>
    <!--  -->

    <!-- Conteudo da página de pedidos -->
    <q-page-container>
      <q-page>
        <q-card>
          <q-banner class="bg-primary text-white text-h5">
            <span style="font-family:'Dosis';font-size:22px;">
              Total de pedidos realizados até o momento - {{quantidadeDePedidos}}
            </span>
          </q-banner>
          <q-scroll-area style="height: 83vh; width: 100%">
            <q-list dense bordered padding class="rounded-borders" clickable v-for="(pedido,idx) in pedidos" :key="idx">

              <q-item clickable v-ripple @click="mostrarPedido(pedido)">
                <q-item-section>
                  <span style="font-family: 'Dosis', sans-serif;font-size:25px;">
                    {{pedido.usuario.label}}
                  </span>
                </q-item-section>
                <q-space />
                <q-btn round icon="delete" />
              </q-item>
            </q-list>

          </q-scroll-area>
        </q-card>
      </q-page>
    </q-page-container>
    <!--  -->

  </q-layout>
</template>

<script>
  import {
    SweetModal
  } from 'sweet-modal-vue'

  import API from '../api/api'

  let listaDeNomes = [];
  export default {
    name: 'MyLayout',

    data() {
      return {
        leftDrawerOpen: true,
        fazerPedido: false,
        cardapio: {},
        usuarioSelecionado: {},
        usuarios: null,
        opcoesDeNomes: [],
        itemsOptions: [],
        multiplosOptionsGroup: [],
        pedidoItemsGroup: [],
        pedidoMultiplosGroup: [],
        pedidos: [],
        quantidadeDePedidos: 0,
        pedidoSelecionado: {}
      }
    },
    mounted() {
      API.connect().then((api) => {
        api.getCardapio().then(cardapio => {
          this.cardapio = cardapio
        })
      });
    },
    methods: {
      resetaFormulario() {
        this.pedidoItemsGroup = [];
        this.pedidoMultiplosGroup = [];
        this.multiplosOptionsGroup = [];
        this.itemsOptions = [];
        API.connect().then((api) => {
          api.getUsuarios().then(usuarios => {
            this.usuarios = usuarios;
            listaDeNomes = usuarios.map(usuario => ({
              label: usuario.nome,
              value: usuario
            }))
            this.opcoesDeNomes = listaDeNomes;
          })


          this.cardapio.items.forEach(opcao => {
            this.pedidoItemsGroup.push(opcao)
            this.itemsOptions.push({
              label: opcao,
              value: opcao
            })
          })

          for (let nome in this.cardapio.multiplos) {
            let multiplosOption = {
              nome,
              options: []
            }
            this.pedidoMultiplosGroup.push(this.cardapio.multiplos[nome][0])
            this.cardapio.multiplos[nome].forEach(opcao => {
              multiplosOption.options.push({
                label: opcao,
                value: opcao
              })
            })
            this.multiplosOptionsGroup.push(multiplosOption)
          }
        })

      },
      confirmarPedido() {
        this.$q.dialog({
          title: 'Confirmar',
          message: 'Gostaria de confirmar o pedido ?',
          cancel: {
            label: 'cancelar'
          },
          ok: {
            label: 'Confirmar'
          },
          persistent: true
        }).onOk(() => {

          this.$refs.sucessModal.open()

          this.pedidos.push({
            usuario: this.usuarioSelecionado,
            item: this.pedidoItemsGroup,
            multiplos: this.pedidoMultiplosGroup[0],
            idPedido: this.quantidadeDePedidos
          });

          this.quantidadeDePedidos++

          console.log({
            usuario: this.usuarioSelecionado,
            item: this.pedidoItemsGroup,
            multiplos: this.pedidoMultiplosGroup[0],
            idPedido: this.quantidadeDePedidos
          })


          this.resetaFormulario();
          this.usuarioSelecionado = {}

        }).onCancel(() => {
          this.$refs.warningModal.open()

          this.resetaFormulario();
        })
      },
      mostrarPedido(pedido) {
        this.$refs.pedidoModal.open()
      },

      // Funções de filtro do nome
      filterFn(val, update) {
        if (val === '') {
          update(() => {
            this.opcoesDeNomes = listaDeNomes
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          this.opcoesDeNomes = listaDeNomes.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
      }

    },
    components: {
      'sweet-modal': SweetModal
    },

  }

</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css?family=Dosis|Vibes&display=swap');

</style>
