interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
  }
  
  interface SaleProduct {
    product_id: number;
    quantity: number;
    unitPrice: number;
    product?: Product;
  }
  
  interface SaleProductCardProps {
    saleProduct: SaleProduct;
  }
  
  export default function SaleProductCard({ saleProduct }: SaleProductCardProps) {
    if (!saleProduct.product) return null;
  
    return (
      <div key={saleProduct.product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={`/images/${saleProduct.product.id}.jpg`}
          alt={saleProduct.product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{saleProduct.product.name}</h2>
          <p className="text-gray-600 text-sm">{saleProduct.product.description}</p>
          <p className="text-xl font-bold mt-2">Precio: ${saleProduct.product.price}</p>
          <p className="text-md font-medium mt-1">Cantidad: {saleProduct.quantity}</p>
        </div>
      </div>
    );
  }
  