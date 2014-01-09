/**
 * creo.htmlBox
 * @version 1.0
 * @copyright creoLIFE.pl 2006-2013
 * @author Mirek Ratman
 * @namespace creo
 * @since 2013-02-11
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
            iframeMode      : true,
            htmlBoxIdPrefix : 'creoHtmlBox_',
            content : {
                forceWidth  : false,
                forceHeight : false
            },
            btn : {
                close : {
                    topFix  : 12,
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
                        })
                )
                .append(
                    $('<div>')
                        .hide()
                        .attr('id', conf.htmlBoxIdPrefix + htmlBoxIdHash)
                        .addClass('creoHtmlBox')
                        .append(
                            $('<div>')
                                .addClass('creoHtmlBoxContent')
                                .css( 
                                    {
                                        width : function(){
                                            return conf.content.forceWidth ? conf.content.forceWidth : false;
                                        },
                                        height : function(){
                                            return conf.content.forceHeight ? conf.content.forceheight : false;
                                        }
                                    }
                                )
                                .append( function(){
                                    if( conf.iframeMode === true ){
                                        var iframe = $('<iframe>')
                                                            .hide()
                                                            .addClass('creoHtmlBoxIframe')
                                                            .attr('id',conf.htmlBoxIdPrefix + htmlBoxIdHash + '_iframe')
                                                            .on('load', function(){
                                                                creo.htmlBox.show( conf.htmlBoxIdPrefix + htmlBoxIdHash );
                                                            })
                                        //Append data to iframe if exists
                                        if( content.substring(0,4) === 'http' ){
                                            iframe.attr('src', content);
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
            $('#'+id+'_btn_close').fadeIn();
            $('#'+id+'_bg').fadeIn( 100, function(){
                creo.htmlBox.setHtmlBoxPos(sourceElId, id, function(){
                    $('#'+id).fadeIn();
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
                .css( 'left', function(){
                    return ( Math.floor(parseInt(sourceElId.width()) - parseInt( $('#' + id).width() ) )/2 );
                });
            creo.htmlBox.setCloseBtnPos(id);
            calback.call( callback );
        },


        /** 
         * Method will set creo.htmlBox close button possition
         * @method setCloseBtnPos
         * @param object id - htmlBox ID
         */
        setCloseBtnPos : function( id ){
            //Create shorthands
            var conf = creo.htmlBox.conf;

            $('#' + id + '_btn_close')
                .css('left', parseInt( $('#' + id).position().left,10) + parseInt( $('#' + id).css('width'),10) + conf.btn.close.leftFix )
                .css('top', parseInt( $('#' + id).position().top,10) + conf.btn.close.topFix)
        },


        /** 
         * Method will show creo.htmlBox
         * @method show
         * @param object id - htmlBox ID
         */
        show : function( id ){
            return;
            //Create shorthands
            var conf = creo.htmlBox.conf;

                $('#' + id + '_bg')
                    .height( id.height());

                $('#' + id)
                    .css( 'left', function(){
                        return ( Math.floor(parseInt(id.width()) - parseInt( $('#' + id).width() ) )/2 );
                    })
                    .width( function(){
                        return parseInt( $('#' + id + '_iframe').width() )
                        + parseInt( $('#' + id).find('.creoHtmlBoxContent').css('margin-left'),10 )
                        + parseInt( $('#' + id).find('.creoHtmlBoxContent').css('margin-right'),10 )
                    });

console.log(parseInt( $('#' + id + '_iframe').contents().find('body').width() ));

                //creo.htmlBox.show( conf.htmlBoxIdPrefix + htmlBoxIdHash );


        },

        /** 
         * Method will update creo.htmlBox width
         * @method updateWidth
         * @param object source - source element from with width will be taken
         */
        updateWidth : function( source ){
            $()
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