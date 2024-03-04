// CSS
import '../styles/popover.scss';

// Helpers
import { createElement } from "./helpers/dom.helpers";

import TippyPopover from 'tippy.js';

export default class FilterPopup {
    constructor(options) {
        this.options = options;
        this.savedFilter = null;
        this.tippyPopover = null;
        
        this.cacheElements();
        this.appendElements();

        this.bindEvents();
    }

    cacheElements () {
        this.elements = {
            mainContainer: createElement('div', { class: 'popover-container' }),
            popoverContent: createElement('div', { class: 'popover-content' }),
            filterListContent: createElement('div', { class: 'filter-list-content' }),
            cancelButton: createElement('button', { class: 'transparent-btn' }, 'Cancel'),
            applyButton: createElement('button', { class: 'blue-btn' }, 'Apply')
        }
    }

    appendElements () {
        this.elements.popoverContent.append(
            this.elements.filterListContent,
            createElement('div', { class: 'popover-button-container' }, [
                this.elements.cancelButton,
                this.elements.applyButton
            ])
        );
        
        this.elements.mainContainer.append(
            createElement('div', { class: 'popover-title' }, 'Filter by team'),
            this.elements.popoverContent
        )
    }

    initFilterPopover () {
        this.tippyPopover = TippyPopover(this.options.filterIcon, {
            trigger: 'click',
            content: this.elements.mainContainer,
            placement: 'right-start',
            allowHTML: true,
            interactive: true,
            hideOnClick: false,
            duration: [300, 0]
        });
    }

    render () {
        const fragment = document.createDocumentFragment();

        this.options.filterList.forEach((filterOption, index) => {
            const rowId = `filter_row_${index}`;

            const inputRadio =  createElement('input', { type: 'radio', name: 'employee-filter-row', value: filterOption.value, id: rowId });
            if (index === 0) {
                this.savedFilter = inputRadio.value;
                inputRadio.checked = true;
            }
            const row = createElement('div', {}, [
                inputRadio,
                createElement('label', { for: rowId }, filterOption.label)
            ]);

            fragment.appendChild(row);
        });

        this.elements.filterListContent.appendChild(fragment);

        this.initFilterPopover();
    }

    closePopover () {
        this.tippyPopover.hide();

        // Reset to previously saved
        const savedFilterInput = this.elements.filterListContent.querySelector(`input[type="radio"][value="${this.savedFilter}"]`);
        savedFilterInput.checked = true;
    }

    saveFilter () {
        this.savedFilter = this.elements.filterListContent.querySelector('input[type="radio"]:checked').value;

        this.options.onFilterSave(this.savedFilter);

        this.closePopover();
    }

    bindEvents () {
        this.elements.cancelButton.addEventListener('click', this.closePopover.bind(this));
        this.elements.applyButton.addEventListener('click', this.saveFilter.bind(this));
    }
}