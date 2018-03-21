/// <reference types="react" />
import { FormBaseInput, IFormBaseInputProps } from 'formgen-react/dist/formBaseInput/FormBaseInput';
import { IFormContext } from 'formgen-react/dist/form/Form.types';
import { IFormSPPeoplePickerProps, IFormSPPeoplePickerState } from './FormSPPeoplePicker.types';
/**
 * SharePoint People picker control. Let choose one ore more Persons.
 */
export declare class FormSPPeoplePicker extends FormBaseInput<IFormSPPeoplePickerProps, IFormBaseInputProps, IFormSPPeoplePickerState> {
    private pickerSuggestionsProps;
    constructor(props: IFormBaseInputProps, context: IFormContext);
    /**
     * Translate all the UI text in the correct langauge.
     */
    private _getTranslatedTexts();
    /**
     * Render a Fabric DatePicker
     */
    render(): JSX.Element;
    /**
   * Event when the selection has changed. Store the array of persons.
   * @param items Array of personas to store
   */
    private _onItemsChange(items);
}
