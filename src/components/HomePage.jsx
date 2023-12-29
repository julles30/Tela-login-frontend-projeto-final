import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css'
import { Link } from 'react-router-dom';
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function HomePage() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/movie').then(response => setMovies(response.data));
    }, []);

    function formatDate(date) {
        var date = new Date(date);

        // Esta linha cria um novo objeto Date a partir da string de data fornecida. O objeto Date é usado para trabalhar com datas e horas no JavaScript.
        var dia = date.getDate().toString().padStart(2, '0');

        // adiciona um zero à esquerda se o dia for um único dígito usando o método padStart()
        var mes = (date.getMonth() + 1).toString().padStart(2, '0');

        //+1 pois no getMonth Janeiro começa com zero.
        var ano = date.getFullYear();
        return dia + "/" + mes + "/" + ano;
    }

    return (
        <div>
            <div className='navbar'>
                <div className='navbar_content'>
                    <div className='logo'>
                        <h2>
                            CineRating
                        </h2>
                        <div className='stars'>
                            <FontAwesomeIcon icon={solidStar} />
                            <FontAwesomeIcon icon={solidStar} />
                            <FontAwesomeIcon icon={solidStar} />
                            <FontAwesomeIcon icon={solidStar} />
                            <FontAwesomeIcon icon={solidStar} />
                        </div>
                    </div>
                    <Link to="/login">
                        <button className='button-reidirect'>
                            Fazer Login
                        </button>
                    </Link>
                </div>
            </div>
            <div className='content'>
                <div className="content-1">
                    <div className='texto-inicial'>
                        <h3>
                            Bem vindo ao CineRating
                        </h3>
                        <p>
                            Ficamos feliz por você estar aqui. No CineRating você pode achar seus filmes favoritos e séries de TV de uma forma simples e fácil.
                            Usar o CineRating é rápido e eficiente: escolha seu filme favorito e dê notas e veja as avaliações das pessoas!
                            Ache o filme perfeito para assistir hoje à noite ou procure pelo seu filme favorito e encontre as plataformas legais online para assisti-lo.
                        </p>
                    </div>
                    <div className='area-filmes'>
                        <h3>
                            Filmes no catálogo
                        </h3>
                        <div className='filmes'>
                            <table className='tabela-filmes'>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Diretor</th>
                                        <th>Data de lançamento</th>
                                        <th>Duração</th>
                                        <th>Gênero</th>
                                        <th>Empresa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.map(movie => (
                                        <tr key={movie.id}>
                                            <td>{movie.title}</td>
                                            <td>{movie.director}</td>
                                            <td>{formatDate(movie.releasedate)}</td>
                                            <td>{movie.duration} min</td>
                                            <td>{movie.genre}</td>
                                            <td>{movie.productioncompany}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className='footer'>
                <p>Copyright 2023 〰</p>
                <p>Equipe CineRating</p>
            </div>
        </div>
    )
}

export default HomePage
