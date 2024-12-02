import React from "react";
import { categoryColors } from "../../constants/leetcodeCategories";

function CategoryTags({ categories }) {
  if (!categories?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.slice(0, 3).map((category, index) => (
        <span
          key={index}
          className="px-2 py-0.5 text-xs rounded-md"
          style={{
            backgroundColor: `${categoryColors[category] || "#888"}22`,
            color: categoryColors[category] || "#888",
          }}
        >
          {category}
        </span>
      ))}
      {categories.length > 3 && (
        <span className="px-2 py-0.5 text-xs rounded-md bg-gray-800 text-gray-400">
          +{categories.length - 3}
        </span>
      )}
    </div>
  );
}

export default CategoryTags;
