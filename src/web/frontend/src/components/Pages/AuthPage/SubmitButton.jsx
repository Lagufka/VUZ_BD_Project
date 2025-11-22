function SubmitButton({ isLoading }) {
  return (
    <button
      type="submit"
      className={`login-button ${isLoading ? "loading" : ""}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="spinner"></div>
          Вход...
        </>
      ) : (
        "Войти"
      )}
    </button>
  );
}

export default SubmitButton;