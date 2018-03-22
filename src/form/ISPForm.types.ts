import { JSPFormData } from "../objects/JSPFormData";
import { IFormProps } from "formgen-react";

export interface ISPFormProps extends IFormProps<JSPFormData> {
    useLocalHost?: boolean
}