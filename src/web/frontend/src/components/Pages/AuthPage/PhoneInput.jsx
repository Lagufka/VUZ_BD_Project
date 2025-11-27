import { useRef } from "react";

function PhoneInput({ value, onChange, error, disabled }) {
  const previousLength = useRef(0);

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
    const inputValue = e.target.value;
    const currentLength = inputValue.length;

    // Определяем, стирает ли пользователь
    const isDeleting = currentLength < previousLength.current;

    if (isDeleting) {
      // При стирании передаем значение как есть
      onChange("phone", inputValue);
    } else {
      // При вводе форматируем
      onChange("phone", formatPhoneNumber(inputValue));
    }

    // Обновляем предыдущую длину
    previousLength.current = currentLength;
  };

  const handlePhoneFocus = (e) => {
    if (!e.target.value || e.target.value === "+7") {
      onChange("phone", "+7 ");
    }
  };

  const handleKeyDown = (e) => {
    // Обработка полной очистки поля (Ctrl+A + Delete)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      // Разрешаем выделение всего текста
      return;
    }
    
    // Если поле почти пустое и пользователь нажимает Backspace
    if (e.key === 'Backspace' && (value === "+7 " || value === "+7")) {
      e.preventDefault();
      onChange("phone", "");
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
        onKeyDown={handleKeyDown}
        className={`form-input ${error ? "error" : ""}`}
        placeholder="+7 (999) 123-45-67"
        disabled={disabled}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default PhoneInput;