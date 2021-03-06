CC := gcc
CXX := g++
GDK_CFLAGS := $(shell pkg-config --cflags gdk-2.0)
CFLAGS := -fPIC $(GDK_CFLAGS) -g 
CXXFLAGS := -fPIC $(GDK_CFLAGS) -g
LFLAGS := -shared
DIRS := linux
OBJECTS := native_events.o linux/linux_events.o linux/linux_utils.o
TARGET := libnative_events.so

native-events.xpi: 
	cd ffx-extension; zip -r9 native-events.xpi *; cd ..
	mv ffx-extension/native-events.xpi .

$(TARGET): $(OBJECTS)
	$(CC) $(LFLAGS) $^ -o $@

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

%.o: %.cxx
	$(CXX) $(CFLAGS) -I -c $< -o $@

.PHONY: clean native-events.xpi

clean:
	echo Cleaning up temporary files
	rm -f $(TARGET) $(OBJECTS) *.o
