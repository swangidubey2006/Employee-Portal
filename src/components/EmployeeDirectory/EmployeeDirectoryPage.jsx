import React, { useEffect, useState } from 'react';
import { UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '../Dashboard/Sidebar.jsx';
import Header from '../Dashboard/Header.jsx';
import NotificationToast from '../LeftPanel/NotificationToast.jsx';
import EmployeeSummaryCards from './EmployeeSummaryCards.jsx';
import EmployeeFilters from './EmployeeFilters.jsx';
import EmployeeCard from './EmployeeCard.jsx';
import EmployeeDetailsModal from './EmployeeDetailsModal.jsx';
import AddEmployeeModal from './AddEmployeeModal.jsx';
import { employeeApi } from '../../services/api.js';

const EmployeeDirectoryPage = () => {
  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');

  // Modal dialog states
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [sortAscending, setSortAscending] = useState(true);

  // Load More state
  const [showAll, setShowAll] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canManageEmployees = ['HR', 'Admin'].includes(currentUser.role);

  useEffect(() => {
    let mounted = true;
    employeeApi.getEmployees()
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res?.data) ? res.data : [];
        setEmployees(data.map((emp) => ({
          ...emp,
          id: emp._id || emp.id,
        })));
      })
      .catch((error) => {
        console.error('Employee directory load failed:', error);
        if (mounted) setToastMessage(error.message || 'Unable to load employee directory.');
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // Filter employee list
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query);

    const matchesDept =
      selectedDepartment === 'All Departments' || emp.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  // Sort employee list A-Z
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortAscending) return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  // Display initial 4 or all employees based on Load More state
  const displayedEmployees = showAll ? sortedEmployees : sortedEmployees.slice(0, 4);

  // Add new employee handler
  const handleAddNewEmployee = (newEmp) => {
    setEmployees([newEmp, ...employees]);
  };

  return (
    <div className="dashboard-layout">
      {/* Toast Notification */}
      <NotificationToast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        <Header />

        <div className="dashboard-scroll-body emp-page-body">
          {/* Page Top Heading Bar */}
          <div className="emp-page-header">
            <div className="emp-title-group">
              <h2 className="emp-main-title">Employee Directory</h2>
              <p className="emp-sub-title">Find employees across different departments.</p>
            </div>

            {canManageEmployees && (
              <button
                className="btn-add-employee"
                onClick={() => setShowAddModal(true)}
              >
                <UserPlus size={16} className="btn-icon-inline" />
                <span>+ Add Employee</span>
              </button>
            )}
          </div>

          {/* 1. SUMMARY CARDS (4 cards horizontally) */}
          <EmployeeSummaryCards totalEmployeesCount={employees.length} />

          {/* 2. SEARCH & FILTER BAR */}
          <EmployeeFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            sortAscending={sortAscending}
            onToggleSort={() => setSortAscending(!sortAscending)}
          />

          {/* 3. EMPLOYEE GRID */}
          {loading ? (
            <div className="emp-empty-state"><p>Loading employee directory...</p></div>
          ) : displayedEmployees.length > 0 ? (
            <div className="emp-card-grid">
              {displayedEmployees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  employee={emp}
                  onViewDetails={(employee) => setSelectedEmployee(employee)}
                />
              ))}
            </div>
          ) : (
            <div className="emp-empty-state">
              <p>No employees match your filter criteria.</p>
            </div>
          )}

          {/* 4. LOAD MORE BUTTON */}
          {sortedEmployees.length > 4 && (
            <div className="emp-load-more-wrapper">
              <button
                className="btn-load-more"
                onClick={() => setShowAll(!showAll)}
              >
                <span>{showAll ? 'Show Less' : 'Load More'}</span>
                {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* EMPLOYEE DETAILS MODAL */}
      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAddEmployee={handleAddNewEmployee}
          setToastMessage={setToastMessage}
        />
      )}
    </div>
  );
};

export default EmployeeDirectoryPage;
