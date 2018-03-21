import { IFormBaseInputState } from "formgen-react/dist/formBaseInput/FormBaseInput.types";
import { IPersonaProps, IPeoplePickerProps } from "office-ui-fabric-react";

/**
 * The People picker state
 */
export interface IFormSPPeoplePickerState extends IFormBaseInputState {
    mostRecentlyUsed: IPersonaProps[];
    peopleList: IPersonaProps[];
}

/**
 * The People picker properties
 */
export interface IFormSPPeoplePickerProps extends IPeoplePickerProps {
    allowMultiple?: boolean;
}