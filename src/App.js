import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage'
import LoginSignUp from './components/LoginSignUp/LoginSignUp';
import MoviePage from './components/MoviePage'

// Este arquivo App.js exporta um componente funcional sem nome (um componente anônimo) que retorna a estrutura da aplicação. 
// Ele importa um componente chamado LoginSignUp do diretório ./components/LoginSignUp/LoginSignUp e o renderiza dentro de uma <div>.

export default (props) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>
    </Router>
  )
};