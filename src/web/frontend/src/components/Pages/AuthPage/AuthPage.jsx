import usePageTitle from "../../Hooks/UsePageTitle";
import { useState } from "react";
import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";
import LoginFooter from "./LoginFooter";
import "./AuthPage.css";


function AuthPage() {
  usePageTitle("Авторизация");

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
        <LoginHeader />
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <LoginFooter />
      </div>
    </div>
  );
}

export default AuthPage;
