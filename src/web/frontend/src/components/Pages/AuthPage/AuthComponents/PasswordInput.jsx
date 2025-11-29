function PasswordInput({ value, onChange, error, disabled }) {
  const handleChange = (e) => {
    onChange("password", e.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor="password" className="form-label">
        Пароль *
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={value}
        onChange={handleChange}
        className={`form-input ${error ? "error" : ""}`}
        placeholder="Введите ваш пароль"
        disabled={disabled}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default PasswordInput;