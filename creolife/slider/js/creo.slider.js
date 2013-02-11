/**
 * creo contentSlider
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

	creo.contentSlider = creo.prototype = {

		/*
		 * @description Object with global params and varibles
		 */
		conf : {
			thisId                   : '.creoContentSlider',
            repeat                   : true,
            autoScrollInterval       : 10,
            fitWidth                 : true,
            pAutoScroll              : false,
            autoScrollStartEl        : 1,
            classes : {
                active      : 'active',
                inActive    : 'inactive'
            },
            ids : {
                slides      : '.creoContentSliderSlides',
                menu        : '.creoContentSliderMenu',
                menuEl      : 'a'
            }
		},


        /** 
         * Method will create G map on given ID
         * @method create
         * @param object el - destination el
         * @param object options - configuration object for creo.gmaps
         * @result html - slider
         */
        create : function( el, options){
            //Create shorthands
            var conf = creo.contentSlider.conf;

            //Check if slider tag was given or exists
            if( typeof el !== 'undefined' ){
                if( $(el).length > 0 ){
                    conf.thisId = $(el);
                }
                else{
                    return false;
                }
            }
            else{
                if( $(conf.thisId).length <= 0 ){
                    return false;
                }
            }

            //creo.contentSlider.conf = options;
            $.extend(true, creo.contentSlider.conf, options);

            //Set local varibles
            var slideToPosition     = 0;
            var slideMaxHeight      = 0;
            var slidePositions      = [];
            var initSlidesWidth     = $(el).width();

            //Set auto scroll interval from param
            if( creo.contentSlider.getHashParams('interval', true) ){
                conf.autoScrollInterval = creo.contentSlider.getHashParams('interval');
            }

            //Create autoscroll interval
            if( conf.autoScrollInterval > 0 ){
                creo.contentSlider.startAutoScroll();
            }

            $( conf.thisId )
                //attach mouse over,mouseout on main area to pause/renew autosliding
                .children( conf.ids.slides )
                    .on('mouseover', function(){
                        creo.contentSlider.stopAutoScroll();
                    })
                    .on('mouseout', function(){
                        if( conf.autoScrollInterval > 0 ){
                            creo.contentSlider.startAutoScroll();
                        }
                    })
                    .end()
                //Setup base parameters for slides area
                .children( conf.ids.slides )
                    .children()
                        //Grab information about all elements to scroll
                        .each( function(i){
                            $(this).width( Math.floor(initSlidesWidth) );
                            slideMaxHeight      = $(this).children().height() > slideMaxHeight ? $(this).children().height() : slideMaxHeight;
                            slidePositions[i]   = slideToPosition;
                            slideToPosition     += ( conf.fitWidth ? $(conf.ids.slides).width() : initSlidesWidth );
                        })
                        .end()
                    .width( Math.floor(slideToPosition) )
                    .height( Math.floor(slideMaxHeight) )
                    .end()
                .children( conf.ids.menu )
                    //Set correct height for buttons
                    .find( conf.ids.menuEl )
                        .height( function(){
                            return $(this).parent().height();
                        })
                        .end()
                    //Find and set active class for 1st button
                    .find( conf.ids.menuEl + ':first' )
                        .parent()
                            .addClass( conf.classes.active )
                            .end()
                        .end()
                    //Attach click events to menu buttons
                    .find( conf.ids.menuEl )
                        .on( 'click', function(e,doScroll){

                            //Set neccessary classes for buttons
                            $(this)
                                .parent()
                                    .siblings()
                                        .removeClass( conf.classes.active )
                                        .addClass( conf.classes.inActive )
                                        .end()
                                    .removeClass( conf.classes.inActive )
                                    .addClass( conf.classes.active );

                            //Define position to scroll
                            var pos = $(this).parent().prevAll().length;

                            //make animation
                            $( conf.ids.slides )
                                .stop()
                                .animate(
                                    {
                                        marginLeft : -slidePositions[pos]
                                    },
                                    600,
                                    'linear'
                                );
                           
                            //Cancel autoscrolling under click on button
                            if( !doScroll ){
                                creo.contentSlider.stopAutoScroll();
                            } 

                            //Prevent execute click
                            e.preventDefault();
                        });
        },


        /** 
         * method will start auto scroll functionality
         * @method startAutoScroll
         */
        startAutoScroll : function(){
            //Create shorthands
            var conf = creo.contentSlider.conf;

            //do autoscroll
            var fScroll = function(){
                if( conf.autoScrollStartEl == -1 ){
                     return false;
                }
                
                var btn = $( conf.ids.menu ).find( conf.ids.menuEl );

                btn.eq( conf.autoScrollStartEl % btn.length )
                    .trigger('click',[true]);   // [true] - doScroll
                
                conf.autoScrollStartEl++;
            };

            //Setup auto scroll
            conf.pAutoScroll = setInterval(
                function(){
                    fScroll( conf.thisId );
                },
                conf.autoScrollInterval * 1000
            );
        },


        /** 
         * method will stop auto scroll functionality
         * @method stopAutoScroll
         */
        stopAutoScroll : function(){
            //Create shorthands
            var conf = creo.contentSlider.conf;

            clearInterval( conf.pAutoScroll );
        },


        /** 
         * method will get params from hash
         * @method autoScroll
         * @param object name - value name from URL hash
         * @param object test - force return boolean type - for test if name exists
         * @return {object, string, boolean} - return object or string or boolean type - depends on given params
         */
        getHashParams : function( name, test ) {
            var hashParams = {};
            var e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&;=]+)=?([^&;]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                q = window.location.hash.substring(1);

            while( e = r.exec(q) ){
               hashParams[d(e[1])] = d(e[2]);
            }

            //set boolean return depends on TESt param
            if( typeof test !== 'undefined' && test === true ){
                if( typeof name !== 'undefined' ){                
                    if( typeof hashParams[name] !==  'undefined' ){
                        return true;
                    }
                    return false;
                }
                return false;
            }

            //return value of param or all params
            if( typeof name !== 'undefined' ){
                return hashParams[name];
            }
            return hashParams;
        }

	};


    /** 
     * Method will create jQuery shorthand method
     * @method creoSlider
     * @param object options - configuration object for creo.contentSlider
     */
	jQuery.fn.creoSlider = function( options ){
        //check if given object exists
        if( $(this).length > 0 ){
            //lunch gmaps
            creo.contentSlider.create( $(this), options );
        }
	};
}