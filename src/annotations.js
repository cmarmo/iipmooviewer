/*
   IIPMooViewer 2.0 - Annotation Extensions
   IIPImage Javascript Viewer <http://iipimage.sourceforge.net>

   Copyright (c) 2007-2012 Ruven Pillay <ruven@users.sourceforge.net>
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


/* Extend IIPMooViewer to handle annotations
 */
IIPMooViewer.implement({

  /* Initialize canvas events for our annotations
   */
  initAnnotations: function() {

    this.annotationTip = null;
    this.annotationsVisible = true;

    // Use closure for mouseenter and mouseleave events
    var _this = this;

    // Display / hide our annotations if we have any
    if( this.annotations ){
      this.canvas.addEvent( 'mouseenter', function(){
        if( _this.annotationsVisible ){
	  _this.container.getElements('canvas.annotation').removeClass('hidden');
	}
      });
      this.canvas.addEvent( 'mouseleave', function(){
	if( _this.annotationsVisible ){
	  _this.container.getElements('canvas.annotation').addClass('hidden');
	}
      });
    }
  },

  /* Draw each annotation
   */
  drawAnnotation: function(x, y, w, h) {
	this.context.beginPath();
	this.context.rect(x, y, w, h);
	// context.arc(0, 0, this.wid * this.annotations[i].w, 0, 2*Math.PI);
	this.context.restore();
	this.context.lineWidth=4;
	this.context.strokeStyle="orange";
	this.context.stroke();
  },

  /* Create annotations if they are contained within our current view
   */
  createAnnotations: function() {

    // Sort our annotations by size to make sure it's always possible to interact
    // with annotations within annotations
    if( !this.annotations ) return;
    this.annotations.sort( function(a,b){ return (b.w*b.h)-(a.w*a.h); } );
    /*var annotation = new Element('canvas', {
        'id': 'annotation',
        'styles': {
          'position': 'absolute',
          'left': this.canvas.getStyle('left'),
          'top': this.canvas.getStyle('top')
	}
      }).inject( this.container );
    annotation.set('width', this.wid);
    annotation.set('height', this.hei);
    var ann_canvas = this.container.getElementById('annotation');
    var context = ann_canvas.getContext('2d');

    if( this.annotationsVisible==false ) annotation.addClass('hidden');*/

    for( var i=0; i<this.annotations.length; i++ ){

      // Check whether this annotation is within our view
      if( this.wid*(this.annotations[i].x+this.annotations[i].w) > this.view.x &&
	  this.wid*this.annotations[i].x < this.view.x+this.view.w &&
	  this.hei*(this.annotations[i].y+this.annotations[i].h) > this.view.y &&
	  this.hei*this.annotations[i].y < this.view.y+this.view.h
	  // Also don't show annotations that entirely fill the screen
	  //	  (this.hei*this.annotations[i].x < this.view.x && this.hei*this.annotations[i].y < this.view.y &&
	  //	   this.wid*(this.annotations[i].x+this.annotations[i].w) > this.view.x+this.view.w && 
      ){

	var text = this.annotations[i].text;
	if( this.annotations[i].title ) text = '<h1>'+this.annotations[i].title+'</h1>' + text;
        //this.annotations[i].store( 'tip:text', text );
        this.drawAnnotation(this.wid * this.annotations[i].x, this.hei * this.annotations[i].y, this.wid * this.annotations[i].w, this.hei * this.annotations[i].h);
      }
    }


    if( !this.annotationTip ){
      var _this = this;
      this.annotationTip = new Tips( 'div.annotation', {
        className: 'tip', // We need this to force the tip in front of nav window
	fixed: true,
	offset: {x:30,y:30},
	hideDelay: 300,
	link: 'chain',
        onShow: function(tip,el){
	  tip.setStyles({opacity:0,display:'block'}).fade(0.9);

	  // Prevent the tip from fading when we are hovering on the tip itself and not
	  // just when we leave the annotated zone
	  tip.addEvents({
	    'mouseleave':  function(){
	       this.active = false;
	       this.fade('out').get('tween').chain( function(){ this.element.setStyle('display','none'); });
	    },
	    'mouseenter': function(){ this.active = true; }
	  })
        },
        onHide: function(tip, el){
	  if( !tip.active ){
	    tip.fade('out').get('tween').chain( function(){ this.element.setStyle('display','none'); });
	    tip.removeEvents(['mouseenter','mouseleave']);
	  }
        }
      });
    }

  },

  /* Toggle visibility of any annotations
   */
  toggleAnnotations: function() {
    var els;
    if( els = this.container.getElements('canvas.annotation') ){
      if( this.annotationsVisible ){
	els.addClass('hidden');
	this.annotationsVisible = false;
	this.showPopUp( IIPMooViewer.lang.annotationsDisabled );
      }
      else{
	els.removeClass('hidden');
	this.annotationsVisible = true;
      }
    }
  },

  // Determine if a point is inside the annotation's bounds
  isInAnnotation = function(px, py) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the annotation's X and (X + Height) and its Y and (Y + Height)
  return  (this.wid * this.annotations[i].x <= mx) && (this.wid * this.annotations[i].x + this.wid * this.annotations[i].w >= mx) &&
          (this.hei * this.annotations[i].y <= my) && (this.hei * this.annotations[i].y + this.hei * this.annotations[i].h >= my);
  },

  /* Destroy our annotations
   */
  destroyAnnotations: function() {
    if( this.annotationTip ) this.annotationTip.detach( this.container.getChildren('canvas.annotation') );

    /*this.container.getChildren('canvas.annotation').each(function(el){
      el.eliminate('tip:text');
      el.destroy();
    });*/
    //(this.container.getElementById('annotation')).destroy();
  }


});
