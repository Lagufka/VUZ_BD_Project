import usePageTitle from "../../Hooks/UsePageTitle";
import FilterPanel from "./FilterPanel/FilterPanel";
import ProductCard from "./ProductCard/ProductCard";
import ProductGrid from "./ProductGrid/ProductGrid";

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
        "123456789qwer tyuioasdfghj klzxcvbnm,12345678iuqwo uetyqieyncqoiwue hryiowrqeugb fioungfheoq wiuchbuqweoi uhncfqiwe ouhcfqwboiecfnhuh"
      }
    />
  ));

  return (
    <div id="catalog-grid">
      <FilterPanel filters={filters} />

      <ProductGrid productCards={productCards} />
    </div>
  );
}

export default HomePage;
