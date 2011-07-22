#ifndef __SEND_EVENT_H
#define __SEND_EVENT_H

#ifdef __linux
#include <gdk/gdk.h>
#include "linux/linux_utils.h"

#ifdef __cplusplus
extern "C" {
// Define C shim methXods here
guint click(guint button);
guint moveMouse(gint x, gint y);
guint keypress(char val, modifiers mods);
}
#endif
#endif

#ifdef __WIN32
#ifdef __cplusplus
extern "C"
#endif
unsigned int _click(int x, int y, char flags[32], int button);
#endif // windows

#endif // header guard
