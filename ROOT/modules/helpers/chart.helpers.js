
export function scrollToNode (employeeID) {
    const svgElement = document.getElementById('chart_container').querySelector('svg');
    const svgWidth = svgElement.clientWidth;
    const svgHeight = svgElement.clientHeight;

    const nodeX = chart.nodes[employeeID].x - 470; // Set the x axis of scroll
    const nodeY = chart.nodes[employeeID].y - 300; // Set the y axis of scroll

    // Set new viewBox
    svgElement.setAttribute('viewBox', `${nodeX},${nodeY},${svgWidth},${svgHeight}`); // Update the scroll position of the svg box

    window.chart.draw(employeeID); // Redraws the chart after scroll (since the node might be hidden)
    window.chart.ripple(employeeID); // ripple effect on the scrolled element
}

export function filterEmployeesByTeam(employeesList, selectedFilter) { // Filters Employees by selected team
    if (selectedFilter === 'all') {
        return employeesList; // Returns all the employees irrespective of filter
    } else {
        return employeesList.filter(employee => employee.team === selectedFilter);
    }
}

export function getEmployeeById(employeesList, employeeId) { // Finds employee details by employee ID
    return employeesList.find(employee => employee.id === employeeId);
}