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

            return [200, { 'Content-Type': 'application/json' }, JSON.stringify(employeesJSON)]; // Return updated data
        } else {
            return [404, { 'Content-Type': 'text/plain' }, 'Employee not found'];
        }
    });
});

window.server.unhandledRequest = function(verb, path, request) {
    request.passthrough(); // <-- A native, sent xhr is returned
};