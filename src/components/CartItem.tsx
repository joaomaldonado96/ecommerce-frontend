interface CartItemProps {
    item: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    };
    onQuantityChange: (id: string, change: number) => void;
    onRemove: (id: string) => void;
  }
  
  export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
    return (
      <div key={item.id} className="flex justify-between items-center border-b pb-2">
        <div>
          <p className="text-lg font-semibold">{item.name}</p>
          <p className="text-gray-700">${item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => onQuantityChange(item.id, -1)}
          >
            -
          </button>
          <span className="text-lg">{item.quantity}</span>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => onQuantityChange(item.id, 1)}
          >
            +
          </button>
        </div>
        <button className="text-red-500" onClick={() => onRemove(item.id)}>
          Eliminar
        </button>
      </div>
    );
  }
  