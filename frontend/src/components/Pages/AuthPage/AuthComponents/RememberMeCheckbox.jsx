function RememberMeCheckbox({ checked, onChange, disabled }) {
  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  return (
    <div className="form-options">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <span className="checkmark"></span>
        Запомнить меня
      </label>
    </div>
  );
}

export default RememberMeCheckbox;