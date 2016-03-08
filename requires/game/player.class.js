( function()
{
    'use strict';

    // Requires
    let Socket        = require( './socket.class' ),
        Map           = require( './map.class' ),
        Event_Emitter = require( './event_emitter.class' ),
        Shots         = require( './shots.class' );

    /**
     * Player class
     */
    class Player extends Event_Emitter
    {
        /**
         * Constructor
         */
        constructor( options )
        {
            super( options );

            // Set up
            this.socket       = options.socket;
            this.id           = options.id || this.utils.get_id();
            this.shots        = new Shots();
            this.map          = new Map();
            this.last_values  = {};
            this.map          = new Map();
            this.position     = {
                value :
                {
                    x : options.x,
                    y : options.y
                },
                speed :
                {
                    x : 0,
                    y : 0
                },
                acceleration :
                {
                    forward  : 10,
                    backward : 2
                }
            }
            this.rotation = {
                value : 0,
                speed : 0
            };
            this.inputs_down = {
                'up'    : false,
                'right' : false,
                'down'  : false,
                'left'  : false,
                'space' : false,
            };
            this.inputs_down_names  = Object.keys( this.inputs_down );

            // Init
            this.init_shooting();
            this.init_socket();
        }

        init_shooting()
        {
            this.shooting           = {};
            this.shooting.active    = false;
            this.shooting.interval  = null;
            this.shooting.period    = 200;
            this.shooting.origin    = { x : 0, y : -10 };
        }

        /**
         * Init socket
         */
        init_socket()
        {
            // Input event
            this.socket.on( 'input', ( data ) =>
            {
                console.log( 'socket'.green.bold + ' - ' + 'input'.cyan + ' - ' + this.socket.id.cyan + ' - ' + data.name );

                // Handle input
                this.handle_input( data );
            } );
        }

        /**
         * Handle input
         */
        handle_input( data )
        {
            // Start
            if( data.action === 'start' )
                this.handle_start_input( data.name );

            // End
            else if( data.action === 'end' )
                this.handle_end_input( data.name );
        }

        /**
         * Handle start input
         */
        handle_start_input( name )
        {
            // Key not found
            if( this.inputs_down_names.indexOf( name ) === -1 )
                return;

            // Already pressed
            if( this.inputs_down[ name ] )
                return;

            // Set up
            this.inputs_down[ name ] = true;
        }

        /**
         * Handle end input
         */
        handle_end_input( name )
        {
            // Key not found
            if( this.inputs_down_names.indexOf( name ) === -1 )
                return;

            // Not yet pressed
            if( !this.inputs_down[ name ] )
                return;

            // Set up
            this.inputs_down[ name ] = false;
        }

        /**
         * Update
         */
        update( time )
        {
            let ratio = time.delta / 1000;

            // Right
            if( this.inputs_down.right )
                this.rotation.speed = 3;

            // Left
            if( this.inputs_down.left )
                this.rotation.speed = - 3;

            // No left and no right or none
            if( ( this.inputs_down.right && this.inputs_down.left ) || ( !this.inputs_down.right && !this.inputs_down.left ) )
                this.rotation.speed = 0;

            // Up
            if( this.inputs_down.up )
            {
                this.position.speed.x += Math.sin( this.rotation.value ) * this.position.acceleration.forward;
                this.position.speed.y -= Math.cos( this.rotation.value ) * this.position.acceleration.forward;
            }

            // Down
            if( this.inputs_down.down )
            {
                this.position.speed.x -= Math.sin( this.rotation.value ) * this.position.acceleration.backward;
                this.position.speed.y += Math.cos( this.rotation.value ) * this.position.acceleration.backward;
            }

            // Space
            if( this.inputs_down.space )
                this.start_shooting();
            else
                this.stop_shooting();

            // Update values
            this.rotation.value   += this.rotation.speed   * ratio;
            this.position.value.x += this.position.speed.x * ratio;
            this.position.value.y += this.position.speed.y * ratio;

            // Map limits
            if( this.position.value.x < 0 )
            {
                this.position.value.x = 0;
                this.position.speed.x *= - ( 1 - this.map.collision_absorption );
            }
            else if( this.position.value.x > this.map.limits.x )
            {
                this.position.value.x = this.map.limits.x;
                this.position.speed.x *= - ( 1 - this.map.collision_absorption );
            }
            if( this.position.value.y < 0 )
            {
                this.position.value.y = 0;
                this.position.speed.y *= - ( 1 - this.map.collision_absorption );
            }
            else if( this.position.value.y > this.map.limits.y )
            {
                this.position.value.y = this.map.limits.y;
                this.position.speed.y *= - ( 1 - this.map.collision_absorption );
            }
        }

        /**
         * Start shooting
         */
        start_shooting()
        {
            // Already shooting
            if( this.shooting.active )
                return false;

            // Set up
            this.shooting.active = true;

            // Start interval
            this.shooting.interval = setInterval( () =>
            {
                // Shoot
                this.shoot();
            }, this.shooting.period );

            // First shot
            this.shoot();
        }

        /**
         * Stop shooting
         */
        stop_shooting()
        {
            // Already stop shooting
            if( !this.shooting.active )
                return false;

            // Set up
            this.shooting.active = false;

            // Clear interval
            clearInterval( this.shooting.interval );
        }

        /**
         * Shoot
         */
        shoot()
        {
            // Set up
            let options  = {},
                sinus    = Math.sin( this.rotation.value ),
                cosinus  = Math.cos( this.rotation.value ),
                origin_x = this.shooting.origin.x * cosinus - this.shooting.origin.y * sinus,
                origin_y = this.shooting.origin.x * sinus - this.shooting.origin.y * cosinus;

            options.player          = this;
            options.direction_angle = this.rotation.value;
            options.x               = this.position.value.x + origin_x;
            options.y               = this.position.value.y - origin_y;
            options.speed_x         = this.position.speed.x;
            options.speed_y         = this.position.speed.y;

            // Add
            this.shots.add( options );
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
            data.r  = this.rotation.value;

            // Test if at leat one value changed
            if(
                !only_updated
                || this.last_values.x !== data.x
                || this.last_values.y !== data.y
                || this.last_values.r !== data.r
            )
            {
                // Set last values
                this.last_values.x = data.x;
                this.last_values.y = data.y;
                this.last_values.r = data.r;

                // Return
                return data;
            }

            return false;
        }
    }

    // Export
    module.exports = Player;

} )();
