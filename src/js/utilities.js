
// utilities 
function utilities () {
	var u = {
		map : function(value, oMin, oMax, nMin, nMax){
		    return nMin + (nMax - nMin) * ((value - oMin) / (oMax - oMin));
		},
		cap : function(v, min, max) {
			if(v < min) return min;
			if(v > max) return max;
			else return v;
		},
		rand : function(min, max,round) {
			if (!round) {
				return Math.random() * (max - min) + min;
			}else{
				return Math.round(Math.random() * (max - min) + min);
			}
		},
		flipcoin : function(){
			return Math.round(Math.random() * (0 - 1) + 1)
		},
		isEven: function(n) {
		   return n % 2 == 0;
		},
		isOdd: function(n) {
		   return Math.abs(n % 2) == 1;
		},
		isSquare: function (n) {
		    return n > 0 && Math.sqrt(n) % 1 === 0;
		},
		getpercent: function (value, max, round) {
			if (!round) {
				return (value/max)*100;
			}else{
				return Math.round((value/max)*100);
			}
		},
		// Converts from degrees to radians.
		de2ra: function(degrees) {
		  return degrees * Math.PI / 180;
		},
		 
		// Converts from radians to degrees.
		ra2de: function(radians) {
		  return radians * 180 / Math.PI;
		},
		isMultiple: function (x,y) {
			//x and y are both integers
			var remainder = x % y;
			if (remainder == 0){
			//x is a multiple of y
				return true;
			} else {
			//x is not a multiple of y
				return false;
			}

		}
	};
	return u;
}

