import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ProductCard.css";

const ProductCard = ({ id, name, price, quantity, image, className = "" }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  const getQuantityText = (quantity) => {
    if (quantity === 0) return "Нет в наличии";
    if (quantity < 5) return `Осталось ${quantity} шт.`;
    return `В наличии ${quantity} шт.`;
  };

  const getQuantityClassName = (quantity) => {
    if (quantity === 0) return "quantity-out-of-stock";
    if (quantity < 5) return "quantity-low";
    return "quantity-available";
  };

  return (
    <div
      className={`product-card ${className}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
    >
      <div className="product-card__image-container">
        <img
          src={image}
          alt={name}
          className="product-card__image"
          loading="lazy"
        />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">{name}</h3>

        <div className="product-card__price">{formatPrice(price)}</div>

        <div
          className={`product-card__quantity ${getQuantityClassName(quantity)}`}
        >
          {getQuantityText(quantity)}
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
