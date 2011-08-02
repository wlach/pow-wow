/* Synthetic sendMouseEvent */
function syntheticSendMouseEvent(aEvent, aTarget, aWindow) {
  if (['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'].indexOf(aEvent.type) == -1) {
    throw new Error("sendMouseEvent doesn't know about event type '"+aEvent.type+"'");
  }

  if (!aWindow) {
    aWindow = window;
  }

  aTarget = aWindow.document.getElementById(aTarget);

  // For events to trigger the UA's default actions they need to be "trusted"
  //netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserWrite');

  var event = aWindow.document.createEvent('MouseEvent');

  var typeArg          = aEvent.type;
  var canBubbleArg     = true;
  var cancelableArg    = true;
  var viewArg          = aWindow;
  var detailArg        = aEvent.detail        || (aEvent.type == 'click'     ||
                                                  aEvent.type == 'mousedown' ||
                                                  aEvent.type == 'mouseup' ? 1 : 0);
  var screenXArg       = aEvent.screenX       || 0;
  var screenYArg       = aEvent.screenY       || 0;
  var clientXArg       = aEvent.clientX       || 0;
  var clientYArg       = aEvent.clientY       || 0;
  var ctrlKeyArg       = aEvent.ctrlKey       || false;
  var altKeyArg        = aEvent.altKey        || false;
  var shiftKeyArg      = aEvent.shiftKey      || false;
  var metaKeyArg       = aEvent.metaKey       || false;
  var buttonArg        = aEvent.button        || 0;
  var relatedTargetArg = aEvent.relatedTarget || null;

  event.initMouseEvent(typeArg, canBubbleArg, cancelableArg, viewArg, detailArg,
                       screenXArg, screenYArg, clientXArg, clientYArg,
                       ctrlKeyArg, altKeyArg, shiftKeyArg, metaKeyArg,
                       buttonArg, relatedTargetArg);

  aTarget.dispatchEvent(event);
}


function NativeEvents() {
}

NativeEvents.prototype = {
  toString: function() { return "[NativeEvents]"; },
  moveMouse: function(x, y) {
    sendAsyncMessage('NativeEvents.MoveMouse', { x: x, y: y });
  },
  clickMouse: function(button) {
    sendAsyncMessage('NativeEvents.ClickMouse', { button: button });
  },
  __exposedProps__: {
    'toString': 'r',
    'clickMouse': 'r',
    'moveMouse': 'r'
  }
};

// This is a frame script, so it may be running in a content process.
// In any event, it is targeted at a specific "tab", so we listen for
// the DOMWindowCreated event to be notified about content windows
// being created in this context.

function NativeEventsManager() {
  addEventListener("DOMWindowCreated", this, false);
}

NativeEventsManager.prototype = {
  handleEvent: function handleEvent(aEvent) {
    var window = aEvent.target.defaultView;
    window.wrappedJSObject.NativeEvents = new NativeEvents(window);
    window.wrappedJSObject.syntheticSendMouseEvent = syntheticSendMouseEvent;
  }
};

var nativeEventsManager = new NativeEventsManager();
