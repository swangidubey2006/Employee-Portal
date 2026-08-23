import React from 'react';
import { Search, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';

const EmployeeFilters = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  sortAscending,
  onToggleSort,
}) => {
  return (
    <div className="emp-filter-container">
      {/* Left: Search Input */}
      <div className="emp-search-input-wrapper">
        <Search size={16} className="emp-search-icon" />
        <input
          type="text"
          className="emp-search-field"
          placeholder="Search Employee..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Right Controls: Department Dropdown & Sort */}
      <div className="emp-filter-controls-right">
        {/* Department Dropdown */}
        <div className="emp-dept-dropdown-wrapper">
          <Filter size={14} className="dept-filter-icon" />
          <select
            className="emp-dept-select"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
          >
            <option value="All Departments">All Departments</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Content">Content</option>
            <option value="Academic">Academic</option>
          </select>
          <ChevronDown size={14} className="dept-select-arrow" />
        </div>

        {/* A-Z Sort Button */}
        <button
          className={`btn-sort-az ${sortAscending ? 'active' : ''}`}
          onClick={onToggleSort}
          title="Toggle A-Z Sorting"
        >
          <span className="sort-az-label">A</span>
          <ArrowUpDown size={13} className="sort-icon-sm" />
          <span className="sort-az-label">Z</span>
        </button>
      </div>
    </div>
  );
};

export default EmployeeFilters;
