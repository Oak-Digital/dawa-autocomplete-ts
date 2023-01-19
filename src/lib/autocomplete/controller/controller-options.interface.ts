export interface ControllerOptions {
    baseUrl?: string;
    fuzzy?: boolean;
    type?: string;
    retryDelay?: number;
    adgangsadresserOnly?: boolean;
    stormodtagerpostnumre?: boolean;
    supplerendebynavn?: boolean;
    pageSize?: number;

    minLength?: number;

    debounce?: boolean;
    debounceDelay?: number;
    debounceMaxWait?: number;
}
