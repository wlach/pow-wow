#include "../native_events.h"
#include <stdlib.h>
#include <gdk/gdkx.h>

// Creates a generic key event
GdkEvent *createKeyEvent(GdkEventType type) {
    GdkWindow *window = getActiveWindow();
    GdkEvent *event = gdk_event_new(type);
    event->key.window = window;
    event->key.send_event = false; // Not a synthesized event
    return event;
}

extern "C" guint _keypress(char c, modifiers *mods) {
    guint keyval = gdk_unicode_to_keyval(c);
    GdkEvent *keydown = createKeyEvent(GDK_KEY_PRESS);
    keydown->key.time = TimeSinceBootMsec();
    keydown->key.keyval = keyval;
    keydown->key.state = getModifierState(mods);

    gdk_event_put(keydown);

    GdkEvent *keyup = gdk_event_copy(keydown);
    keyup->key.type = GDK_KEY_RELEASE;
    keyup->key.time++;

    gdk_event_free(keyup);
    return true;
}

extern "C" guint _sendKeys() {
    
}

extern "C" guint _moveMouse(gint x, gint y) {
    gdk_display_warp_pointer(gdk_display_get_default(), gdk_screen_get_default(),
                             x, y);
    
#if 0    
    GdkEvent* event = gdk_event_new(GDK_MOTION_NOTIFY);
    
    event->motion.send_event = false;
    event->motion.time = TimeSinceBootMsec();
    event->motion.x = x;
    event->motion.y = y;

    GtkWidget* grab_widget = gtk_grab_get_current();
    if (grab_widget) {
        // If there is a grab, we need to target all events at it regardless of
        // what widget the mouse is over.
        event->motion.window = grab_widget->window;
    } else {
        gint x2, y2;
        event->motion.window = gdk_window_at_pointer(&x2, &y2);
    }

    g_object_ref(event->motion.window);
    gint origin_x, origin_y;
    gdk_window_get_origin(event->motion.window, &origin_x, &origin_y);
    event->motion.x_root = x + origin_x;
    event->motion.y_root = y + origin_y;

    event->motion.device = gdk_device_get_core_pointer();
    event->type = GDK_MOTION_NOTIFY;

    gdk_event_put(event);
    gdk_event_free(event);    
#endif
    return true;
}

// Send a click event
extern "C" guint _click(guint button) {    
    
    gint x, y;    
    GdkWindow *window = gdk_window_at_pointer(&x, &y);
    GdkWindow *toplevel = gdk_window_get_toplevel(window);

    // Create the press event
    GdkEvent *press = gdk_event_new(GDK_BUTTON_PRESS);
    press->button.window = window;

    g_object_ref(press->button.window);

    GdkModifierType modifier;
    gdk_window_get_pointer(press->button.window, NULL, NULL, &modifier);
    press->button.state = modifier;

    press->button.send_event = false; // Not a synthesized event
    press->button.time = TimeSinceBootMsec();
    press->button.x = x;
    press->button.y = y;

    press->button.button = button;
    press->button.device = gdk_device_get_core_pointer();

    gint origin_x, origin_y;
    gdk_window_get_origin(press->button.window, &origin_x, &origin_y);
    press->button.x_root = x + origin_x;
    press->button.y_root = y + origin_y;

    // Submit the press event
    gdk_event_put(press);

    // Create the release event (copy from press event)
    GdkEvent *release = gdk_event_copy(press);
    release->button.type = GDK_BUTTON_RELEASE;
    release->button.time++;

    // Submit the release event
    gdk_event_put(release);
    
    // Cleanup (only need to release one event)
    gdk_event_free(press);
    gdk_event_free(release);

    return true;
}

