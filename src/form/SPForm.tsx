import * as React from 'react';
import { BaseComponent } from "office-ui-fabric-react";
import { IFormState } from "formgen-react/dist/form/Form.types";
import { GenericForm, IGenericForm, JFormData } from 'formgen-react';
import { SPFormInputs } from './SPFormInputs';
import { SPContainer } from '../objects/inversify.config';
import { ISPFormProps } from './ISPForm.types';

/**
 * The main SharePoint Form Control that renders the Control Tree
 */
export class SPForm extends BaseComponent<ISPFormProps, IFormState> implements IGenericForm<JFormData> {

    public render(): JSX.Element {
        let inputs:SPFormInputs = new SPFormInputs();
        let spContainer = new SPContainer(this.props.useLocalHost ? this.props.useLocalHost : false, this.props.serverRelativeUrl);
        return(
            <GenericForm
                {... this.props }
                container={ spContainer }
                formInputs={ inputs }
                />
        ); 
    }
}