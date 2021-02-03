const reMouseEvent = /^(?:mouse|contextmenu)|click/;

const reTouchEvent = /^touch/;

const rePointerEvent = /^pointer/;

export class EventWrap {
    constructor(evt, listenerThis) {
        this.originalEvent = evt;
        this.type = evt.type;
        this.timeStamp = evt.timeStamp;
        this.target = evt.target;
        this.currentTarget = evt.currentTarget || listenerThis;
        if (reMouseEvent.test(this.type) || rePointerEvent.test(this.type)) {
            const mouseOrPointerEvt = evt;
            this.clientX = mouseOrPointerEvt.clientX;
            this.clientY = mouseOrPointerEvt.clientY;
            this.pageX = mouseOrPointerEvt.pageX;
            this.pageY = mouseOrPointerEvt.pageY;
        } else if (reTouchEvent.test(this.type)) {
            const firstTouch = evt.touches[0];
            if (firstTouch) {
                this.clientX = firstTouch.clientX;
                this.clientY = firstTouch.clientY;
                this.pageX = firstTouch.pageX;
                this.pageY = firstTouch.pageY;
            }
        }
    }
    preventDefault() {
        this.originalEvent.preventDefault();
    }
    stopPropagation() {
        this.originalEvent.stopPropagation();
    }
    isDefaultPrevented() {
        return this.originalEvent.defaultPrevented;
    }
    isPropagationStopped() {
        return this.originalEvent.bubbles;
    }
}