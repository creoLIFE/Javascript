 /**
 * creo.autoDownload - scripts helps to handle and execute file download without special headers
 * @version 1.1
 * @source https://github.com/creoLIFE/Javascript
 * @author Mirek Ratman
 * @namespace creo
 * @since 2014-06-03
 * @description Version v1.1 has simplified structure and handle onload event to detect if the file was received from the server
 * @requires [jQuery, creo.urlDecoder]
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
if( typeof creo != 'undefined' && typeof jQuery != 'undefined' && typeof creo.urlDecoder != 'undefined' ) {

    creo.autoDownload = creo.prototype = {

        /*
         * @description Object with global params
         */
        conf : {
            iframe : {
                id : 'creoIframeDownload'
            },
            form :{
                method  : 'GET'
            },
            progressDelay : 5000
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
         */
        __init : function( url, callback ){
            var conf = creo.autoDownload.conf;
            var varibles = creo.autoDownload.varibles;
            var iframe =  $('<iframe>');
            var form =  $('<form>');
            var formId = 'form' + Math.floor((1 + Math.random()) * 10000000000000000);
            var params = creo.urlDecoder.__init( url );

            //Run

            //Define form
            form
                .attr('id', formId )
                .attr('action', params.getFilePath() )
                .attr('method', conf.form.method );

            //add form params
            $.each( params.getParams(), function(key,val){
                form.append( 
                    $('<input>')
                        .attr('type','hidden')
                        .attr('name',key)
                        .attr('value',val)
                );
            });

            //Define iframe
            iframe
                .css({
                    'display':'none',
                    'width':0,
                    'height':0
                })
                .attr('id', conf.iframe.id )
                .attr('src', url)
                .on('load',function(){
                    if( typeof callback == 'function' ){
                        callback.call();
                    }
                });

            //Commit iframe to DOM
            $.when($('#' + conf.iframe.id ).remove())
                .then(
                    iframe
                        .append( form )
                        .appendTo('body')
                );
        }
    };
}

if( typeof jQuery != 'undefined' ) {
    /*
     * @method creoAutoDownload
     * @param [string] $url - url to decode
     * @param [object] $options - extra options to set/change
     * @param [function] $callback - callback
     */
    jQuery.fn.creoAutoDownload = function( url, options, callback){
        //Extends basic options
        if( typeof options == 'object' ){
            creo.autoDownload.__extend(creo.autoDownload.conf, options);
        }

        //lunch avast web numbers
        return creo.autoDownload.__init( url, callback );
    };

}

