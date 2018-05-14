/// <reference types="react" />
import { BaseComponent } from "office-ui-fabric-react";
import { IFormState } from "formgen-react/dist/form/Form.types";
import { IGenericForm, JFormData } from 'formgen-react';
import { ISPFormProps } from './ISPForm.types';
/**
 * The main SharePoint Form Control that renders the Control Tree
 */
export declare class SPForm extends BaseComponent<ISPFormProps, IFormState> implements IGenericForm<JFormData> {
    render(): JSX.Element;
}
