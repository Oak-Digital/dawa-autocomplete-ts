import { debounce, DebounceSettings } from 'lodash';
import { AutocompleteController } from '../controller/AutocompleteController';
import { UIOptions } from './ui-options.interface';

const defaultOptions: UIOptions = {
    minInputLength: 2,
    debounce: true,
    debounceDelay: 300,
    debounceMaxWait: 500,
};

export class AutocompleteUI {
    options: UIOptions;

    inputField: HTMLInputElement;
    controller: AutocompleteController;

    singleResultArea?: HTMLElement;
    resultList?: HTMLUListElement;

    public onSelect?: () => void;

    constructor(inputField: HTMLInputElement, options?: UIOptions) {
        this.options = options ?? defaultOptions;

        // Set input field
        this.inputField = inputField;

        // On change callback
        const debounceOptions: DebounceSettings = {
            maxWait: this.options.debounceMaxWait ?? defaultOptions.debounceMaxWait,
        };
        this.inputField.addEventListener(
            'input',
            this.options.debounce
                ? debounce(
                      () => this.onChange(),
                      this.options.debounceDelay ?? defaultOptions.debounceDelay,
                      debounceOptions
                  )
                : this.onChange
        );

        // Set controller
        this.controller = this.options.controller ?? new AutocompleteController(this.options.controllerOptions);
        this.controller.setOnResolved(() => this.onResolve());
        this.controller.setOnUpdate(() => this.onUpdate());
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
        if (q.length <= this.options.minInputLength) return;
        this.controller.update(q, caretPosition);
    }

    private onResolve() {
        if (!this.resultList) return;

        this.resultList.innerHTML = '';
        this.controller.getResults().forEach((el, idx) => {
            const listItem = document.createElement('span');
            listItem.innerHTML = el.forslagstekst;

            listItem.addEventListener('click', () => {
                this.controller.select(idx);
                if (this.onSelect) this.onSelect();
            });

            this.resultList?.appendChild(listItem);
        });
    }

    private onUpdate() {
        this.inputField.value = this.controller.getQuery();
        this.inputField.focus();
    }
}
