import { JSPFormData } from "../objects/JSPFormData";
import { IFormProps } from "formgen-react";

/**
 * The Interface for the Property.
 */
export interface ISPFormProps extends IFormProps<JSPFormData> {
    /** When set to true then uses the localhost SharePoint Proxy server insetd of the context. */
    useLocalHost?: boolean;

    /** When set to true then show the templated title string insed of the static title */
    showTemplateTitle?: boolean;

    /** Defines the server Relative url to the root web site */
    serverRelativeUrl: string;
}