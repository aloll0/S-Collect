import { useTranslation } from "react-i18next";
import ManagementTable from "../features/mangement/ManagementTable";

const Management = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f5f7fb]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("managementTable.title")}</h1>
        <p className="text-gray-500 mt-1">{t("managementTable.subtitle")}</p>
        <ManagementTable />
      </div>
    </div>
  );
};

export default Management;
