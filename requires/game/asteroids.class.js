( function()
{
    'use strict';

    // Requires
    let socket_io = require( 'socket.io' ),
        Data      = require( './data.class' ),
        Map       = require( './map.class' ),
        Players   = require( './players.class' ),
        Shots     = require( './shots.class' );

    /**
     * Asteroids class
     */
    class Asteroids
    {
        /**
         * Constructor
         */
        constructor( options )
        {
            // Set up
            this.data    = new Data( { server : options.server } );
            this.map     = new Map();
            this.players = new Players();
            this.shots   = new Shots();

            this.players.on( 'add', ( player ) =>
            {
                player.socket.emit(
                    'start',
                    {
                        map :
                        {
                            limits :
                            {
                                x : this.map.limits.x,
                                y : this.map.limits.y
                            }
                        }
                    }
                );
            } );
        }
    }

    // Export
    module.exports = Asteroids;

} )();
