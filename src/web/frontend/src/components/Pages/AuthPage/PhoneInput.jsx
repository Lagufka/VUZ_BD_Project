function PhoneInput({ value, onChange, error, disabled }) {
  const formatPhoneNumber = (inputValue) => {
    const numbers = inputValue.replace(/\D/g, "");
    let formattedValue = "+7 ";

    if (numbers.length > 1) {
      formattedValue += "(" + numbers.substring(1, 4);
    }
    if (numbers.length >= 4) {
      formattedValue += ") " + numbers.substring(4, 7);
    }
    if (numbers.length >= 7) {
      formattedValue += "-" + numbers.substring(7, 9);
    }
    if (numbers.length >= 9) {
      formattedValue += "-" + numbers.substring(9, 11);
    }

    return formattedValue;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange("phone", formattedValue);
  };

  const handlePhoneFocus = (e) => {
    if (!e.target.value) {
      onChange("phone", "+7 ");
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="phone" className="form-label">
        Номер телефона *
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={value}
        onChange={handlePhoneChange}
        onFocus={handlePhoneFocus}
        className={`form-input ${error ? "error" : ""}`}
        placeholder="+7 (999) 123-45-67"
        disabled={disabled}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default PhoneInput;