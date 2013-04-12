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

      // Create coordinate display div
      CreateCoordDisplay: function(coord,linproj,proj) {
        if ( !this.controlsWindow ) this.CreateControlWin();
        this.FindKeywords();
 
       var coordtable = new Element( 'table', {
          'html': '<tr><td id="cel1">=</td><td id="celx"></td></tr><tr><td id="cel2"></td><td id="cely"></td></tr>'
          //'html': '<tr><th>x</th><th>y</th><th id="cel1">l</th><th id="cel2">b</th></tr><tr><td id="x"></td><td id="y"></td><td id="celx"></td><td id="cely"></td></tr>'
        }).inject(this.controlsWindow);


        if (coord == 'lonlat') {
          document.getElementById("cel1").innerHTML= 'l=';
          document.getElementById("cel2").innerHTML= 'b=';
        } else if (coord == 'radec') {
          document.getElementById("cel1").innerHTML= 'RA=';
          document.getElementById("cel2").innerHTML= 'DEC=';
        }
        // Catching coordinates on canvas
        var _this = this;
        //imagezone = document.getElementById("images");
        this.canvas.addEvent('mousemove', function(e) {
                 var offsetx = parseFloat(this.getStyle('left'));
                 var offsety = parseFloat(this.getStyle('top'));
                 var res = Math.pow(2,_this.num_resolutions-_this.view.res-1);
                 var x = (e.client.x - offsetx + _this.view.x)*res;
                 var y = _this.max_size.h - (e.client.y - offsety + _this.view.y)*res;
                 //document.getElementById("x").innerHTML= x ;
                 //document.getElementById("y").innerHTML= y ;
                 var xycoord = linproj.linp2x([x, y]);
                 var newcoord = proj.prjx2s(xycoord,1);
                 document.getElementById("celx").innerHTML= newcoord[0].toFixed(4);
                 document.getElementById("cely").innerHTML= newcoord[1].toFixed(4);
          });
      },

      // Parsing keywords

      FindKeywords: function() {
        var _this = this;
        var headerreq = new Request(
            {
	    method: 'get',
	    url: _this.server,
  	    onComplete: function(transport){
	         var response = transport || alert( "Error: No response from server " + _this.server );
                 var header = new FITSHeader ({ format : 'asciistream' });
                 var keywords = header.parseAsciiStream(response);
console.log(keywords.length );
                 for (var i = 0; i<keywords.length ; i++) {
                   if (keywords[i].keyname == 'NAXIS') {
                     var naxis = keywords[i].keyvalue;
                     var crpix = new Array(naxis);
                     var cdelt = new Array(naxis);
                     var pc = new Array(naxis*naxis);
                     continue;
                   }
                   if (keywords[i].keyname == 'CRPIX1') { crpix[0] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CRPIX2') { crpix[1] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CDELT1') { cdelt[0] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CDELT2') { cdelt[1] = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CRVAL1') { phi0 = keywords[i].keyvalue; continue; }
                   if (keywords[i].keyname == 'CRVAL2') { theta0 = keywords[i].keyvalue; continue; }
                 }
                 var valproj = [naxis, crpix, cdelt, phi0, theta0];
                 return valproj; 
            },
	    onFailure: function(){ alert('Error: Unable to get header image from server!'); }
	});
        headerreq.send( "FIF=" + this.images[0].src + "&obj=subject");
      },

});

