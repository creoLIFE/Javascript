 /**
 * creo.autoDownload - scripts helps to handle and execute file download without special headers
 * @version 1.0
 * @source https://github.com/creoLIFE/Javascript
 * @author Mirek Ratman
 * @namespace creo
 * @since 2014-06-03
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
         * @description Object with global params for best antyvirus comparison
         */
        conf : {
            form :{
                method : 'GET'
            },
            delay : 2000,
            progress : {
                domId   : '#creoProgressBar',
                type    : 'text',
                messages : {
                    active      : "Please wait...",
                    inactive    : ""
                },
                classes : {
                    active      : "creoProgressBarActive"
                }

            }
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
            //progress update
            creo.autoDownload.updateProgress('active', function(){

                var conf = creo.autoDownload.conf;
                var iframe =  $('<iframe>');
                var iframeId = 'iframe' + Math.floor((1 + Math.random()) * 10000000000000000);
                var form =  $('<form>');
                var params = creo.urlDecoder.__init( url );

                $.each( params.getParams(), function(key,val){
                    form.append( 
                        $('<input>')
                            .attr('type','hidden')
                            .attr('name',key)
                            .attr('value',val)
                    );
                });

                iframe
                    .hide()
                    .attr('id', iframeId )
                    .appendTo('body');
                form
                    .attr('action', params.getFilePath() )
                    .attr('method', conf.form.method )
                    .delay( conf.delay )
                    .appendTo('#' + iframeId)
                        .submit()
                        .find('#' + iframeId, function(){
                            $(this)
                                .remove();
                            //execute callback
                            if( typeof callback == 'function' ){
                                callback.call();
                            }
                        });
                //Update status
                creo.autoDownload.updateProgress('inactive');

            });
        },

        /** 
         * Method will update DOM element responsible for progress 
         * @method updateProgress
         * @param [string] $status - status (active|inactive)
         * @param [function] $callback - callback function
         */
        updateProgress : function( status, callback ){
            var conf = creo.autoDownload.conf;
            var el = $(conf.progress.domId );
            
            switch( conf.progress.type ){    
                case 'text':
                    switch( status ){
                        case 'active':
                            el.text( conf.progress.messages.active );
                        break;
                        case 'inactive':
                            el.text( conf.progress.messages.inactive );
                        break;
                    }
                break;
                case 'class':
                    switch( status ){
                        case 'active':
                            el.addClass( conf.progress.messages.active );
                        break;
                        case 'inactive':
                            el.removeClass( conf.progress.messages.active );
                        break;
                    }
                break;
            }

            if( typeof callback == 'function' ){
                callback.call();
            }
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

