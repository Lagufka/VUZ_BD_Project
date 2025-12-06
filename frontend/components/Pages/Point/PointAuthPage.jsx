import usePageTitle from "../../../hooks/UsePageTitle.jsx";
import "../../../styles/UserAuthPage.css";

function PointAuthPage() {
  usePageTitle("Авторизация пользователя");

  return (
    <div className="login-page">
      <div className="login-container">
        <a href="/point_manage">
          Подтвердить честное управление точками доставки 3000
        </a>
      </div>
    </div>
  );
}

export default PointAuthPage;
