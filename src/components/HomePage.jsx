import React from 'react';
import './HomePage.css'
import { Link } from 'react-router-dom';
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function HomePage() {
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
                        <button className='button-login'>
                            Fazer Login
                        </button>
                    </Link>
                </div>
            </div>
            <div className='content'>
                <div className="content-1">
                    <div className='texto-inicial'>
                        <p>
                            <h3>
                                Bem vindo ao CineRating
                            </h3>
                            Ficamos feliz por você estar aqui. No CineRating você pode achar seus filmes favoritos e séries de TV de uma forma simples e fácil.
                            Usar o CineRating é rápido e eficiente: escolha seu filme favorito e dê notas e veja as avaliações das pessoas!
                            Ache o filme perfeito para assistir hoje à noite ou procure pelo seu filme favorito e encontre as plataformas legais online para assisti-lo.
                        </p>
                    </div>
                    <div className='cards-filmes'>
                        <div className='filmes'>

                        </div>
                    </div>
                </div>
            </div>
            <div className='footer'>
                <p>Copyright 2023</p>
                <p>Equipe CineRating</p>
            </div>
        </div>
    )
}

export default HomePage
