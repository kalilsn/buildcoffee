# logo color generator

import math

colors = [(238, 160, 165), (237, 176, 13), (226, 237, 13), (133, 237, 13), (13, 237, 195), (99, 170, 255), (203, 160, 238)]


# takes a list of rgb tuples
def shaded_keyframes(name, colors, adjustment=1):
    length = len(colors)
    print "@keyframes %s {" % name
    for i in range(length):
        print " "*4 + str(int(math.ceil(i*12.5))) + "% {fill: " + "rgb(%d,%d,%d)}" % tuple(map(lambda x: int(math.ceil(adjustment*x)), colors[i]))
    print "}"


if __name__ == '__main__':
    shaded_keyframes("multicolor-light", colors)
    shaded_keyframes("multicolor-dark", colors, 0.75)
