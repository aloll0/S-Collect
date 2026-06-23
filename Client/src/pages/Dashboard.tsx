import { useTranslation } from "react-i18next";
import DashboardGrid from "../features/dashboard/DashboardGrid";

const Dashboard = () => {
  const { t } = useTranslation();
  return <div className=" flex flex-col flex-1">

    <div className="flex items-center justify-between mb-10 bg-gray-50 px-14 " >
      <h1 className="text-h4 py-5" >
        {t("dashboard")}
      </h1>
    </div>

    <DashboardGrid />


  </div>;
};

export default Dashboard;
