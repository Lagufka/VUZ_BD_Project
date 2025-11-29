function LoginHeader({ headerText }) {
  return (
    <div className="login-header">
      <h1 className="login-title">{headerText}</h1>
      <p className="login-subtitle">Введите ваши данные для входа</p>
    </div>
  );
}

export default LoginHeader;