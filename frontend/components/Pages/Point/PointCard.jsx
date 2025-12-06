import "../../../styles/PointCard.css";

function PointCard({ point, onDelete, isDeleting }) {
  // Функция для форматирования адреса
  const formatAddress = (address) => {
    if (!address) return "Адрес не указан";
    
    // Если адрес содержит "г.", форматируем его
    if (address.includes("г.")) {
      const parts = address.split(",");
      if (parts.length > 2) {
        return (
          <>
            <span className="address-city">{parts[0]}</span>
            <span className="address-street">{parts.slice(1).join(",")}</span>
          </>
        );
      }
    }
    
    return address;
  };

  // Функция для форматирования телефона
  const formatPhone = (phone) => {
    if (!phone || phone === "Не указан") {
      return (
        <span className="phone-not-available">
          <span className="phone-icon">📵</span>
          Телефон не указан
        </span>
      );
    }
    
    // Простое форматирование телефонного номера
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      const formatted = `+7 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7, 9)}-${cleanPhone.slice(9)}`;
      return (
        <a href={`tel:${cleanPhone}`} className="phone-link">
          <span className="phone-icon">📱</span>
          {formatted}
        </a>
      );
    }
    
    return (
      <span className="phone-text">
        <span className="phone-icon">📱</span>
        {phone}
      </span>
    );
  };

  // Получение описания типа точки
  const getTypeDescription = (type) => {
    const descriptions = {
      "Пункт выдачи заказов": "Место получения заказов покупателями",
      "Склад": "Складское помещение для хранения товаров",
      "ПВЗ": "Пункт выдачи заказов для клиентов",
      "warehouse": "Склад для хранения и сортировки"
    };
    return descriptions[type] || "Точка доставки";
  };

  // Получение иконки типа точки
  const getTypeIcon = (type) => {
    const icons = {
      "Пункт выдачи заказов": "🏪",
      "Склад": "🏭",
      "ПВЗ": "🏪",
      "warehouse": "🏭",
      "pickup": "📍"
    };
    return icons[type] || "📍";
  };

  return (
    <div className="point-card">
      {/* Заголовок карточки с типом точки */}
      <div className="point-card-header">
        <div className="point-type">
          <span className="type-icon">{getTypeIcon(point.type)}</span>
          <span className="type-text">{point.type}</span>
        </div>
        <span className="point-status active">Активна</span>
      </div>

      {/* ID точки (опционально) */}
      <div className="point-id">
        <span className="id-label">ID:</span>
        <span className="id-value">{point.id}</span>
      </div>

      {/* Адрес */}
      <div className="point-address">
        <div className="address-header">
          <span className="address-icon">📍</span>
          <h4>Адрес точки</h4>
        </div>
        <div className="address-content">
          {formatAddress(point.address)}
        </div>
      </div>

      {/* Контактная информация */}
      <div className="point-contact">
        <div className="contact-header">
          <span className="contact-icon">📞</span>
          <h4>Контактная информация</h4>
        </div>
        <div className="contact-content">
          <div className="contact-phone">
            <span className="contact-label">Телефон:</span>
            <span className="contact-value">{formatPhone(point.phone)}</span>
          </div>
        </div>
      </div>

      {/* Описание типа точки */}
      <div className="point-description">
        <div className="description-content">
          <span className="description-icon">ℹ️</span>
          <span className="description-text">
            {getTypeDescription(point.type)}
          </span>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="point-info">
        <div className="info-item">
          <span className="info-icon">⏰</span>
          <div className="info-content">
            <span className="info-label">Режим работы:</span>
            <span className="info-value">10:00 - 20:00 (ежедневно)</span>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">📦</span>
          <div className="info-content">
            <span className="info-label">Принимает посылки:</span>
            <span className="info-value">до 20 кг</span>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="point-actions">
        <button
          onClick={() => {
            // В будущем можно добавить редактирование
            alert(`Редактирование точки ${point.id}\nЭта функция в разработке`);
          }}
          className="edit-btn"
          title="Редактировать информацию о точке"
        >
          ✏️ Редактировать
        </button>
        <button
          onClick={() => onDelete(point.id)}
          disabled={isDeleting}
          className={`delete-btn ${isDeleting ? 'deleting' : ''}`}
          title="Удалить точку доставки"
        >
          {isDeleting ? (
            <>
              <span className="spinner"></span>
              Удаление...
            </>
          ) : (
            "🗑️ Удалить"
          )}
        </button>
      </div>

      {/* Подсказка */}
      <div className="point-hint">
        <span className="hint-icon">💡</span>
        <span className="hint-text">
          Для изменения информации нажмите "Редактировать"
        </span>
      </div>
    </div>
  );
}

export default PointCard;