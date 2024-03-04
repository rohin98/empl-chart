// CSS 
import '../styles/index.scss';

import './pretender';

// Components
import LeftPanel from './left-panel';
import ChartRenderer from './chart-renderer';

export default new class MainClass {
    constructor () {
        this.setup();
    }

    cacheElements () {
        this.elements = {
            mainContainer: document.getElementById('main_container'),
            pageLoader: document.getElementById('page_loader'),
        }
    }

    setup () {
        this.cacheElements();

        fetch('/employees')
            .then((response) => {
                const employeesList = JSON.parse(response._bodyText);

                LeftPanel.setup({
                    onFilterSave: ChartRenderer.onFilterSave.bind(ChartRenderer)
                });
                ChartRenderer.setup();
                
                LeftPanel.renderPanel(employeesList);
                ChartRenderer.renderChart(employeesList);

                setTimeout(() => {
                    this.removePageLoader();
                }, 1000);
            })
            .catch((err) => {
                alert('Unable to process employees request');
                throw err;
            })
    }

    removePageLoader () {
        this.elements.mainContainer.classList.remove('display-none');
        this.elements.pageLoader.classList.add('display-none');
    }
}