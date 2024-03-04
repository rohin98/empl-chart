import Pretender from 'pretender';
import { employeesJSON } from '../mock/employees'; 

window.server = new Pretender(function() {
    this.get('/employees', _ => {
        return [200, {"Content-Type": "application/json"}, JSON.stringify(employeesJSON)]
    });

    this.put('/employee/:employeeID', request => {
        const employeeID = request.params.employeeID; // Get employee ID from request URL
        
        const updatedData = JSON.parse(request.requestBody);

        // Find the employee in the employee JSON data by ID
        const employeeIndex = employeesJSON.findIndex(employee => employee.id == employeeID);

        if (employeeIndex !== -1) { // Update the employee data if found
            employeesJSON[employeeIndex].managerId = updatedData.managerId;
            employeesJSON[employeeIndex].team = updatedData.team;

            updateSubtreeTeams(employeesJSON, employeesJSON[employeeIndex].id, updatedData.team); // Update the team for all the employees under dropped employee, if any

            return [200, { 'Content-Type': 'application/json' }, JSON.stringify(employeesJSON)]; // Return updated data
        } else {
            return [404, { 'Content-Type': 'text/plain' }, 'Employee not found'];
        }
    });
});

window.server.unhandledRequest = function(verb, path, request) {
    request.passthrough(); // Native sent xhr is returned
};

function updateSubtreeTeams (employeesJSON, managerID, team) {
    const subtreeEmployees = employeesJSON.filter(employee => employee.managerId === managerID);

    subtreeEmployees.forEach(employee => {
        employee.team = team; // Update the team name

        updateSubtreeTeams(employeesJSON, employee.id, team); // Recursively update the subtree of the current employee
    });
}