const state = {
  cardapio: {},
  pedidos: [],
  possivelFazerPedidos: true,
  teste: ""
}

const mutations = {
  updateCardapio(state, payload) {
    state.cardapio = payload
  },
  updatePedidos(state, payload) {
    state.pedidos = payload
  },
  updatePossibilidadeDeFazerPedidos(state, payload) {
    if (payload == 'Aberto') {
      state.possivelFazerPedidos = true
    } else if (payload == 'Fechado') {
      state.possivelFazerPedidos = false
    }
  }
}

const actions = {
  updateCardapio({
    commit
  }, payload) {
    commit('updateCardapio', payload);
  },
  updatePedidos({
    commit
  }, payload) {
    commit('updatePedidos', payload);
  },
  updatePossibilidadeDeFazerPedidos({
    commit
  }, payload) {
    commit('updatePossibilidadeDeFazerPedidos', payload);
  },
}

const getters = {
  getCardapio: (state) => state.cardapio,
  getPedidos: (state) => state.pedidos,
  getPossibilidadeDeFazerPedidos: (state) => state.possivelFazerPedidos
}

export default {
  namespaced: true,
  // this allows me to create another one store modules
  state,
  mutations,
  actions,
  getters
}
