#include "linux_utils.h"
#include <gdk/gdkx.h>


// This is the timestamp needed in the GDK events.
guint32 TimeSinceBootMsec() {
  struct timespec ts;
  clock_gettime(CLOCK_MONOTONIC, &ts);
  return ts.tv_sec * 1000 + ts.tv_nsec / 1000000 + 500;
}

// Returns the modifier state from the given modifier struct
guint getModifierState(modifiers *mods) {
    guint state = 0;
    if (mods->shift == 1) state |= GDK_SHIFT_MASK;
    if (mods->ctrl == 1) state |= GDK_CONTROL_MASK;
    if (mods->alt == 1) state |= GDK_MOD1_MASK; // This isn't guaranteed to be alt but it is for most systems
    if (mods->meta == 1) state |= GDK_META_MASK;
    return state;
}
