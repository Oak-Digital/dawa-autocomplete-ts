import axios, { AxiosInstance } from 'axios';
import { ControllerOptions } from './controller-options.interface';

const defaultOptions: ControllerOptions = {
    minLength: 2,
    retryDelay: 500,
    type: 'adresse',
    baseUrl: 'https://dawa.aws.dk',
    adgangsadresserOnly: false,
    stormodtagerpostnumre: true,
    supplerendebynavn: true,
    fuzzy: true,
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

    onResolved: (() => void) | null = null;
    onUpdate: (() => void) | null = null;

    constructor(options?: ControllerOptions) {
        options = Object.assign({}, defaultOptions, options || {});
        this.options = options;

        this.client = axios.create({
            baseURL: options.baseUrl,
        });
    }

    private async resolve(request: RequestOptions) {
        return this.client.get<GetAutocompleteResponse[]>('/autocomplete', {
            params: {
                q: request.query,
                caretpos: request.caretPosition,
                type: this.options.type,
                fuzzy: this.options.fuzzy ? '' : undefined,
                supplerendebynavn: this.options.supplerendebynavn,
                stormodtagerpostnumre: this.options.stormodtagerpostnumre,
            },
        });
    }

    async update(query: string, caretPosition: number) {
        this.query = query;
        this.caretPosition = caretPosition;

        try {
            const { data, status } = await this.resolve({ query, caretPosition });

            console.debug('Remote answer with status: ', status);

            this.resultList = data;
            if (this.onResolved) this.onResolved();
        } catch (e) {
            console.error(e);
        } finally {
            if (this.onUpdate) this.onUpdate();
        }
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

    select(item: number) {
        if (item < 0 || item >= this.resultList.length) return false;
        this.selectedItem = this.resultList[item];

        console.debug('Selected item: ', this.selectedItem);

        this.caretPosition = this.selectedItem.caretpos;

        this.update(this.selectedItem.tekst, this.caretPosition);

        return true;
    }

    setOnResolved(func: () => void) {
        this.onResolved = func;
    }

    setOnUpdate(func: () => void) {
        this.onUpdate = func;
    }

    reset() {
        console.debug('Reset');

        this.resultList = [];
        this.selectedItem = null;

        this.update('', 0);
    }
}
