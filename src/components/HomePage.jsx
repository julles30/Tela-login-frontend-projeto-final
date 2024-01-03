import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css'
import { Link } from 'react-router-dom';
import { faStar as solidStar, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactStars from "react-rating-stars-component";


// Carrega e manipula a HomePage.
function HomePage() {
    // Declaração de vários estados para armazenar informações do usuário e gerenciar o estado do componente
    const [rating, setRating] = useState(0);
    const [ratings, setRatings] = useState({});

    // Recuperar o usuário no localStorage
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const [movies, setMovies] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    let timeoutId;

    const handleRatingChange = (movie, newRating) => {
        // Controle de requisições, para caso o usuário fique clicando nas estrelas muito rapidamente
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Atualize o estado de classificações com a nova classificação para os filmes
        setRatings({
            ...ratings,
            [movie.id]: newRating
        });

        timeoutId = setTimeout(() => {
            setRating(newRating);

            const userid = user.user.id;
            const movieid = movie.id;
            // Altera a data para o formato 'YYYY-MM-DD'
            const evaluationdate = new Date().toISOString().slice(0, 10)

            axios.get(`http://localhost:3000/evaluate/${userid}/${movieid}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            }).then(response => {
                if (Object.keys(response.data).length === 0) {
                    // Se a avaliação não existir, cria uma nova avaliação 
                    axios.post('http://localhost:3000/evaluate', { userid, movieid, rating: newRating, evaluationdate }, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    }).then(response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.error(error)
                    });
                } else {
                    // Se a avaliação existir, atualiza a avaliação
                    axios.put(`http://localhost:3000/evaluate/${userid}/${movieid}`, { rating: newRating, evaluationdate }, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    }).then(response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.error(error)
                    });
                }
            }).catch(error => {
                console.error(error)
            });
            localStorage.setItem(`rating-${movie.id}`, newRating)
        }, 500); // 0.5s de atraso

    };

    useEffect(() => {
        // Pegar os filmes do banco de dados
        axios.get('http://localhost:3000/movie').then(response => {
            setMovies(response.data);
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                setIsLoggedIn(true)
                // Pegar as notas do sistema para renderizar nas estrelas
                // Uma “Promessa” (Promise) é um objeto em JavaScript que é usado para lidar com operações assíncronas. Uma operação assíncrona é uma operação que leva algum tempo para ser concluída, como uma solicitação de rede.
                const ratings = {};
                const promises = response.data.map(async movie => {
                    try {
                        const averageResponse = await axios.get(`http://localhost:3000/evaluate/average/${movie.id}`, {
                            headers: { 'Authorization': `Bearer ${user.token}` }
                        });
                        movie.averageRating = averageResponse.data.averageRating;
                    } catch (error) {
                        console.error(error);
                    }
                    // Recuperar a avaliação do localStorage
                    const localRating = localStorage.getItem(`rating-${movie.id}`);
                    if (localRating) {
                        ratings[movie.id] = Number(localRating);
                    }
                });
                Promise.all(promises).then(() => setRatings(ratings));
            }
        });
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

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('user');
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
                    {isLoggedIn ? (
                        <div className='logado'>
                            <Link to={"/login"}>
                                <button className='button-reidirect'>
                                    Configurações da conta
                                </button>
                            </Link>
                            <a className='aa' onClick={handleLogout} href='/login'>
                                Logout
                            </a>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className='button-reidirect'>
                                Fazer Login
                            </button>
                        </Link>
                    )}
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
                        <div className="search">
                            <h3>
                                Filmes no catálogo
                            </h3>
                            <div className='pesq'>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                <input
                                    name='pesq'
                                    type="text"
                                    placeholder='Digite o nome do filme'
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='filmes'>
                            <table className='tabela-filmes'>
                                <thead>
                                    <tr>
                                        <th>
                                            Título
                                        </th>
                                        <th>
                                            Diretor
                                        </th>
                                        <th>
                                            Data de lançamento
                                        </th>
                                        <th>
                                            Duração
                                        </th>
                                        <th>
                                            Gênero
                                        </th>
                                        <th>
                                            Empresa
                                        </th>
                                        {isLoggedIn && (
                                            <>
                                                <th>
                                                    Sua nota
                                                </th>
                                                <th>
                                                    Média de notas
                                                </th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase())).map(movie => (
                                        <tr key={movie.id}>
                                            <td><Link to={`/movie/${movie.id}`}>{movie.title}</Link></td>
                                            <td>{movie.director}</td>
                                            <td>{formatDate(movie.releasedate)}</td>
                                            <td>{movie.duration} min</td>
                                            <td>{movie.genre}</td>
                                            <td>{movie.productioncompany}</td>
                                            {isLoggedIn && (
                                                <>
                                                    <td>
                                                        <ReactStars
                                                            count={5}
                                                            value={ratings[movie.id] || 0}
                                                            size={24}
                                                            activeColor='#ffd700'
                                                            onChange={newRating => handleRatingChange(movie, newRating)}
                                                        />
                                                    </td>
                                                    <td>{movie.averageRating}</td>
                                                </>
                                            )}
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
