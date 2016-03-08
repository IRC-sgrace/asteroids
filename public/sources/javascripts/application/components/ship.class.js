( function()
{
    'use strict';

    B.Components.Ship = B.Core.Abstract.extend( {

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
            this.utils     = new B.Tools.Utils();
            this.container = new PIXI.Container();

            // Init
            this.init_hull();
        },

        /**
         * Init hull
         */
        init_hull : function()
        {
            var graphics = new PIXI.Graphics(),
                polygon  = new PIXI.Polygon(
                    0, -10,
                    10, 10,
                    0, 7,
                    -10, 10
                );

            // Draw
            graphics.beginFill( 0xffffff, 0.2 );
            graphics.lineStyle( 2, 0xffffff, 1 );
            graphics.drawPolygon( polygon );

            // Add to container
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
