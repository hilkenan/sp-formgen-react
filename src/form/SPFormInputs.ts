import { FormInputs } from 'formgen-react/dist/form/FormInputs';
import { ControlTypes } from 'formgen-react/dist/Enums';
import { FormSPPeoplePicker } from '../inputs/peoplePicker/FormSPPeoplePicker'

export class SPFormInputs extends FormInputs {
    constructor() {
        super();
        let picker = this.controls.find(c => c.typeName == ControlTypes.PeoplePicker);
        picker.controlType = FormSPPeoplePicker;
    }
}