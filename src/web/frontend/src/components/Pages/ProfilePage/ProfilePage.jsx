import { useParams } from "react-router-dom";
import { useState } from "react";
import usePageTitle from "../../Hooks/UsePageTitle";
import "./ProfilePage.css"

function ProfilePage() {
  usePageTitle("Профиль");
  const { id } = useParams();

  const [user] = useState({
    id: 1,
    fullName: "Иванов Петр Сергеевич",
    phone: "+7 (999) 123-45-67",
    email: "petr.ivanov@example.com",
  });

  const [currentDeliveries] = useState([
    {
      id: 1,
      productName: "Смартфон Samsung Galaxy S23",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-20",
      status: "В пути",
      price: 79999,
      trackingNumber: "TRK123456789",
    },
    {
      id: 2,
      productName: "Наушники Sony WH-1000XM4",
      orderDate: "2024-01-10",
      deliveryDate: "2024-01-18",
      status: "Собирается",
      price: 24999,
      trackingNumber: "TRK987654321",
    },
  ]);

  const [orderHistory] = useState([
    {
      id: 1,
      productName: "Ноутбук Apple MacBook Pro",
      orderDate: "2023-12-05",
      deliveryDate: "2023-12-10",
      status: "Доставлен",
      price: 159999,
    },
    {
      id: 2,
      productName: "Мышь Logitech MX Master 3",
      orderDate: "2023-11-20",
      deliveryDate: "2023-11-25",
      status: "Доставлен",
      price: 8999,
    },
    {
      id: 3,
      productName: "Клавиатура Keychron K2",
      orderDate: "2023-10-15",
      deliveryDate: "2023-10-22",
      status: "Доставлен",
      price: 12999,
    },
  ]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      Доставлен: "status-delivered",
      "В пути": "status-shipping",
      Собирается: "status-processing",
    };
    return statusClasses[status] || "status-default";
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Заголовок страницы */}
        <div className="profile-header">
          <h1 className="profile-title">Личный кабинет</h1>
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
                <span className="info-label">Номер телефона:</span>
                <span className="info-value phone">{user.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value email">
                  {user.email || "Не указан"}
                </span>
              </div>
            </div>
          </div>

          {/* Текущие доставки */}
          <div className="deliveries-section">
            <h2 className="section-title">Текущие доставки</h2>
            {currentDeliveries.length > 0 ? (
              <div className="deliveries-list">
                {currentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="delivery-card">
                    <div className="delivery-header">
                      <h3 className="product-name">{delivery.productName}</h3>
                      <span
                        className={`status-badge ${getStatusBadge(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <div className="delivery-details">
                      <div className="detail-row">
                        <span>Дата заказа:</span>
                        <span>
                          {new Date(delivery.orderDate).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>Ожидаемая доставка:</span>
                        <span>
                          {new Date(delivery.deliveryDate).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>Трек номер:</span>
                        <span className="tracking-number">
                          {delivery.trackingNumber}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>Стоимость:</span>
                        <span className="price">
                          {delivery.price.toLocaleString()} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Нет активных доставок</p>
              </div>
            )}
          </div>

          {/* История заказов */}
          <div className="order-history-section">
            <h2 className="section-title">История заказов</h2>
            {orderHistory.length > 0 ? (
              <div className="order-history-list">
                {orderHistory.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h3 className="product-name">{order.productName}</h3>
                      <span
                        className={`status-badge ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <div className="detail-row">
                        <span>Дата заказа:</span>
                        <span>
                          {new Date(order.orderDate).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>Дата доставки:</span>
                        <span>
                          {new Date(order.deliveryDate).toLocaleDateString(
                            "ru-RU"
                          )}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>Стоимость:</span>
                        <span className="price">
                          {order.price.toLocaleString()} ₽
                        </span>
                      </div>
                      {order.rating && (
                        <div className="detail-row">
                          <span>Ваша оценка:</span>
                          <span className="rating">
                            {"★".repeat(order.rating)}
                            {"☆".repeat(5 - order.rating)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>История заказов пуста</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
