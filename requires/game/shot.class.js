( function()
{
    'use strict';

    // Requires
    let Socket        = require( './socket.class' ),
        Event_Emitter = require( './event_emitter.class' ),
        Utils         = require( './utils.class' );

    /**
     * Shot class
     */
    class Shot extends Event_Emitter
    {
        /**
         * Constructor
         */
        constructor( options )
        {
            super( options );

            // Set up
            this.utils           = new Utils();
            this.id              = options.id || this.utils.get_id();
            this.direction_angle = options.direction_angle;
            this.player          = options.player;
            this.last_values     = {};
            this.position        = {
                value :
                {
                    x : options.x,
                    y : options.y
                },
                speed :
                {
                    x : options.speed_x + Math.sin( this.direction_angle ) * 300,
                    y : options.speed_y - Math.cos( this.direction_angle ) * 300
                }
            };
            this.life          = {};
            this.life.duration = 2000;
            this.life.progress = 0;
            this.life.ratio    = 0;
            this.life.start    = + new Date();
        }

        /**
         * Update
         */
        update( time )
        {
            let ratio = time.delta / 1000;

            // Position
            this.position.value.x += this.position.speed.x * ratio;
            this.position.value.y += this.position.speed.y * ratio;

            // Life
            this.life.progress = + new Date() - this.life.start;
            this.life.ratio    = this.life.progress / this.life.duration;

            if( this.life.ratio > 1 )
                this.trigger( 'elapsed' );
        }

        /**
         * Get data
         */
        get_data( only_updated )
        {
            // Params
            if( typeof only_updated === 'undefined' )
                only_updated = true;

            // Set up
            let data = {};

            // Minimum data
            data.id = this.id;
            data.x  = this.position.value.x;
            data.y  = this.position.value.y;

            // Test if at leat one value changed
            if(
                !only_updated
                || this.last_values.x !== data.x
                || this.last_values.y !== data.y
            )
            {
                // Set last values
                this.last_values.x = data.x;
                this.last_values.y = data.y;

                // Return
                return data;
            }

            return false;
        }
    }

    // Export
    module.exports = Shot;

} )();
