import { Search } from "lucide-react";


const InputSearch = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className=" px-3 py-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-gray-600" />
      <i className="absolute right-2 top-2.5">
        <Search
          className="w-4 h-4"
        />
      </i>
    </div>
  )
}

export default InputSearch