function ProductCard({ id, name }) {
  return (
    <a href={"product/" + id} className="product-card">
      <p>{name}</p>
    </a>
  );
}

export default ProductCard;
