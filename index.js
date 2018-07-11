'use strict';

// We use this only for debugging
// var logger = require('jsdoc/util/logger');

// TODO Get config
// Should the HTML lists be added to the doclet description?
var showList = true;

// Key map of classes and what they inherit from:
// { 'childClassName': 'parentClassName' }
var parents = {};

/**
 * A recursive function that finds all the parents of a given class.
 *
 * @param {string[]} p A single element array with the name of the class
 *                     whose parents we need to find
 * @returns {string[]} An array of all parents starting with the highest
 */
function findAllParents( p ) {
	var lastParent = p[ 0 ];
	var lastParentsParent = parents[ lastParent ];
	if ( lastParentsParent === undefined ) {
		return p;
	} else {
		p.unshift( lastParentsParent );
		return findAllParents( p );
	}
}

/**
 * Finds all the direct children of a given class name.
 *
 * @param {string} className
 * @returns {string[]} Array of the child classes' names
 */
function findDirectChildren( className ) {
	var children = [];
	for ( var longname in parents ) {
		if ( parents[ longname ] === className ) {
			children.push( longname );
		}
	}
	return children;
}

/**
 * Creates a link to a given class.
 *
 * @param {string} className
 * @returns {string} HTML string of '<a>'
 */
function linkTo( className ) {
	return '<a href="' + className + '.html">' + className + '</a>';
}

/**
 * Recursive function that creates a nested list of a class' parents.
 *
 * @param {string[]} classes Array of class' parent's names
 * @returns {string} HTML string of a `<ul>`
 */
function makeHierarchyList( classes ) {
	if ( classes.length === 0 ) {
		return '';
	} else {
		var className = classes.shift();
		return '<ul><li>' + linkTo( className ) + ' ' + makeHierarchyList( classes ) + '</li></ul>'
	}
}

/**
 * Creates a list of child classes.
 *
 * @param {string[]} classes Array of all the child classes' names.
 * @returns {string} HTML string of a `<ul>`
 */
function makeChildrenList( classes ) {
	var list = '<ul>';
	classes.forEach( function ( className ) {
		list += '<li>' + linkTo( className ) + '</li>';
	})
	list += '</ul>';
	return list;
}

// Setup event handlers for JSDoc
exports.handlers = {
	// Add names to the parents map for every new doclet
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

	// Once all doclets are processed, go through them and create hierarchy
	// and children lists. Also add the HTML versions if the config allows.
	processingComplete: function(e) {
		// Traverse list and get all parents
		e.doclets.forEach( function (d) {
			if ( d.kind === 'class'	) {
				var html = '';

				if (
					d.augments !== undefined &&
					d.augments.length > 0
				) {
					d.hierarchy = findAllParents( [ d.longname ] );
					if ( d.hierarchy.length > 0 && showList ) {
						html += '<h3>Hierarchy</h3>' + makeHierarchyList( d.hierarchy.slice() );
					}
				}

				d.children = findDirectChildren( d.longname );
				if ( d.children.length > 0 && showList ) {
					html += '<h3>Children</h3>' + makeChildrenList( d.children.slice() );
				}

				d.description = d.description === undefined ? '' : d.description;
				// Otherwise, using += appends 'undefined' as a string

				d.description = '<small>' + html + '</small>' + d.description;
			}
		});
	}
};
