import { useState } from "react";
import PhoneInput from "./PhoneInput";
import PasswordInput from "./PasswordInput";
import RememberMeCheckbox from "./RememberMeCheckbox";
import SubmitButton from "./SubmitButton";

function LoginForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (
      !(/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/).test(
        formData.phone.replace(/\s/g, "")
      )
    ) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await onSubmit({
        phone: formData.phone,
        password: formData.password,
        rememberMe,
      });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const updateField = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <PhoneInput
        value={formData.phone}
        onChange={updateField}
        error={errors.phone}
        disabled={isLoading}
      />

      <PasswordInput
        value={formData.password}
        onChange={updateField}
        error={errors.password}
        disabled={isLoading}
      />

      <RememberMeCheckbox
        checked={rememberMe}
        onChange={setRememberMe}
        disabled={isLoading}
      />

      {errors.submit && <div className="submit-error">{errors.submit}</div>}

      <SubmitButton isLoading={isLoading} />
    </form>
  );
}

export default LoginForm;
