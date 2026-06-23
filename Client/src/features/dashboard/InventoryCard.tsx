import { useTranslation } from 'react-i18next';

interface CardData {
  id: string;
  image: string;
  name: string;
  sku: string;
  stockCount: number;
  status: 'Out of Stock' | 'Low Stock' | 'In Stock';
  theme: {
    text: 'var(--red)' | 'var(--yellow)' | 'var(--green)';
    background:
      | 'var(--red-light)'
      | 'var(--yellow-light)'
      | 'var(--green-light)';
  };
}

const InventoryCard = ({ cardData }: { cardData: CardData }) => {
  const { t } = useTranslation();

  const getStatusLabel = (status: CardData['status']) => {
    switch (status) {
      case 'Out of Stock':
        return t('inventoryItem.outOfStock');
      case 'Low Stock':
        return t('inventoryItem.lowStock');
      case 'In Stock':
        return t('inventoryItem.available');
      default:
        return status;
    }
  };

  return (
    <div className="flex  items-center gap-3 shadow">
      <div className="h-14 w-14 rounded-lg overflow-hidden ">
        <img
          className="object-cover w-full h-full"
          src={cardData.image}
          alt={cardData.name}
        />
      </div>
      <div className="flex flex-col gap-2.5 flex-1 ">
        <h6 className="text-base">{cardData.name}</h6>
        <p className="text-sm text-gray-400">
          {t('inventoryItem.sku')} : {cardData.sku}
        </p>
      </div>
      <div className="flex flex-col  items-end pe-1.5">
        <span
          className="py-1 px-2 rounded-full inline-block mb-3"
          style={{
            background: cardData.theme.background,
            color: cardData.theme.text,
          }}
        >
          {' '}
          {getStatusLabel(cardData.status)}
        </span>
        <span className="text-gray-400">
          {' '}
          {t('inventoryItem.stock')} : {cardData.stockCount}
        </span>
      </div>
    </div>
  );
};

export default InventoryCard;
