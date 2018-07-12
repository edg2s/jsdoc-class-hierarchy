# jsdoc-class-hierarchy
[JSDoc](http://usejsdoc.org/) plugin to add class hierarchy data, and optionally
an HTML list representation of the same.

It uses the `newDoclet` and `processingComplete` events given by JSDoc, and
reads the `augments` property in the doclets. This is added when the `@extends`
tag is used.

## Install
Install using [npm](https://www.npmjs.com/package/jsdoc-class-hierarchy):

```
npm install jsdoc-class-hierarchy --save-dev
```

Add to the plugins in your JSDoc config:

```json
{
  "plugins": [
    "plugins/markdown",
    "node_modules/jsdoc-class-hierarchy"
  ]
}
```

## Configuration
Name|Type|Description
--|--|--
`showList` | **boolean** | Whether or not to show an HTML list of the children classes and hierarchy.<br><br> Defaults to `false`.

## Usage
If you use the plugin with `showList` enabled you automatically get a styled
HTML list in your class description. This is is the easiest way of using the
plugin:

```json
{
  "plugins": [
    "node_modules/jsdoc-class-hierarchy"
  ],
  "opts": {
    "class-hierarchy": {
      "showList": true
    }
  }
}
```

It will result in something like this:

<img 
  width="813" 
  alt="class hierarchy screenshot" 
  src="https://user-images.githubusercontent.com/9491/42612314-46f8bc5e-85b8-11e8-9712-e2f04974be48.png">

If you don't like this display you can update your theme to show this data
however you like. Doclets of classes that have subclasses will have a
`children` key. All classes that are subclasses of another class will have the
`hierarchy` key. Both are arrays of strings, with the class on top of the
hierarchy being the first one.

For example:

```javascript
doclet.children = [ 'OO.ui.ToolGroup', 'OO.ui.Tool' ];
doclet.hierarchy = [ 'OO.ui.Element', 'OO.ui.Widget' ];
```
