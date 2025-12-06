import usePageTitle from "../../../hooks/UsePageTitle.jsx";
import { useState } from "react";
import LoginForm from "../../Feature/LoginForm.jsx";
import LoginHeader from "../../Feature/LoginHeader.jsx";
import LoginFooter from "../../Feature/LoginFooter.jsx";
import API from "../../../api/api.js";
import "../../../styles/UserAuthPage.css";

function UserAuthPage() {
  usePageTitle("Авторизация пользователя");

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("phone");
  const [error, setError] = useState('');

  const handleRequestCode = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Устанавливаем phone из данных формы
      const phoneNumber = formData.phone;
      setPhone(phoneNumber);

      const result = await API.post("/api/auth/request_code", { 
        "phone": phoneNumber 
      });

      if (result.data && result.data.success) {
        setStep('code');
        // В реальном приложении не показываем код пользователю!
        console.log('Debug code:', result.data.debug_code);
        alert(`Код для тестирования: ${result.data.debug_code}`);
      } else {
        setError(result.data?.message || 'Ошибка при отправке кода');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Ошибка соединения');
      console.error("Ошибка при запросе кода:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Проверяем код подтверждения
      const verifyResponse = await API.post("/api/auth/verify", {
        phone: phone,
        code: code
      });

      if (verifyResponse.data && verifyResponse.data.success) {
        // Получаем информацию о пользователе по номеру телефона
        const userResponse = await API.get(`/api/buyers/phone/${phone}`);

        if (userResponse.data && userResponse.data.id) {
          const userId = userResponse.data.id;
          
          // Сохраняем user_id в localStorage как auth_token
          localStorage.setItem('auth_token', String(userId));
          localStorage.setItem('user_id', String(userId));
          localStorage.setItem('user_phone', phone);
          
          // Если есть дополнительные данные пользователя, сохраняем их
          if (userResponse.data.name || userResponse.data.email) {
            localStorage.setItem('user', JSON.stringify(userResponse.data));
          }

          console.log(`User ID сохранен как auth_token: ${userId}`);

          // Перенаправляем на страницу профиля
          window.location.replace("/user_profile");
        } else {
          setError('Не удалось получить ID пользователя');
        }
      } else {
        setError(verifyResponse.data?.message || 'Неверный код подтверждения');
      }
    } catch (err) {
      console.error("Ошибка при проверке кода:", err);
      setError(err.response?.data?.message || err.message || 'Ошибка проверки кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setError('');
    setCode('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LoginHeader headerText={"Вход в акаунт пользователя"} />

        {step === "phone" ? (
          <>
            <LoginForm
              onSubmit={handleRequestCode}
              isLoading={isLoading}
            />
            {error && <div className="error-message">{error}</div>}
          </>
        ) : (
          <div className="code-verification">
            <h3>Введите код из SMS</h3>
            <p>Код отправлен на номер: {phone}</p>

            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                placeholder="1234"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={4}
                className="code-input"
              />
              <button
                type="submit"
                disabled={isLoading || code.length !== 4}
                className="verify-button"
              >
                {isLoading ? "Проверка..." : "Подтвердить"}
              </button>

              <button
                type="button"
                onClick={handleBackToPhone}
                className="back-button"
              >
                Изменить номер
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        <LoginFooter />
      </div>
    </div>
  );
}

export default UserAuthPage;