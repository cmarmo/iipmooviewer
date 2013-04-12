/*
   Catalog Javascript Parser 
                        Version 0.0

   Copyright (c) 2012 Chiara Marmo <chiara.marmo@u-psud.fr>


   Built using the Mootools 1.3.2 javascript framework <http://www.mootools.net>


   ---------------------------------------------------------------------------

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

   ---------------------------------------------------------------------------
*/

/* catalog handler */
var Catalog = new Class({
	/**
	* Property: filenames
	* {Array} Array of filenames
	*     
	*/
	filenames: null,

	/**
	* Property: features
	* {Array} Array of features
	*     
	*/
	features: null,

	/**
	* Property: projection
	* {Enum}
	*     
	*/
	projection: null

});

/* KML catalog Handler */
var KMLCatalog = new Class({
	Extends: Catalog,
 
	/* return an Array of features */
	getFeatures: function(filenames,dimim,dimann) {
		if (window.XMLHttpRequest)
  		{// code for IE7+, Firefox, Chrome, Opera, Safari
  			xmlhttp=new XMLHttpRequest();
  		}
		else
  		{// code for IE6, IE5
  			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  		}
		var objects = new Array();
		for (var j=0; j<filenames.length; j++) {
			xmlhttp.open("GET",filenames[j],false);
			xmlhttp.send();
			xmlDoc=xmlhttp.responseXML;

			var n = (xmlDoc.getElementsByTagName("Placemark")).length;
			for (var i=0; i<n; i++) {
				var coordinates = ((xmlDoc.getElementsByTagName("coordinates")[i].childNodes[0].nodeValue).split(","));
				var nodes = xmlDoc.getElementsByTagName("SchemaData")[i].childNodes;
				var text = "<div>";
				for (dn=0;dn<nodes.length;dn++) {
					if (nodes[dn].nodeName=="SimpleData") {
						text = text + nodes[dn].getAttribute("name");
						text = text + " = " + nodes[dn].childNodes[0].nodeValue + "<br />";
					}
				text = text + "</div>";
				}
				objects.push({x:(parseFloat(coordinates[0])-(dimann[0]/2.))/dimim[0], y:(dimim[1]-(dimann[1]/2.)-parseFloat(coordinates[1]))/dimim[1], h:dimann[1]/dimim[1], w:dimann[0]/dimim[0], text:text});
			}
		}
		return objects;
	}
});

/* JSON catalog Handler */
var JSONCatalog = new Class({
	Extends: Catalog,
 
	/* return an Array of features */
	getFeatures: function(filenames) {
		if (window.XMLHttpRequest)
  		{// code for IE7+, Firefox, Chrome, Opera, Safari
  			xmlhttp=new XMLHttpRequest();
  		}
		else
  		{// code for IE6, IE5
  			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  		}
		var objects = new Array();
		for (var j=0; j<filenames.length; j++) {
			xmlhttp.open("GET",filenames[j],false);
			xmlhttp.send();
			var jsondata=eval(xmlhttp.response);
			var temparray = objects.concat(jsondata);
			objects = temparray;
		}
		return objects;
	}
});
