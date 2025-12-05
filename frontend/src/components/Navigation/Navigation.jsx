import { Link } from "react-router-dom";

function Navigation({ profileId }) {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>Доставка 3000</h1>
        </div>
        <nav className="nav-list">
          <Link to="/">
            <div className="link">Главная</div>
          </Link>
          <Link to={`/profile/${profileId}`}>
            <div className="link">Профиль</div>
          </Link>
          <Link to="/user_auth">
            <div className="link">Войти</div>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
