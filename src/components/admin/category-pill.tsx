'use client';

interface CategoryPillProps {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryPill({ id, name, color, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
        isActive
          ? `bg-gradient-to-r ${color} text-white shadow-md`
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
    >
      {name}
    </button>
  );
}
