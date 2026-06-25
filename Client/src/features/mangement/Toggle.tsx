type Props = {
  checked: boolean;
  onChange: () => void;
};

export default function Toggle({ checked, onChange }: Props) {
  return (
    <label className="relative inline-flex items-center cursor-pointer w-10 h-[22px] flex-shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="absolute inset-0 rounded-full bg-gray-300 peer-checked:bg-green-500 transition-colors duration-200" />
      <div className="absolute w-4 h-4 bg-white rounded-full top-[3px] left-[3px] shadow-sm transition-transform duration-200 peer-checked:translate-x-[18px]" />
    </label>
  );
}
