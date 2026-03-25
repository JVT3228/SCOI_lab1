import React from 'react';
import trashicon from '../icons8-полная-корзина.gif';

const LayerItem = ({ layer, index, totalLayers, onUpdate, onRemove, onMoveUp, onMoveDown }) => {
  const blendModes = ['normal', 'mult', 'sum', 'sub', 'max', 'geom', 'sr'];

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '8px',
      marginBottom: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={layer.dataURL} alt="layer" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '8px' }} />
        <div style={{ flex: 1 }}>
          <select
            value={layer.blendMode}
            onChange={(e) => onUpdate(layer.id, 'blendMode', e.target.value)}
            style={{ width: '100%', marginBottom: '4px' }}
          >
            {blendModes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
          <label>
            Opacity: {Math.round(layer.opacity * 100)}%
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={layer.opacity * 100}
              onChange={(e) => onUpdate(layer.id, 'opacity', parseInt(e.target.value) / 100)}
              style={{ width: '100%' }}
            />
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', textAlign: 'center' }}>
            <label>
              X: <input
                type="number"
                value={layer.offsetX}
                onChange={(e) => onUpdate(layer.id, 'offsetX', parseInt(e.target.value) || 0)}
                style={{ width: '60px' }}
              />
            </label>
            <label>
              Y: <input
                type="number"
                value={layer.offsetY}
                onChange={(e) => onUpdate(layer.id, 'offsetY', parseInt(e.target.value) || 0)}
                style={{ width: '60px' }}
              />
            </label>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
            {layer.width} x {layer.height}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <label>
              <input
                type="checkbox"
                checked={layer.channels.r}
                onChange={(e) => onUpdate(layer.id, 'channels', { ...layer.channels, r: e.target.checked })}
              /> R
            </label>
            <label>
              <input
                type="checkbox"
                checked={layer.channels.g}
                onChange={(e) => onUpdate(layer.id, 'channels', { ...layer.channels, g: e.target.checked })}
              /> G
            </label>
            <label>
              <input
                type="checkbox"
                checked={layer.channels.b}
                onChange={(e) => onUpdate(layer.id, 'channels', { ...layer.channels, b: e.target.checked })}
              /> B
            </label>
          </div>
          <div style={{ marginTop: '8px' }}>
            <label>
              <input
                type="checkbox"
                checked={layer.stretch}
                onChange={(e) => onUpdate(layer.id, 'stretch', e.target.checked)}
              /> Растянуть до макс размера
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
          <button onClick={() => onMoveUp(index)} disabled={index === 0}>▲</button>
          <button onClick={() => onMoveDown(index)} disabled={index === totalLayers - 1}>▼</button>
          <button onClick={() => onRemove(layer.id)} style={{ marginTop: '4px' }}>
            <div>
              <img src={trashicon} alt="🗑️" width='12px' height='12px'/>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayerItem;