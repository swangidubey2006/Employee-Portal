import React from "react";
import { Filter, ChevronDown } from "lucide-react";

const DocumentFilter = ({
  selectedCategory,
  onSelectCategory,
  showingCount,
  totalCount = 0,
  categories = [],
}) => {
  const fallbackCategories = ["Letters", "Salary Slips", "Policies", "Other Documents"];
  const availableCategories = [...new Set([...fallbackCategories, ...categories])];

  return (
    <div className="doc-filter-bar">
      <div className="doc-filter-left">
        <div className="doc-filter-dropdown-wrapper">
          <Filter size={15} className="doc-filter-icon" />
          <select
            className="doc-category-select"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
          >
            <option value="All Documents">All Documents</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="doc-select-arrow" />
        </div>
      </div>

      <div className="doc-filter-right">
        <span className="results-count-text">
          Showing {showingCount} of {totalCount} results
        </span>
      </div>
    </div>
  );
};

export default DocumentFilter;
