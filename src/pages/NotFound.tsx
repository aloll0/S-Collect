import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f5f7fb] h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-red-500">404 - Page Not Found</h1>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
