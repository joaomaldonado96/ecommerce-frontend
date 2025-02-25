import Link from "next/link";
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div key={product.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
      <Image
        src={`/images/${product.id}.jpg`}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
      <p className="text-gray-600 flex-grow">{product.description}</p>
      <p className="text-xl font-bold mt-2">${product.price}</p>
      <Link href={`/product/${product.id}`}>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Ver detalles
        </button>
      </Link>
    </div>
  );
}
