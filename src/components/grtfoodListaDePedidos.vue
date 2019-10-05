<template>
  <!-- Lista de pedidos -->
    <q-page-container>
      
      <!-- Lista dos pedidos  -->
      <q-page>
        <q-card>
          <q-banner class="bg-primary text-white text-h5">
            <span style="font-family:'Dosis';font-size:22px;">
              Total de pedidos realizados até o momento - {{quantidadeDePedidos}}
            </span>
          </q-banner>
          
          <q-scroll-area>
            <q-list dense bordered padding class="rounded-borders" 
            clickable v-for="(pedido,idx) in pedidos" :key="idx">
          
              <q-item clickable v-ripple @click="mostrarPedido(pedido)">
                <q-item-section>
                  <span style="font-family: 'Dosis', sans-serif;font-size:25px;">
                    {{pedido.usuario.label}}
                  </span>
                </q-item-section>
                <q-space />
                <q-btn round icon="delete" @click.stop="removerPedido(pedido)"/>
              </q-item>
          
            </q-list>
          </q-scroll-area>
        </q-card>
      </q-page>
      <!--  -->

      <!-- Modal com o conteúdo do pedido selecionado -->
      <q-dialog v-model="mostrandoPedido" position="top">
        <q-card style="width: 500px;">
          
          <q-card-section>
            <q-banner class="bg-primary">
              <span class="text-white" style="font-family: 'Dosis', sans-serif;font-size:25px;">
                Informações do pedido de {{pedidoSelecionado.usuario}}
              </span>
            </q-banner>
          </q-card-section>
          
          <q-card-section>
            
            <q-list bordered separator 
            v-for="itemPedido in pedidoSelecionado.items" :key="itemPedido">
              <q-item clickable v-ripple>
                <q-item-section>
                  <span style="font-family: 'Dosis', sans-serif;font-size:20px;">
                    {{itemPedido}}
                  </span>
                </q-item-section>
              </q-item>
            </q-list> 

            <q-list bordered separator v-for="multiploPedido in pedidoSelecionado.multiplos" :key="multiploPedido">
              <q-item clickable v-ripple>
                <q-item-section>
                  <span style="font-family: 'Dosis', sans-serif;font-size:20px;">
                    {{multiploPedido}}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
            
            <q-item clickable v-ripple>
              <q-item-section class="bg-grey-4 shadow-2">
                  <span class="q-mb-sm text-grey-9 text-center" style="font-family: 'Dosis', sans-serif;font-size:20px;">Observação</span>
                  <q-input dense style="height:5rem;" v-model="pedidoSelecionado.observacao" filled type="textarea" />
              </q-item-section>
            </q-item>
          
          </q-card-section>
          
          <q-card-actions align="right">
            <q-btn label="Fechar" color="primary" v-close-popup />
          </q-card-actions>
        
        </q-card>
      </q-dialog>
      <!--  -->


      <!-- Modais de avisos -->
      <sweet-modal icon="success" ref="removidoComSucesso">
        Pedido removido com sucesso!
      </sweet-modal>

      <sweet-modal icon="warning" ref="naoRemovido">
        Pedido de remoção cancelado!
      </sweet-modal>
      <!--  -->

    </q-page-container>
</template>

<script>
  import {
    SweetModal
  } from 'sweet-modal-vue';
  import grtfoodStoreController from '../controllers/grtfoodStoreController'
  import API from '../api/api'
  
  export default {
    data(){
      return{
        pedidos:[],
        pedidoSelecionado:{},
        mostrandoPedido: false
      }
    },
    mounted(){
      this.pedidos = grtfoodStoreController.getPedidos()
    },
    methods:{
      selecionarPedido(pedido){
        Object.assign(this.pedidoSelecionado, {
          items:pedido.items,
          multiplos:pedido.multiplos,
          observacao:pedido.obs,
          usuario: pedido.usuario.label
        });
      },
      mostrarPedido(pedido) {
        this.selecionarPedido(pedido)
        this.mostrandoPedido = true
      },
      removerPedido(pedido){
        this.selecionarPedido(pedido)
        this.$q.dialog({
          title: 'Confirmar',
          message: `${this.pedidoSelecionado.usuario} você gostaria de remover seu pedido ?`,
          cancel: {
            label: 'cancelar'
          },
          ok: {
            label: 'Confirmar'
          },
          persistent: true
        }).onOk(() => {
          
          API.connect().then((api) => {
            api.getCardapio().then(cardapio => {
          
              // grtfoodStoreController.updateCardapio(cardapio)
              // this.cardapio = grtfoodStoreController.getCardapio()
          
            })
          });
          
          this.$refs.removidoComSucesso.open()
        }).onCancel(() => {
          this.$refs.naoRemovido.open()
        });
      }
    },
    computed:{
      quantidadeDePedidos(){
        return this.pedidos.length
      }
    },
    components:{
      'sweet-modal': SweetModal,
    }
  }

</script>
