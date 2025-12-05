import React, { useState } from "react";
import "./UserRegisterPage.css";
import SubmitButton from "../../AuthPage/AuthComponents/SubmitButton";
import PhoneInput from "../../AuthPage/AuthComponents/PhoneInput";
import PasswordInput from "../../AuthPage/AuthComponents/PasswordInput";

const UserRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name, value) => {
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

    // Валидация ФИО
    if (!formData.fullName.trim()) {
      newErrors.fullName = "ФИО обязательно";
    } else if (formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Введите фамилию, имя и отчество";
    }

    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (
      !(/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/).test(
        formData.phone.replace(/\s/g, "")
      )
    ) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    // Валидация email (не обязателен, но если указан - проверяем формат)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }
    // else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    //       newErrors.password = 'Пароль должен содержать буквы в верхнем и нижнем регистре и цифры';
    //     }

    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
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
      // Имитация запроса к API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Здесь будет реальный запрос к API
      console.log("Данные для регистрации:", {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || null,
        password: formData.password,
      });

      // Успешная регистрация
      alert("Регистрация прошла успешно!");
      // Здесь можно добавить редирект на страницу входа или автоматический вход
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setErrors({ submit: "Ошибка регистрации. Попробуйте позже." });
    } finally {
      setIsLoading(false);
    }
  };

  // const getPasswordStrength = (password) => {
  //   if (!password) return { strength: 0, text: '', color: '' };

  //   let strength = 0;
  //   if (password.length >= 6) strength += 1;
  //   if (/[a-z]/.test(password)) strength += 1;
  //   if (/[A-Z]/.test(password)) strength += 1;
  //   if (/\d/.test(password)) strength += 1;
  //   if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

  //   const strengthMap = {
  //     1: { text: 'Слабый', color: '#e74c3c' },
  //     2: { text: 'Слабый', color: '#e74c3c' },
  //     3: { text: 'Средний', color: '#f39c12' },
  //     4: { text: 'Хороший', color: '#3498db' },
  //     5: { text: 'Надежный', color: '#27ae60' }
  //   };

  //   return {
  //     strength: (strength / 5) * 100,
  //     ...strengthMap[strength] || { text: 'Очень слабый', color: '#e74c3c' }
  //   };
  // };

  // const passwordStrength = getPasswordStrength(formData.password);

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

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Пароль *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Введите пароль"
                disabled={isLoading}
              />
              {/* {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )} */}
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <div className="field-hint">
                {/* Минимум 6 символов, буквы в верхнем и нижнем регистре, цифры */}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Подтверждение пароля *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`form-input ${
                  errors.confirmPassword ? "error" : ""
                }`}
                placeholder="Повторите пароль"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
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
