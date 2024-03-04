// CSS
import '../styles/chart.scss';

// Helpers
import { filterEmployeesByTeam, getEmployeeById } from './helpers/chart.helpers';

export default new class ChartRenderer {
    constructor() {
        this.employeesList = [];
        this.chartInstance = null;
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

        this.chartInstance = new OrgChart(this.domCache.chartContainer, {
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

        this.chartInstance.onDrop(this.onNodeDrop.bind(this));
        this.chartInstance.onNodeClick(this.onNodeClick.bind(this)); // Edit node option hidden
        this.chartInstance.onExpandCollpaseButtonClick(this.onNodeClick.bind(this)); // Expand/collapse option hidden

        this.load(nodes);
    }

    load (nodes) {
        this.chartInstance.load(nodes);
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

        const managerDetailsDetails = getEmployeeById(this.employeesList, dropId);

        fetch(`/employee/${dragId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ // Update manager ID & team for the employee
                managerId: managerDetailsDetails.id,
                team: managerDetailsDetails.team
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