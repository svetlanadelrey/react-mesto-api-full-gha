import React from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({card, onCardClick, onCardLike, onCardDelete}) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner === currentUser._id;
    const isLiked = card.likes.some(id => id === currentUser._id);
    const cardLikeButtonClassName = (
        `gallery__button-like ${isLiked && 'gallery__button-like_active'}`
    );

    const handleCardClick = () => {
        onCardClick(card);
    }

    const handleCardLike = () => {
        onCardLike(card);
    }

    const handleCardDelete = () => {
        onCardDelete(card);
    }

    return (
        <li 
            className="gallery__item">
            <img 
                className="gallery__image" 
                src={card.link} 
                alt={card.name} 
                onClick={handleCardClick}
            />
            {isOwn && 
                <button 
                    className="gallery__button-delete" 
                    type="button" 
                    aria-label="Удалить"
                    onClick={handleCardDelete}
                />
            }
            <div className="gallery__wrapper">
                <h2 className="gallery__title">{card.name}</h2>
                <div className="gallery__like-wrapper">
                    <button 
                        className={cardLikeButtonClassName} 
                        type="button" 
                        aria-label="Нравится"
                        onClick={handleCardLike}
                    />
                    <span className="gallery__like-counter">{card.likes.length}</span>
                </div>
            </div>
        </li>
    );
}

export { Card };