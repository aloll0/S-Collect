import { useBreakpoint } from '../hooks/useBreakpoint';
import { InventoryDesktop, InventoryMobile } from '../features/Inventory';

const Inventory = () => {
  const { isMobile } = useBreakpoint();

  return isMobile ? <InventoryMobile /> : <InventoryDesktop />;
};

export default Inventory;
