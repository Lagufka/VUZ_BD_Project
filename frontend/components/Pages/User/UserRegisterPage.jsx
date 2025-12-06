import { useState } from "react";
import API from "../../../api/api.js";
import SubmitButton from "../../Feature/SubmitButton.jsx";
import PhoneInput from "../../Feature/PhoneInput.jsx";
import "../../../styles/UserRegisterPage.css";

const UserRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "ФИО обязательно";
    } else if (formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Введите фамилию, имя";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (
      !/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(
        formData.phone.replace(/\s/g, "")
      )
    ) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const [second_name, first_name, patronymic] = formData.fullName
        .trim()
        .split(" ");

      const payload = {
        "first_name": first_name,
        "second_name": second_name,
        "patronymic": patronymic,
        "phone_number": formData.phone,
        "email": formData.email || null,
      };
      console.log(payload);
      await API.post("/api/buyers/register", payload);

      alert("Регистрация прошла успешно!");
      window.location.replace("/user_profile");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setErrors({ submit: "Ошибка регистрации. Попробуйте позже." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="register-container">
          <div className="register-header">
            <h1 className="register-title">Регистрация пользователя</h1>
            <p className="register-subtitle">Создайте новый аккаунт</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                ФИО *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`form-input ${errors.fullName ? "error" : ""}`}
                placeholder="Иванов Иван Иванович"
                disabled={isLoading}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            <PhoneInput
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              disabled={isLoading}
            />

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="example@mail.ru"
                disabled={isLoading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
              <div className="field-hint">Необязательное поле</div>
            </div>

            {errors.submit && (
              <div className="submit-error">{errors.submit}</div>
            )}

            <SubmitButton
              isLoading={isLoading}
              buttonText="Зарегистрироваться"
            />
          </form>

          <div className="register-footer">
            <p className="login-link">
              Уже есть аккаунт? <a href="/auth">Войти</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;
