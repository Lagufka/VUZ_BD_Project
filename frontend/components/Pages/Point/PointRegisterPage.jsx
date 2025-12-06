import { useState } from "react";
import "../../../styles/PointRegisterPage.css";
import PhoneInput from "../../Feature/PhoneInput";

const PointRegisterPage = () => {
  const [formData, setFormData] = useState({
    address: "",
    type: "pickup",
    phone: "",
  });

  const [errors, setErrors] = useState({});

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
    }

    if (
      formData.phone &&
      !/^[+]?[78]?[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Здесь будет логика отправки данных
      console.log("Данные формы:", formData);
      alert("Точка доставки успешно зарегистрирована!");

      // Сброс формы
      setFormData({
        address: "",
        type: "pickup",
        phone: "",
      });
    }
  };

  return (
    <div className="delivery-registration">
      <section>
        <h2>Регистрация точки доставки</h2>
        <div className="registration-container">
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Адрес *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`form-input ${errors.address ? "error" : ""}`}
                placeholder="Введите полный адрес точки доставки"
                rows="3"
              />
              {errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Тип точки *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="pickup">Пункт выдачи заказов (ПВЗ)</option>
                <option value="warehouse">Склад</option>
              </select>
            </div>

            {/* <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Номер телефона
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div> */}

            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneInputChange}
              error={errors.phone}
            />

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Зарегистрировать точку
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PointRegisterPage;
