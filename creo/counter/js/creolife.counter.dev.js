/**
 * creolife.counter - plugin provide counter functionality
 * @version 1.0
 * @copyright creoLIFE.pl 2006-2013
 * @author Mirek Ratman
 * @namespace creo
 * @since 2013-02-18
 * @update 2013-10-16
 * @requires [creolife.core.js, jQuery if it will be used as a jQuery plugin]
 */


/**
 *  creolife.counter
 */
if( typeof creolife != 'undefined' && typeof creolife.core !== 'undefined') {

	creolife.counter = creolife.prototype = {

		/*
		 * Object with global params and varibles
         * @var conf
		 */
		conf : {
            interval            : 1000,
            countDownStop       : false,
            countUpStop         : false,
            counterPrefix       : '0',
            showDaysOverWeek    : true,            //Show more days over than 7 days of a week
            counterId           : '#creoCounter',
            ids : {
                years           : '#cYears',
                months          : '#cMonths',
                weeks           : '#cWeeks',
                days            : '#cDays',
                hours           : '#cHours',
                minutes         : '#cMinutes',
                seconds         : '#cSeconds',
                miliseconds     : '#cMiliseconds'
            },
            executeBeforeTime   : null,
            executeAfterTime    : null
		},

        /*
         * Object with global consts
         * @var conf
         */
        consts : {
            creoCounterInterval    : []
        },

        /*
         * Method will calculate difference between given timestamp and current computer timestamp,
         * create a output object years, months, days, hours, minutes and seconds with continous (each 1 second) callback
         * @method timeCounter
         * @param strng $timestamp - timestamp of begining or end time for counter
         * @param strng $callback - callback which contain time object (values)
         */
        timeCounter : function( timestamp, callback  ){
            //Create shorthands
            var conf = creolife.counter.conf;
            var consts = creolife.counter.consts;
            var uniqueId = creolife.core.getUniqueId();
            console.log(uniqueId);
            consts.creoCounterInterval.push( uniqueId );

            if( typeof timestamp !== 'undefined' ){
                consts.creoCounterInterval[uniqueId] = setInterval(
                    function(){
                        console.log('aaa');
                        var cts = creolife.counter.getTimestampFromCurrentTime();
                        var ts = creolife.counter.getTimestampFromDate( timestamp );

                        if( isNaN(ts) ){
                            clearInterval( consts.creoCounterInterval[uniqueId] );
                            return false;
                        }

                        //fix ts param if timestamp format is given
                        if( creolife.counter.isInt( timestamp ) ){
                            ts = Math.round( timestamp );
                        }

                        var countdown = true;
                        var diff = (ts - cts);
                        //create timestamp difference
                        if( cts - ts >= 0  ){
                            countdown = false;
                            diff = (cts - ts);
                        }

                        //make rest date object
                        var rest = new Date();
                        var restMiliseconds = new Date();

                        restMiliseconds.setTime( Math.abs( diff ) );

                        rest.setTime( Math.abs( diff / 1000 ) );
                        timediff = rest.getTime();

                        var weeks = Math.floor(timediff / (60 * 60 * 24 * 7));
                        timediff -= weeks * (60 * 60 * 24 * 7);
                        
                        //fix for show more days over the 7 of a week
                        if( conf.showDaysOverWeek ){
                            timediff = rest.getTime();
                        }

                        var days = Math.floor(timediff / (60 * 60 * 24)); 
                        timediff -= days * (60 * 60 * 24);

                        var hours = Math.floor(timediff / (60 * 60)); 
                        timediff -= hours * (60 * 60);

                        var minutes = Math.floor(timediff / (60)); 
                        timediff -= minutes * (60);

                        var seconds = Math.floor(timediff);
                        timediff -= seconds;

                        var miliseconds = restMiliseconds.getMilliseconds();


                        //Prevent counter to display data when countDownStop or counUpStop is set to TRUE
                        var show = true;
                        if( conf.countDownStop === true && countdown === false ){
                            show = false;
                        }
                        if( conf.countUpStop === true && countdown === true ){
                            show = false;
                        }
                        
                        //return values
                        if( show ){
                            callback({
                                status          : true,
                                years           : creolife.counter.getYearDiff(cts, ts),
                                months          : creolife.counter.getMonthDiff(cts, ts),
                                weeks           : weeks,
                                days            : days,
                                hours           : hours < 10 ? conf.counterPrefix + hours : hours,
                                minutes         : minutes < 10 ? conf.counterPrefix + minutes : minutes,
                                seconds         : seconds < 10 ? conf.counterPrefix + seconds : seconds,
                                miliseconds     : miliseconds
                            });
                        }
                        else{
                            callback({
                                status      : false,
                                years       : 0,
                                months      : 0,
                                weeks       : 0,
                                days        : 0,
                                hours       : conf.counterPrefix + '0',
                                minutes     : conf.counterPrefix + '0',
                                seconds     : conf.counterPrefix + '0',
                                miliseconds : '0'
                            });
                        }
                    },
                    conf.interval
                );
            }
        },


        /*
         * Method will check if given value is integer value
         * @method isInt
         * @param string $n - given number
         * @return boolean
         */
        isInt : function( n ){
            return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
        },


        /*
         * Method will get timestamp from given date in ISO format
         * @method getTimestampFromDate
         * @param string $date - ISO date definition
         * @return integer
         */
        getTimestampFromDate : function( date ){
            var now = new Date();
            return Math.round( new Date( date ).getTime() );
        },


        /*
         * Method will get timestamp from current time
         * @method getTimestampFromCurrentTime
         * @return integer
         */
        getTimestampFromCurrentTime : function(){
            var now = new Date();
            return Math.round( new Date(now.getTime() - now.getTimezoneOffset() * 60000).getTime() );
        },


        /*
         * Method will calculate month difference
         * @method getMonthDiff
         * @param date $d1 - first date
         * @param date $d2 - second date
         * @return integer
         */
        getMonthDiff : function(d1, d2) {
            var months;
            d1 = new Date(d1);
            d2 = new Date(d2);
            months = Math.abs( (d2.getFullYear() - d1.getFullYear()) * 12 );
            months -= ( d2.getMonth()  );
            months += ( d1.getMonth()  );

            return months <= 0 ? 0 : months;
        },

        /*
         * Method will calculate year difference
         * @method getYearDiff
         * @param date $d1 - first date
         * @param date $d2 - second date
         * @return integer
         */
        getYearDiff : function(d1, d2) {
            var years;
            d1 = new Date(d1);
            d2 = new Date(d2);
            years = Math.abs( (d2.getFullYear() - d1.getFullYear()) );

            return years <= 0 ? 0 : years;
        }

	};
}


/**
 *  creolife.counter
 */
if( typeof jQuery != 'undefined' && typeof creolife.counter != 'undefined' ) {

    /** 
     * Method will create jQuery shorthand method
     * @method creoSlider
     * @param object options - configuration object for creolife.slider
     */
    jQuery.fn.creolifeCounter = function( timestamp, options ){
        //check if given object exists
        if( $(this).length > 0 ){

            //Create shorthands
            var conf = creolife.counter.conf;

            //Extend default configuration
            $.extend(true, conf, options);

            //set counter for current tag
            conf.counterId = $(this);

            //lunch gmaps
            creolife.counter.timeCounter( timestamp, function( el ){
                $(conf.counterId)
                    .find( conf.ids.years )
                        .text( el.years )
                        .end()
                    .find( conf.ids.months )
                        .text( el.months )
                        .end()
                    .find( conf.ids.weeks )
                        .text( el.weeks )
                        .end()
                    .find( conf.ids.days )
                        .text( el.days )
                        .end()
                    .find( conf.ids.hours )
                        .text( el.hours )
                        .end()
                    .find( conf.ids.minutes )
                        .text( el.minutes )
                        .end()
                    .find( conf.ids.seconds )
                        .text( el.seconds )
                        .end()
                    .find( conf.ids.miliseconds )
                        .text( el.miliseconds );
            });
        }
    };
}