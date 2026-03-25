import React from 'react';

const CompositeCanvas = ({ image }) => {
  return image ? (
    <div>
      <h3>Результат:</h3>
      <div
        style={{
          overflow: 'auto',         
          maxHeight: '80vh',         
          border: '1px solid #ccc',
          background: '#f0f0f0',
          borderRadius: '4px',
          padding: '4px'
        }}
      >
        <img
          src={image}
          alt="Composite"
          style={{
            maxWidth: '100%',        
            display: 'block',
            margin: '0 auto'        
          }}
        />
      </div>
    </div>
  ) : (
    <p>Нет слоёв</p>
  );
};

export default CompositeCanvas;