import React, { useRef } from 'react';

const DropZone = ({ onFile }) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) onFile(file);
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) onFile(file);
    });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '100px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '20px'
      }}
      onClick={() => fileInputRef.current.click()}
    >
      <p>Перетащите сюда изображения или кликните для выбора c компа</p>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default DropZone;