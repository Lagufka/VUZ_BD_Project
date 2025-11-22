import usePageTitle from "../../Hooks/UsePageTitle";
import { useState } from "react";
import "./AuthPage.css"


function AuthPage() {
  usePageTitle("Авторизация");

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (
      !/^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(
        formData.phone.replace(/\s/g, "")
      )
    ) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
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
      console.log("Данные для авторизации:", {
        phone: formData.phone,
        password: formData.password,
        rememberMe,
      });

      // Успешная авторизация
      alert("Авторизация прошла успешно!");
      // Здесь можно добавить редирект или обновление состояния приложения
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      setErrors({
        submit: "Ошибка авторизации. Проверьте данные и попробуйте снова.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneFocus = (e) => {
    if (!e.target.value) {
      e.target.value = "+7 ";
    }
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    let formattedValue = "+7 ";

    if (numbers.length > 1) {
      formattedValue += "(" + numbers.substring(1, 4);
    }
    if (numbers.length >= 4) {
      formattedValue += ") " + numbers.substring(4, 7);
    }
    if (numbers.length >= 7) {
      formattedValue += "-" + numbers.substring(7, 9);
    }
    if (numbers.length >= 9) {
      formattedValue += "-" + numbers.substring(9, 11);
    }

    return formattedValue;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      phone: formattedValue,
    }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Вход в аккаунт</h1>
          <p className="login-subtitle">Введите ваши данные для входа</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Номер телефона *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              className={`form-input ${errors.phone ? "error" : ""}`}
              placeholder="+7 (999) 123-45-67"
              disabled={isLoading}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
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
              onChange={handleInputChange}
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Введите ваш пароль"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Запомнить меня
            </label>
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="register-link">
            Еще нет аккаунта? <a href="/register">Зарегистрироваться</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
