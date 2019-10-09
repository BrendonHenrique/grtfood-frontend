import simple_jsonrpc from 'simple-jsonrpc-js'
import grtfoodStoreController from '../controllers/grtfoodStoreController'
let socket;
let jrpc;
let iniciado = false;
let ApiEstado = {
  "NAO_INCIALIZADO": 0,
  "INICIALIZADO": 1,
  "CONECTANDO": 2,
  "CONECTADO": 3,
  "ERRO": 4
}
let callbackList = [];
class Api {
  static get estado() {
    return this._estado ? this._estado : ApiEstado.NAO_INCIALIZADO;
  }
  static set estado(estado) {
    this._estado = estado;
  }

  constructor() {

    if (Api.estado == ApiEstado.NAO_INCIALIZADO) {
      Api.estado = ApiEstado.INICIALIZADO;
      jrpc = new simple_jsonrpc()


      socket = new WebSocket(`ws://${window.location.host}/websocket`)
    }

  }

  connect() {
    if (Api.estado == ApiEstado.CONECTADO) return Promise.resolve(this);
    else if (Api.estado == ApiEstado.CONECTANDO) return new Promise((res, rej) => {
      callbackList.push(() => {
        res(this)
      })
    })
    Api.estado = ApiEstado.CONECTANDO;
    //se inicializado, conectar
    return new Promise((res, rej) => {
      callbackList.push(() => {
        console.log("resolveu")
        res(this)
      })
      socket.onmessage = event => jrpc.messageHandler(event.data);
      jrpc.toStream = _msg => socket.send(_msg)
      this.onDisconnect = () => rej()
      socket.onerror = error => this.onDisconnect()
      socket.onclose = event => this.onDisconnect()
      socket.onopen = () => {
        Api.estado = ApiEstado.CONECTADO;
        console.log("Conectou")
        console.log(callbackList)
        callbackList.forEach(cb => cb())

      }
      console.log("Conectando")

    });
  }

  getUsuarios() {
    return jrpc.call('getUsuarios', []);
  }

  getCardapio() {
    return jrpc.call('getCardapio', {});
  }
  setCardapio(cardapio) {
    return jrpc.call('setCardapio', {
      novoCardapio: cardapio
    });
  }

  createPedido(payload) {
    const {
      userId,
      items,
      multiplos,
      obs
    } = payload
    return jrpc.call('createPedido', {
      "userId": userId,
      "pedido": {
        "items": items,
        "multiplos": multiplos
      },
      "obs": obs
    })
  }

  removerPedido(pedidoId) {
    return jrpc.call('deletePedido', [pedidoId]);
  }

  getPedidos() {
    return jrpc.call('getPedidos', []);
  }


}

let api = new Api()
export default api;
export {
  jrpc
}
