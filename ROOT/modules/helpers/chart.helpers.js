
export function scrollToNode (employeeID) {
    const svgElement = document.getElementById('chart_container').querySelector('svg');
    const svgWidth = svgElement.clientWidth;
    const svgHeight = svgElement.clientHeight;

    const nodeX = chart.nodes[employeeID].x - 470;
    const nodeY = chart.nodes[employeeID].y - 300;

    // Set new viewBox
    svgElement.setAttribute('viewBox', `${nodeX},${nodeY},${svgWidth},${svgHeight}`);

    window.chart.draw(employeeID);
    window.chart.ripple(employeeID); // ripple effect on the scrolled element
}

export function filterEmployeesByTeam(employeesList, selectedFilter) {
    if (selectedFilter === 'all') {
        return employeesList;
    } else {
        return employeesList.filter(employee => employee.team === selectedFilter);
    }
}