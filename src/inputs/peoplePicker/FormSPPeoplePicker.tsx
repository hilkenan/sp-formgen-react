import * as React from 'react';
import { FormBaseInput, IFormBaseInputProps } from 'formgen-react/dist/formBaseInput/FormBaseInput';
import { IFormContext } from 'formgen-react/dist/form/Form.types';
import { IBasePickerSuggestionsProps, autobind } from 'office-ui-fabric-react';
import { IFormSPPeoplePickerProps, IFormSPPeoplePickerState } from './FormSPPeoplePicker.types'
import { InnerControl } from 'formgen-react/dist/controls/innerControl/InnerControl'
import { Helper } from 'formgen-react/dist/Helper';
import { LocalsPeoplePicker } from 'formgen-react/dist/locales/LocalsPeoplePicker';
import Rendering from 'formgen-react/dist/form/Rendering';;
import { SPPeoplePicker } from 'gd-sprest-react/build/components/peoplePicker'

/**
 * SharePoint People picker control. Let choose one ore more Persons.
 */
export class FormSPPeoplePicker extends FormBaseInput<IFormSPPeoplePickerProps, IFormBaseInputProps, IFormSPPeoplePickerState> {
  private pickerSuggestionsProps:IBasePickerSuggestionsProps;

  constructor(props: IFormBaseInputProps, context: IFormContext) {
    super(props, context);
    this.state = {
      isValid: true,
      currentValue: this.props.control.Value,
      currentError: undefined,
      mostRecentlyUsed: [],
      peopleList: [],
    };
    this.pickerSuggestionsProps = this._getTranslatedTexts();
  }

  /**
   * Translate all the UI text in the correct langauge.
   */
  private _getTranslatedTexts(): IBasePickerSuggestionsProps {
    let ppFormater = Helper.getTranslator("peoplepicker").formatMessage;
    const suggestionProps: IBasePickerSuggestionsProps = {
      suggestionsHeaderText: ppFormater(LocalsPeoplePicker.suggestionsHeaderText),
      mostRecentlyUsedHeaderText: ppFormater(LocalsPeoplePicker.mostRecentlyUsedHeaderText),
      noResultsFoundText: ppFormater(LocalsPeoplePicker.noResultsFoundText),
      loadingText: ppFormater(LocalsPeoplePicker.loadingText),
      showRemoveButtons: true,
      suggestionsAvailableAlertText: ppFormater(LocalsPeoplePicker.suggestionsAvailableAlertText),
      suggestionsContainerAriaLabel: ppFormater(LocalsPeoplePicker.suggestionsContainerAriaLabel),
    };
    return suggestionProps;
  }

  /**
   * Render a Fabric DatePicker
   */
  public render(): JSX.Element {
    return (
    <InnerControl BaseControl={ this } LabelWith={ this.props.labelWith } >
      <SPPeoplePicker 
          ref={(input) => this.innerControl = input }     
          {...this.ConfigProperties}
          props={{
              onChange: this._onItemsChange,
              onResolveSuggestions: null,
              pickerSuggestionsProps: this.pickerSuggestionsProps
          }}
      />
      { this.state.currentError && Rendering.renderError(this.state.currentError) }        
      </InnerControl>);
  }

    /**
   * Event when the selection has changed. Store the array of persons.
   * @param items Array of personas to store
   */
  @autobind
  private _onItemsChange(items: any[]) {
    let alloMulti = this.ConfigProperties.allowMultiple != undefined ? this.ConfigProperties.allowMultiple : true;
    let personas = alloMulti ? items : items.splice(items.length - 1, 1);
    this.setValue(personas, true);
  }
}
