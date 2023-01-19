import { AutocompleteController } from '../controller/AutocompleteController';
import { UIOptions } from './ui-options.interface';

export class AutocompleteUI {
    options: UIOptions;

    inputField: HTMLInputElement;
    controller: AutocompleteController;

    singleResultArea?: HTMLElement;
    resultList?: HTMLUListElement;

    public onSelect?: () => void;

    constructor(inputField: HTMLInputElement, options?: UIOptions) {
        this.options = options ?? {};

        // Set input field
        this.inputField = inputField;
        this.inputField.addEventListener('input', this.onChange);

        // Set controller
        this.controller = this.options.controller ?? new AutocompleteController(this.options.controllerOptions);
        this.controller.onUpdate = () => this.onUpdate();
    }

    setSingleResultArea(element: HTMLElement) {
        this.singleResultArea = element;
    }

    setResultList(element: HTMLUListElement) {
        this.resultList = element;
    }

    getController() {
        return this.controller;
    }

    private onChange() {
        const q = this.inputField.value ?? '';
        const caretPosition = this.inputField.selectionStart ?? q.length;

        // Discard update if value is under minimum character length
        const minInputLength = this.options.minInputLength ?? 2;
        if (q.length <= minInputLength) return;
        this.controller.update(q, caretPosition);
    }

    private onUpdate() {
        if (!this.resultList) return;

        this.resultList.innerHTML = '';
        this.controller.getResults().forEach((el) => {
            const listItem = document.createElement('span');
            listItem.innerHTML = el.forslagstekst;

            listItem.addEventListener('click', () => {
                this.controller.select(el);
                if (this.onSelect) this.onSelect();
            });

            this.resultList?.appendChild(listItem);
        });
    }
}
