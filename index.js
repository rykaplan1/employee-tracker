const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const queryfn = require('./assets/js/query-functions');

//Helper functions
const getEmployeeList = async (database, queryFunction) => {
  const employees = await queryFunction(database);
  const employeeList = [];
  for (const employeeInfo of employees[0]) {
    employeeList.push(`${employeeInfo.first_name} ${employeeInfo.last_name}`);
  }

  return employeeList;
}

const getRolesList = async (database) => {
  const roles = await queryfn.getRoles(database);
  const rolesList = [];
  for (const roleInfo of roles[0]) {
    rolesList.push(roleInfo.title);
  }

  return rolesList;
}

const getDepartmentList = async (database) => {
  const departments = await queryfn.getDepartments(database);
  const departmentList = [];
  for (const departmentInfo of departments[0]) {
    departmentList.push(departmentInfo.name);
  }

  return departmentList;
}

//Main Function
async function init() {
  let keepWorking = true;
  const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'LearningSQL42069!?',
      database: 'employee_tracker_db'
    },
    console.log('Welcome to Employee Tracker!')
  )

  while (keepWorking) {
    const action = await inquirer.prompt(
      {
        type: "list",
        name: "choice",
        message: "Please choose an action:",
        choices: ["View All Employees", "View Employees by Manager", "View Employees by Department", "Add Employee", "Update Employee Role", "Update Employee Manager", "Delete Employee", "View All Roles", "Add Role", "Delete Role", "View All Departments", "Add Department", "View Department Budget", "Delete Department", "Quit"]
      }
    )
  
    switch (action.choice) {
      case "View All Employees":
        const employees = await queryfn.getEmployees(db);
        console.log(cTable.getTable(employees[0]));
        break;

      case "View Employees by Manager":
        const managerList = await getEmployeeList(db, queryfn.getManagers);
        const manager = await inquirer.prompt(
          {
            type: "list",
            name: "choice",
            message: "Please choose a manager:",
            choices: managerList
          }
        );
        
        const managerId = await queryfn.getEmployeeId(db, manager.choice.split(" "));

        const managerEmployees = await queryfn.getEmployeesByManager(db, managerId[0][0].id);

        console.log(cTable.getTable(managerEmployees[0]));
        break;

      case "View Employees by Department":
        const departmentList = await getDepartmentList(db);

        const department = await inquirer.prompt(
          {
            type: "list",
            name: "choice",
            message: "Please choose a department:",
            choices: departmentList
          }
        );

        const departmentId = await queryfn.getDepartmentId(db, department.choice);

        const departmentEmployees = await queryfn.getEmployeesByDepartment(db, departmentId[0][0].id);

        console.log(cTable.getTable(departmentEmployees[0]));
        break;

      case "Add Employee":
        const rolesList = await getRolesList(db);
        const chooseManagerList = await getEmployeeList(db, queryfn.getEmployees);

        const employeeInfo = await inquirer.prompt([
          {
            type: "input",
            name: "firstName",
            message: "Please enter the employee's first name:",
            validate: async (input) => {
              const splitInput = input.split(" ")
              for (const word of splitInput) {
                if (!/^[a-zA-Z]+$/.test(word)) {
                  return "Please enter a name with only letters in it."
                }
              }
              return true;
            }
          },
          {
            type: "input",
            name: "lastName",
            message: "Please enter the employee's last name:",
            validate: async (input) => {
              const splitInput = input.split(" ")
              for (const word of splitInput) {
                if (!/^[a-zA-Z]+$/.test(word)) {
                  return "Please enter a name with only letters in it."
                }
              }
              return true;
            }
          },
          {
            type: "list",
            name: "role",
            message: "Please select a role for the employee:",
            choices: rolesList
          },
          {
            type: "list",
            name: "manager",
            message: "Please select a manager for the employee:",
            choices: chooseManagerList
          }
        ]);

        const employeeRoleId = await queryfn.getRoleId(db, employeeInfo.role);
        const employeeManagerId = await queryfn.getEmployeeId(db, employeeInfo.manager.split(' '));

        await queryfn.addEntry(db, 'employee', ['first_name', 'last_name', 'role_id', 'manager_id'], [employeeInfo.firstName, employeeInfo.lastName, employeeRoleId[0][0].id, employeeManagerId[0][0].id]).then(() => {
          console.log(`New ${employeeInfo.role} ${employeeInfo.firstName} ${employeeInfo.lastName} added.`);
        });
        break;

      case "Update Employee Role":
        const updateRoleEmployeeList = await getEmployeeList(db, queryfn.getEmployees);
        const updateRolesList = await getRolesList(db);

        const updateRoleInfo = await inquirer.prompt([
          {
            type: "list",
            name: "name",
            message: "Please select an employee:",
            choices: updateRoleEmployeeList
          },
          {
            type: "list",
            name: "role",
            message: "Please select a new role for the employee:",
            choices: updateRolesList
          },
        ]);

        const updateRoleEmployeeId = await queryfn.getEmployeeId(db, updateRoleInfo.name.split(" "));
        const roleId = await queryfn.getRoleId(db, updateInfo.role);

        await queryfn.updateRole(db, updateRoleEmployeeId[0][0].id, roleId[0][0].id).then(() => {
          console.log(`New role for ${updateInfo.name}: ${updateInfo.role}`);
        });

        break;

        case "Update Employee Manager":
          const updateManagerEmployeeList = await getEmployeeList(db, queryfn.getEmployees);
  
          const updateManagerInfo = await inquirer.prompt([
            {
              type: "list",
              name: "name",
              message: "Please select an employee:",
              choices: updateManagerEmployeeList
            },
            {
              type: "list",
              name: "manager",
              message: "Please select a new manager for the employee:",
              choices: updateManagerEmployeeList
            },
          ]);

          const updateManagerEmployeeId = await queryfn.getEmployeeId(db, updateManagerInfo.name.split(" "));
          let updateManagerId;

          if (updateManagerInfo.name === updateManagerInfo.manager) {
            updateManagerId = null;
          } else {
            updateManagerId = await queryfn.getEmployeeId(db, updateManagerInfo.manager.split(" "));
            updateManagerId = updateManagerId[0][0].id;
          }
          
          await queryfn.updateManager(db, updateManagerEmployeeId[0][0].id, updateManagerId).then(() => {
            console.log(`New manager for ${updateManagerInfo.name}: ${updateManagerInfo.manager}`);
          });
          break;

      case "Delete Employee":
        const deleteEmployeeList = await getEmployeeList(db, queryfn.getEmployees);

        const deleteInfo = await inquirer.prompt(
          {
            type: "list",
            name: "name",
            message: "Please choose an employee to delete:",
            choices: deleteEmployeeList
          }
        );

        const deleteEmployeeId = await queryfn.getEmployeeId(db, deleteInfo.name.split(" "));

        await queryfn.deleteEntry(db, 'employee', deleteEmployeeId[0][0].id).then(() => {
          console.log(`${deleteInfo.name} deleted from database.`);
        })
        break;
      
      case "View All Roles": 
        const roles = await queryfn.getRoles(db);
        console.log(cTable.getTable(roles[0]));
        break;
      
      case "Add Role":
        const addRoleDepartmentList = await getDepartmentList(db);

        const addRoleInfo = await inquirer.prompt([
          {
            type: "input",
            name: "title",
            message: "Please enter a title for the role:",
            validate: async (input) => {
              const splitInput = input.split(" ")
              for (const word of splitInput) {
                if (!/^[a-zA-Z]+$/.test(word)) {
                  return "Please enter a name with only letters in it."
                }
              }
              return true;
            }
          },
          {
            type:"list",
            name: "department",
            message: "Please choose a department for the role:",
            choices: addRoleDepartmentList
          },
          {
            type: "input",
            name: "salary",
            message: "Enter a salary for the role:",
            validate: async (input) => {
              if (!/^[0-9]+$/.test(input)) {
                return "Please enter a valid number."
              }
              return true;
            }
          }
        ]);

        const roleDepartmentId = await queryfn.getDepartmentId(db, addRoleInfo.department);

        await queryfn.addEntry(db, 'role', ['title', 'salary', 'department_id'], [addRoleInfo.title, addRoleInfo.salary, roleDepartmentId[0][0].id]).then(() => {
          console.log(`New role ${addRoleInfo.title} added.`);
        });
        

        break;

        case "Delete Role":
          const deleteRoleList = await getRolesList(db);
  
          const deleteRoleInfo = await inquirer.prompt(
            {
              type: "list",
              name: "title",
              message: "Please choose a role to delete:",
              choices: deleteRoleList
            }
          );
  
          const deleteRoleId = await queryfn.getRoleId(db, deleteRoleInfo.title);
  
          await queryfn.deleteEntry(db, 'role', deleteRoleId[0][0].id).then(() => {
            console.log(`${deleteRoleInfo.title} deleted from database.`);
          })
          break;
          
      case "View All Departments":
        const departments = await queryfn.getDepartments(db);
        console.log(cTable.getTable(departments[0]));
        break;

      case "Add Department":
        const addDepartmentInfo = await inquirer.prompt(
          {
            type: "input",
            name: "name",
            message: "Please enter a department name:",
            validate: async (input) => {
              const splitInput = input.split(" ")
              for (const word of splitInput) {
                if (!/^[a-zA-Z]+$/.test(word)) {
                  return "Please enter a name with only letters in it."
                }
              }
              return true;
            }
          }
        );

        await queryfn.addEntry(db, 'department', ['name'], [addDepartmentInfo.name]).then(() => {
          console.log(`New department ${addDepartmentInfo.name} added.`);
        });
        break;

      case "View Department Budget":
        const departmentBudgetList = await getDepartmentList(db);
        const chooseDepartmentBudget = await inquirer.prompt(
          {
            type:"list",
            name: "name",
            message: "Please choose a department:",
            choices: departmentBudgetList
          }
        );

        const departmentBudgetId = await queryfn.getDepartmentId(db, chooseDepartmentBudget.name);
        const departmentBudget = await queryfn.getDepartmentBudget(db, departmentBudgetId[0][0].id);
        console.log(`Total budget for ${chooseDepartmentBudget.name}: $${departmentBudget[0][0]['SUM(salary)']}`);

        break;

      case "Delete Department":
        const deleteDepartmentList = await getDepartmentList(db);
  
        const deleteDepartmentInfo = await inquirer.prompt(
          {
            type: "list",
            name: "name",
            message: "Please choose a department to delete:",
            choices: deleteDepartmentList
          }
        );

        const deleteDepartmentId = await queryfn.getDepartmentId(db, deleteDepartmentInfo.name);

        await queryfn.deleteEntry(db, 'department', deleteDepartmentId[0][0].id).then(() => {
          console.log(`${deleteDepartmentInfo.name} deleted from database.`);
        })
        break;

      case "Quit":
      default:
        keepWorking = false;
        break;
    }
  }
  console.log("Goodbye.");
  db.end();
}

init();