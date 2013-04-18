/*
   IIPMooViewer 2.0 - Controls Extensions
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


/* Extend IIPMooViewer to handle controls widgets
 */
IIPMooViewer.implement({

  // Create controls window
  CreateControlWin: function() {

    var navwindow =  document.getElementById('navcontainer');
    this.controlsWindow = new Element('div', {
      'class': 'controls',
      'styles': { 'width':  this.navigation.size.x,
                  'text-align': 'left' }
    }).inject(navwindow);

    /*var globaldiv = new Element('div', {
      'id': 'globcontrols',
      'class': 'text',
      'html': '<p>Global controls</p>',
    }).inject(this.controlsWindow);*/
    for (i=0; i<this.images.length; i++){
      var n = (this.images[i].src.split("/")).length-1;
      var imdiv = new Element('div', {
        'id': 'imname'+i,
        'class': 'text',
        'html': '<p id="impar'+i+'">'+(this.images[i].src.split("/"))[n]+'</p>',
      }).inject(this.controlsWindow);
    }
  },


  // Create contrast controls
  CreateContrastControl: function() {
    if ( !this.controlsWindow ) this.CreateControlWin();

    var slider = Array(this.images.length);
    for (i=0; i<this.images.length; i++){
      var imdiv = this.controlsWindow.getElementById('imname'+i);
      var conPar = new Element('p', {
        'id': 'conslider'+i,
        'class': 'text',
        'html': 'Contrast: <span id="contrast-factor'+i+'"></span>',
        'styles': { 'position': 'relative',
                    'bottom' : '15px'}
      }).inject(imdiv);
      var area = new Element('div', {
          'id': 'conarea'+i,
          'class': 'conarea',
          'styles': { 'position': 'relative',
                    'bottom' : '15px'}
      }).inject(imdiv);
      var knob = new Element('div', {
         'id': 'conknob'+i,
         'class': 'conknob'
      }).inject(area);
      var _this = this;
      slider[i] = new Slider( area, knob, {
         range: [0,100],
         onComplete: function(pos){
           newcnt = 1.0 + pos/100;
           var j = slider.indexOf(this);
           if (j!=-1) {
             document.getElementById('contrast-factor'+j).setStyle('font-weight', 'bold');
             document.getElementById('contrast-factor'+j).set('html', newcnt.toFixed(2) + 'x');
             _this.images[j].cnt=newcnt;
             _this.requestImages();
           } else {
             document.getElementById('contrast-factor'+i).setStyle('font-weight', 'bold');
             document.getElementById('contrast-factor'+i).set('html', '1x');
           }
         }
      });
      slider[i].set(0);   
    }
  },

  // Create gamma controls
  CreateGammaControl: function() {
    if ( !this.controlsWindow ) this.CreateControlWin();

    var slider = Array(this.images.length);
    for (i=0; i<this.images.length; i++){
      var imdiv = this.controlsWindow.getElementById('imname'+i);
      var gamPar = new Element('p', {
        'id': 'gamslider'+i,
        'class': 'text',
        'html': 'Set display gamma: <span id="gamma-factor'+i+'"></span>'
      }).inject(imdiv);
      var area = new Element('div', {
          'id': 'gamarea'+i,
          'class': 'gamarea'
      }).inject(imdiv);
      var knob = new Element('div', {
         'id': 'gamknob'+i,
         'class': 'gamknob'
      }).inject(area);
      var _this = this;
      slider[i] = new Slider( area, knob, {
         range: [50,300],
         onComplete: function(pos){
           newgam = pos/100;
           var j = slider.indexOf(this);
           if (j!=-1) {
             document.getElementById('gamma-factor'+j).setStyle('font-weight', 'bold');
             document.getElementById('gamma-factor'+j).set('html', newgam.toFixed(2));
             _this.images[j].gam=(1./newgam).toFixed(2);
             _this.requestImages();
           } else {
             document.getElementById('gamma-factor'+i).setStyle('font-weight', 'bold');
             document.getElementById('gamma-factor'+i).set('html', '2.20');
           }
         }
      });
      slider[i].set(220);   
    }
  },

  // Create min max controls
  CreateMinMaxControl: function() {
    if ( !this.controlsWindow ) this.CreateControlWin();

    var minmaxreq = Array(this.images.length);

    var minslider = Array(this.images.length);
    var maxslider = Array(this.images.length);
    var minInp = Array(this.images.length);
    var maxInp = Array(this.images.length);

    for (i=0; i<this.images.length; i++){

      var _this = this;
      var imdiv = this.controlsWindow.getElementById('imname'+i);
      var minPar = new Element('p', {
        'id': 'minslider'+i,
        'class': 'mintext',
        'html': 'min: '
      }).inject(imdiv);
      minInp[i] = new Element('input',{
	'id': 'minimum'+i,
        'value': 0
      }).inject(minPar);
      var maxPar = new Element('p', {
        'id': 'maxslider'+i,
        'class': 'maxtext',
        'html': 'max: '
      }).inject(imdiv);
      maxInp[i] = new Element('input',{
	'id': 'maximum'+i,
        'value': 0
      }).inject(maxPar);

      var minarea = new Element('div', {
          'id': 'minarea'+i,
          'class': 'minarea'
      }).inject(imdiv);
      var minknob = new Element('div', {
         'id': 'minknob'+i,
         'class': 'minknob'
      }).inject(minarea);
      minslider[i] = new Slider( minarea, minknob, {
         range: [-10,100],
         onComplete: function(pos){
           var newmin = pos;
           var jmin = minslider.indexOf(this);
           if (jmin>-1) {
             document.getElementById('minimum'+jmin).set('value', newmin);
             _this.images[jmin].minarray[0]=newmin;
             _this.requestImages();
           }
         }
      });

      var maxarea = new Element('div', {
          'id': 'maxarea'+i,
          'class': 'maxarea'
      }).inject(imdiv);
      var maxknob = new Element('div', {
         'id': 'maxknob'+i,
         'class': 'maxknob'
      }).inject(maxarea);
      maxslider[i] = new Slider( maxarea, maxknob, {
         range: [-10,100],
         onComplete: function(pos){
           var newmax = pos;
           var jmax = maxslider.indexOf(this);
           if (jmax>-1) {
             document.getElementById('maximum'+jmax).set('value', newmax);
             _this.images[jmax].maxarray[0]=newmax;
             _this.requestImages();
           }
         }
      });

      // Send the minmax request
      this.images[i].minarray = new Array();
      this.images[i].maxarray = new Array();
      minmaxreq[i] = new Request(
        {
	method: 'get',
	url: _this.server,
  	onComplete: function(transport){
	  var response = transport || alert( "Error: No response from server " + _this.server );
	  // Parse the result
          var result = _this.protocol.parseMinMax( response );
          var j = minmaxreq.indexOf(this);
          if (j>-1) {
            _this.images[j].minarray = result.minarray;
            _this.images[j].maxarray = result.maxarray;
//console.log(_this.images[j].minarray[0]);
            document.getElementById('minimum'+j).set('value', _this.images[j].minarray[0]);
            document.getElementById('maximum'+j).set('value', _this.images[j].maxarray[0]);
            minslider[j].set(_this.images[j].minarray[0]);
            maxslider[j].set(_this.images[j].maxarray[0]);
          }
        },
	onFailure: function(){ alert('Error: Unable to get image minimum and maximum from server!'); }
	} );


      minInp[i].addEvent('change', function(){
           var jmin = minInp.indexOf(this);
           if (jmin>-1) {
             minslider[jmin].set(this.value);
             _this.images[jmin].minarray[0]=this.value;
             _this.requestImages();
	   }
      });
      maxInp[i].addEvent('change', function(){
           var jmax = maxInp.indexOf(this);
           if (jmax>-1) {
             maxslider[jmax].set(this.value);
             _this.images[jmax].maxarray[0]=this.value;
             _this.requestImages();
	   }
      });

      minmaxreq[i].send( this.protocol.getMinMaxURL(this.images[i].src) );
//console.log(this.images[i].minarray[0]);
//console.log(this.images[i].maxarray[0]);
    }
  },


  // Create opacity controls
  CreateOpacityControl: function() {
    if ( !this.controlsWindow ) this.CreateControlWin();

    var slider = Array(this.images.length);
    for (i=0; i<this.images.length; i++){
      var imdiv = this.controlsWindow.getElementById('imname'+i);
      var opaPar = new Element('p', {
        'id': 'opaslider'+i,
        'class': 'text',
        'html': 'Set image opacity: <span id="opacity-value'+i+'"></span>'
      }).inject(imdiv);
      var area = new Element('div', {
          'id': 'opaarea'+i,
          'class': 'opaarea'
      }).inject(imdiv);
      var knob = new Element('div', {
         'id': 'opaknob'+i,
         'class': 'opaknob'
      }).inject(area);
      var _this = this;
      slider[i] = new Slider( area, knob, {
         range: [0,100],
         onComplete: function(pos){
           newopa = 1.0 - pos/100;
           var j = slider.indexOf(this);
           if (j!=-1) {
             document.getElementById('opacity-value'+j).setStyle('font-weight', 'bold');
             document.getElementById('opacity-value'+j).set('html', newopa.toFixed(2));
             _this.images[j].opacity=newopa;
	     _this.canvas.getChildren('img').setStyle('opacity', newopa);
           } else {
             document.getElementById('opacity-value'+i).setStyle('font-weight', 'bold');
             document.getElementById('opacity-value'+i).set('html', '1');
           }
         }
      });
      slider[i].set(0);   
    }
  },

  // Create the blending bar
  CreateBlendingBar: function() {
    if ( !this.controlsWindow ) this.CreateControlWin();

    var imdiv = this.controlsWindow;
    var area = new Element('div', {
        'id': 'blendarea',
        'class': 'blendarea',
        'styles': { 'height': this.controlsWindow.getStyle('height'),
                    'top': '20px' }
    }).inject(imdiv,'top');
    var knob = new Element('div', {
        'id': 'blendknob',
        'class': 'blendknob'
    }).inject(area);
    var _this = this;
    var slider = new Slider( area, knob, {
        range: [0,100],
        mode: 'vertical',
        onComplete: function(pos){
           var dop = 100 / (_this.images.length-1);
           _this.images[0].opacity = 1;

           for (var i=1; i<_this.images.length; i++){
             _this.images[i].opacity = (pos > i*dop)? 1:(pos/dop)-i+1;
	     var img = _this.canvas.getChildren('img');
	     for (var j=0; j<img.length; j++) {
               if (img[j].hasClass('layer'+i)) img[j].setStyle('opacity', _this.images[i].opacity);
             }
           }
        }
    });
  },

  // Create Layer Menu
  CreateLayerSwitch: function() {
    if ( !this.controlsWindow ) this.CreateControlWin();

    var _this = this;
    var pradio = Array(this.images.length);
    for (i=0; i<this.images.length; i++){
      if (this.controlsWindow.getElementById('layercol'+i)) (this.controlsWindow.getElementById('layercol'+i)).setStyle('display','hidden');
      var imdiv = this.controlsWindow.getElementById('impar'+i);
      var form = new Element ('form').inject(imdiv,'after');
      pradio[i] = new Element ('input', {
        'id': 'layerimg'+i,
        'type': 'radio',
        'name': 'layer',
        'value': i,
        'styles': { 'position': 'relative',
                    'bottom': '25px',
                    'left': '100px'}
      }).inject(form);
      pradio[i].addEvent('click', function() {
	   var img = _this.canvas.getChildren('img');
           var j = pradio.indexOf(this);
           if (j!=-1) {
	     for (t=0; t<_this.images.length; t++) {
               if (t!=j) {
		 _this.images[t].opacity=0;
                 pradio[t].checked=false;
	         for (var l=0; l<img.length; l++) {
                   if (img[l].hasClass('layer'+t)) img[l].setStyle('opacity', _this.images[t].opacity);
                 }
               }
               pradio[j].set('checked','true');
               _this.images[j].opacity = 1.0;
	       for (var l=0; l<img.length; l++) {
                 if (img[l].hasClass('layer'+j)) img[l].setStyle('opacity', _this.images[j].opacity);
               }
             }
	   }  
       });
    }
    pradio[0].set('checked','true');
  }
});
