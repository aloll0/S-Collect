import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import { Star, ShieldCheck, Grid2x2Check } from 'lucide-react';

const AuthLeftPanel = () => {
  const { t } = useTranslation();

  const features = [
    { icon: <Star color="white" size={20} />, label: t('panel.feature1') },
    {
      icon: <ShieldCheck color="white" size={20} />,
      label: t('panel.feature3'),
    },
    {
      icon: <Grid2x2Check color="white" size={20} />,
      label: t('panel.feature2'),
    },
  ];

  return (
    <div
      className=" px-10 py-12 flex flex-col  relative overflow-hidden min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/bg_login.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 mt-25 ml-12">
        <Logo />

        <div className="mt-12">
          <h1 className="text-white text-[32px] font-bold leading-tight mb-3">
            {t('panel.tagline1')}
            <br />
            {t('panel.tagline2')}
          </h1>

          <p className="text-[#ddd] text-sm leading-relaxed mb-10">
            {t('panel.subtitle')}
          </p>

          <div className="mb-8">
            <h3 className="text-white text-base font-semibold mb-2">
              {t('panel.becomeVendor')}
            </h3>

            <p className="text-[#ddd] text-[13px] leading-relaxed mb-5">
              {t('panel.becomeVendorDesc')}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {features.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                {icon}
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
