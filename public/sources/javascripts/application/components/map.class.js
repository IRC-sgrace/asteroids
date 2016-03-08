( function()
{
    'use strict';

    B.Components.Map = B.Core.Abstract.extend( {

        options :
        {
            limits :
            {
                x : 600,
                y : 600
            }
        },

        /**
         * Construct
         */
        construct : function( options )
        {
            this._super( options );

            // Set up
            this.utils     = new B.Tools.Utils();
            this.container = new PIXI.Container();
            this.limits    = {};
            this.limits.x  = this.options.limits.x;
            this.limits.y  = this.options.limits.y;

            // Init
            this.init_borders();
        },

        /**
         * Init borders
         */
        init_borders : function()
        {
            var graphics = new PIXI.Graphics();
            graphics.lineStyle( 2, 0xffffff, 1 );
            graphics.drawRect( 0, 0, this.limits.x, this.limits.y );
            this.container.addChild( graphics );
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Empty container
            this.container.removeChildren();

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
