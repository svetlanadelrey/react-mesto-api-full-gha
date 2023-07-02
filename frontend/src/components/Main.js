import React from 'react';
import { Card } from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main({cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, onCardDelete}) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main>
        <section className="profile">
          <div className="avatar profile__avatar">
            <button 
              className="avatar__button" 
              onClick={onEditAvatar} />
            <img
              className="avatar__image"
              src={currentUser.avatar}
              alt="Жак-Ив Кусто"
            />
          </div>
          <div className="profile__info">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button
              className="profile__button-edit"
              type="button"
              aria-label="Редактировать профиль"
              onClick={onEditProfile}
            />
            <p className="profile__paragraph">{currentUser.about}</p>
          </div>
          <button
            className="profile__button-add"
            type="button"
            aria-label="Добавить фото"
            onClick={onAddPlace}
          />
        </section>
        <section className="gallery" aria-label="Фотогалерея">
          <ul className="gallery__list">
            {
              cards.map((card) => 
                <Card card={card}
                  key={card._id}
                  onCardClick={onCardClick}
                  onCardLike={onCardLike}
                  onCardDelete={onCardDelete}
                />
            )}
          </ul>
        </section>
      </main>
    );
}

export { Main };