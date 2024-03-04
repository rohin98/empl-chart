import Pretender from 'pretender';
import { employeesJSON } from '../mock/employees'; 

window.server = new Pretender(function() {
    this.get('/employees', request => {
        let all =  JSON.stringify(employeesJSON);
        return [200, {"Content-Type": "application/json"}, all]
    });

    this.put('/employee/:employeeID', request => {
        // Extract the employee ID from the request URL
        const employeeID = request.params.employeeID;
        
        // Parse the request body to get the updated data
        const updatedData = JSON.parse(request.requestBody);

        // Find the employee in the JSON data array by ID
        const employeeIndex = employeesJSON.findIndex(employee => employee.id == employeeID);

        if (employeeIndex !== -1) {
             // Update the employee data if found
            employeesJSON[employeeIndex].managerId = updatedData.managerId;

            // Return a response with the updated employee data
            return [200, { 'Content-Type': 'application/json' }, JSON.stringify(employeesJSON)];
        } else {
            // Return a 404 response if the employee is not found
            return [404, { 'Content-Type': 'text/plain' }, 'Employee not found'];
        }
    });
});

window.server.unhandledRequest = function(verb, path, request) {
    request.passthrough(); // <-- A native, sent xhr is returned
};