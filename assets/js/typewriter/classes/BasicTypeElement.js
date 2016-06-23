define( [ 
	"helper/globals",
	"helper/errorMessenger", 
	"cursor/cursor",
	"timer/controller" 
	], function ( _globals, errorMessenger, cursor, timerController ) {

	function BasicTypeElement () {};

	BasicTypeElement.prototype.name = "BasicTypeElement";

	BasicTypeElement.prototype.addNext = function ( next ) {
		this.next = next;
	}

	BasicTypeElement.prototype.randomize = function ( input, minFactor, maxFactor ) {
		return input * ( minFactor + ( Math.random() * ( maxFactor - minFactor ) ) );
	}

	BasicTypeElement.prototype.basicSetup = function ( args ) {
		args = args || [];

		this.parent = args.parent;
		this.nr = args.nr;
		this.self = args.self;
		this.prev = args.prev || false;
		this.delay = args.delay || this.defaultDelay || false;

		if ( this.isElement === true ) {
			this.$self = $( this.self );
			this.$self.addClass( "ns" );
			this.delay = this.$self.data( "typespeed" ) || this.delay;
		}	

		// add this as the next Element to the previous Element
		if ( this.prev !== false ) {
			this.prev.addNext( this );
		}

		// create childList if this object can have children
		if ( this.hasChildren === true && this.getChildren ) {
			this.getChildren();
			this.currentChild = 0;
		}
	}

	BasicTypeElement.prototype.getDelay = function () {
		return this.delay / ( _globals.typeSpeedMultiplyer || 1 );
	}

	BasicTypeElement.prototype.startReveal = function ( parentCallback ) {
		this.parentCallbackAfterReveal = parentCallback;

		if ( this.beforeRevealCountdown ) { 
			this.beforeRevealCountdown(); 
		}

		timerController.addTimeout( this.reveal.bind( this ), this.getDelay() );
	}

	BasicTypeElement.prototype.reveal = function () {
		this.$self.addClass( "s" ).removeClass( "ns" );
		cursor.moveToElement( this );
		if ( this.hasChildren === true && this.revealChildren ) {
			this.revealChildren();
		} else {
			if( this.parentCallbackAfterReveal ) {
				this.parentCallbackAfterReveal();
			}
		}
	}

	BasicTypeElement.prototype.getElementToMoveTo = function () {
		return this;
	}

	BasicTypeElement.prototype.moveToStartFirst = function () {
		this.notRevealedYet = true;
	}

	BasicTypeElement.prototype.checkIfCursorToTheRight = function () {
		if ( this.notRevealedYet ) {
			this.notRevealedYet = false;
			return false;
		} else {
			return this.cursorToTheRight;
		}
	}

	return BasicTypeElement;
} );
