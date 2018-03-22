import { JSPFormData } from "../objects/JSPFormData";
import { IFormProps } from "formgen-react";

/**
 * The Interface for the Property.
 */
export interface ISPFormProps extends IFormProps<JSPFormData> {
    /** When set to true then uses the localhost SharePoint Proxy server insetd of the context. */
    useLocalHost?: boolean
}