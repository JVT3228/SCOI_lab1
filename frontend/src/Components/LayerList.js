import React from 'react';
import LayerItem from './LayerItem';

const LayerList = ({ layers, onUpdate, onRemove, onReorder }) => {
  const moveLayer = (dragIndex, hoverIndex) => {
    if (dragIndex === hoverIndex) return;
    const newLayers = [...layers];
    const dragged = newLayers[dragIndex];
    newLayers.splice(dragIndex, 1);
    newLayers.splice(hoverIndex, 0, dragged);
    onReorder(newLayers);
  };

  return (
    <div>
      {layers.map((layer, index) => (
        <LayerItem
          key={layer.id}
          layer={layer}
          index={index}
          totalLayers={layers.length}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onMoveUp={() => moveLayer(index, index - 1)}
          onMoveDown={() => moveLayer(index, index + 1)}
        />
      ))}
    </div>
  );
};

export default LayerList;