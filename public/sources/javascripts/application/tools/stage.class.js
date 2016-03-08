( function()
{
    'use strict';

    B.Tools.Stage = B.Core.Event_Emitter.extend( {

        static : 'stage',

        /**
         * Construct
         */
        construct : function()
        {
            this._super();

            // Set up
            this.ticker   = new B.Tools.Ticker();
            this.viewport = new B.Tools.Viewport();

            // Init
            this.init_renderer();
            this.init_container();
            this.init_filters();
        },

        /**
         * Init renderer
         */
        init_renderer : function()
        {
            var that = this;

            // Set up
            this.renderer = new PIXI.autoDetectRenderer( 800, 600, {
                autoResize : true,
                resolution : window.devicePixelRatio,
                antialias  : false
            } );

            // Add to DOM
            document.body.appendChild( this.renderer.view );

            // Ticker tick event
            this.ticker.on( 'tick', function()
            {
                // Render the main container
                that.renderer.render( that.container );
            } );

            // Viewport resize event
            this.viewport.on( 'resize', function()
            {
                that.renderer.view.style.width  = that.viewport.width + 'px';
                that.renderer.view.style.height = that.viewport.height + 'px';
                that.renderer.resize( that.viewport.width, that.viewport.height );
            } );
        },

        /**
         * Init filters
         */
        init_filters : function()
        {
            // Set up
            var filter = new PIXI.filters.BlurFilter();
            filter.blur = 0;

            // Add filters
            this.container.filters = [ filter ];
        },

        /**
         * Init container
         */
        init_container : function()
        {
            // Set up
            this.container = new PIXI.Container( 0x66FF99 );
            this.container.interactive = true;
        }
    } );
} )();
