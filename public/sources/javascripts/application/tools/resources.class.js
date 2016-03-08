( function()
{
    'use strict';

    B.Tools.Resources = B.Core.Event_Emitter.extend( {

        static : 'resources',

        /**
         * Construct
         */
        construct : function()
        {
            this._super();

            // Init
            this.init_loader();
        },

        /**
         * Init loader
         */
        init_loader : function()
        {
            var that = this;

            // Set up
            this.loader = new PIXI.loaders.Loader();

            // Load sprite
            this.loader.add( 'sources/images/sprite.json' );

            // Loader complete event
            this.loader.once( 'complete', function( result )
            {
                // Save in all
                that.all = result.resources;

                // Trigger complete
                that.trigger( 'load-complete' );
            } );

            // Start loading
            this.loader.load();
        },

        /**
         * Get
         */
        get : function( key )
        {
            // Set up
            var resource = this.all.resources[ key ];

            // Resource not found
            if( !resource )
            {
                console.warn( 'Could not retrieve ' + resource + ' resource' );

                return false;
            }
        }
    } );
} )();
