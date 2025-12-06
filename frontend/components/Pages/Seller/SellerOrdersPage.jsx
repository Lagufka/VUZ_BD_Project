import { useState } from "react";
import "../../../styles/SellerOrdersPage.css";

const SellerOrdersPage = () => {
  const [activeTab, setActiveTab] = useState("active");

  // Моковые данные для демонстрации
  const ordersData = {
    active: [
      {
        id: "ORD-001",
        productName: "Смартфон Samsung Galaxy S23",
        status: "В пути",
        price: 250,
        history: [
          { date: "2024-01-15 10:30", event: "Заказ принят" },
          { date: "2024-01-15 14:20", event: "Передан в службу доставки" },
          { date: "2024-01-16 09:15", event: "В пути к сортировочному центру" },
        ],
        productUrl: "/product/smartphone-samsung",
      },
      {
        id: "ORD-002",
        productName: "Наушники Apple AirPods Pro",
        status: "Ожидает отправки",
        price: 180,
        history: [
          { date: "2024-01-16 16:45", event: "Заказ принят" },
          { date: "2024-01-16 17:30", event: "Сборка заказа" },
        ],
        productUrl: "/product/airpods-pro",
      },
    ],
    completed: [
      {
        id: "ORD-003",
        productName: "Ноутбук Lenovo IdeaPad",
        status: "Доставлен",
        price: 320,
        history: [
          { date: "2024-01-10 11:20", event: "Заказ принят" },
          { date: "2024-01-10 15:40", event: "Передан в службу доставки" },
          { date: "2024-01-12 10:15", event: "Доставлен" },
        ],
        productUrl: "/product/laptop-lenovo",
      },
      {
        id: "ORD-004",
        productName: "Фитнес-браслет Xiaomi",
        status: "Доставлен",
        price: 120,
        history: [
          { date: "2024-01-08 09:15", event: "Заказ принят" },
          { date: "2024-01-09 12:30", event: "Передан в службу доставки" },
          { date: "2024-01-11 14:20", event: "Доставлен" },
        ],
        productUrl: "/product/fitness-band",
      },
    ],
  };

  const handleOrderClick = () => {
    // В реальном приложении здесь будет навигация
    // window.location.href = productUrl;
  };

  const currentOrders = ordersData[activeTab];

  return (
    <div className="orders-page">
      <div className="container">
        <section>
          <h2>Мои заказы</h2>

          {/* Вкладки */}
          <div className="orders-tabs">
            <button
              className={`tab-button ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Активные доставки ({ordersData.active.length})
            </button>
            <button
              className={`tab-button ${
                activeTab === "completed" ? "active" : ""
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Завершенные доставки ({ordersData.completed.length})
            </button>
          </div>

          {/* Список заказов */}
          <div className="orders-list">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => handleOrderClick(order.productUrl)}
              >
                <div className="order-header">
                  <h3 className="order-id">{order.id}</h3>
                  <span
                    className={`status ${order.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-product">
                  <h4 className="product-name">{order.productName}</h4>
                  <div className="delivery-price">
                    Стоимость доставки: <strong>{order.price} ₽</strong>
                  </div>
                </div>

                <div className="delivery-history">
                  <h5>История доставки:</h5>
                  <div className="history-timeline">
                    {order.history.map((item, index) => (
                      <div key={index} className="history-item">
                        <span className="history-date">{item.date}</span>
                        <span className="history-event">{item.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentOrders.length === 0 && (
            <div className="no-orders">
              <p>
                Нет {activeTab === "active" ? "активных" : "завершенных"}{" "}
                доставок
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SellerOrdersPage;
