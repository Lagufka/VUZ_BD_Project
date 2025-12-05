import { useParams } from "react-router-dom";
import usePageTitle from "../../Hooks/UsePageTitle";
import "./ProductPage.css"

function ProductPage() {
  usePageTitle("Страница товара");
  const { id } = useParams();

  let product = {
    name: "Туфли adidas colab. DolceAndGabana",
    description: "Комфортные туфли Adidas. Ортопедическая стелька и качественные материалы для ежедневной носки. 35 размер.",
    stock: "5 ",
    price: "299",
    seller: "Иванов Иван Иванович",
    weight: "2.5 кг",
    size: "35x35x35 см"

  }
  const handleBuyClick = () => {
    alert(`Товар "${product.name}" добавлен в корзину!`);
    // Здесь можно добавить логику для добавления в корзину
  };

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
                <span className={`detail-value ${product.stock < 5 ? 'low-stock' : ''}`}>
                  {product.stock} шт.
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Цена:</span>
                <span className="detail-value price">{product.price.toLocaleString()} ₽</span>
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
            </div>
            
            <button 
              className="buy-button"
              onClick={handleBuyClick}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Товар закончился' : 'Купить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
