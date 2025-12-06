import { useState } from "react";
import PhoneInput from "./PhoneInput";
import RememberMeCheckbox from "./RememberMeCheckbox";
import SubmitButton from "./SubmitButton";

function LoginForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    phone: "",
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
      // Передаем formData как есть, включая телефон
      await onSubmit({
        phone: formData.phone,
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