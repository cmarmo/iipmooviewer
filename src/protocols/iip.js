/* IIP Protocol Handler
 */

Protocols.IIP = new Class({

  /* Return metadata URL
   */
  getMetaDataURL: function(server,image){
    return server+"?FIF=" + image + "&obj=IIP,1.0&obj=Max-size&obj=Tile-size&obj=Resolution-number";
  },

  /* Return an individual tile request URL
   */
  getTileURL: function(t){
    var modifiers = Array( '?FIF=' + t.image );
    if( t.contrast ) modifiers.push( 'CNT=' + t.contrast );
    if( t.sds )      modifiers.push( 'SDS=' + t.sds );
    if( t.rotation ) modifiers.push( 'ROT=' + t.rotation );
    if( t.gamma )    modifiers.push( 'GAM=' + t.gamma );
    if( t.shade )    modifiers.push( 'SHD=' + t.shade );
    if( t.cmp )      modifiers.push( 'CMP=' + t.cmp );
    if( t.minmax )   modifiers.push( 'MINMAX=1,' + t.mincut + ',' + t.maxcut );
    modifiers.push( 'JTL=' + t.resolution + ',' + t.tileindex );
    return t.server+modifiers.join('&');
  },

  /* Parse an IIP protocol metadata request
   */
  parseMetaData: function(response){
    var tmp = response.split( "Max-size" );
    if(!tmp[1]) alert( "Error: Unexpected response from server " + this.server );
    var size = tmp[1].split(" ");
    var max_size = { w: parseInt(size[0].substring(1,size[0].length)),
		     h: parseInt(size[1]) };
    tmp = response.split( "Tile-size" );
    size = tmp[1].split(" ");
    var tileSize = { w: parseInt(size[0].substring(1,size[0].length)),
		     h: parseInt(size[1]) };
    tmp = response.split( "Resolution-number" );
    var num_resolutions = parseInt( tmp[1].substring(1,tmp[1].length) );
    var result = {
      'max_size': max_size,
      'tileSize': tileSize,
      'num_resolutions': num_resolutions
    };
    return result;
  },

  /* Return URL for a full view
   */
  getRegionURL: function(server,image,region,width){
    var rgn = region.x + ',' + region.y + ',' + region.w + ',' + region.h;
    return server+'?FIF='+image+'&WID='+width+'&RGN='+rgn+'&CVT=jpeg';
  },

  /* Return URL for parsing min and max
   */
  getMinMaxURL: function(image){
    return "FIF=" + image + "&obj=IIP,1.0&obj=Min-Max-sample-values";
  },

  /* Parsing min and max
   */
  parseMinMax: function(response){
    var tmp = response.split( "Min-Max-sample-values" );
    if(!tmp[1]) alert( "Error: Unexpected response from server " + this.server );
    var minmax = tmp[1].split(" ");
    var arraylen = Math.floor(minmax.length / 2);
    var minarray = new Array();
    var maxarray = new Array();
    var n = 0;
    for (var l=0; l<minmax.length, n<arraylen; l++) {
      if (parseFloat(minmax[l])) {
        minarray.push(parseFloat( minmax[l]));
        n++;
      }
    }
    for (var ll=l; ll<minmax.length; ll++) {
      if (parseFloat(minmax[l]))
        maxarray.push(parseFloat( minmax[l] ))
    }
    var result = {
      'minarray': minarray,
      'maxarray': maxarray
    };
    return result;
  },

  /* Return thumbnail URL
   */
  getThumbnailURL: function(server,image,width){
    return server+'?FIF='+image+'&WID='+width+'&QLT=98&CVT=jpeg';
  }

});


