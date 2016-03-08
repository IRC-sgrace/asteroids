( function()
{
    'use strict';

    B.Tools.Utils = B.Core.Event_Emitter.extend( {

        static  : 'utils',
        options : {},

        /**
         * CONSTRUCT
         */
        construct : function( options )
        {
            this._super( options );

            // Set up
            this.last_id = 0;
        },

        /**
         * Get id
         */
        get_id : function()
        {
            return ++this.last_id;
        },

        /**
         * Null object
         */
        null_object : function( object )
        {
            if( object.destroy || object.div )
            {
                for( var _key in object )
                {
                    if( typeof object[ _key ] !== 'undefined' )
                        object[ _key ] = null;
                }
            }

            return null;
        }
    } );
} )();
