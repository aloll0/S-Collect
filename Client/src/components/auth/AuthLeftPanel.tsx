import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import { TrendingUp, Shield, ChartNoAxesColumnIncreasing } from 'lucide-react';

const AuthLeftPanel = () => {
  const { t } = useTranslation();

  const features = [
    { icon: <TrendingUp color="white" size={16} />, label: t('panel.feature1') },
    {
      icon: <Shield color="white" size={16} />,
      label: t('panel.feature3'),
    },
    {
      icon: <ChartNoAxesColumnIncreasing  color="white" size={16} />,
      label: t('panel.feature2'),
    },
  ];

  return (
    <div
      className="
      relative overflow-hidden bg-cover bg-center bg-no-repeat
      px-6 py-8
      lg:min-h-screen lg:h-auto
      lg:px-10 lg:py-12
      lg:flex-1
      h-[220px]
    " 
      style={{
        backgroundImage: "url('/bg_login.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

     <div className="relative z-10 lg:mt-25 lg:ml-12 ">
       <Logo />

        <div className="mt-4 mb-12 hidden lg:block">
          <h1 className="text-white text-[56px] font-bold">
            Power your store
            <br />
            Grow your sales
          </h1>

          <p className="text-white/80 mt-2">
            Join thousands of vendors already scaling their business with <br />  HubMarket
          </p>
        </div>

        <div className="mt-4  lg:hidden block">
          <h5 className="text-white text-[24px] font-bold">
            Power your store
          </h5> 
 
          <p className="text-white/80 mt-2">
            Sign in to manage your marketplace account
          </p>
        </div>

        <div className="hidden lg:block">
          <div className="mb-8">
            <h3 className="text-white text-[24px] font-bold mb-2">
              Become a Vendor
            </h3>

            <p className="text-[#ddd] text-[13px] leading-relaxed mb-5">
              Join our marketplace and start selling today. Manage your store, <br /> fulfill orders, and grow your brand with Nexus.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {features.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="rounded bg-gray-600 w-6 h-6 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-[#ccc] text-[13px]">{label}</span>
              </div>
            ))}
          </div>
        </div>
    </div>
    </div>
  );
};

export default AuthLeftPanel;
