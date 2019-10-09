<template>
  <div>
    
    <!-- Menu de pedidos -->
    <q-dialog v-model="fazerPedido" @show="resetaFormulario" persistent >

      <q-card style="width: 700px; max-width: 80vw;height:100vh;">

        <!-- Header do menu -->
        <q-card-section>
          <div class="row">
            <span class="text-h5">
              Faça seu pedido
            </span>
            <q-space />
            <q-btn dense round icon="close" @click="$emit('updateFazerPedido',false)" />
          </div>
        </q-card-section>
        <!--  -->

        <!-- Conteudo do dialog para criar pedido -->
        <q-form  @submit="confirmarPedido">
          
          <q-card-section style="display:flex;justify-content:center;">
            <!-- select de nomes -->
            <q-select filled v-model="usuarioSelecionado" use-input input-debounce="0" clearable
            label="Informe seu nome" class="text-grey-7" :options="opcoesDeNomes" @filter="filtrarNome" 
            style="width: 100%;font-size:20px;">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sem resultado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <!--  -->
          </q-card-section>

          <q-card-section class="q-ml-lg">
            <!-- Check box  -->
            <q-option-group v-model="pedidoItemsGroup" 
            :options="itemsOptions" color="green" type="checkbox"
            />
            <!--  -->

            <!-- Options -->
            <div v-for="(multiplosOptions,idx) in multiplosOptionsGroup" :key="multiplosOptions.nome">
              <q-banner inline-actions class="text-white bg-primary">
                {{multiplosOptions.nome}} <i style="float:right">Selecione um item!</i>
              </q-banner>
              <q-option-group v-model="pedidoMultiplosGroup[idx]" :options="multiplosOptions.options" color="red" />
            </div>
            <!--  -->

            <q-banner v-show="false" class="bg-primary text-white q-mt-sm " dense>
              Observações
            </q-banner>

            <div v-show="false" style="width: 100%;">
              <q-input dense style="height:5rem;" v-model="observacao" filled type="textarea" />
            </div>
          </q-card-section>
            
          <!-- botão para confirmar o pedido -->
          <q-card-actions align="right">
            <q-btn label="Confirmar pedido" color="primary" 
            :disable="submitIsDisabled" size="16px"
            type="submit" />
          </q-card-actions>
          <!--  -->
          

        </q-form>
        <!--  -->
          
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

  </div>
</template>

<script>
  import API from '../api/api';

  import grtfoodStoreController from '../controllers/grtfoodStoreController'

  import {
    SweetModal
  } from 'sweet-modal-vue';

  let listaDeNomes = [];

  export default {
    props: ['fazerPedido'],
    data() {
      return {
        usuarioSelecionado: {},
        usuarios: null,
        opcoesDeNomes: [],
        itemsOptions: [],
        multiplosOptionsGroup: [],
        pedidoItemsGroup: [],
        pedidoMultiplosGroup: [],
        pedidos: [],
        cardapio: {},
        observacao: '',
        submitIsDisabled: true,
        usuarioSelecionadoAux:{},
      }
    },
    mounted() {
      this.cardapio = grtfoodStoreController.getCardapio()
    },
    methods: {
      resetaFormulario() {
        this.pedidoItemsGroup = [];
        this.pedidoMultiplosGroup = [];
        this.multiplosOptionsGroup = [];
        this.itemsOptions = [];
        this.observacao = ''
        this.usuarioSelecionado = {}

        API.connect().then((api) => {

          api.getUsuarios().then(usuarios => {
            this.usuarios = usuarios;
            listaDeNomes = usuarios.map(usuario => ({
              label: usuario.nome,
              value: usuario
            }));
            this.opcoesDeNomes = listaDeNomes;
          });

          this.cardapio.items.forEach(opcao => {
            this.pedidoItemsGroup.push(opcao)
            this.itemsOptions.push({
              label: opcao,
              value: opcao
            });
          });

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
              });
            });
            this.multiplosOptionsGroup.push(multiplosOption)
          }

        });
      },
      enviaPedido() {
        // garantindo possibilidade de mais uma chave em multiplos
        var multiplosSelected = {}
        for (name in this.cardapio.multiplos) {
          this.cardapio.multiplos[name].forEach(option => {
            this.pedidoMultiplosGroup.forEach(multiplosEscolhidos => { 
              if(option == multiplosEscolhidos){
                Object.assign(multiplosSelected,{
                  [name]:multiplosEscolhidos
                });
              }
            });
          });
        }

        // Enviando o pedido para o backend 
        API.connect().then((api) => {
          api.createPedido({
            userId: this.usuarioSelecionadoAux.value.id,
            items: this.pedidoItemsGroup,
            multiplos: multiplosSelected,
            obs: this.observacao
          }).then((response) => { 
            api.getPedidos().then(pedidos => {
              grtfoodStoreController.updatePedidos(pedidos)
            });
            this.$refs.sucessModal.open()
          });
        });
      },
      confirmarPedido() {
        this.$emit('updateFazerPedido', false)
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
          this.enviaPedido()
        }).onCancel(() => {
          this.$refs.warningModal.open()
        })
      },
      // Função para filtrargem do nome
      filtrarNome(val, update) {
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
    watch:{
      usuarioSelecionado(newValue){
        Object.assign(this.usuarioSelecionadoAux, newValue);
        if(newValue){
          this.submitIsDisabled = false;
        }else{
          this.submitIsDisabled = true;
        }
      }, 
    },
    components: {
      'sweet-modal': SweetModal,
    }
  }
</script>
