// HomePage.jsx
import { useState, useEffect } from "react";
import usePageTitle from "../../../hooks/UsePageTitle.jsx";
import FilterPanel from "../../Feature/FilterPanel.jsx";
import ProductCard from "../../Feature/ProductCard.jsx";
import ProductGrid from "../../Feature/ProductGrid.jsx";
import Footer from "../../Layout/Footer.jsx";
import API from "../../../api/api.js";
import "../../../styles/HomePage.css";

// Дебаунс хук
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

function HomePage() {
  usePageTitle("Главная страница");

  const pageSize = 30;

  // Состояния
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Фильтры
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  // Debounce
  const debouncedSearch = useDebounce(searchQuery);
  const debouncedMin = useDebounce(minPrice);
  const debouncedMax = useDebounce(maxPrice);

  // Загружаем данные с сервера
  useEffect(() => {
    loadProducts();
  }, [currentPage, debouncedSearch, debouncedMin, debouncedMax, hideOutOfStock]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        page_size: pageSize,
      };

      const response = await API.get("/api/products/", { params });
      const data = response.data;

      let list = data.products || [];

      // Клиентская фильтрация
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        list = list.filter(
          (p) =>
            p.product_name.toLowerCase().includes(q) ||
            p.discription.toLowerCase().includes(q)
        );
      }

      if (debouncedMin) {
        const min = parseFloat(debouncedMin);
        if (!isNaN(min)) list = list.filter((p) => p.price >= min);
      }

      if (debouncedMax) {
        const max = parseFloat(debouncedMax);
        if (!isNaN(max)) list = list.filter((p) => p.price <= max);
      }

      if (hideOutOfStock) {
        list = list.filter((p) => p.remaining_amount > 0);
      }

      setProducts(list);
      console.log(list);
      setTotalProducts(data.pagination.total);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setError("Ошибка при загрузке товаров");
    } finally {
      setLoading(false);
    }
  }

  // Пагинация
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageClick(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageClick(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxCount = 5;

    if (totalPages <= maxCount) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);

    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setHideOutOfStock(false);
    setCurrentPage(1);
  };

  // Сборка фильтров
  const filters = [
    <div key="search" className="filter-section">
      <h3>Поиск товаров</h3>
      <input
        type="text"
        placeholder="Введите название..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="filter-input"
      />
    </div>,

    <div key="price" className="filter-section">
      <h3>Цена</h3>

      <label>От:</label>
      <input
        type="number"
        value={minPrice}
        placeholder="0"
        onChange={(e) => {
          setMinPrice(e.target.value);
          setCurrentPage(1);
        }}
        className="filter-input"
      />

      <label>До:</label>
      <input
        type="number"
        value={maxPrice}
        placeholder="∞"
        onChange={(e) => {
          setMaxPrice(e.target.value);
          setCurrentPage(1);
        }}
        className="filter-input"
      />
    </div>,

    <div key="stock" className="filter-section">
      <h3>Наличие</h3>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={hideOutOfStock}
          onChange={(e) => {
            setHideOutOfStock(e.target.checked);
            setCurrentPage(1);
          }}
        />
        Только в наличии
      </label>
    </div>,

    <div key="reset" className="filter-section">
      <button className="filter-button" onClick={resetFilters}>
        Сбросить фильтры
      </button>
    </div>,
  ];

  return (
    <div>
      <div id="catalog-grid">
        <FilterPanel filters={filters} />

        <div className="product-grid-container">
          <div className="products-info">
            <p>Найдено: {totalProducts}</p>
            <p>
              Страница {currentPage} из {totalPages}
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Загрузка...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <ProductGrid>
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.product_name}
                    price={product.price}
                    quantity={product.remaining_amount}
                    description={product.discription}
                    seller={product.seller_full_name}
                  />
                ))
              ) : (
                <div className="no-products">
                  <h3>Товары не найдены</h3>
                </div>
              )}
            </ProductGrid>
          )}

          {/* ПАГИНАЦИЯ */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Назад
              </button>

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageClick(p)}
                  className={`page-number ${p === currentPage ? "active" : ""}`}
                >
                  {p}
                </button>
              ))}

              <button
                className="pagination-button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Вперед
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
