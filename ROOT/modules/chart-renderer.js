// CSS
import '../styles/chart.scss';

// Helpers
import { filterEmployeesByTeam, getEmployeeById } from './helpers/chart.helpers';

export default new class ChartRenderer {
    constructor() {
        this.employeesList = [];
    }

    setup (options) {
        this.options = options;

        this.cacheElements();
    }

    cacheElements () { // Cache elements
        this.domCache = {
            chartContainer: document.getElementById("chart_container")
        }
    }

    renderChart (employeesList) {
        this.employeesList = employeesList;

        const nodes = getNodesList(employeesList);

        window.chart = new OrgChart(this.domCache.chartContainer, {
            template: "ula",
            padding: 100,
            scaleInitial: OrgChart.match.boundary,
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            },
            enableDragDrop: true,
            enableSearch: false,
            mouseScrool: OrgChart.none,
            collapse: false,
            toolbar: {
                zoom: true,
                fit: true
            }
        });

        window.chart.onDrop(this.onNodeDrop.bind(this));
        window.chart.onNodeClick(this.onNodeClick.bind(this)); // Edit node option hidden
        window.chart.onExpandCollpaseButtonClick(this.onNodeClick.bind(this)); // Expand/collapse option hidden

        this.load(nodes);
    }

    load (nodes) {
        window.chart.load(nodes);
    }

    onFilterSave (selectedFilter) {
        const filteredList = filterEmployeesByTeam(this.employeesList, selectedFilter);

        const nodes = getNodesList(filteredList);

        this.load(nodes);
    }

    onNodeDrop ({ dragId, dropId }) {
        if (dropId === undefined) { // Dropped on canvas
            return;
        }

        const employeeDetails = getEmployeeById(this.employeesList, dragId);
        const managerDetails = getEmployeeById(this.employeesList, dropId);

        if (employeeDetails.managerId === managerDetails.id) { // Return if the employee is dropped to the same manager
            return;
        }

        fetch(`/employee/${employeeDetails.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ // Update manager ID & team for the employee
                managerId: managerDetails.id,
                team: managerDetails.team
            })
        })
        .then(response => response.json())
        .then(data => {
            this.employeesList = data;

            this.options.onEmployeeManagerChange(this.employeesList);
        })
        .catch(error => {
            console.error('Error updating JSON data:', error);
        });
    }

    onNodeClick () {
        return false;
    }
}

function getNodesList (employeesList) { // Remap according to chart library
    return employeesList.map((data) => {
        return {
            id: data.id,
            name: data.name,
            pid: data.managerId,
            img: data.profile,
            title: data.designation
        }
    });
}