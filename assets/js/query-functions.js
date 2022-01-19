const mysql = require('mysql2');

const getAll = (database, tableName) => {
  return database.promise().query(`SELECT * FROM ${tableName}`);
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

const getEmployeeID = (database, employeeName) => {
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

const getEmployeesByManager = (database, managerId) => {
  return database.promise().query('SELECT * FROM employee WHERE manager_id = ?', managerId)
}

const getRoleIDsByDepartment = (database, departmentId) => {
  return database.promise().query('SELECT id FROM role WHERE department_id = ?', departmentId);
}

const getEmployeesByDepartment = (database, roleIds) => {
  let roleIdString = '';
  for (let i = 0; i < roleIds.length; i++) {
    roleIdString += 'role_id = ?';
    if (i < roleIdsData.length - 1) {
      roleIdString += ' OR '
    }
  }
  
  return database.promise().query(`SELECT * FROM employee WHERE ${roleIdString}`, roleIds);
}

const deleteEntry = (database, tableName, id) => {
  return database.promise().query(`DELETE FROM ${tableName} WHERE id = ?`, id);
}

const getDepartmentBudget = (database, roleIds) => {
  let roleIdString = '';
  for (let i = 0; i < roleIds.length; i++) {
    roleIdString += 'role.id = ?';
    if (i < roleIdsData.length - 1) {
      roleIdString += ' OR '
    }
  }

  return database.promise().query(`SELECT SUM(salary) FROM employee INNER JOIN role ON employee.role_id = role.id WHERE ${roleIdString}`, roleIds);
}