// FilterPanel.jsx
function FilterPanel({ filters = [] }) {
  return (
    <div className="filter-panel">
      <h2>Фильтры</h2>
      <div className="filters-container">
        {filters}
      </div>
    </div>
  );
}
export default FilterPanel;
