import usePageTitle from "../../Hooks/UsePageTitle";
import FilterPanel from "./FilterPanel/FilterPanel";
import ProductCard from "./ProductCard/ProductCard";
import ProductGrid from "./ProductGrid/ProductGrid";
import Footer from "../../Navigation/Footer";
import "./HomePage.css";

function HomePage() {
  usePageTitle("Главная страница");

  let filters = Array.from([
    <h3 key={"filter 1"}>Фильтр 1</h3>,
    <h3 key={"filter 2"}>Фильтр 2</h3>,
    <h3 key={"filter 3"}>Фильтр 3</h3>,
  ]);

  let productCards = Array.from({ length: 20 }, (_, i) => (
    <ProductCard
      key={`product ${i}`}
      id={i}
      name={
        "Кросовки найк адидас"
      }
    />
  ));

  return (
    <div >
      <div id="catalog-grid">
      <FilterPanel filters={filters} />

      <ProductGrid productCards={productCards} />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
