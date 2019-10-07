
import store from '../store/grtfood' 

const {state,getters,mutations} = store; 

export default class grtfoodController { 

    static updateCardapio(payload){ 
        mutations.updateCardapio(state,payload)
    }
    
    static getCardapio(){
        return getters.getCardapio(state)
    }
    
    static updatePedidos(payload){
        mutations.updatePedidos(state,payload)
    }

    static getPedidos(){
        return getters.getPedidos(state)
    }

    static getPossibilidadeDeFazerPedidos(){
        return getters.getPossibilidadeDeFazerPedidos()
    }

    static updatePossibilidadeDefazerPedidos(payload){
        mutations.updatePossibilidadeDeFazerPedidos(state, payload)
    }

}