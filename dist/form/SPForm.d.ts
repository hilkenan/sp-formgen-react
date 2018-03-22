/// <reference types="react" />
import { BaseComponent } from "office-ui-fabric-react";
import { IFormState } from "formgen-react/dist/form/Form.types";
import { IGenericForm } from 'formgen-react';
import { JSPFormData } from '../objects/JSPFormData';
import { ISPFormProps } from './ISPForm.types';
/**
 * The main SharePoint Form Control that renders the Control Tree
 */
export declare class SPForm extends BaseComponent<ISPFormProps, IFormState> implements IGenericForm<JSPFormData> {
    render(): JSX.Element;
}
