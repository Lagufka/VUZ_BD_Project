import usePageTitle from "../../../hooks/UsePageTitle.jsx";
import { useState } from "react";
import LoginForm from "../../Feature/LoginForm.jsx";
import LoginHeader from "../../Feature/LoginHeader.jsx";
import "../../../styles/SellerAuthPage.css";

function SellerAuthPage() {
  usePageTitle("Авторизация продавца");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (formData) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Данные для авторизации:", formData);
      alert("Авторизация прошла успешно!");
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      throw new Error(
        "Ошибка авторизации. Проверьте данные и попробуйте снова."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LoginHeader headerText={"Вход в акаунт продавца"} />
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <a href="seller_profile/2">Профиль продавца</a>
      </div>
    </div>
  );
}

export default SellerAuthPage;
