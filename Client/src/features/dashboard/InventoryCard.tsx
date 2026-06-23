interface CardData {
  id: string;
  image: string;
  name: string;
  sku: string;
  stockCount: number;
  status: 'Out of Stock' | 'Low Stock' | 'In Stock';
  theme: {
    text: 'var(--red)' | 'var(--yellow)' | 'var(--green)';
    background: 'var(--red-light)' | 'var(--yellow-light)' | 'var(--green-light)';
  };
}

const InventoryCard = ({ cardData }: { cardData: CardData }) => {
  return <div>{cardData.name}</div>;
};

export default InventoryCard;