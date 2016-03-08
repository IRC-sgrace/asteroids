( function()
{
    'use strict';

    B.Components.Player = B.Core.Abstract.extend( {

        options :
        {
            id       : 0,
            x        : 0,
            y        : 0,
            rotation : 0
        },

        /**
         * Construct
         */
        construct : function( options )
        {
            this._super( options );

            // Set up
            this.utils      = new B.Tools.Utils();
            this.ship       = new B.Components.Ship();
            this.container  = new PIXI.Container();
            this.id         = this.options.id;
            this.position   = {};
            this.position.x = new B.Components.Number( {
                value : this.options.x,
                type  : 'interpolate'
            } );
            this.position.y = new B.Components.Number( {
                value : this.options.y,
                type  : 'interpolate'
            } );
            this.rotation = new B.Components.Number( {
                value : this.options.rotation,
                type  : 'interpolate'
            } );

            this.container.addChild( this.ship.container );

            // Init inputs
            this.init_ticker();
        },

        /**
         * Init ticker
         */
        init_ticker: function()
        {
            var that = this;

            // Set up
            this.ticker    = new B.Tools.Ticker();
            this.ticker_id = this.utils.get_id();

            // Ticker tick event
            this.ticker.on( 'tick.' + this.ticker_id, function( time )
            {
                // Update container
                that.container.x        = that.position.x.get();
                that.container.y        = that.position.y.get();
                that.container.rotation = that.rotation.get();
            } );
        },

        /**
         * Update
         */
        update : function( data )
        {
            this.position.x.update( data.x );
            this.position.y.update( data.y );
            this.rotation.update( data.r );
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Destruct
            this.position.x.destruct();
            this.position.y.destruct();
            this.rotation.destruct();

            // Empty container
            this.container.removeChildren();

            // Off
            this.ticker.off( 'tick.' + this.ticker_id );

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
