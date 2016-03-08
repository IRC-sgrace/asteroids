( function()
{
    'use strict';

    B.Components.World = B.Core.Abstract.extend( {

        /**
         * Construct
         */
        construct : function( options )
        {
            this._super( options );

            // Set up
            this.utils       = new B.Tools.Utils();
            this.stage       = new B.Tools.Stage();
            this.ticker      = new B.Tools.Ticker();
            this.container   = new PIXI.Container();
            this.map         = new B.Components.Map( this.options.map );
            this.players     = new B.Components.Players();
            this.shots       = new B.Components.Shots();
            this.main_player = new B.Components.Main_Player();

            this.container.addChild( this.map.container );
            this.container.addChild( this.players.container );
            this.container.addChild( this.shots.container );
            this.stage.container.addChild( this.container );
        },

        /**
         * Update
         */
        update : function( data )
        {
            // Players update
            if( data.players )
                this.players.update( data.players );

            // Shots update
            if( data.shots )
                this.shots.update( data.shots );
        },

        /**
         * Destruct
         */
        destruct : function()
        {
            // Empty container
            this.container.removeChildren();

            // Destruct
            this.map.destruct();
            this.players.destruct();
            this.shots.destruct();
            // this.main_player.destruct();

            // Go null
            this.utils.null_object( this );
        }
    } );
} )();
