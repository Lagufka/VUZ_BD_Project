import { useState } from "react";
import PointCard from "../Point/PointCard.jsx";
import "../../../styles/PointManagePage.css";

const PointManagePage = () => {
  // Пример данных - в реальном приложении будут приходить из props или API
  const [points, setPoints] = useState([
    {
      id: "1",
      address: "г. Москва, ул. Тверская, д. 10, офис 25",
      type: "pickup",
      phone: "+7 (999) 123-45-67",
    },
    {
      id: "2",
      address:
        "г. Санкт-Петербург, Невский проспект, д. 50, складской комплекс №3",
      type: "warehouse",
      phone: "",
    },
    {
      id: "3",
      address: 'г. Казань, ул. Баумана, д. 15, торговый центр "Центральный"',
      type: "pickup",
      phone: "+7 (987) 654-32-10",
    },
  ]);

  const handleDeletePoint = (pointId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту точку доставки?")) {
      setPoints((prevPoints) =>
        prevPoints.filter((point) => point.id !== pointId)
      );
    }
  };

  return (
    <div className="points-management">
      <section>
        <h2>Управление точками доставки</h2>

        {points.length === 0 ? (
          <div className="empty-state">
            <p>Нет зарегистрированных точек доставки</p>
          </div>
        ) : (
          <>
            <div className="points-stats">Всего точек: {points.length}</div>
            <div className="points-grid">
              {points.map((point) => (
                <PointCard
                  key={point.id}
                  point={point}
                  onDelete={handleDeletePoint}
                />
              ))}
            </div>
          </>
        )}
      </section>
      <a href="/point_register">Зарегистрировать точку</a>
    </div>
  );
};

export default PointManagePage;
