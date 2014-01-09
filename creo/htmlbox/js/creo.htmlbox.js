/**
 * creo.htmlBox
 * @version 1.0
 * @copyright creoLIFE.pl 2006-2013
 * @author Mirek Ratman
 * @namespace creo
 * @since 2014-01-08
 * @requires [jQuery]
 */

//Set main creo class if not exists.
if( typeof creo === 'undefined' ){
    var creo = {};
}

/**
 *  creoSlider
 */
if( typeof jQuery != 'undefined' && typeof creo != 'undefined' ) {

	creo.htmlBox = creo.prototype = {

		/*
		 * @description Object with global params and varibles
		 */
		conf : {
            iframeMode      : false,
            htmlBoxIdPrefix : 'creoHtmlBox_',
            content : {
                forceWidth  : false,
                forceHeight : false
            },
            btn : {
                close : {
                    topFix  : 10,
                    leftFix : -10
                }
            }
		},


        /** 
         * Method will create creo.htmlBox
         * @method create
         * @param object id - destination ID
         * @param object content - content which should be added in to htmlBox
         */
        create : function( id, content ){
            //Create shorthands
            var conf = creo.htmlBox.conf;

            //create unique Hash
            var htmlBoxIdHash = Math.floor((Math.random()*10000000000)+1);

            //htmlBox element
            $(id)
                .append(
                    $('<div>')
                        .hide()
                        .attr('id', conf.htmlBoxIdPrefix + htmlBoxIdHash + '_bg')
                        .addClass('creoHtmlBoxBg')
                        .on('click', function(){
                            creo.htmlBox.hide( conf.htmlBoxIdPrefix + htmlBoxIdHash );
                            return false;
                        })
                )
                .append(
                    $('<div>')
                        .hide()
                        .attr('id', conf.htmlBoxIdPrefix + htmlBoxIdHash)
                        .addClass('creoHtmlBox')
                        .addClass('creoHtmlBoxContentProgress')
                        .css({
                            width   : 60,
                            height  : 60
                        })
                        .append(
                            $('<div>')
                                .addClass('creoHtmlBoxContent')
                                .append( function(){
                                    if( conf.iframeMode === true ){
                                        var iframe = $('<iframe>')
                                                            .hide()
                                                            .addClass('creoHtmlBoxIframe')
                                                            .attr('id',conf.htmlBoxIdPrefix + htmlBoxIdHash + '_iframe');
                                        //Append data to iframe if exists
                                        if( content.substring(0,4) === 'http' ){
                                            iframe
                                                .attr('src', content)
                                                .on('load', function(){
                                                    creo.htmlBox.show( id, conf.htmlBoxIdPrefix + htmlBoxIdHash );
                                                });
                                        }
                                        if( content.substring(0,4) !== 'http' ){
                                            setTimeout( function() {
                                                iframe
                                                    .contents()
                                                        .find('body')
                                                            .html( content );
                                            }, 10 );
                                        }
                                        return iframe;
                                    }
                                    else{
                                        return content;
                                    }
                                })
                        )
                )
                .append(
                    $('<a>')
                        .hide()
                        .attr('href','#')
                        .html('<span>X</span>')
                        .addClass('creoHtmlBoxBtnClose')
                        .attr('id', conf.htmlBoxIdPrefix + htmlBoxIdHash + '_btn_close')
                        .on('click', function(){
                            creo.htmlBox.hide( conf.htmlBoxIdPrefix + htmlBoxIdHash );
                            return false;
                        })
                );

                //Execure preloader
                creo.htmlBox.preload( id, conf.htmlBoxIdPrefix + htmlBoxIdHash );
        },


        /** 
         * Method will show creo.htmlBox preloader box
         * @method preload
         * @param object sourceElId - source element ID
         * @param object id - htmlBox ID
         */
        preload : function( sourceElId, id ){
            //Preload htmlBox
            $('#'+id+'_bg')
                .height( $(window).height())
                .fadeIn( 100, function(){
                    $('#'+id+'_btn_close').fadeIn();
                    creo.htmlBox.setHtmlBoxPos(sourceElId, id, function(){
                        $('#'+id).fadeIn( function(){
                            $('#'+id)
                                .removeClass('creoHtmlBoxContentProgress');
                            creo.htmlBox.show( sourceElId, id );
                        });
                    });
                });
        },


        /** 
         * Method will set creo.htmlBox possition
         * @method setHtmlBoxPos
         * @param object sourceElId - source element ID
         * @param object id - htmlBox ID
         * @param object callback - callback
         */
        setHtmlBoxPos : function( sourceElId, id, callback ){
            $('#' + id)
                .css( 'left', Math.floor(parseInt(sourceElId.width(),10) - parseInt( $('#' + id).width(),10 ) )/2 );

            creo.htmlBox.setCloseBtnPos(id);

            if( typeof callback === 'function' ){
                callback.call();
            }
        },


        /** 
         * Method will set creo.htmlBox close button possition
         * @method setCloseBtnPos
         * @param object id - htmlBox ID
         */
        setCloseBtnPos : function( id ){
            //Create shorthands
            var conf = creo.htmlBox.conf;
            
            setTimeout( function() {
                $('#' + id + '_btn_close')
                    .css('left', parseInt( $('#' + id).position().left,10) + parseInt( $('#' + id).css('width'),10) + conf.btn.close.leftFix )
                    .css('top', parseInt( $('#' + id).position().top,10) + conf.btn.close.topFix);
            }, 10 );
        },


        /** 
         * Method will show creo.htmlBox
         * @method show
         * @param object sourceElId - source element ID
         * @param object id - htmlBox ID
         */
        show : function( sourceElId, id ){
            //Create shorthands
            var conf = creo.htmlBox.conf;
            $('#' + id)
                .css( 
                    {
                        width : function(){
                            var contentWidth = $(this)
                                                    .find('.creoHtmlBoxContent > *')
                                                    .map(function(){
                                                       return $(this).width();
                                                    }).get();
                            var out = Math.floor( $(window).width() * 0.95 );
                            if( !conf.iframeMode ){
                                out = contentWidth < $(window).width() && contentWidth !== 0 ? contentWidth : out;

                            }
                            return conf.content.forceWidth ? conf.content.forceWidth : out;
                        },
                        height : function(){
                            var contentHeight = $(this)
                                                    .find('.creoHtmlBoxContent > *')
                                                    .map(function(){
                                                       return $(this).height();
                                                    }).get();
                            var out = Math.floor( $(window).height() * 0.95 ) - parseInt( $("#"+id).css('margin-top'),10);
                            if( !conf.iframeMode ){
                                out = contentHeight < $(window).height() && contentHeight !== 0 ? contentHeight : out;
                            }
                            return conf.content.forceHeight ? conf.content.forceHeight : out;
                        },
                        left : function(){
                            return ( Math.floor(parseInt(sourceElId.width(),10) - parseInt( $('#' + id).width(),10 ) )/2 );
                        }
                    }
                );

            $('#' + id + '_iframe')
                .css( 'height', parseInt( $('#' + id).height(),10) - parseInt( $("#"+id).css('margin-top'),10) )
                .fadeIn();
            creo.htmlBox.setHtmlBoxPos(sourceElId, id);
        },


        /** 
         * Method will hide and remove creo.htmlBox
         * @method hide
         * @param object id - htmlBox ID
         */
        hide : function( id ){
            $('#'+id+'_btn_close').fadeOut( 100, function(){
                $(this).remove();
            });
            $('#'+id).fadeOut( 100, function(){
                $(this).remove();  
                $('#'+id+'_bg').fadeOut( function(){
                    $(this).remove();  
                });
            });
        }

	};


    /** 
     * Method will create jQuery shorthand method
     * @method creoSlider
     * @param object content - content whoch should be added in to htmlBox
     * @param object options - configuration object for creo.slider
     */
	jQuery.fn.creoHtmlBox = function( content, options ){
        //check if given object exists
        if( $(this).length > 0 ){

             //creo.slider.conf = options;
            $.extend(true, creo.htmlBox.conf, options);

            //lounch htmlBox
            creo.htmlBox.create( $(this), content );
        }
	};
}