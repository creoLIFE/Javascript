 /**
 * creo.urlDecoder - decodes full url and let user to get some part of it in easy way
 * @version 1.2
 * @source https://github.com/creoLIFE/Javascript
 * @author Mirek Ratman
 * @namespace creo
 * @since 2014-04-09
 * @requires []
 * @copyright creoLIFE.pl 2006-2014
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//Set main creo object if not exists.
if( typeof creo === 'undefined' ){
    var creo = {};
}

/**
 *  urlDecoder
 */
if( typeof creo != 'undefined' ) {

    creo.urlDecoder = creo.prototype = {

        /*
         * @description Object with global params for best antyvirus comparison
         */
        conf : {
            hash :{
                separator   : ';'
            }
        },


        /*
         * @description Object with global varibles
         */
        varibles : {
            source     		: '',
            protocol    	: '',
            host        	: '',
            post        	: '',
            query       	: '',
            updatedQuery    : '',
            params      	: {},
            file        	: '',
            hash        	: '',
            hashs        	: {},
            path        	: '',
            relative    	: '',
            segments    	: '' 
        },


        /** 
         * Method extend option library
         * @method __extend
         * @result [array]
         */
        __extend : function(){
            for(var i=1; i<arguments.length; i++)
                for(var key in arguments[i])
                    if(arguments[i].hasOwnProperty(key))
                        arguments[0][key] = arguments[i][key];
            return arguments[0];
        },

        /** 
         * Method will decode URL
         * @method __init
         * @param [string] $url - url string
         * @param [function] $callback - callback function
         */
        __init : function( url, callback ){
            var conf = creo.urlDecoder.conf;
            var a =  document.createElement('a');

            //fill temp object
            a.href = url;

            creo.urlDecoder.varibles = {
                source      : creo.urlDecoder.__sanitizeVal( url ),
                protocol    : creo.urlDecoder.__sanitizeVal( a.protocol.replace(':','') ),
                host        : creo.urlDecoder.__sanitizeVal( a.hostname ),
                port        : creo.urlDecoder.__sanitizeVal( a.port ),
                query       : creo.urlDecoder.__sanitizeVal( a.search ),
                params      : (function(){
                                var ret = {},
                                    seg = a.search.replace(/^\?/,'').split('&'),
                                    len = seg.length, i = 0, s;
                                for (;i<len;i++) {
                                    if (!seg[i]) { continue; }
                                    s = seg[i].split('=');
                                    ret[s[0]] = creo.urlDecoder.__sanitizeVal( s[1] );
                                }
                                return ret;
                            })(),
                file        : creo.urlDecoder.__sanitizeVal( (a.pathname.match(/\/([^\/?#]+)$/i) || [''])[1] ),
                hash        : creo.urlDecoder.__sanitizeVal( a.hash.replace('#','') ),
                hashes      : (function(){
                                var ret = {},
                                    seg = a.hash.replace('#','').split( conf.hash.separator ),
                                    len = seg.length, i = 0, s;
                                for (;i<len;i++) {
                                    if (!seg[i]) { continue; }
                                    ret[i] = creo.urlDecoder.__sanitizeVal( seg[i] );
                                }
                                return ret;
                            })(),
                path        : creo.urlDecoder.__sanitizeVal( a.pathname.replace(/^([^\/])/,'/$1') ),
                filePath    : creo.urlDecoder.__sanitizeVal( a.protocol.replace(':','') ) + '://' + creo.urlDecoder.__sanitizeVal( a.hostname ) + creo.urlDecoder.__sanitizeVal( a.pathname.replace(/^([^\/])/,'/$1') ),
                relative    : creo.urlDecoder.__sanitizeVal( (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [''])[1] ),
                segments    : (function(){
                                var ret = {},
                                    seg = a.pathname.replace(/^\//,'').split('/'),
                                    len = seg.length, i = 0, s;
                                for (;i<len;i++) {
                                    if (!seg[i]) { continue; }
                                    ret[i] = creo.urlDecoder.__sanitizeVal( seg[i] );
                                }
                                return ret;
                            })()
            };
          
            //execute callback
            if( typeof callback == 'function' ){
                callback.call( creo.urlDecoder );
            }

            //return parsed object
            return creo.urlDecoder;
        },

        /** 
         * Method will sanitize value from some unusual use
         * @method __sanitizeVal
         * @param [string] $val - value to sanitize
         * @result [string]
         */
        __sanitizeVal : function( val ){
            val = encodeURIComponent(val);
            return decodeURIComponent(
            	val
	                .replace(/&/g, "&amp;")
	                .replace(/</g, "&lt;")
	                .replace(/%253C/g, "")  // char <
	                .replace(/%3C/g, "")  // char <
	                .replace(/>/g, "&gt;")
	                .replace(/%253E/g, "")  //  char >
	                .replace(/%3E/g, "")  //  char >
	                .replace(/%2522/g, "")  //  char "
	                .replace(/%22/g, "")  //  char "
	                .replace(/"/g, "&quot;")
	                .replace(/'/g, "&#039;")
	                .replace(/[^a-zA-Z0-9\-\+\%\&\@\#\/\%\?\=\~\_\|\!\:\,\.\;\(\)]/g, "")
	        );
        },

	    decode : function( url, options, callback){
	        //Extends basic options
	        if( typeof options == 'object' ){
	            creo.urlDecoder.__extend(creo.urlDecoder.conf, options);
	        }

	        //lunch avast web numbers
	        return creo.urlDecoder.__init( url, callback );
	    },

        /** 
         * Method will get source from decoded URL
         * @method getSource
         * @result [string]
         */
        getSource : function(){
            return creo.urlDecoder.varibles.source;
        },

        /** 
         * Method will get protocol from decoded URL
         * @method getProtocol
         * @result [string]
         */
        getProtocol : function(){
            return creo.urlDecoder.varibles.protocol;
        },

        /** 
         * Method will get host from decoded URL
         * @method getHost
         * @result [string]
         */
        getHost : function(){
            return creo.urlDecoder.varibles.host;
        },

        /** 
         * Method will get port from decoded URL
         * @method getPort
         * @result [string]
         */
        getPort : function(){
            return creo.urlDecoder.varibles.port;
        },

        /** 
         * Method will get query from decoded URL
         * @method getQuery
         * @result [string]
         */
        getQuery : function(){
            return creo.urlDecoder.varibles.query;
        },

        /** 
         * Method will get param decoded from URL by its key
         * @method getParam
         * @param [string] $pName - parameter name
         * @param [RegExp] $reg - regular expression to verify pName string
         * @result [mixed]
         */
        getParam : function( pName, reg ){
            var p = creo.urlDecoder.varibles.params;
            var patt = new RegExp(reg);
            if( typeof p[pName] !== 'undefined' ){
                return patt.test(p[pName]) ? p[pName] : null;
            }
            else{
                return null;
            }
        },

        /** 
         * Method will set param
         * @method setParam
         * @param [string] $pName - parameter name
         * @param [string] $pVal - parameter value
         * @result [string]
         */
        setParam : function( pName, pVal  ){
            creo.urlDecoder.varibles.params[pName] = creo.urlDecoder.__sanitizeVal(pVal);
        	var query = (function(){
                    var ret = '?', size = 0, key;
				    for (key in creo.urlDecoder.varibles.params) {
				        if( creo.urlDecoder.varibles.params.hasOwnProperty(key) ){
				        	ret += (ret !== '?' ? '&' : '') + key + '=' + creo.urlDecoder.varibles.params[key];
				        }
				    }
                    return ret;
                })();

            creo.urlDecoder.varibles.query = query;
        },

        /** 
         * Method will get all param decoded from URL by its key
         * @method getParams
         * @result [string]
         */
        getParams : function(){
            return creo.urlDecoder.varibles.params;
        },

        /** 
         * Method will get file from decoded URL
         * @method getFile
         * @result [string]
         */
        getFile : function(){
            return creo.urlDecoder.varibles.file;
        },

        /** 
         * Method will get full path to the file including filename
         * @method getFilePath
         * @result [string]
         */
        getFilePath : function(){
            return creo.urlDecoder.varibles.filePath;
        },

        /** 
         * Method will get hash decoded from URL by its position
         * @method getHash
         * @param [integer] $pos - position
         * @result [string]
         */
        getHash : function( pos ){
            var h = creo.urlDecoder.varibles.hashes;
            return typeof h[pos] !== 'undefined' ? h[pos] : null;
        },


        /** 
         * Method will set hash
         * @method setHash
         * @param [integer] $pos - position
         * @param [string] $val - value
         * @result [string]
         */
        setHash : function( pos, val ){
            creo.urlDecoder.varibles.hashes[pos] = creo.urlDecoder.__sanitizeVal(val);
        },

        /** 
         * Method will get all hashes decoded from URL by its key
         * @method getHashes
         * @result [string]
         */
        getHashes : function(){
            return creo.urlDecoder.varibles.hashes;
        },

        /** 
         * Method will get path from decoded URL
         * @method getPath
         * @result [string]
         */
        getPath : function(){
            return creo.urlDecoder.varibles.path;
        },

        /** 
         * Method will get relative from decoded URL
         * @method getRelative
         * @result [string]
         */
        getRelative : function(){
            return creo.urlDecoder.varibles.relative;
        },

        /** 
         * Method will get segment decoded from URL by its position
         * @method getSegment
         * @param integer $pos - position
         * @result [string]
         */
        getSegment : function( pos ){
            var s = creo.urlDecoder.varibles.segments;
            return typeof s[pos] !== 'undefined' ? s[pos] : null;
        },

        /** 
         * Method will get segments from decoded URL
         * @method getSegments
         * @result [string]
         */
        getSegments : function(){
            return creo.urlDecoder.varibles.segments;
        }

    };
}

if( typeof jQuery != 'undefined' ) {
    /*
     * @method creourlDecoder
     * @param [string] $url - url to decode
     * @param [object] $options - extra options to set/change
     * @param [function] $callback - callback
     */
    jQuery.fn.creoUrlDecoder = function( url, options, callback){
        //Extends basic options
        if( typeof options == 'object' ){
            creo.urlDecoder.__extend(creo.urlDecoder.conf, options);
        }

        //lunch avast web numbers
        return creo.urlDecoder.__init( url, callback );
    };

}

