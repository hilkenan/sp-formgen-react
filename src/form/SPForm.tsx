import * as React from 'react';
import { BaseComponent } from "office-ui-fabric-react";
import { IFormProps, IFormState } from "formgen-react/dist/form/Form.types";
import { GenericForm, DataBinder, IGenericForm } from 'formgen-react';
import { SPFormInputs } from './SPFormInputs'
import { JSPFormData } from '../objects/JSPFormData'
import { SPContainer } from '../objects/inversify.config'
  
/**
 * The main SharePoint Form Control that renders the Control Tree
 */
export class SPForm extends BaseComponent<IFormProps<JSPFormData>, IFormState> implements IGenericForm<JSPFormData> {

    public render(): JSX.Element {
        let inputs:SPFormInputs = new SPFormInputs();
        let spContainer = new SPContainer();
        return(
            <GenericForm
                {... this.props }
                container={ spContainer }
                formType={ JSPFormData }
                formInputs={ inputs }
                />
        ); 
    }
}