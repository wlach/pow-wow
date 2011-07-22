#include "native_events.h"

#ifdef __linux
// Define C++ method implementations here
guint _click(guint button);
guint _moveMouse(gint x, gint y);
guint _keypress(char val, modifiers *mods);

guint moveMouse(gint x, gint y) {
    return _moveMouse(x, y);
}

guint click(guint button) {
    return _click(button);
}

guint keypress(char val, modifiers mods) {
    return _keypress(val, &mods);
}
#endif

#ifdef __WIN32
#define DllExport __declspec( dllexport )
DllExport unsigned int click(int x, int y, char flags[32], int button) {
    return _click(x, y, flags, button);
}
#endif
