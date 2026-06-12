// draggableNode.js

export const DraggableNode = ({ type, label, icon, subtitle, tone }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`draggable-node draggable-node--${tone ?? 'default'}`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          <span className="draggable-node__icon">{icon}</span>
          <span className="draggable-node__label">{label}</span>
          {subtitle && <span className="draggable-node__subtitle">{subtitle}</span>}
      </div>
    );
  };
  
