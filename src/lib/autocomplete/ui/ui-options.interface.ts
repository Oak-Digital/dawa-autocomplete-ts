import { AutocompleteController } from '../controller/AutocompleteController';
import { ControllerOptions } from '../controller/controller-options.interface';

export interface UIOptions {
    minInputLength: number;

    debounce: boolean;
    debounceDelay?: number;
    debounceMaxWait?: number;

    controller?: AutocompleteController;
    controllerOptions?: ControllerOptions;
}
