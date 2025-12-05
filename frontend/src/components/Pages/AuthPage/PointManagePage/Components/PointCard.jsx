import React from 'react';
import './PointCard.css';

const PointCard = ({ point, onDelete }) => {
  const getTypeLabel = (type) => {
    return type === 'pickup' ? 'ПВЗ' : 'Склад';
  };

  return (
    <div className="point-card">
      <div className="point-header">
        <span className="point-type">{getTypeLabel(point.type)}</span>
        <button 
          onClick={() => onDelete(point.id)}
          className="delete-button"
          aria-label="Удалить точку"
        >
          ×
        </button>
      </div>
      
      <div className="point-address">
        <h3>Адрес:</h3>
        <p>{point.address}</p>
      </div>
      
      {point.phone && (
        <div className="point-phone">
          <h3>Телефон:</h3>
          <p>{point.phone}</p>
        </div>
      )}
      
      <div className="point-id">
        ID: {point.id}
      </div>
    </div>
  );
};

export default PointCard;