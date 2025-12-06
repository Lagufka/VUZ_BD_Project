import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../hooks/UsePageTitle.jsx";
import API from "../../../api/api.js";
import "../../../styles/UserProfilePage.css";

function UserProfilePage() {
  usePageTitle("Профиль");
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для проверки авторизации и загрузки данных пользователя
  const loadUserData = async () => {
    const userId = localStorage.getItem('user_id') || localStorage.getItem('auth_token');
    
    // Если пользователь не авторизован - перенаправляем на страницу авторизации
    if (!userId) {
      navigate("/user_auth");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/api/buyers/${userId}`);
      
      if (response.data) {
        // Формируем полное имя из частей
        const fullName = `${response.data.second_name || ''} ${response.data.first_name || ''} ${response.data.patronymic || ''}`.trim();
        
        setUser({
          id: response.data.id,
          fullName: fullName || "Не указано",
          firstName: response.data.first_name || "",
          secondName: response.data.second_name || "",
          patronymic: response.data.patronymic || "",
          phone: response.data.phone_number || "Не указан",
          email: response.data.email || "Не указан"
        });
      } else {
        setError("Не удалось загрузить данные пользователя");
      }
    } catch (err) {
      console.error("Ошибка при загрузке данных пользователя:", err);
      setError("Ошибка при загрузке данных. Пожалуйста, попробуйте позже.");
      
      // Если ошибка 404 или 401, возможно, токен недействителен
      if (err.response?.status === 401 || err.response?.status === 404) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Функция для выхода из системы
  const handleLogout = () => {
    // Удаляем все данные пользователя из localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user');
    
    // Перенаправляем на страницу авторизации
    navigate("/user_auth");
  };

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    loadUserData();
  }, []);

  // Если загрузка
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка данных профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-container">
            <h2>Ошибка</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Попробовать снова
            </button>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Если данные пользователя не загружены
  if (!user) {
    return null; // или редирект произойдет в loadUserData
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Заголовок страницы */}
        <div className="profile-header">
          <h1 className="profile-title">Личный кабинет</h1>
          <button onClick={handleLogout} className="logout-header-button">
            Выйти
          </button>
        </div>

        {/* Основная информация пользователя */}
        <div className="profile-content">
          <div className="user-info-section">
            <h2 className="section-title">Основная информация</h2>
            <div className="user-info-card">
              <div className="info-row">
                <span className="info-label">ФИО:</span>
                <span className="info-value">{user.fullName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Имя:</span>
                <span className="info-value">{user.firstName || "Не указано"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Фамилия:</span>
                <span className="info-value">{user.secondName || "Не указано"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Отчество:</span>
                <span className="info-value">{user.patronymic || "Не указано"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Номер телефона:</span>
                <span className="info-value phone">{user.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value email">{user.email}</span>
              </div>

            </div>
          </div>

          <div className="profile-actions">
            <div className="parent">
              <a href="/user_profile/orders" className="orderButton">Ваши заказы</a>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;