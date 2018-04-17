import * as React from 'react';
import { BaseComponent } from "office-ui-fabric-react";
import { IFormState } from "formgen-react/dist/form/Form.types";
import { GenericForm, IGenericForm } from 'formgen-react';
import { SPFormInputs } from './SPFormInputs';
import { JSPFormData } from '../objects/JSPFormData';
import { SPContainer } from '../objects/inversify.config';
import { ISPFormProps } from './ISPForm.types';
import { TemplateHelper } from '../objects/TemplateHelper';

/**
 * The main SharePoint Form Control that renders the Control Tree
 */
export class SPForm extends BaseComponent<ISPFormProps, IFormState> implements IGenericForm<JSPFormData> {

    public render(): JSX.Element {
        let formTitle = this.props.showTemplateTitle ? TemplateHelper.getTemplatedTitle(this.props.jsonFormData) : undefined;
        let inputs:SPFormInputs = new SPFormInputs();
        let spContainer = new SPContainer(this.props.useLocalHost ? this.props.useLocalHost : false);
        return(
            <GenericForm
                formTitle={ formTitle }
                {... this.props }
                container={ spContainer }
                formType={ JSPFormData }
                formInputs={ inputs }
                />
        ); 
    }
}