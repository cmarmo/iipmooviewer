/*
   IIPMooViewer 2.0 - FITS Controls Extensions
   IIPImage Javascript Viewer <http://iipimage.sourceforge.net>

   Copyright (c) 2012 Chiara Marmo <cmarmo@users.sourceforge.net>

   ---------------------------------------------------------------------------

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   ---------------------------------------------------------------------------

*/
IIPMooViewer.implement({

      // Create display FITS header button and div
      CreateHeaderDisplay: function() {

        if ( !this.controlsWindow ) this.CreateControlWin();
        var headdiv = new Element ( 'div', {
            'id' : 'header',
            'class': 'tip',
            'styles': {'width': '450px',
                       'visibility' : 'hidden' }
        }).inject(this.source);

        var toolbar = new Element( 'div', {
             'class': 'toolbar',
        });
        toolbar.store( 'tip:text', IIPMooViewer.lang.draghead );
        toolbar.inject(headdiv);

        var headclose = new Element ( 'span', {
            'class' : 'tip',
            'html' : 'X',
            'styles' : { 'border': '1px inset grey',
                         'position' : 'absolute',
                         'right' : '1px',
                         'cursor' : 'pointer',
                         'z-index' : 3 } 
        }).inject(headdiv);
        var headview = new Element ( 'span', {
            'id' : 'headerv',
            'class' : 'tip',
            'styles' : { 'line-height' : '1.4em',
                         'position' : 'absolute',
                         'top': '12px',
                         'width': '95%'}
        }).inject(headdiv);
        headclose.addEvent('click', function(){
                 (_this.container.getElementById('header')).setStyle('visibility','hidden');        
        });

        headdiv.makeDraggable({
	     container: this.container,
             handle:toolbar,
             // Take a note of the starting coords of our drag zone
             onStart: function() {
	       var pos = headdiv.getPosition();
	       this.hpos = {x: pos.x, y: pos.y-10};
	     }.bind(this),
        });

        var _this = this;
        var headerreq = new Request(
            {
	    method: 'get',
	    url: _this.server,
  	    onComplete: function(transport){
	         var response = transport || alert( "Error: No response from server " + _this.server );
	         // reformat the response
                 var n = response.indexOf(':')+1;
                 var hdr = response.substr(n);
                 var i = 0;
                 var printhdr = '';
                 while ( i<hdr.length ) {
                   var tmp = (hdr.substr(i,80)).concat('<br \>');
                   printhdr = printhdr.concat(tmp);
                   i += 80;
                 }
                 (_this.container.getElementById('headerv')).set('html',printhdr);
                 (_this.container.getElementById('header')).setStyle('visibility','visible');
            },
	    onFailure: function(){ alert('Error: Unable to get header image from server!'); }
	});

        var button = Array(this.images.length);
        for (i=0; i<this.images.length; i++){

          var imdiv = this.controlsWindow.getElementById('imname'+i);
          button[i] = new Element( 'button', {
            'class': 'headerfits',
            'html': 'FITS header',
          }).inject(imdiv);
          button[i].addEvent('click', function(){
                 var j = button.indexOf(this);
                 if (j!=-1) {
                   headerreq.send( "FIF=" + _this.images[j].src + "&obj=subject" );
                 }
          });

        }
      },


      // Parsing keywords
      FindKeywords: function() {
        var param;
        var headerreq = new Request(
            {
	    method: 'get',
	    async: false,
	    url: this.server + '?FIF=' + this.images[0].src + '&obj=subject',
  	    onComplete: function(transport){
	         var response = transport || alert( "Error: No response from server " + _this.server );
                 var header = new FITSHeader ({ format : 'asciistream' });
                 var keywords = header.parseAsciiStream(response);
                 for (var i = 0; i<keywords.length ; i++) {
                   if (keywords[i].keyname == 'NAXIS') {
                     var naxis = keywords[i].keyvalue;
                     var ctype = new Array(naxis);
                     var crpix = new Array(naxis);
                     var crval = new Array(naxis);
                     var cdelt = new Array(naxis);
		     for (var j = 0; j< naxis; j++) { cdelt[j] = 1; }
                     var crota = 0;
                     var cd = new Array(naxis*naxis);
		     for (var j = 0; j< naxis*naxis; j= j+3) { cd[j] = 1; }
		     for (var j = 1; j< naxis*naxis-1; j++) { cd[j] = 0; }
                     var pc = new Array(naxis*naxis);
                     continue;
                   }
                   if (keywords[i].keyname == 'CTYPE1') { ctype[0] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CTYPE2') { ctype[1] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CRPIX1') { crpix[0] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CRPIX2') { crpix[1] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CDELT1') { cdelt[0] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CDELT2') { cdelt[1] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CROTA1') { crota = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CROTA2') { crota = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CRVAL1') { crval[0] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CRVAL2') { crval[1] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CD1_1') { cd[0] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CD1_2') { cd[1] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CD2_1') { cd[2] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CD2_2') { cd[3] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'LONPOLE') { lonpole = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'LATPOLE') { latpole = keywords[i].keyvalue; continue; }
                 }
		 var coord = (((ctype[0]).split("-")[0]).replace('\'','') == 'GLON') ? 'lonlat' : 'radec';
                 var myproj = ((ctype[0]).slice('-4')).replace('\'','');
		 cdelt[0] = cd[0]*cdelt[0];
		 cdelt[1] = cd[3]*cdelt[1]; 
                 pc[0] = cd[0] * Math.cos(crota*Math.PI/180) ;
		 pc[1] = - Math.sin(crota*Math.PI/180);
		 pc[2] = Math.sin(crota*Math.PI/180);
                 pc[3] = cd[3] * Math.cos(crota*Math.PI/180);
		 param = {coord: coord, proj: myproj,
			  naxis: naxis, crpix: crpix,
			  crval: crval, cdelt: cdelt, pc: pc};
            },
	    onFailure: function(){ alert('Error: Unable to get header image from server!'); }
	});
        headerreq.send(); 
	return param;
      },

      /* define the image projection */
      DefineProjection: function(param){
    	this.linproj = new CoordTransf.Linear({naxis: param.naxis, crpix: param.crpix, pc: param.pc, cdelt: param.cdelt});
        if (param.coord == 'lonlat') { this.lon = 'l'; this.lat = 'b'; }
	else if (param.coord == 'radec') { this.lon = 'RA'; this.lat = 'DEC'; }

	switch (param.proj) {
          case 'AIT':
            this.proj = new Projections.Aitoff({naxis: param.naxis});
            break;
          case 'TAN':
            this.proj = new Projections.Gnomonic({naxis: param.naxis, crval: param.crval});
            break;
                }
      },

      /* Transform resolution independent coordinates to coordinate system */
      transformCoords: function( x, y ){

        // Calculate celestial coordinates using header astrometry
        var xycoord = this.linproj.linp2x([x*this.max_size.w, (1 - y) * this.max_size.h]);
        var newcoord = this.proj.prjx2s(xycoord,1);

        var text = this.lon + " = " + newcoord[0].toFixed(4) + " " + this.lat + " = " + newcoord[1].toFixed(4);
          return text;   
    },

});

