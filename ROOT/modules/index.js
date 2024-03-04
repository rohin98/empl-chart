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

     setup () {
        fetch('/employees')
            .then((response) => {
                const employeesList = JSON.parse(response._bodyText);

                LeftPanel.setup({
                    onFilterSave: ChartRenderer.onFilterSave.bind(ChartRenderer)
                });
                ChartRenderer.setup();
                
                LeftPanel.renderPanel(employeesList);
                ChartRenderer.renderChart(employeesList);
            })
            .catch((err) => {
                alert('Unable to process employees request');
                throw err;
            })
    }
}