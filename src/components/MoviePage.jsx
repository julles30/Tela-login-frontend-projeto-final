import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MoviePage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [actors, setActors] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/movie/${id}`).then(response => {
            setMovie(response.data);
        });

        axios.get(`http://localhost:3000/actors/${id}`).then(response => {
            setActors(response.data);
        });
    }, [id]);

    if (!movie || actors.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{movie.title}</h1>
            <p>Director: {movie.director}</p>
            <p>{movie.director}</p>
            <p>{formatDate(movie.releasedate)}</p>
            <p>{movie.duration} min</p>
            <p>{movie.genre}</p>
            <p>{movie.productioncompany}</p>
            <h2>Actors</h2>
            <ul>
                {actors.map(actor => (
                    <li key={actor.id}>{actor.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default MoviePage;
