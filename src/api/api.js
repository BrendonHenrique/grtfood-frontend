import simple_jsonrpc from 'simple-jsonrpc-js'
let socket;
let jrpc;
let iniciado = false;

class Api {
    constructor(){
    if(!socket && !jrpc){
        jrpc =  new simple_jsonrpc()
        socket =  new WebSocket("ws://10.0.0.136:8080/websocket")
    }
    this.iniciado = iniciado;
    this.jrpc = jrpc;
    this.socket = socket;
}

    connect(){
        return new Promise((res,rej)=>{
            if(this.iniciado) {res(this); return;}
            this.socket.onmessage = event => this.jrpc.messageHandler(event.data);
            this.jrpc.toStream = _msg => this.socket.send(_msg)
            this.socket.onerror = error => this.onDisconnect() 
            this.socket.onclose = event => this.onDisconnect() 
            this.onDisconnect = () =>  rej()
            this.socket.onopen = () => {
                iniciado = this.iniciado = true;
                res(this);
            }
        });
    }
    
    getUsuarios(){
        return this.jrpc.call('getUsuarios',[])
    }

    getCardapio(){
        return this.jrpc.call('getCardapio',{})
    }

}
let api = new Api()
export default api;