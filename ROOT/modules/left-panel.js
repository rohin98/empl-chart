// CSS
import '../styles/panel.scss';

// Helpers
import { filterEmployeesByTeam, scrollToNode } from './helpers/chart.helpers';
import { createElement, removeAllChildNodes, searchObjects } from "./helpers/dom.helpers";

import FilterPopup from './filter-popup';

const PREDEFINED_COLOURS = ['#157a59', '#154a7a', '#7a1515', '#6f157a', '#7a1553', '#15707a', '#565786', '#30896b'];

export default new class LeftPanel {
    constructor() {
        this.employeesList = [];
        this.savedFilter = null;
        this.filterPopup = null;
        this.teamColours = {};
    }

    setup (options) {
        this.options = options;

        this.cacheElements();
        this.appendElements();

        this.bindEvents();
    }

    cacheElements () { // Cache elements
        this.elements = {
            panelContainer: document.getElementById("left_panel_container"),
            headerContainer: createElement('div', { class: 'header_container' }),
            employeesContainer: createElement('div', { class: 'employees-container' }),

            searchInput: createElement('input', { placeholder: 'Search' }),
            filterIcon: createElement('i', { class: 'fas fa-filter' }),
            filterIndicator: createElement('span', { class: 'filter-indicator display-none' }),

            searchBySelectbox: createElement('select', {}, [
                createElement('option', { value: 'name' }, 'Name'),
                createElement('option', { value: 'designation' }, 'Designation')
            ])
        }
    }

    appendElements () { // Append elements in structure
        this.elements.headerContainer.append(
            createElement('div', { class: 'brand-header' }, [
                createElement('img', { src: 'https://assets.www.happyfox.com/v2/images/zendesk-alternative/hf-mini.png' }),
                createElement('label', {}, 'Organisation Chart')
            ]),
            createElement('div', { class: 'search-container' }, [
                createElement('div', { class: 'search-wrapper' }, [
                    createElement('i', { class: 'fas fa-search' }),
                    this.elements.searchInput,
                    this.elements.searchBySelectbox
                ]),
                this.elements.filterIcon,

                createElement('div', { class: 'postion-relative' }, [
                    this.elements.filterIndicator
                ])
            ])
        );

        this.elements.panelContainer.append(
            this.elements.headerContainer,
            this.elements.employeesContainer
        );
    }

    renderPanel (employeesList) {
        this.employeesList = employeesList;

        this.renderEmployeesList(employeesList);
        this.renderFilter();
    }

    renderEmployeesList (employeesList, highlight) {
        const fragment = document.createDocumentFragment();

        removeAllChildNodes(this.elements.employeesContainer);

        const sortedEmployeeList = sortEmployees(employeesList);

        sortedEmployeeList.forEach((data) => {
            if (this.savedFilter && data.team !== this.savedFilter) { // Filters teams that are not part of current filtered team
                return;
            }

            let employeeName = data.name;
            let designation = data.designation;
            
            if (highlight) { // highlight searched text
                if (highlight.searchProperty === 'name') { // name search
                    employeeName = employeeName.replace(highlight.regex, '<mark>$1</mark>');
                } else if (highlight.searchProperty === 'designation') { // designation search
                    designation = designation.replace(highlight.regex, '<mark>$1</mark>');
                }
            }

            if (!this.teamColours[data.team]) {
                this.teamColours[data.team] = PREDEFINED_COLOURS.length > 0 ? PREDEFINED_COLOURS.shift() : getRandomColor(); // Use predefined colours, else generate random colour
            }

            const employeeRow = createElement('div', { class: 'employee-card' }, [
                createElement('div', { class: 'employee-name' }, employeeName),
                createElement('div', { class: 'employee-designation' }, designation),
                createElement('div', { class: 'employee-team', style: `background:${this.teamColours[data.team]}` }, data.team)
            ]);
            fragment.appendChild(employeeRow);

            employeeRow.onclick = this.onRowClick.bind(this);
            employeeRow.__data__ = data;
        });

        this.elements.employeesContainer.appendChild(fragment);
    }

    renderFilter () {
        const filterList = [
            { label: 'ALL', value: 'all' } // Default option
        ];
    
        const uniqueTeams = new Set();
        this.employeesList.forEach(employee => { // Fetch all team names
            uniqueTeams.add(employee.team);
        });
    
        uniqueTeams.forEach(team => { // Render team names in filter list
            filterList.push({ label: team, value: team });
        });

        this.filterPopup = new FilterPopup({
            filterList,
            filterIcon: this.elements.filterIcon,
            onFilterSave: this.onFilterSave.bind(this)
        });

        this.filterPopup.render();
    }

    onFilterSave (selectedFilter) {
        const isShowAllFilter = selectedFilter === 'all';
        if (isShowAllFilter) {
            this.savedFilter = null;
        } else {
            this.savedFilter = selectedFilter;
        }

        this.elements.filterIndicator.classList.toggle('display-none', isShowAllFilter); // Display filter indicator based on saved filter type

        this.elements.searchInput.value = '';

        const filteredList = filterEmployeesByTeam(this.employeesList, selectedFilter);
        this.renderEmployeesList(filteredList);

        this.options.onFilterSave(selectedFilter);
    }

    showEmptyResultSearch () {
        removeAllChildNodes(this.elements.employeesContainer);
        this.elements.employeesContainer.appendChild(createElement('span', { class: 'empty-search-result' }, 'No results found'));
    }

    onEmployeeManagerChange (employeeList) {
        this.employeesList = employeeList;

        this.searchEmployees();
    }

    onRowClick (e) {
        const row =  e.target.closest('.employee-card')
        const employeeID = row.__data__.id;

        scrollToNode(employeeID);
    }

    searchEmployees () {
        const searchValue = this.elements.searchInput.value.trim();

        if (searchValue.length === 0) { // When search is empty, render entire employee list
            this.renderEmployeesList(this.employeesList);
            return;
        }

        const searchBy = this.elements.searchBySelectbox.value;
        const searchData = searchObjects(searchValue, searchBy, this.employeesList);

        if (searchData.filteredList.length === 0) { // If no results found based on search, show empty section
            this.showEmptyResultSearch();
            return;
        }

        this.renderEmployeesList(searchData.filteredList, {
            searchProperty: searchBy,
            regex: searchData.regex
        });
    }

    bindEvents () {
        this.elements.searchInput.addEventListener('input', this.searchEmployees.bind(this));
        this.elements.searchBySelectbox.addEventListener('change', this.searchEmployees.bind(this));
    }
}

function getRandomColor() {
    // Min max values for RGB components - which excludes white & black range colours
    const min = 40;
    const max = 150;

    // Generate random values for the RGB components within the specified range
    const r = Math.floor(Math.random() * (max - min)) + min;
    const g = Math.floor(Math.random() * (max - min)) + min;
    const b = Math.floor(Math.random() * (max - min)) + min;

    // Return the RGB color in the format "rgb(r, g, b)"
    return `rgb(${r}, ${g}, ${b})`;
}

function sortEmployees (employeesList) {
    return employeesList.sort((a, b) => {
        if (a.team < b.team) { // First sort based on team
            return -1;
        } else if (a.team > b.team) {
            return 1;
        } else { // If teams are the same, sort based on name
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        }
    });
}