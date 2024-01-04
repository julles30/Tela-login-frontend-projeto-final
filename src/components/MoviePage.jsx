import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MoviePage.css'
import { Link } from 'react-router-dom';
import { faStar as solidStar, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function MoviePage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [actors, setActors] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('user');
    }

    useEffect(() => {
        axios.get(`http://localhost:3000/movie/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then(response => {
            setMovie(response.data[0]);
        });


        axios.get(`http://localhost:3000/actors/movie/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then(response => {
            setActors(response.data);
        });


        axios.get(`http://localhost:3000/evaluate/average/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then(response => {
            setAverageRating(response.data.averageRating);
        });
    }, [id]);

    if (!movie || actors.length === 0 || !averageRating) {
        return (
            <div className='loading'></div>
        );
    }


    function formatDate(date) {
        var date = new Date(date);
        var dia = date.getDate().toString().padStart(2, '0');
        var mes = (date.getMonth() + 1).toString().padStart(2, '0');
        var ano = date.getFullYear();
        return dia + "/" + mes + "/" + ano;
    }

    return (
        <div className="raiz">
            <div className='navbar'>
                <div className='navbar_content'>
                    <Link to={"/"}>
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
                    </Link>
                </div>
            </div>
            <div className="movieContent">
                <h1>{movie.title}</h1>
                <p><b>Diretor:</b> {movie.director}</p>
                <p><b>Data de Lançamento:</b> {formatDate(movie.releasedate)}</p>
                <p><b>Duração:</b> {movie.duration} min</p>
                <p><b>Gênero:</b> {movie.genre}</p>
                <p><b>Produtora:</b> {movie.productioncompany}</p>
                <p><b>Bilheteria: R$</b> {movie.boxoffice}</p>
                <p><b>Média IMDB:</b> {movie.mediumrating}</p>
                <h2>Atores Principais</h2>
                <ul>
                    {actors.map(actor => (
                        <li key={actor.id}>{actor.name}</li>
                    ))}
                </ul>
                <h2>Nota média no nosso site</h2>
                <p>{averageRating}</p>
            </div>
        </div>
    );
}

export default MoviePage;
