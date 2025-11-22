function FilterPanel({ filters }) {
  return (
    <aside className="filter-panel">
      <h1>Фильтры</h1>
      {filters}
      <button>Сбросить</button>
    </aside>
  );
}

export default FilterPanel;