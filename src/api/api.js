import simple_jsonrpc from 'simple-jsonrpc-js'
import grtfoodStoreController from '../controllers/grtfoodStoreController'
let socket;
let jrpc;
let iniciado = false;

class Api {
    constructor() {

        if (!socket && !jrpc) {
            jrpc = new simple_jsonrpc()

            jrpc.dispatch('setEstadoCardapio', function (estado) {
                //console.log(estado)
                grtfoodStoreController.updatePossibilidadeDefazerPedidos(estado)
            });

            socket = new WebSocket("ws://0.0.0.0:8081/websocket")
        }

        this.iniciado = iniciado;
        this.jrpc = jrpc;
        this.socket = socket;
    }

    connect() {
        return new Promise((res, rej) => {

            if (this.iniciado) {
                res(this);
                return;
            }

            this.socket.onmessage = event => this.jrpc.messageHandler(event.data);
            this.jrpc.toStream = _msg => this.socket.send(_msg)
            this.socket.onerror = error => this.onDisconnect()
            this.socket.onclose = event => this.onDisconnect()
            this.onDisconnect = () => rej()
            this.socket.onopen = () => {
                iniciado = this.iniciado = true;
                res(this);
            }


        });
    }

    getUsuarios() {
        return this.jrpc.call('getUsuarios', []);
    }

    getCardapio() {
        return this.jrpc.call('getCardapio', {});
    }
    setCardapio(cardapio) {
        return this.jrpc.call('setCardapio', { novoCardapio: cardapio });
    }

    createPedido(payload) {
        const { userId, items, multiplos, obs } = payload
        return this.jrpc.call('createPedido',
            {
                "userId": userId,
                "pedido": {
                    "items": items,
                    "multiplos": multiplos
                },
                "obs": obs
            })
    }

    removerPedido(pedidoId) {
        return this.jrpc.call('deletePedido', pedidoId);
    }

    getPedidos() {
        return this.jrpc.call('getPedidos', []);
    }


}

let api = new Api()
export default api;