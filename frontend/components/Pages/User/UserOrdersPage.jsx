import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api.js";
import "../../../styles/UserOrdersPage.css";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parcels, setParcels] = useState([]); // Список посылок
  const [transfers, setTransfers] = useState({}); // История перемещений для каждой посылки
  const navigate = useNavigate();

  // Вместо загрузки заказов, загружаем посылки покупателя
  // Предполагаю, что есть API для получения посылок покупателя
  // Если нет, нужно получить этот эндпоинт

  const loadUserParcels = async () => {
    const userId = localStorage.getItem('user_id') || localStorage.getItem('auth_token');
    
    // Если пользователь не авторизован - перенаправляем на страницу авторизации
    if (!userId) {
      navigate("/user_auth");
      return;
    }

    try {
      setLoading(true);
      
      // ПРЕДПОЛОЖЕНИЕ: Есть API для получения посылок покупателя
      // Если нет такого API, нужно получить правильный эндпоинт
      const parcelsResponse = await API.get(`/api/buyers/${userId}/parcels`);
      
      if (parcelsResponse.data && parcelsResponse.data.parcels) {
        const parcelsList = parcelsResponse.data.parcels;
        setParcels(parcelsList);
        
        // Для каждой посылки загружаем историю перемещений
        const transfersPromises = parcelsList.map(parcel => 
          API.get(`/api/parcels/${parcel.id}/transfers`)
            .then(response => ({
              parcelId: parcel.id,
              transfers: response.data?.transfers || []
            }))
            .catch(err => {
              console.error(`Ошибка загрузки перемещений для посылки ${parcel.id}:`, err);
              return {
                parcelId: parcel.id,
                transfers: []
              };
            })
        );
        
        const transfersResults = await Promise.all(transfersPromises);
        const transfersMap = {};
        transfersResults.forEach(result => {
          transfersMap[result.parcelId] = result.transfers;
        });
        
        setTransfers(transfersMap);
      } else {
        // Если нет API для посылок, показываем сообщение
        setError("Информация о посылках временно недоступна");
        setParcels([]);
      }
    } catch (err) {
      console.error("Ошибка при загрузке посылок:", err);
      
      // Если 404 - возможно, эндпоинт не существует
      if (err.response?.status === 404) {
        setError("Функционал отслеживания посылок временно недоступен");
      } else {
        setError("Ошибка при загрузке данных. Пожалуйста, попробуйте позже.");
      }
      
      // Если ошибка 401, токен недействителен
      if (err.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        navigate("/user_auth");
      }
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация посылок по статусу
  const filterParcelsByStatus = (parcelsList, statusType) => {
    const ACTIVE_STATUSES = ["В обработке", "На складе", "В пути", "Готов к выдаче"];
    const COMPLETED_STATUSES = ["Получено"];
    
    if (statusType === "active") {
      return parcelsList.filter(parcel => {
        const parcelTransfers = transfers[parcel.id] || [];
        const lastTransfer = parcelTransfers[parcelTransfers.length - 1];
        return lastTransfer && ACTIVE_STATUSES.includes(lastTransfer.assigned_status);
      });
    } else {
      return parcelsList.filter(parcel => {
        const parcelTransfers = transfers[parcel.id] || [];
        const lastTransfer = parcelTransfers[parcelTransfers.length - 1];
        return lastTransfer && COMPLETED_STATUSES.includes(lastTransfer.assigned_status);
      });
    }
  };

  // Получение текущего статуса посылки
  const getParcelCurrentStatus = (parcelId) => {
    const parcelTransfers = transfers[parcelId] || [];
    const lastTransfer = parcelTransfers[parcelTransfers.length - 1];
    return lastTransfer ? lastTransfer.assigned_status : "Информация о статусе отсутствует";
  };

  // Получение истории перемещений для посылки
  const getParcelHistory = (parcelId) => {
    return transfers[parcelId] || [];
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Получение класса для статуса
  const getStatusClass = (status) => {
    const statusClasses = {
      'В обработке': 'status-processing',
      'На складе': 'status-warehouse',
      'В пути': 'status-shipping',
      'Готов к выдаче': 'status-ready',
      'Получено': 'status-delivered',
      'Информация о статусе отсутствует': 'status-default'
    };
    return statusClasses[status] || 'status-default';
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    loadUserParcels();
  }, []);

  // Если загрузка
  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка информации о посылках...</p>
          </div>
        </div>
      </div>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-container">
            <h2>Информация о доставке</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/user_profile")} className="back-button">
              Вернуться в профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeParcels = filterParcelsByStatus(parcels, "active");
  const completedParcels = filterParcelsByStatus(parcels, "completed");
  const currentParcels = activeTab === "active" ? activeParcels : completedParcels;

  return (
    <div className="orders-page">
      <div className="container">
        <section>
          <div className="page-header">
            <h2>Мои посылки</h2>
            <button onClick={() => navigate("/user_profile")} className="back-to-profile">
              ← Назад в профиль
            </button>
          </div>

          {/* Вкладки */}
          <div className="orders-tabs">
            <button
              className={`tab-button ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              В процессе ({activeParcels.length})
            </button>
            <button
              className={`tab-button ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Доставленные ({completedParcels.length})
            </button>
          </div>

          {/* Список посылок */}
          <div className="orders-list">
            {currentParcels.map((parcel) => {
              const currentStatus = getParcelCurrentStatus(parcel.id);
              const history = getParcelHistory(parcel.id);
              
              return (
                <div key={parcel.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3 className="order-id">Посылка #{parcel.id}</h3>
                      {parcel.tracking_number && (
                        <div className="tracking-number">Трек-номер: {parcel.tracking_number}</div>
                      )}
                    </div>
                    <span className={`status ${getStatusClass(currentStatus)}`}>
                      {currentStatus}
                    </span>
                  </div>

                  {/* Информация о содержимом посылки (если есть) */}
                  {parcel.content && (
                    <div className="parcel-content">
                      <h4>Содержимое:</h4>
                      <p>{parcel.content}</p>
                    </div>
                  )}

                  {parcel.weight && (
                    <div className="parcel-details">
                      <div className="detail-row">
                        <span className="detail-label">Вес:</span>
                        <span className="detail-value">{parcel.weight} кг</span>
                      </div>
                    </div>
                  )}

                  {/* История перемещений */}
                  {history.length > 0 ? (
                    <div className="delivery-history">
                      <h5>История перемещений:</h5>
                      <div className="history-timeline">
                        {history.map((transfer, index) => (
                          <div key={transfer.id} className="history-item">
                            <div className="history-step">
                              <div className="step-number">{index + 1}</div>
                              <div className="step-content">
                                <div className="step-status">
                                  <span className={`status-badge ${getStatusClass(transfer.assigned_status)}`}>
                                    {transfer.assigned_status}
                                  </span>
                                  <span className="step-date">{formatDate(transfer.created_date)}</span>
                                </div>
                                <div className="step-locations">
                                  {transfer.shipping_address && (
                                    <div className="step-from">
                                      <span className="step-label">Откуда:</span>
                                      <span className="step-address">{transfer.shipping_address}</span>
                                      {transfer.shipping_type && (
                                        <span className="step-type">({transfer.shipping_type})</span>
                                      )}
                                    </div>
                                  )}
                                  {transfer.destination_address && (
                                    <div className="step-to">
                                      <span className="step-label">Куда:</span>
                                      <span className="step-address">{transfer.destination_address}</span>
                                      {transfer.destination_type && (
                                        <span className="step-type">({transfer.destination_type})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {index < history.length - 1 && <div className="timeline-line"></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="no-history">
                      <p>Информация о перемещениях пока не доступна</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {currentParcels.length === 0 && (
            <div className="no-orders">
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>Посылки не найдены</h3>
                <p>
                  {activeTab === "active" 
                    ? "У вас нет активных посылок." 
                    : "У вас еще нет доставленных посылок."}
                </p>
                <button 
                  onClick={() => navigate("/")} 
                  className="browse-catalog-btn"
                >
                  На главную
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrdersPage;