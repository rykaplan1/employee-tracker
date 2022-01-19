INSERT INTO department (name)
VALUES ("Programming"),
       ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Programmer", 120000.0, 1),
       ("Junior Programmer", 75000.0, 1),
       ("Intern", 32000.0, 1),
       ("HR Head", 90000.0, 2),
       ("HR Assistant", 60000.0, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Manny", "Smith", 1, NULL),
       ("Eric", "Ericson", 2, 1),
       ("Steve", "Stevens", 2, 1),
       ("Aaron", "Anderson", 3, 2),
       ("Samantha", "Samuels", 4, NULL),
       ("Kathleen", "Goldsmith", 5, 5);