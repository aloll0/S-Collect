import { useTranslation } from 'react-i18next';
import { useMobileAddProductStore } from './mobileAddProductStore';

const STEPS = [
  { key: 'basicInfo', label: 'Basic Info' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'publish', label: 'Publish' },
];

const MobileStepIndicator = () => {
  const { t } = useTranslation();
  const currentStep = useMobileAddProductStore((state) => state.step);

  return (
    <div className="flex items-center gap-0 w-full mb-5">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div
            key={step.key}
            className="flex items-center flex-1 last:flex-none"
          >
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-gray-900'
                    : isCompleted
                      ? 'text-green-500'
                      : 'text-gray-400'
                }`}
              >
                {t(`addProduct.steps.${step.key}`, step.label)}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 mx-1 transition-colors ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MobileStepIndicator;
