
import store from '../store/grtfood' 

const {state,getters,mutations} = store; 

export default class grtfoodController { 

    static updateCardapio(payload){ 
        mutations.updateCardapio(state,payload)
    }
    
    static getCardapio(){
        return getters.getCardapio(state)
    }
    
    static adicionarPedidos(payload){
        mutations.adicionarPedidos(state,payload)
    }

    static getPedidos(){
        return getters.getPedidos(state)
    }

    static getPossibilidadeDeFazerPedidos(){
        return getters.getPossibilidadeDeFazerPedidos()
    }

    static updatePossibilidadeDefazerPedidos(){
        mutations.updatePossibilidadeDeFazerPedidos(state, payload)
    }

}