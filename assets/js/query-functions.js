const mysql = require('mysql2');

const getDepartments = (database) => {
  return database.promise().query('SELECT * FROM department');
}

const getRoles = (database) => {
  return database.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id');
}

const getEmployees = (database) => {
  return database.promise().query('SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title, role.salary, department.name AS department, m.first_name AS manager_first_name, m.last_name AS manager_last_name FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON role.id = e.role_id LEFT JOIN department ON department.id = role.department_id');
}

const addEntry = (database, tableName, columnNames, entryData) => {
  const columnString = `(${columnNames.join(', ')})`;
  let entryString = '';
  for (let i = 0; i < entryData.length; i++) {
    entryString += '?';
    if (i < entryData.length - 1) {
      entryString += ', '
    }
  }

  return database.promise().query(`INSERT INTO ${tableName} ${columnString} VALUES (${entryString})`, entryData);
}

const getEmployeeId = (database, employeeName) => {
  return database.promise().query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', employeeName);
}

const getDepartmentId = (database, name) => {
  return database.promise().query('SELECT id FROM department where name = ?', name);
}

const getRoleId = (database, title) => {
  return database.promise().query('SELECT id FROM role WHERE title = ?', title);
}

const updateRole = (database, employeeId, newRole) => {
  return database.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [newRole, employeeId]);
}

const updateManager = (database, employeeId, newManager) => {
  return database.promise().query('UPDATE employee SET manager_id = ? WHERE id = ?', [newManager, employeeId])
}

const getManagers = (database) => {
  return database.promise().query('SELECT * FROM employee WHERE id IN (SELECT manager_id FROM employee)');
}

const getEmployeesByManager = (database, managerId) => {
  return database.promise().query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?', managerId);
}

const getRoleIdsByDepartment = (database, departmentId) => {
  return database.promise().query();
}

const getEmployeesByDepartment = (database, departmentId) => {
  return database.promise().query('SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title, role.salary, m.first_name AS manager_first_name, m.last_name AS manager_last_name FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON role.id = e.role_id WHERE department_id = ?', departmentId);
}

const deleteEntry = (database, tableName, id) => {
  return database.promise().query(`DELETE FROM ${tableName} WHERE id = ?`, id);
}

const getDepartmentBudget = (database, department) => {
  return database.promise().query('SELECT SUM(salary) FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE department_id = ?', department);
}

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addEntry,
  getEmployeeId,
  getDepartmentId,
  getRoleId,
  updateRole,
  updateManager,
  getManagers,
  getEmployeesByManager,
  getRoleIdsByDepartment,
  getEmployeesByDepartment,
  deleteEntry,
  getDepartmentBudget
}