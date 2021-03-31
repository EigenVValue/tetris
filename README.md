# tetris
Didn't finish part: 
1.tile piece still can collide with any existing piece.
    But can no longer touch the wall.

2. Cannot remove one row when it iss completely filled.

In my code, webgl is used to generate the GL and the game-logic is used to
play the game. Drop() is the main function to start the game.

Basic idea of my code is that it transform the squares into coordinates. 
Let every squares becomes a point according to it left bottom point.
So, it is hard to do rotation. I add a parameter called rotationTimes. It counts
the rotation times of each piece to get true coordinates.

By the way, I use matrix transformation to do rotation.