// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name creo.normalize.min.js
// ==/ClosureCompiler==
/**
 * creo.normalize - plugin provide style normalization functionality. You can easilly normalize many css parameters.
 * @version 1.0
 * @copyright creoLIFE.pl 2006-2013
 * @author Mirek Ratman
 * @namespace creo
 * @since 2013-03-07
 * @requires [creo.js, jQuery - if it will be used as a jQuery plugin]
 */

/**
 *  creo.normalize class
 */
if( typeof creo !== 'undefined' ) {

	creo.normalize = creo.prototype = {

        /**
         * method will find the element with max style (param) and set this param to any other boxes
         * @param [object] $list - list of tags
         * @param [string] $param - parameter to normalize (example, height, width, etc - not all css styles are supported now)
         * @param [string] $fix - number that can be added or subtracted from final value
         * @param [integer] $timeout - timeout (sometimes elements need to be loaded)
         **/
        doNormalize : function( list, param, fix, timeout ){
            if( typeof list === 'undefined' || typeof param === 'undefined' ){
                return false;
            }

            if( typeof fix !== undefined && !creo.isInt(fix) ){
                fix = 0;
            }

            /**
             * function will find and get tallest tag height
             * @param [object] $list - list of elements
             * @param [string] $param - list of elements
             * @param [callback] $callback - callback
             **/
            function getElParams( list, param, callback ){
                if( $(list).find('img').length > 0 ){
                    avast.core.imagesLoaded( list, function(){
                        var paramsList = $(list)
                                            .map( function(){
                                                return parseInt( $(this).css( param ) , 10);
                                            })
                                            .get();
                        callback( Math.max.apply(null, paramsList) );
                    });
                }
                else{
                    var paramsList = $(list)
                                        .map( function(){
                                            return parseInt( $(this).css( param ) , 10);
                                        })
                                        .get();
                    callback( Math.max.apply(null, paramsList) );
                }
            }

            if( typeof timeout !== undefined && creo.isInt(timeout) ){
                setTimeout(
                    function(){
                        if( creo.isArray( param ) ){
                            $.each( param, function( i,s ){
                                getElParams( list, s, function(val){
                                    $(list).css( s , val + fix );
                                });
                            });
                        }
                        else{
                            getElParams( list, param, function(val){
                                $(list).css( param , val + fix );
                            });
                        }
                    },
                    timeout
                ); 
            }
            else{
                if( creo.isArray( param ) ){
                    $.each( param, function( i,s ){
                        getElParams( list, s, function(val){
                            $(list).css( s , val + fix );
                        });
                    });
                }
                else{
                    getElParams( list, param, function(val){
                        $(list).css( param , val + fix );
                    });
                }
            }
        }
	};
}


if( typeof jQuery !== 'undefined' && typeof creo !== 'undefined' ) {

    /** 
     * Method will create jQuery shorthand method
     * @param [array] $param - parameter to normalize (example, height, width, etc - not all css styles are supported now)
     * @param [string] $fix - number that can be added or subtracted from final value
     * @param [integer] $timeout - timeout (sometimes elements need to be loaded)
     **/
    jQuery.fn.creoNormalize = function( param, fix, timeout ){
        //check if given object exists
        if( this.length > 0 ){
            creo.normalize.doNormalize( this, param, fix, timeout );
        }
    };
}