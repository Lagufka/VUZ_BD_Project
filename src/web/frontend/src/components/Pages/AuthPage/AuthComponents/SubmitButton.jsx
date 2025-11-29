// SubmitButton.js
function SubmitButton({ isLoading, buttonText = "Войти" }) {
  return (
    <button
      type="submit"
      className={`login-button ${isLoading ? "loading" : ""}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="spinner"></div>
          {buttonText.replace('ся', 'ется')}...
        </>
      ) : (
        buttonText
      )}
    </button>
  );
}

export default SubmitButton;