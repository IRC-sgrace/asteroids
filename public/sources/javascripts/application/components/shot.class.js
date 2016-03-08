( function()
{
    'use strict';

    B.Components.Shot = B.Core.Abstract.extend( {

        options :
        {
            id : 0,
            x  : 0,
            y  : 0
        },

        /**
         * Construct
         */
        construct : function( options )
        {
            this._super( options );

            // Set up
            this.utils      = new B.Tools.Utils();
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

            // Init inputs
            this.init_ticker();
            this.init_bullet();
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
                that.container.x = that.position.x.get();
                that.container.y = that.position.y.get();
            } );
        },

        /**
         * Init bullet
         */
        init_bullet : function()
        {
            // Set up
            var container = new PIXI.Container(),
                graphics  = new PIXI.Graphics();

            container.x = 0;
            container.y = 0;

            // Draw
            graphics.beginFill( 0xffffff, 1 );
            graphics.drawCircle( 0, 0, 2 );
            container.addChild( graphics )

            // Add to container
            this.container.addChild( container );
        },

        /**
         * Update
         */
        update : function( data )
        {
            this.position.x.update( data.x );
            this.position.y.update( data.y );
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Destruct
            this.position.x.destruct();
            this.position.y.destruct();

            // Empty container
            this.container.removeChildren();

            // Off
            this.ticker.off( 'tick.' + this.ticker_id );

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
