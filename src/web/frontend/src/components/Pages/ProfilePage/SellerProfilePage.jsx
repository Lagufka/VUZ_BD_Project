import { useParams } from "react-router-dom";
import { useState } from "react";
import usePageTitle from "../../Hooks/UsePageTitle";
import "./UserProfilePage.css";

function SellerProfilePage() {
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
          <h1 className="profile-title">Личный кабинет продавца</h1>
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

          <a href="/"></a>
        </div>
        <a href="/seller_profile/4/orders">Ваши заказы</a>
      </div>
    </div>
  );
}

export default SellerProfilePage;
