import usePageTitle from "../../Hooks/UsePageTitle";
import LoginForm from "./AuthComponents/LoginForm";
import LoginHeader from "./AuthComponents/LoginHeader";
import LoginFooter from "./AuthComponents/LoginFooter";
import "./UserAuthPage.css";


function PointAuthPage() {
  usePageTitle("Авторизация пользователя");

  return (
    <div className="login-page">
      <div className="login-container">
          <a href="/point_manage">Подтвердить честное управление точками доставки 3000</a>
      </div>
    </div>
  );
}

export default PointAuthPage;
