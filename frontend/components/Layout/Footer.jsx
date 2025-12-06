import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Дополнительные ссылки</h4>
            <a href="/seller_register" className="footer-link">
              Регистрация продавца
            </a>
            <a href="/seller_auth" className="footer-link">
              Вход продавца
            </a>
            <a href="/point_auth" className="footer-link">
              Управление точками
            </a>
          </div>

          <div className="footer-column">
            <h4>Социальные сети</h4>
            <a href="https://vk.com" className="footer-link">
              ВКонтакте
            </a>
            <a href="https://telegram.org" className="footer-link">
              Telegram
            </a>
            <a href="https://youtube.com" className="footer-link">
              YouTube
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Доставка 3000. Все права не защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
