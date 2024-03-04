// CSS
import '../styles/chart.scss';

// Helpers
import { filterEmployeesByTeam } from './helpers/chart.helpers';

export default new class ChartRenderer {
    constructor() {
        this.employeesList = [];
        this.chartInstance = null;
    }

    setup () {
        this.cacheElements();
    }

    cacheElements () {
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
            searchFields: ["name", "title"],
            nodeBinding: {
                field_0: "name",
                field_1: "title",
                img_0: "img"
            },
            enableDragDrop: true,
            enableSearch: false,
            mouseScrool: OrgChart.none,
            // align: OrgChart.ORIENTATION,
            toolbar: {
                zoom: true,
                fit: true
            }
        });

        this.chartInstance.onDrop(this.onNodeDrop.bind(this));
        this.chartInstance.onNodeClick(this.onNodeClick.bind(this));

        this.load(nodes);

        window.chart = this.chartInstance; // TODO: remove
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
        fetch(`/employee/${dragId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              managerId: dropId
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.employeesList = data;
        })
        .catch(error => {
            console.error('Error updating JSON data:', error);
        });
    }

    onNodeClick () {
        return false;
    }
}

function getNodesList (employeesList) {
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