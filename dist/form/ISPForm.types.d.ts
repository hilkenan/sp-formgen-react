import { IFormProps, JFormData } from "formgen-react";
/**
 * The Interface for the Property.
 */
export interface ISPFormProps extends IFormProps<JFormData> {
    /** When set to true then uses the localhost SharePoint Proxy server insetd of the context. */
    useLocalHost?: boolean;
    /** Defines the server Relative url to the root web site */
    serverRelativeUrl: string;
}
