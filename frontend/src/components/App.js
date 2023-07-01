import React from 'react';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { PopupWithForm } from './PopupWithForm';
import { ImagePopup } from './ImagePopup';
import api from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Login } from './Login';
import { Register } from './Register';
import { ProtectedRoute } from './ProtectedRoute';
import { InfoToolTip } from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isInfoToolTip, setIsInfoToolTip] = React.useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate(); 

  React.useEffect(() => {
    if(loggedIn) {
      Promise.all([
        api.getCards(),
        api.getCurrentUser()
      ])
        .then(([cards, user]) => {
          setCards(cards);
          setCurrentUser(user);
        })
        .catch(err => console.log(err));
    }
  }, [loggedIn]);

  React.useEffect(() => {
    if(loggedIn) {
      navigate("/", { replace: true });
    }
  }, [loggedIn, navigate]);

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if(token) {
      auth.checkToken(token)
      .then((res) => {
        if (res) {
          api.setToken(token);
          setLoggedIn(true);
          navigate("/", { replace: true });
        }
      })
      .catch(err => console.log(err))
    }
  }, [navigate])

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }
  
  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
    setIsInfoToolTip(false);
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(id => id === currentUser._id);
    
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
        setCards((state) => 
        state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch(err => console.log(err));
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => 
      state.filter((c) => c._id !== card._id));
    })
    .catch(err => console.log(err));
  }

  const handleUpdateUser = (user) => {
    api.editUserInfo(user)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => console.log(err));
  }

  const handleUpdateAvatar = (link) => {
    api.updateAvatar(link)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => console.log(err));
  }

  const handleAddPlaceSubmit = (card) => {
    api.addCard(card)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch(err => console.log(err));
  }

  const handleLogin = ({email, password}) => {
    auth.authorize(email, password)
    .then((data) => {
      if(data.token) {
        setLoggedIn(true);
        setEmail(email);
      }
      localStorage.setItem("jwt", data.token);
    })
    .catch(err => console.log(err))
  }

  const handleSignOut = () => {
    setLoggedIn(false);
    setEmail('');
    navigate("/sign-in", { replace: true });
    localStorage.removeItem("jwt");
  }

  const handleRegister = ({email, password}) => {
    auth.register(email, password)
    .then(() => {
      setUserData({email, password});
      setIsInfoToolTip(true);
      setIsRegisterSuccess(true);
      navigate("/sign-in", { replace: true });
    })
    .catch((err) => {
      setIsInfoToolTip(true);
      setIsRegisterSuccess(false);
      console.log(err);
    })
  }

  /*function handleCheckToken() {
    const jwt = localStorage.getItem('jwt');
    if(jwt) {
      auth.checkToken(jwt)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          navigate("/", { replace: true });
        }
      })
      .catch(err => console.log(err))
    }
  }*/

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedIn={loggedIn} email={email} handleSignOut={handleSignOut} />
        <Routes>
          <Route 
              path="/sign-in"
              element={
                <Login onLogin={handleLogin} />
              }
            />
          <Route 
            path="/sign-up"
            element={
              <Register onRegister={handleRegister}/>
            }
          />
          <Route 
            path="/"
            element={
              <ProtectedRoute
                userData={userData}
                loggedIn={loggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                component={Main}
              />
            }
          />
          <Route
              path="*"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/sign-in" replace />
                )
              }
            />
        </Routes>
        {loggedIn && <Footer />}
        <EditProfilePopup 
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup 
          isOpen={isEditAvatarPopupOpen} 
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup 
          isOpen={isAddPlacePopupOpen} 
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <PopupWithForm
          name={'popup_type_confirm'}
          title={'Вы уверены?'}
          buttonText={'Да'}
          onClose={closeAllPopups}
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoToolTip 
          isOpen={isInfoToolTip}
          onClose={closeAllPopups}
          isRegisterSuccess={isRegisterSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
