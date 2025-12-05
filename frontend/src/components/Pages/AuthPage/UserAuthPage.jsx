import usePageTitle from "../../Hooks/UsePageTitle";
import { useState } from "react";
import LoginForm from "./AuthComponents/LoginForm";
import LoginHeader from "./AuthComponents/LoginHeader";
import LoginFooter from "./AuthComponents/LoginFooter";
import "./UserAuthPage.css";


function UserAuthPage() {
  usePageTitle("Авторизация пользователя");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Данные для авторизации:", formData);
      alert("Авторизация прошла успешно!");
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      throw new Error("Ошибка авторизации. Проверьте данные и попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <LoginHeader headerText={"Вход в акаунт пользователя"}/>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <LoginFooter />
      </div>
    </div>
  );
}

export default UserAuthPage;
