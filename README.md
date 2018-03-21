# SharePoint React Form Generator with UI Fabric React Components

<b>All of you are very welcome to contribute with this project!</b>
Also my other project formgen-react. This project is only the injection for SharePoint
for the formgen-react project. See <a href="https://github.com/hilkenan/formgen-react/wiki">formgen-react documentation<a>.

[![npm version](https://badge.fury.io/js/sp-formgen-react.svg)](http://badge.fury.io/js/sp-formgen-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://secure.travis-ci.org/hilkenan/sp-formgen-react.svg)](https://travis-ci.org/hilkenan/sp-formgen-react)
[![Dependency Status](https://david-dm.org/hilkenan/sp-formgen-react.svg)](https://david-dm.org/hilkenan/sp-formgen-react)
[![Downloads](http://img.shields.io/npm/dm/sp-formgen-react.svg)](https://npmjs.org/package/sp-formgen-react)

## Features
- Same as for formgen-react project
- SharePoint People Picker control
- Dependency Injection for SharePoint List loading for the controls:
    - DropDonw
    - Combobox
    - Choice Group
    - Cascading Dropdonw (over multiple lists)
- Load translated list content from sharepoint

## Installation

The package can be installed via NPM:
```
npm install # sp-formgen-react --save
```

## Documentation

<a href="https://github.com/hilkenan/formgen-react/wiki">Full documentation from formgen-react<a><br>
<a href="https://github.com/hilkenan/sp-formgen-react/wiki">Full documentation from sp-formgen-react<a>

## Configuration

The example below shows how to use the form generator with a simple json definition. This JSON need to map to the JSON schema:
```ts
import * as React from 'react';
import Form from 'formgen-react';
var jsonForm = require('./test.json');

export class Example extends React.Component {
render() {
  return (
  <SPForm 
    onCancelForm={ () => console.log("cancel click") }
    onSubmitForm={ (formData:any) => console.log("submit click: " + JSON.stringify(formData)) }
    jsonFormData={ jsonForm }  />
);
}
```
The above ./test.json file could look like this:
```JSON
{
     "$schema": "../schemas/jfrom-schema.json",
     "id": "testform",
     "theme": "red",
     "title": "Test EN",
     "title_trans": {
         "de": "Test DE",
         "fr": "Test FR",
         "it": "Test IT"
    },
	"sp_config": {
		"lists": [{
			"key": "configKeyList",
			"config": {
				"view_name": "All Elementes",
				"key_field": "ID",
				"list_name": "yoursharepointlist",
				"display_fields": [{
					"internal_name": "Title"
				}]
			}
        }]
    },
    "rows": [{
        "columns": [{
			"controls": [{
                "id": "choiceGroup",
				"title": "ChoiceGroup",
				"dataProviderConfigKeys": [ "configKeyList" ],
                "control_type": [ "ChoiceGroup" ],
                "label_position": [ "Top"]
            }]
        }]
    }]
 }
```
The JSON has to fit the Schema Definition:<br/>
[Form Schema](src/schemas/sp-jfrom-schema.json)<br/>
[SharePoint Config](src/schemas/sp-databinder-config-schema.json)<br/>
You need also the following global Schemas:<br/>
[Translation](src/schemas/translation-schema.json)<br/>
[Object Translation](src/schemas/objecttranslation-schema.json)<br/><br/>

## Local Development

The `master` branch contains the latest version of the Form component. To start your example app, you can run `npm run serve`. This starts a simple webserver on http://localhost:3000 and also an proxy to your sharepoint environment at http://localhost:4323. When you publish the solution to sharepoint you has to commet in the file SharePointTarget the line for the url an uncomment "static url:string = null". Otherwise the code still search you sharepoint at the localhost adress

## License

Copyright (c) 2018 to hilkenan and individual contributors. Licensed under MIT license, see [LICENSE](LICENSE) for the full license.