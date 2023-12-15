import './App.css';
import LoginSignUp from './components/LoginSignUp/LoginSignUp'

// Este arquivo App.js exporta um componente funcional sem nome (um componente anônimo) que retorna a estrutura da aplicação. 
// Ele importa um componente chamado LoginSignUp do diretório ./components/LoginSignUp/LoginSignUp e o renderiza dentro de uma <div>.

export default (props) => {
  return (
    <div>
      <LoginSignUp />
    </div>
  )
};