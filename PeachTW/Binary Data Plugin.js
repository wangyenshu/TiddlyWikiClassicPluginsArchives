//{{{
config.macros.binaryData = { };

config.macros.binaryData.convertHexToBinary = function( paramSourceString, paramOffset, paramBytes ) {
	var digits = paramBytes * 2;
	var result = 0;
	var str = [ ];
	var source = paramSourceString.toLowerCase( );
	for( var i = 0; i < digits; i++ ) {
		var charCode = source.charCodeAt( paramOffset + i );
		result = result << 4;
		if (charCode > 47 && charCode < 58) {
			result = result | ( charCode - 48 );
		}
		else {
			result = result | ( charCode  - 55 );
		}
		if( i > 0 && i % 2 == 0 ) {
			str.push( String.fromCharCode( result ) );
			result = 0;
		}
	}
	if( i > 0 && i % 2 == 0 ) {
		str.push( String.fromCharCode( result ) );
	}
	return str.join( "" );
}

config.macros.binaryData.readFloat = function( paramSourceString, paramOffset ) {
	var result = 0;
	var charCodes = [
		paramSourceString.charCodeAt( paramOffset ),
		paramSourceString.charCodeAt( paramOffset + 1 ),
		paramSourceString.charCodeAt( paramOffset + 2 ),
		paramSourceString.charCodeAt( paramOffset + 3 )
	];
	var negative = ( charCodes [ 0 ] & 128 ) != 0;
	var exponent = ( ( charCodes [ 0 ] & 127 << 1 ) | ( charCodes [ 1 ] & 128 ) ) - 127;
	var zeroMantissa = ( charCodes [ 1 ] & 127 ) == charCodes [ 2 ] == charCodes [ 3 ] == 0;
	if ( exponent == 255 ) {
		if ( zeroMantissa ) {
			return Infinity;
		}
		else {
			return NaN;
		}
	}
	else if ( exponent == 0 ) {
		if ( zeroMantissa ) {
			return 0;
		}
		else {
			//Denormalized Number
			return Math.pow( 2, -149 ) *
				( ( ( ( ( charCodes [ 1 ] & 127 ) << 8 ) | charCodes [ 2 ] ) << 8 ) | charCodes [ 3 ] ) *
				( negative ? -1 : 1 );
		}
	}
	else {
		return Math.pow( 2, exponent - 23 ) *
		( ( ( ( 128 | ( charCodes [ 1 ] & 127 ) << 8 ) | charCodes [ 2 ] ) << 8 ) | charCodes [ 3 ] ) *
		( negative ? -1 : 1 );
	}
}

config.macros.binaryData.readStringFromString = function( paramSourceString, paramOffset ) {
	var charCode = paramSourceString.charCodeAt( paramOffset );
	var offset = 1;
	var result = [ ];
	while( charCode != 0) {
		result.push( String.fromCharCode( charCode ) );
		charCode = paramSourceString.charCodeAt( paramOffset + ( offset++ ) );
	}
	return result.join( "" );
}

config.macros.binaryData.readCharFromString = function( paramSourceString, paramOffset ) {
	return paramSourceString.charCodeAt( paramOffset );
}

config.macros.binaryData.readShortFromString = function( paramSourceString, paramOffset ) {
	var result = paramSourceString.charCodeAt( paramOffset );
	result = result << 8;
	return ( result + paramSourceString.charCodeAt( paramOffset + 1 ) );
}

config.macros.binaryData.readIntFromString = function( paramSourceString, paramOffset ) {
	var result = paramSourceString.charCodeAt( paramOffset );
	result = result << 8;
	result += paramSourceString.charCodeAt( paramOffset + 1);
	result = result << 8;
	result += paramSourceString.charCodeAt( paramOffset + 2);
	result = result << 8;
	return ( result + paramSourceString.charCodeAt( paramOffset + 3 ) );
}

config.macros.binaryData.readDataFromString = function( paramSourceString, paramOffset, paramDataTypeString ) {
	
};

config.macros.binaryData.writeChar = function( paramSourceNumber ) {
	return String.fromCharCode( paramSourceNumber );
}

config.macros.binaryData.writeShort = function( paramSourceNumber ) {
	return String.fromCharCode( paramSourceNumber >> 8 & 255 ) +
	String.fromCharCode( paramSourceNumber & 255 );
}

config.macros.binaryData.writeInt = function( paramSourceNumber ) {
	return String.fromCharCode( paramSourceNumber >> 24 & 255 ) +
	String.fromCharCode( paramSourceNumber >> 16 & 255 ) +
	String.fromCharCode( paramSourceNumber >> 8 & 255 ) +
	String.fromCharCode( paramSourceNumber & 255 );
}

config.macros.binaryData.writeString = function( paramSourceString ) {
	return paramSourceString + String.fromCharCode( 0 );
}

config.macros.binaryData.getStringFromData = function( paramDataTypeString ) {
	var result = [];
	return result.join( "" );
}
//}}}