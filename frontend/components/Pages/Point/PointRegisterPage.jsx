import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/PointRegisterPage.css";
import PhoneInput from "../../Feature/PhoneInput";
import API from "../../../api/api.js";

const PointRegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: "",
    type: "ПВЗ", // Изменено на значения из API
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = "Адрес обязателен для заполнения";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Адрес должен содержать не менее 10 символов";
    }

    if (formData.phone && !/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (!formData.type) {
      newErrors.type = "Выберите тип точки";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      // Подготавливаем данные для API
      const apiData = {
        addres: formData.address.trim(), // Обратите внимание: "addres" с одной "s"
        type: formData.type,
        phone_number: formData.phone || "" // Если телефон пустой, отправляем пустую строку
      };

      console.log("Отправка данных на API:", apiData);

      const response = await API.post("/api/points/", apiData);

      if (response.data && response.data.success) {
        setSuccessMessage(`✅ ${response.data.message || "Точка успешно зарегистрирована"}`);

        // Показываем ID созданной точки
        const pointId = response.data.point_id;
        if (pointId) {
          setSuccessMessage(prev => `${prev}\nID новой точки: ${pointId}`);
        }

        // Сброс формы после успешной регистрации
        setTimeout(() => {
          setFormData({
            address: "",
            type: "ПВЗ",
            phone: "",
          });

          // Автоматическое скрытие сообщения через 5 секунд
          setTimeout(() => {
            setSuccessMessage("");
            // Перенаправление на страницу управления точками через 3 секунды
            setTimeout(() => {
              navigate("/point_manage");
            }, 1000);
          }, 5000);
        }, 2000);
      } else {
        setErrors({ submit: response.data?.message || "Ошибка при регистрации точки" });
      }
    } catch (err) {
      console.error("Ошибка при регистрации точки:", err);

      let errorMessage = "Ошибка при регистрации точки. Пожалуйста, попробуйте позже.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Вы действительно хотите отменить регистрацию? Введенные данные будут потеряны.")) {
      navigate("/point_manage");
    }
  };

  const handleClearForm = () => {
    if (window.confirm("Очистить форму? Все введенные данные будут удалены.")) {
      setFormData({
        address: "",
        type: "ПВЗ",
        phone: "",
      });
      setErrors({});
      setSuccessMessage("");
    }
  };

  // Примеры адресов для подсказки
  const addressExamples = [
    "г. Москва, ул. Тверская, д. 10, офис 25",
    "г. Санкт-Петербург, Невский проспект, д. 50",
    "г. Казань, ул. Баумана, д. 15, ТЦ 'Центральный'"
  ];

  return (
    <div className="delivery-registration-page">
      <section>
        <div className="page-header">
          <h2>📝 Регистрация новой точки доставки</h2>
          <p className="page-subtitle">Заполните форму для добавления новой точки в систему доставки</p>
        </div>

        <div className="registration-container">
          {/* Информационный блок */}
          <div className="info-section">
            <div className="info-card">
              <h3>📋 Важная информация</h3>
              <ul className="info-list">
                <li>✅ Адрес должен быть точным и полным</li>
                <li>✅ Укажите корректный тип точки (ПВЗ или Склад)</li>
                <li>✅ Телефон необязателен, но желателен для связи</li>
                <li>✅ После регистрации точка появится в общем списке</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
            {/* Адрес */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                <span className="label-icon">📍</span>
                Адрес точки *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`form-input-textarea ${errors.address ? "error" : ""}`} // Измененный класс
                placeholder="Введите полный адрес точки доставки"
                rows="3"
                disabled={loading}
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
              <div className="input-hint">
                <span className="hint-icon">💡</span>
                <span className="hint-text">Примеры:</span>
                <ul className="examples-list">
                  {addressExamples.map((example, index) => (
                    <li key={index} className="example-item">
                      <button
                        type="button"
                        className="example-btn"
                        onClick={() => setFormData(prev => ({ ...prev, address: example }))}
                      >
                        {example}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Тип точки */}
            <div className="form-group">
              <label htmlFor="type" className="form-label">
                <span className="label-icon">🏷️</span>
                Тип точки *
              </label>
              <div className="type-selection">
                <div className="type-options">
                  <label className={`type-option ${formData.type === "ПВЗ" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="type"
                      value="ПВЗ"
                      checked={formData.type === "ПВЗ"}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="type-radio"
                    />
                    <div className="option-content">
                      <span className="option-icon">🏪</span>
                      <div className="option-text">
                        <strong>Пункт выдачи заказов (ПВЗ)</strong>
                        <p className="option-description">Клиенты забирают здесь свои заказы</p>
                      </div>
                    </div>
                  </label>

                  <label className={`type-option ${formData.type === "Склад" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="type"
                      value="Склад"
                      checked={formData.type === "Склад"}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="type-radio"
                    />
                    <div className="option-content">
                      <span className="option-icon">🏭</span>
                      <div className="option-text">
                        <strong>Склад</strong>
                        <p className="option-description">Хранение и сортировка товаров</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              {errors.type && (
                <span className="error-message">{errors.type}</span>
              )}
            </div>

            {/* Телефон */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📱</span>
                Номер телефона (необязательно)
              </label>
              <div className="phone-input-wrapper">
                <PhoneInput
                  value={formData.phone}
                  onChange={handlePhoneInputChange}
                  error={errors.phone}
                  disabled={loading}
                  name="phone"
                />
              </div>
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
              <div className="input-hint">
                <span className="hint-icon">ℹ️</span>
                <span className="hint-text">
                  Укажите телефон для связи с администрацией точки
                </span>
              </div>
            </div>

            {/* Сообщение об успехе */}
            {successMessage && (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <div className="success-content">
                  {successMessage.split('\n').map((line, index) => (
                    <p key={index} className="success-line">{line}</p>
                  ))}
                  <p className="success-note">
                    Через несколько секунд вы будете перенаправлены на страницу управления точками...
                  </p>
                </div>
              </div>
            )}

            {/* Ошибка отправки */}
            {errors.submit && (
              <div className="submit-error">
                <div className="error-icon">❌</div>
                <div className="error-content">
                  <strong>Ошибка:</strong>
                  <p>{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-button"
                disabled={loading}
              >
                ↩️ Отмена
              </button>
              <button
                type="button"
                onClick={handleClearForm}
                className="clear-button"
                disabled={loading}
              >
                🗑️ Очистить форму
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Регистрация...
                  </>
                ) : (
                  "✅ Зарегистрировать точку"
                )}
              </button>
            </div>

            {/* Подсказка по заполнению */}
            <div className="form-hint">
              <div className="hint-card">
                <span className="hint-icon-large">💡</span>
                <div className="hint-content">
                  <strong>Советы по заполнению:</strong>
                  <ul>
                    <li>Убедитесь, что адрес указан полностью и точно</li>
                    <li>Проверьте правильность введенного телефона</li>
                    <li>После регистрации точка появится в общем списке</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PointRegisterPage;