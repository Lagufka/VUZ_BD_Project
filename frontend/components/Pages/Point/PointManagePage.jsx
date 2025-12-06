import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PointCard from "../Point/PointCard.jsx";
import API from "../../../api/api.js";
import "../../../styles/PointManagePage.css";

const PointManagePage = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedPointType, setSelectedPointType] = useState("all");
  const navigate = useNavigate();

  // Типы точек для фильтрации
  const pointTypes = [
    { value: "all", label: "Все типы" },
    { value: "ПВЗ", label: "Пункты выдачи заказов" },
    { value: "Склад", label: "Склады" }
  ];

  // Загрузка точек из API с фильтрацией
  const loadPoints = async (pageNum = 1, append = false, typeFilter = selectedPointType) => {
    try {
      setLoading(true);
      
      const params = {
        page: pageNum,
        page_size: 20
      };

      // Добавляем фильтр по типу, если выбран не "all"
      if (typeFilter !== "all") {
        params.point_type = typeFilter;
      }

      const response = await API.get("/api/points/", { params });

      if (response.data && response.data.points) {
        const newPoints = response.data.points;
        
        if (append) {
          setPoints(prev => [...prev, ...newPoints]);
        } else {
          setPoints(newPoints);
        }
        
        setHasMore(newPoints.length === 20);
      } else {
        setPoints([]);
        setHasMore(false);
      }
      
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке точек:", err);
      setError("Не удалось загрузить точки доставки. Пожалуйста, попробуйте позже.");
      if (!append) {
        setPoints([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Обработчик изменения фильтра
  const handleFilterChange = (type) => {
    setSelectedPointType(type);
    setPage(1);
    loadPoints(1, false, type);
  };

  // Удаление точки
  const handleDeletePoint = async (pointId) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту точку доставки?\n\nВнимание: Удаление точки может повлиять на активные заказы.")) {
      return;
    }

    try {
      setDeletingId(pointId);
      
      const response = await API.delete(`/api/points/${pointId}`);
      
      if (response.data && response.data.success) {
        setPoints(prevPoints => prevPoints.filter(point => point.id !== pointId));
        alert("✅ " + (response.data.message || "Точка успешно удалена"));
      } else {
        alert("❌ Не удалось удалить точку");
      }
    } catch (err) {
      console.error("Ошибка при удалении точки:", err);
      const errorMsg = err.response?.data?.message || "Ошибка при удалении точки";
      alert(`❌ ${errorMsg}\n\nПожалуйста, убедитесь, что на эту точку нет активных заказов.`);
    } finally {
      setDeletingId(null);
    }
  };

  // Загрузка следующей страницы
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPoints(nextPage, true);
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadPoints(1, false);
  }, []);

  // Обновление PointCard для работы с новой структурой данных
  const PointCardWrapper = ({ point, onDelete }) => {
    // Преобразуем тип точки для отображения
    const getPointTypeText = (type) => {
      const types = {
        "ПВЗ": "Пункт выдачи заказов",
        "Склад": "Склад"
      };
      return types[type] || type;
    };

    // Получаем иконку для типа точки
    const getPointTypeIcon = (type) => {
      const icons = {
        "ПВЗ": "🏪",
        "Склад": "🏭"
      };
      return icons[type] || "📍";
    };

    // Форматирование телефонного номера
    const formatPhoneNumber = (phone) => {
      if (!phone) return "Не указан";
      
      // Удаляем все нецифровые символы
      const digits = phone.replace(/\D/g, '');
      
      if (digits.length === 11) {
        return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
      }
      
      return phone;
    };

    return (
      <PointCard
        key={point.id}
        point={{
          id: point.id,
          address: point.addres,
          type: getPointTypeText(point.type),
          typeIcon: getPointTypeIcon(point.type),
          phone: formatPhoneNumber(point.phone_number),
          originalType: point.type
        }}
        onDelete={onDelete}
        isDeleting={deletingId === point.id}
      />
    );
  };

  // Если загрузка и нет данных
  if (loading && points.length === 0) {
    return (
      <div className="points-management">
        <section>
          <div className="header-with-actions">
            <h2>Управление точками доставки</h2>
          </div>
          
          <div className="info-section">
            <div className="info-card">
              <h3>👋 Добро пожаловать в систему управления точками доставки</h3>
              <p>Здесь вы можете управлять всеми точками выдачи заказов и складами вашей сети доставки.</p>
            </div>
          </div>
          
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загружаем информацию о точках доставки...</p>
            <p className="loading-subtext">Это может занять несколько секунд</p>
          </div>
        </section>
      </div>
    );
  }

  // Статистика по типам точек
  const stats = {
    total: points.length,
    pvz: points.filter(p => p.type === "ПВЗ").length,
    warehouse: points.filter(p => p.type === "Склад").length
  };

  return (
    <div className="points-management">
      <section>
        <div className="header-with-actions">
          <div>
            <h1>🏪 Управление точками доставки</h1>
            <p className="page-subtitle">Центр управления вашей сетью точек выдачи и складов</p>
          </div>
          <button 
            onClick={() => navigate("/point_register")}
            className="create-point-btn"
            title="Добавить новую точку в систему"
          >
            <span className="btn-icon">+</span>
            Создать новую точку
          </button>
        </div>

        {/* Информационный блок */}
        <div className="info-section">
          <div className="info-card">
            <h3>📋 О системе управления точками</h3>
            <p>Эта панель позволяет вам управлять всеми точками доставки вашей сети. Вы можете:</p>
            <ul className="features-list">
              <li>✅ Просматривать все активные точки доставки</li>
              <li>✅ Фильтровать точки по типу (ПВЗ или Склад)</li>
              <li>✅ Добавлять новые точки доставки</li>
              <li>✅ Удалять ненужные или неактивные точки</li>
              <li>✅ Просматривать контактную информацию по каждой точке</li>
            </ul>
            <div className="info-note">
              <strong>💡 Важно:</strong> Убедитесь, что на удаляемой точке нет активных заказов или ожидающих выдачи посылок.
            </div>
          </div>

          {/* Статистика */}
          <div className="stats-cards">
            <div className="stat-card total">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <h4>Всего точек</h4>
                <p className="stat-number">{stats.total}</p>
              </div>
            </div>
            <div className="stat-card pvz">
              <div className="stat-icon">🏪</div>
              <div className="stat-content">
                <h4>Пункты выдачи</h4>
                <p className="stat-number">{stats.pvz}</p>
              </div>
            </div>
            <div className="stat-card warehouse">
              <div className="stat-icon">🏭</div>
              <div className="stat-content">
                <h4>Склады</h4>
                <p className="stat-number">{stats.warehouse}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="filters-section">
          <h3>🔍 Фильтр точек</h3>
          <div className="filter-buttons">
            {pointTypes.map((type) => (
              <button
                key={type.value}
                className={`filter-btn ${selectedPointType === type.value ? 'active' : ''}`}
                onClick={() => handleFilterChange(type.value)}
              >
                {type.label}
                {type.value !== "all" && (
                  <span className="filter-count">
                    {type.value === "ПВЗ" ? stats.pvz : stats.warehouse}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="filter-help">
            Выберите тип точек для просмотра. ПВЗ — пункты выдачи заказов для клиентов. Склады — хранилища товаров.
          </p>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div>
              <h4>Произошла ошибка</h4>
              <p>{error}</p>
              <button onClick={() => loadPoints(1, false)} className="retry-btn">
                ↻ Попробовать снова
              </button>
            </div>
          </div>
        )}

        {points.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <h3>Точки доставки не найдены</h3>
            <p>
              {selectedPointType === "all" 
                ? "В системе еще нет зарегистрированных точек доставки."
                : `Нет точек доставки типа "${selectedPointType === "ПВЗ" ? "Пункты выдачи" : "Склады"}"`}
            </p>
            <div className="empty-actions">
              <button 
                onClick={() => navigate("/point_register")}
                className="create-first-point-btn"
              >
                📝 Создать первую точку
              </button>
              {selectedPointType !== "all" && (
                <button 
                  onClick={() => handleFilterChange("all")}
                  className="show-all-btn"
                >
                  Показать все точки
                </button>
              )}
            </div>
            <div className="empty-tips">
              <p><strong>Совет:</strong> При создании точки укажите:</p>
              <ul>
                <li>Полный адрес с городом, улицей и номером дома</li>
                <li>Контактный телефон для связи</li>
                <li>Правильный тип точки (ПВЗ или Склад)</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="points-stats">
              <div>
                <span className="points-count">Показано точек: <strong>{points.length}</strong></span>
                {selectedPointType !== "all" && (
                  <span className="filter-indicator">
                    Фильтр: {selectedPointType === "ПВЗ" ? "Пункты выдачи" : "Склады"}
                  </span>
                )}
              </div>
              {hasMore && (
                <button 
                  onClick={loadMore} 
                  disabled={loading}
                  className="load-more-btn"
                  title="Загрузить дополнительные точки"
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Загрузка...
                    </>
                  ) : (
                    "⤵ Загрузить еще"
                  )}
                </button>
              )}
            </div>
            
            <div className="points-grid">
              {points.map((point) => (
                <PointCardWrapper
                  key={point.id}
                  point={point}
                  onDelete={handleDeletePoint}
                />
              ))}
            </div>

            {loading && points.length > 0 && (
              <div className="loading-more">
                <div className="small-spinner"></div>
                <p>Ищем дополнительные точки доставки...</p>
              </div>
            )}

            {points.length > 0 && !hasMore && !loading && (
              <div className="end-of-list">
                <div className="end-icon">🏁</div>
                <p>Вы просмотрели все доступные точки доставки</p>
                <p className="end-subtext">Для добавления новых точек используйте кнопку "Создать новую точку"</p>
              </div>
            )}
          </>
        )}

        {/* Справочная информация */}
        <div className="help-section">
          <h3>❓ Справочная информация</h3>
          <div className="help-cards">
            <div className="help-card">
              <h4>🏪 Что такое ПВЗ?</h4>
              <p><strong>Пункт выдачи заказов (ПВЗ)</strong> — это место, где клиенты могут получить свои заказы. Обычно располагается в торговых центрах, отделениях почты или специализированных пунктах выдачи.</p>
            </div>
            <div className="help-card">
              <h4>🏭 Что такое Склад?</h4>
              <p><strong>Склад</strong> — это место хранения товаров перед их отправкой в ПВЗ или напрямую клиентам. Склады используются для временного хранения и сортировки заказов.</p>
            </div>
            <div className="help-card">
              <h4>📞 Контактный телефон</h4>
              <p>Укажите рабочий телефон точки для связи с администрацией или сотрудниками. Это поможет клиентам и курьерам решать вопросы по доставке.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PointManagePage;