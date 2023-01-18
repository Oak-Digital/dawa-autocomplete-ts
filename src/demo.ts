import { AutocompleteUI } from './main';

const inputField = document.getElementById('dawa-input') as HTMLInputElement;
if (inputField) {
    const ui = new AutocompleteUI(inputField);

    const resultList = document.getElementById('result-list') as HTMLUListElement;
    if (resultList) ui.setResultList(resultList);

    const resultSelectedArea = document.getElementById('dawa-selected');
    if (resultSelectedArea) {
        ui.onSelect = () => {
            resultSelectedArea.innerHTML = JSON.stringify(ui.getController().getSelectedItem());
        };
    }

    const resetButton = document.getElementById('dawa-input-reset');
    resetButton?.addEventListener('click', () => {
        ui.getController().reset();
    });
}
