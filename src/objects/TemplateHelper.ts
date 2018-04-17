import { JSPFormData, SPHelper } from "..";
import { ObjectFabric, TranslatedProperty } from "formgen-react";
import jsonpath = require("jsonpath");
import { Helper } from "formgen-react/dist/Helper";

export class TemplateHelper {
    public static getTemplatedTitle(formDataJson: any) : string {
        let formData = ObjectFabric.getForm<JSPFormData>(formDataJson, JSPFormData) as JSPFormData;
        if (formData.TitleTemplate) {
            let title = Helper.getTranslatedProperty(TranslatedProperty.Message, formData.TitleTemplate)
            if (formData.TitleTemplate.TemplateVariables) {
                for(let templVariable of formData.TitleTemplate.TemplateVariables) {
                    let varObjects:any[] = jsonpath.query(formDataJson, templVariable.JsonPath, 1);
                    if (varObjects.length > 0) {
                        title = SPHelper.replaceAll(title, "[" + templVariable.Name + "]", varObjects[0] as string);
                    }
                }
            }
            return title;
        }
        return undefined;
    }
}