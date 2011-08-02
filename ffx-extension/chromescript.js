Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");

Components.utils.import("resource://gre/modules/ctypes.jsm");
const lib = ctypes.open('/home/wlach/src/pow-wow/libnative_events.so');
const moveMouse = lib.declare('moveMouse', ctypes.default_abi, ctypes.unsigned_long, ctypes.unsigned_long, ctypes.unsigned_long);
const clickMouse = lib.declare('click', ctypes.default_abi, ctypes.unsigned_long, ctypes.unsigned_long);

const Cc = Components.classes;
const Ci = Components.interfaces;

/* XPCOM gunk */
function NativeEventsObserver() {}

function myDump(aMessage) {
  var consoleService = Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService);
  consoleService.logStringMessage("NEV: " + aMessage);
}

NativeEventsObserver.prototype = {
  classDescription: "Native Events Observer for use in testing.",
  classID: Components.ID("{cee89d1e-f891-438a-9405-981117d55c90}"),
  contractID: "@mozilla.org/native-events-observer;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver]),
  _xpcom_categories: [{category: "profile-after-change", service: true }],
  isFrameScriptLoaded: false,
  
  observe: function(aSubject, aTopic, aData)
  {
    if (aTopic == "profile-after-change") {
      this.init();
    } else if (!this.isFrameScriptLoaded &&
               aTopic == "chrome-document-global-created") {
      var messageManager = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIChromeFrameMessageManager);
      // Register for any messages our API needs us to handle
      messageManager.addMessageListener("NativeEvents.MoveMouse", this);
      messageManager.addMessageListener("NativeEvents.ClickMouse", this);
      
      messageManager.loadFrameScript("chrome://native-events/content/contentscript.js", true);
      this.isFrameScriptLoaded = true;
    } else if (aTopic == "xpcom-shutdown") {
      this.uninit();
    }
  },
  
  init: function () {
    var obs = Services.obs;
    obs.addObserver(this, "xpcom-shutdown", false);
    obs.addObserver(this, "chrome-document-global-created", false);
  },
  
  uninit: function () {
    var obs = Services.obs;
    obs.removeObserver(this, "chrome-document-global-created", false);
  },
  
  receiveMessage: function(aMessage) {
    switch(aMessage.name) {
    case "NativeEvents.MoveMouse":
      moveMouse(aMessage.json.x,aMessage.json.y);
      break;
    case "NativeEvents.ClickMouse":
      clickMouse(aMessage.json.button);
      break;
    }

    return;
  }
};

const NSGetFactory = XPCOMUtils.generateNSGetFactory([NativeEventsObserver]);
