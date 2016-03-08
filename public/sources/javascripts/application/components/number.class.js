( function()
{
    'use strict';

    B.Components.Number = B.Core.Event_Emitter.extend( {

        options :
        {
            value  : 0,
            type   : 'set',
            easing :
            {
                strength  : 0.2,
                precision : 1
            },
            interpolation :
            {
                periode : 50,
                limit   : 200
            }
        },

        types :
        {
            'set'           : 0,
            'ease'          : 1,
            'easing'        : 1,
            'interpolate'   : 2,
            'interpolation' : 2
        },

        /**
         * Construct
         */
        construct : function( options )
        {
            this._super( options );

            // Set up
            this.utils = new B.Tools.Utils();

            this.type = this.types[ this.options.type ];

            this.easing           = {};
            this.easing.strength  = this.options.easing.strength;
            this.easing.target    = null;
            this.easing.precision = this.options.easing.strength;
            this.easing.running   = false;

            this.interpolation              = {};
            this.interpolation.start        = null;
            this.interpolation.periode      = this.options.interpolation.periode;
            this.interpolation.target       = null;
            this.interpolation.time         = {};
            this.interpolation.time.start   = null;
            this.interpolation.time.current = null;
            this.interpolation.time.ratio   = null;
            this.interpolation.limit        = this.options.interpolation.limit;
            this.interpolation.running      = false;

            this.value = this.options.value;

            // Init
            this.init_ticker();
        },

        /**
         * Init ticker
         */
        init_ticker : function()
        {
            var that = this;

            // Ticker not neaded
            if( this.options.type === 0 )
                return false;

            // Set up
            this.ticker    = new B.Tools.Ticker();
            this.ticker_id = this.utils.get_id();

            // Ticker tick event
            this.ticker.on( 'tick.' + this.ticker_id, function()
            {
                that.tick();
            } );
        },

        /**
         * Tick
         */
        tick : function()
        {
            var that = this;

            // Easing
            if( this.type === 1 )
            {
                // Is running
                if( this.easing.running )
                {
                    // Update value
                    this.value += ( this.easing.target - this.value ) * this.easing.strength;

                    // Easing end (value close enough to target)
                    if( Math.abs( this.value - this.easing.target ) < this.easing.precision )
                    {
                        this.value          = this.easing.target;
                        this.easing.running = false;
                    }
                }
            }
            else if( this.type === 2 )
            {
                // Is running
                if( this.interpolation.running )
                {
                    this.interpolation.time.current = + new Date();
                    this.interpolation.time.ratio   = ( this.interpolation.time.current - this.interpolation.time.start ) / this.interpolation.periode;

                    // Interpolation end (ratio > 1)
                    if( this.interpolation.time.ratio > 1 )
                    {
                        this.value                 = this.interpolation.target;
                        this.interpolation.running = false;
                    }
                    else
                    {
                        // Update value
                        this.value = that.interpolation.start + ( that.interpolation.target - that.interpolation.start ) * this.interpolation.time.ratio;
                    }
                }
            }
        },

        /**
         * Update
         */
        update : function( value )
        {
            switch( this.type )
            {
                case 0 :
                    this.set( value );
                    break;

                case 1 :
                    this.ease( value );
                    break;

                case 2 :
                    this.interpolate( value );
                    break;

                default :
                    console.warn( 'Wrong value type' );
                    break;
            }

            return value;
        },

        /**
         * Set
         */
        set : function( value )
        {
            this.value = value;
        },

        /**
         * Ease
         */
        ease : function( value )
        {
            this.easing.target  = value;
            this.easing.running = true;
        },

        /**
         * Interpolate
         */
        interpolate : function( value )
        {
            this.interpolation.start        = this.value;
            this.interpolation.target       = value;
            this.interpolation.time.start   = + new Date();
            this.interpolation.time.current = this.interpolation.time.start;
            this.interpolation.time.ratio   = 0;
            this.interpolation.running      = true;
        },

        /**
         * Get
         */
        get : function()
        {
            return this.value;
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Has ticker
            if( this.ticker_id )
            {
                this.ticker.off( '.' + this.ticker_id );
            }

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
