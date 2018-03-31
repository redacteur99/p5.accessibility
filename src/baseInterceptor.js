function baseInterceptor() {
  this.colorMode = {
    mode: 0, // RGB -> 0 | HSB -> 1 | HSL -> 2
    max1: 255,
    max2: 255,
    max3: 255,
    maxA: 255,
  };
  this.prevTotalCount = 0,
  this.totalCount = 0,
  this.currentColor = 'white',
  this.bgColor = 'white',
  this.objectArea = 0,
  this.coordinates = [],
  this.objectDescription = '',
  this.canvasDetails = {
    width: 0,
    height: 0
  },
  this.setupObject = {
    objectArray: [],
    objectCount: 0,
    objectTypeCount: {}
  },
  this.drawObject = {
    objectArray: [],
    objectCount: 0,
    objectTypeCount: {}
  },
  this.isCleared = false;
}

baseInterceptor.prototype.getColorName = function(arguments) {

  if (arguments.length == 4) {
    return(getRGBAname(arguments));
  }
  else if (arguments.length == 3) {
    return(getRGBname(arguments));
  }
  else if (arguments.length == 2) {
    var trans = Math.round(100-((arguments[1]*100)/255));
    // assuming that we are doing RGB - this would be a grayscale number
    if (arguments[0] < 10) {
      var rgb = '(0, 0, 0)';
      if (trans == 0){
        return ({
          'color': 'black',
          'rgb': rgb
        });
      }
      else {
        return ({
          'color': 'black with '+ trans + '% tranparency',
          'rgb': rgb
        });
      }
    }
    else if (arguments[0] > 240) {
      var rgb = '(255, 255, 255)';
      if (trans == 0){
        return ({
          'color': 'white',
          'rgb': rgb
        });
      }
      else {
        return ({
          'color': 'white with '+ trans + '% tranparency',
          'rgb': rgb
        });
      }
    }
    else {
      var rgb = '(' + arguments[0] + ', ' + arguments[0] + ', ' + arguments[0] + ')';
      if (trans == 0){
        return ({
          'color': 'gray',
          'rgb': rgb
        });
      }
      else {
        return ({
          'color': 'gray with '+ trans + '% tranparency',
          'rgb': rgb
        });
      }
    }
  }
  else if (arguments.length == 1) {
    if (!(typeof(arguments[0])).localeCompare('number')) {
      // assuming that we are doing RGB - this would be a grayscale number
      if (arguments[0] < 10) {
        var rgb = '(0, 0, 0)';
        return ({
          'color': 'black',
          'rgb': rgb
        });
      }
      else if (arguments[0] > 240) {
        var rgb = '(255, 255, 255)';
        return ({
          'color': 'white',
          'rgb': rgb
        });
      }
      else {
        var rgb = '(' + arguments[0] + ', ' + arguments[0] + ', ' + arguments[0] + ')';
        return ({
          'color': 'grey',
          'rgb': rgb
        });
      }
    }
    else if (!(typeof(arguments[0])).localeCompare('string')){
      if (!arguments[0].charAt(0).localeCompare('#')) {
        return(getHexname(arguments));
      }
      else if (arguments[0].match(/rgba/)){
        return(RGBAString(arguments));
      }
      else if (arguments[0].match(/rgb/)){
        return(RGBString(arguments));
      }
    }
  }
  else{
    return ({
      'color': arguments[0],
      'rgb': ''
    });
  }
}

function getRGBAname(arguments,max1,max2,max3,max4){
  var trans = Math.round(100-((arguments[3]*100)));
  var colorName = rgbColorName(arguments[0]*(255/max1), arguments[1]*(255/max2), arguments[2]*(255/max3));
  var rgb = '(' + arguments[0] + ', ' + arguments[1] + ', ' + arguments[2] + ')';
  if (trans>0){
    return ({
      'color': colorName + ' with '+ trans + '% tranparency',
      'rgb': rgb
    });
  } else {
    return ({
      'color': colorName,
      'rgb': rgb
    });
  }
}

function getRGBname(arguments,max1,max2,max3){
  var colorName = rgbColorName(arguments[0]/max1, arguments[1]/max2, arguments[2]/max3);
  var rgb = '(' + arguments[0] + ', ' + arguments[1] + ', ' + arguments[2] + ')';
  return ({
    'color': colorName,
    'rgb': rgb
  });
}

function getHexname(arguments){
  var hex = arguments[0].slice(1);
  if ((arguments[0].match(/\w/g)).length==3){//3digithex
    var h3x = hex.match(/\w/g)
    hex = [h3x[0],h3x[0],h3x[1],h3x[1],h3x[2],h3x[2]].join('');
  }
  var colorName = hexColorName(hex);
  var r = parseInt(hex[1] + hex[2], 16);
  var g = parseInt(hex[3] + hex[4], 16);
  var b = parseInt(hex[5] + hex[6], 16);
  var rgb = '(' + r + ', ' + g + ', ' + b + ')';
  return ({
    'color': colorName,
    'rgb': rgb
  });
}

function RGBAString(arguments){
  if (arguments[0].match(/%/)){
    if (((arguments[0].match(/%/g)).length)==4){
      //when arguments[0] is 'rgba(10%,100%,30%,0.5%)'
      console.log(arguments[0]);
      var values = (((arguments[0].match(/(\(\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?\s*?)/g))[0]).replace(/\%|\(|\)/g,"")).split(",");
      values = [values[0],values[1],values[3],0];
      for (var i = values.length - 2; i >= 0; i--) {
        if (parseInt(values[i])<100){
          values[i]= Math.round(parseInt(values[i])*2.55);
        } else {
          values[i]=255;
        }
      }
      return(getRGBAname(values));

    } else if (((arguments[0].match(/%/g)).length)==3 && ((arguments[0].match(/\,/g)).length)==2){
      //when arguments[0] is 'rgba(10%,100%,30%)'
      console.log(arguments[0]);
      var values = (((arguments[0].match(/(\(\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%\)\s*?\s*?)/g))[0]).replace(/\%|\(|\)/g,"")).split(",");
      values = [values[0],values[1],values[2],0];
      for (var i = values.length - 2; i >= 0; i--) {
        if (parseInt(values[i])<100){
          values[i]= Math.round(parseInt(values[i])*2.55);
        } else {
          values[i]=255;
        }
      }
      return(getRGBAname(values));
    }else if (((arguments[0].match(/%/g)).length)==3){
      //when arguments[0] is 'rgba(10%,100%,30%,0.5)'
      //This line creates an array with the values in order the following order ["R","G","B","A"]. The RegEx looks for three values with percentages and one value without percentage.
      var values = (((arguments[0].match(/(\(\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?\))/g))[0]).replace(/\%|\(|\)/g,"")).split(",");
      for (var i = values.length - 2; i >= 0; i--) {
        if (parseInt(values[i])<100){
          values[i]= Math.round(parseInt(values[i])*2.55);
        } else {
          values[i]=255;
        }
      }
      values[3]=parseFloat(values[3]);
      return(getRGBAname(values));
    }else{
      var values = [255,255,255,0];
      return(getRGBAname(values));
    }
  }else{
    if (((arguments[0].match(/\,/g)).length)==2){
      //when arguments[0] is 'rgba(10,100,30)'
      console.log(arguments[0]);
      var values = (((arguments[0].match(/(\(\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?\)\s*?\s*?)/g))[0]).replace(/\%|\(|\)/g,"")).split(",");
      values = [values[0],values[1],values[2],0];
      for (var i = values.length - 2; i >= 0; i--) {
        if (parseInt(values[i])<100){
          values[i]= Math.round(parseInt(values[i])*2.55);
        } else {
          values[i]=255;
        }
      }
      return(getRGBAname(values));
    }else{
      //when arguments[0] is 'rgba(10,100,30,0.5)'
      //This line creates an array with the values in order the following order ["R","G","B","A"]. Values must be less than 255.
      var values = (((arguments[0].match(/(\(\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?\))/g))[0]).replace(/(\(|\))/g,"")).split(",");
      values = [parseInt(values[0]),parseInt(values[1]),parseInt(values[2]),parseFloat(values[3])];
      return(getRGBAname(values));
    }
  }
}

function RGBString(arguments){
  if (arguments[0].match(/%/)){
    if (((arguments[0].match(/%/g)).length)==3){
    //when arguments[0] is 'rgb(10%,100%,30%)'
    //This line creates an array with the values in order the following order ["R","G","B"]. The RegEx looks for three values with percentages.
      var values = (((arguments[0].match(/(\(\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?%\s*?\))/g))[0]).replace(/\%|\(|\)/g,"")).split(",");
      for (var i = values.length - 1; i >= 0; i--) {
        if (parseInt(values[i])<100){
          values[i]= Math.round(parseInt(values[i])*2.55);
        } else {
          values[i]=255;
        }
      }
      return(getRGBname(values));
    }else{
      var values = [255,255,255];
      return(getRGBname(values));
    }
  }else{
    //when arguments[0] is 'rgb(10,100,30)'
    //This line creates an array with the values in order the following order ["R","G","B"]. Values must be less than 255.
    var values = (((arguments[0].match(/(\(\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?,\s*?((000|0?\d{1,2}|1\d\d|2[0-4]\d|25[0-5])|(000(?:\.+\d*)|0?\d{1,2}(?:\.+\d*)|1\d\d(?:\.+\d*)|2[0-4]\d(?:\.+\d*)|25[0-5](?:\.+\d*)))\s*?\))/g))[0]).replace(/(\(|\))/g,"")).split(",");
    values = [parseInt(values[0]),parseInt(values[1]),parseInt(values[2])];
    return(getRGBname(values));
  }
}
