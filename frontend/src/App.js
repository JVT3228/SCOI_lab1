import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DropZone from './Components/DropZone';
import LayerList from './Components/LayerList';
import CompositeCanvas from './Components/CompositeCanvas';
import './App.css';

function App() {
  const [layers, setLayers] = useState([]);
  const [compositeImage, setCompositeImage] = useState('');
  const [fileName, setFileName] = useState('result.png');

  const updateComposite = useCallback(async () => {
    if (layers.length === 0) {
      setCompositeImage('');
      return;
    }
    const payload = {
      layers: layers.map(l => ({
        image: l.dataURL,
        blendMode: l.blendMode,
        opacity: l.opacity,
        offsetX: l.offsetX,
        offsetY: l.offsetY,
        stretch: l.stretch,
        channels: l.channels
      }))
    };
    try {
      const res = await axios.post('/api/composite/', payload);
      setCompositeImage(res.data.image);
    } catch (err) {
      console.error('Composite error:', err);
    }
  }, [layers]);

  useEffect(() => {
    updateComposite();
  }, [updateComposite]);

  const addLayer = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataURL = e.target.result;
    const img = new Image();
    img.onload = () => {
      const newLayer = {
        id: Date.now(),
        dataURL: dataURL,
        blendMode: 'normal',
        opacity: 1.0,
        offsetX: 0,
        offsetY: 0,
        stretch: false,
        channels: { r: true, g: true, b: true },
        width: img.width,    
        height: img.height   
      };
      setLayers(prev => [...prev, newLayer]);
    };
    img.src = dataURL;
  };
  reader.readAsDataURL(file);
};

  const updateLayer = (id, key, value) => {
    setLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, [key]: value } : layer
    ));
  };

  const removeLayer = (id) => {
    setLayers(prev => prev.filter(layer => layer.id !== id));
  };

  const reorderLayers = (newLayers) => {
    setLayers(newLayers);
  };

  const saveImage = () => {
    if (!compositeImage) return;
    let name = fileName.trim();
    if (name && !name.match(/\.(png|jpg|jpeg)$/i)) {
      name += '.png';
    }
    const link = document.createElement('a');
    link.download = name || 'result.png';
    link.href = compositeImage;
    link.click();
  };

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>

      <div style={{ width: '350px' }}>
        <DropZone onFile={addLayer} />
        <LayerList
          layers={layers}
          onUpdate={updateLayer}
          onRemove={removeLayer}
          onReorder={reorderLayers}
        />
      </div>

      <div style={{ flex: 1 }}>
        <CompositeCanvas image={compositeImage} />

        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderTop: '1px solid #ddd',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <label htmlFor="filename">Имя файла:</label>
          <input
            id="filename"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="result.png"
            style={{ flex: 1, padding: '8px' }}
          />
          <button
            onClick={saveImage}
            disabled={!compositeImage}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#37753a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;