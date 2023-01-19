import axios, { AxiosInstance } from 'axios';
import { debounce } from 'lodash';
import { ControllerOptions } from './controller-options.interface';

const defaultOptions: ControllerOptions = {
    retryDelay: 500,
    type: 'adresse',
    baseUrl: 'https://dawa.aws.dk',
    adgangsadresserOnly: false,
    stormodtagerpostnumre: true,
    supplerendebynavn: true,
    fuzzy: true,
    pageSize: 5,

    minLength: 2,

    debounce: true,
    debounceDelay: 300,
    debounceMaxWait: 500,
};

type GetAutocompleteResponse = {
    type: string;
    tekst: string;
    caretpos: number;
    forslagstekst: string;
    data: any;
};

type RequestOptions = {
    query?: string;
    caretPosition?: number;
};

export class AutocompleteController {
    options: ControllerOptions;
    private client: AxiosInstance;

    private resultList: GetAutocompleteResponse[] = [];
    private selectedItem: GetAutocompleteResponse | null = null;

    private query = '';
    private caretPosition = 0;

    public onUpdate: (() => void) | null = null;
    public onSelect: ((selected: GetAutocompleteResponse) => void) | null = null;

    private updateAction: () => void;

    constructor(options?: ControllerOptions) {
        options = Object.assign({}, defaultOptions, options || {});
        this.options = options;

        this.client = axios.create({
            baseURL: options.baseUrl ?? defaultOptions.baseUrl,
        });

        this.updateAction = this.options.debounce
            ? debounce(
                  () => {
                      this.doUpdate();
                  },
                  this.options.debounceDelay,
                  { maxWait: this.options.debounceMaxWait }
              )
            : () => {
                  this.doUpdate();
              };
    }

    private async resolve(request: RequestOptions) {
        return this.client.get<GetAutocompleteResponse[]>('/autocomplete', {
            params: {
                q: request.query,
                caretpos: request.caretPosition,
                type: this.options.type ?? defaultOptions.type,
                fuzzy: this.options.fuzzy ?? defaultOptions.fuzzy ? '' : undefined,
                supplerendebynavn: this.options.supplerendebynavn ?? defaultOptions.supplerendebynavn,
                stormodtagerpostnumre: this.options.stormodtagerpostnumre ?? defaultOptions.stormodtagerpostnumre,
                per_side: this.options.pageSize ?? defaultOptions.pageSize,
            },
        });
    }

    async update(query: string, caretPosition: number) {
        this.query = query;
        this.caretPosition = caretPosition;
        this.updateAction();
    }

    private doUpdate() {
        this.resolve({ query: this.query, caretPosition: this.caretPosition })
            .then(({ data }) => {
                this.resultList = data;

                if (this.onUpdate) this.onUpdate();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    getCaretPosition() {
        return this.caretPosition;
    }

    getQuery() {
        return this.query;
    }

    getResults() {
        return this.resultList;
    }

    getSelectedItem() {
        return this.selectedItem;
    }

    select(item: GetAutocompleteResponse) {
        this.selectedItem = item;
        this.caretPosition = item.caretpos;

        this.update(this.selectedItem.tekst, this.caretPosition);
        if (this.onSelect) this.onSelect(this.selectedItem);

        return true;
    }

    reset() {
        console.debug('Reset');

        this.resultList = [];
        this.selectedItem = null;

        this.update('', 0);
    }
}
