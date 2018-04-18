export declare class TemplateHelper {
    static getTemplatedTitle(formDataJson: any): string;
    /**
     * Finde with the full control id the Control in the tree.
     * @param inputKey The full control id to finde the corresponding control
     */
    private static findeControlFromKey(formData, inputKey);
    /**
     * Find the Control with the ID in the tree of controls
     * @param rows Row Array
     * @param controlStruct ID Structure. the Element 0 is the id from the form an will not be used
     * @param level The level in where to search in the contrlStruct.
     */
    private static findeControlInRow(rows, controlStruct, level);
    /**
     * Find the Control with the ID in the tree of controls
     * @param controls Control Array
     * @param controlStruct ID Structure. the Element 0 is the id from the form an will not be used
     * @param level The level in where to search in the contrlStruct.
     */
    private static findeControlInControls(controls, controlStruct, level);
}
