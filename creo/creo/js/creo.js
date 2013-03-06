/**
 * creo.js - core functionality for different creo classes.
 * @version 1.0
 * @copyright creoLIFE.pl 2006-2013
 * @author Mirek Ratman
 * @namespace creo
 * @since 2013-03-07
  */

/**
 *  creo core class
 */
if( typeof creo === 'undefined' ) {

    var creo = {

	    /* 
	     * method will check if given value is an integer
	     * @method isInt
	     * @param object $n - value to check
	     * @return boolean
	     */
	    isInt : function(n) {
	        return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
	    },

	    /* 
	     * method will check if given value is an array
	     * @method isArray
	     * @param object $n - value to check
	     * @return boolean
	     */
	    isArray : function(n) {
	        return Object.prototype.toString.call( n ) === '[object Array]' ? true : false;
	    }

	}
}
