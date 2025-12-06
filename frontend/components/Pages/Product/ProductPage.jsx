import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import usePageTitle from "../../../hooks/UsePageTitle.jsx";
import API from "../../../api/api.js";
import "../../../styles/ProductPage.css";

function ProductPage() {
  usePageTitle("Страница товара");
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/api/products/${id}`);
        const data = response.data;
        setProduct({
          name: data.product_name,
          description: data.discription,
          stock: data.remaining_amount,
          price: data.price,
          seller: `${data.first_name} ${data.second_name} ${data?.patronymic}`,
          sellerPhone: data.seller_phone,
          sellerEmail: data.seller_email,
          weight: `${data.weight} кг.`,
          size: data.size,
        });
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyClick = () => {
    if (product) {
      alert(`Товар "${product.name}" добавлен в корзину!`);
      // Логика добавления в корзину
    }
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-header">
          <h1 className="product-title">{product.name}</h1>
        </div>
        <div className="product-content">
          <div className="product-info">
            <div className="product-section">
              <h3>Описание</h3>
              <p className="product-description">{product.description}</p>
            </div>
            <div className="product-details">
              <div className="detail-item">
                <span className="detail-label">Количество в наличии:</span>
                <span
                  className={`detail-value ${product.stock < 5 ? "low-stock" : ""}`}
                >
                  {product.stock} шт.
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Цена:</span>
                <span className="detail-value price">{product.price} ₽</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Продавец:</span>
                <span className="detail-value">{product.seller}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Размеры:</span>
                <span className="detail-value">{product.size}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Вес:</span>
                <span className="detail-value">{product.weight}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Телефон продавца:</span>
                <span className="detail-value">{product.sellerPhone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email продавца:</span>
                <span className="detail-value">{product.sellerEmail}</span>
              </div>
            </div>
            <button
              className="buy-button"
              onClick={handleBuyClick}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Товар закончился" : "Купить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
