'use strict';

var logger = require('jsdoc/util/logger');

// TODO This might be useless
var helper = require('jsdoc/util/templateHelper');

// Key map of classes and what they inherit from:
// { 'childClassName': 'parentClassName' }
var parents = {};

var findAllParents = function ( p ) {
	var lastParent = p[ 0 ];
	var lastParentsParent = parents[ lastParent ];
	if ( lastParentsParent === undefined ) {
		return p;
	} else {
		p.unshift( lastParentsParent );
		return findAllParents( p );
	}
}

var findDirectChildren = function ( className ) {
	var children = [];
	for ( var longname in parents ) {
		if ( parents[ longname ] === className ) {
			children.push( longname );
		}
	}
	return children;
}

var makeHierarchyList = function ( classes ) {
	if ( classes.length === 0 ) {
		return '';
	} else {
		var className = classes.shift();
		return '<ul><li>' + className + ' ' + makeHierarchyList( classes ) + '</li></ul>'
	}
}

var makeChildrenList = function ( classes ) {
	var list = '<ul>';
	classes.forEach( function ( className ) {
		list += '<li>' + className + '</li>';
	})
	list += '</ul>';
	return list;
}

exports.handlers = {
	newDoclet: function ( e ) {
		var doclet = e.doclet;
		if (
			doclet.kind === 'class' &&
			doclet.augments !== undefined &&
			doclet.augments.length > 0
		) {
			parents[ doclet.longname ] = doclet.augments[ 0 ];
		}
	},

	processingComplete: function(e) {
		// Traverse list and get all parents
		e.doclets.forEach( function (d) {
      if (
				d.kind === 'class' &&
				d.augments !== undefined &&
				d.augments.length > 0
			) {
				d.hierarchy = findAllParents( [ d.longname ] );
				d.children = findDirectChildren( d.longname );

				// Pass a copy of the array
				d.description += '<h3>Hierarchy</h3>' + makeHierarchyList( d.hierarchy.slice() );
				d.description += '<h3>Children</h3>' + makeChildrenList( d.children.slice() );
      }
    });
  }
};
