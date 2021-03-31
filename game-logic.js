function keyEventListener(){
  document.addEventListener ('keydown', (event) => {
  const keyName = event.key;
  if (keyName == 'ArrowDown') {
    drop();
  } else if (keyName == 'ArrowLeft') {
    translateTetris(num, -1.0, 0);
    main();
  } else if (keyName == 'ArrowRight') {
    translateTetris(num, 1.0, 0);
    main();
  } else if (keyName == 'ArrowUp') {
    size = 2*(num*16+28*2);
    positions = rotateTile(size);
    main();
  } else if (keyName == 'q' || keyName == 'Q') {
    // Quit
    positions = [];
    colors = [];
    main();
    clearInterval(intervalId);
  } else if (keyName == 'r'|| keyName == 'R') {
    // Restart
    tetris = Array(200).fill(0);
    tetris = tetris.concat(Array(10).fill(1));
    num = 0;
    rotationTimes = 0;
    shapeOrder = 0;
    gameover = false;
    positions = [
      -5,  9.0, 5,  9.0, 
      -5,  8.0, 5,  8.0, 
      -5,  7.0, 5,  7.0, 
      -5,  6.0, 5,  6.0, 
      -5,  5.0, 5,  5.0, 
      -5,  4.0, 5,  4.0,
      -5,  3.0, 5,  3.0,
      -5,  2.0, 5,  2.0,
      -5,  1.0, 5,  1.0,
      -5,  0.0, 5,  0.0,
      -5,  -1.0, 5,  -1.0,
      -5,  -2.0, 5,  -2.0,
      -5,  -3.0, 5,  -3.0,
      -5,  -4.0, 5,  -4.0,
      -5,  -5.0, 5,  -5.0,
      -5,  -6.0, 5,  -6.0,
      -5,  -7.0, 5,  -7.0,
      -5,  -8.0, 5,  -8.0,
      -5,  -9.0, 5,  -9.0,
    
      4.0,  10.0, 4.0,  -10.0,
      3.0,  10.0, 3.0,  -10.0,
      2.0,  10.0, 2.0,  -10.0,
      1.0,  10.0, 1.0,  -10.0,
      0.0,  10.0, 0.0,  -10.0,
      -1.0,  10.0, -1.0,  -10.0,
      -2.0,  10.0, -2.0,  -10.0,
      -3.0,  10.0, -3.0,  -10.0,
      -4.0,  10.0, -4.0,  -10.0,
      ];
    colors = Array(224).fill(1.0);
    positions = positions.concat(generateNewTile());
    colors = colors.concat(randomColor());
    main();
    clearInterval(intervalId);
    intervalId = setInterval(drop, 500);
  }
});
}

function checkGameOver(tetris,x) {
  // Top x
  if (tetris[x] == 1) {
    clearInterval(intervalId);
    return true;
  }
}

function translateTetris(id, x, y) {
  // Check if reach the board
  for ( i = 0; i < 4*4; i++){
    square_pos = 2*(id*16+28*2 + i);
    if (positions[square_pos]+x > 5 ||
      positions[square_pos]+x < -5 ) {
        console.log("Invalid input!");
        return;
      }
  }
  
  // Do translation
  for ( i = 0; i < 4*4; i++){
		square_pos = 2*(id*16+28*2 + i);
		positions[square_pos] += x;
		positions[square_pos+1] += y;
	}
	main();
}

function rotateTile(size) {
  // rotate at the third tile. 
  // square shape
  if (shapeOrder == 1) {
    shapeOrder = 0;
    return positions;
  }

  // Other shape
  var n;
  if (rotationTimes%4 == 0) {n = 2;}
  else if (rotationTimes%4 == 1) {n = 0;}
  else if (rotationTimes%4 == 2) {n = 1;}
  else if (rotationTimes%4 == 3) {n = 3;}
  baseX = positions[size+16+(n*2)]+0.5;
  baseY = positions[size+16+(n*2)+1]+0.5;
  degree = Math.PI/2;
  for (i = size; i < size+32; i+=2) {
    x = positions[i];
    y = positions[i+1];
    positions[i]=Math.round((x-baseX) * Math.cos(degree)-(y-baseY)*Math.sin(degree)+baseX);
    positions[i+1]=Math.round((x-baseX) * Math.sin(degree)+(y-baseY)*Math.cos(degree)+baseY);
  }
  rotationTimes++;
  return positions;
}

function generateNewTile() {
  n = Math.random()*7;
  n = Math.ceil(n);
  if (n == 2) {
    // I shape
    x = Math.ceil(Math.random()*6-3);
  } else {
    x = Math.ceil(Math.random()*8-4);
  }
  var shape = [];
  if (n==1) {
    // O
    shape = [
      x-1.0,  11.0, x,  11.0, x-1.0,  10.0, x,  10.0,
      x,  11.0, x+1.0,  11.0, x,  10.0, x+1.0,  10.0,
      x,  12.0, x+1.0,  12.0, x,  11.0, x+1.0,  11.0,
      x-1.0,  12.0, x,  12.0, x-1.0,  11.0, x,  11.0];
      shapeOrder = 1;
  } else if (n==2) {
    // I
    shape = [
      x-3.0,  11.0, x-2.0,  11.0, x-3.0,  10.0, x-2.0,  10.0,
      x-2.0,  11.0, x-1.0,  11.0, x-2.0,  10.0, x-1.0,  10.0,
      x-1,  11.0, x,  11.0, x-1,  10.0, x,  10.0,
      x,  11.0, x+1.0,  11.0, x,  10.0, x+1.0,  10.0];
    shapeOrder = 2;
  } else if (n==3) {
    // S
    shape = [
      x-2.0,  11.0, x-1.0,  11.0, x-2.0,  10.0, x-1.0,  10.0,
      x-1.0,  11.0, x,  11.0, x-1.0,  10.0, x,  10.0,
      x-1.0,  12.0, x,  12.0, x-1.0,  11.0, x,  11.0,
      x,  12.0, x+1.0,  12.0, x,  11.0, x+1.0,  11.0];
  } else if (n==4) {
    // z
    shape = [
      x-2.0,  12.0, x-1.0,  12.0, x-2.0,  11.0, x-1.0,  11.0,
      x-1.0,  11.0, x+0.0,  11.0, x-1.0,  10.0, x+0.0,  10.0,
      x-1.0,  12.0, x+0.0,  12.0, x-1.0,  11.0, x+0.0,  11.0,
      x+1.0,  11.0, x+0.0,  11.0, x+1.0,  10.0, x+0.0,  10.0];
  } else if (n==5) {
    // L
    shape = [
      x-2.0,  11.0, x-1.0,  11.0, x-2.0,  10.0, x-1.0,  10.0,
      x-2.0,  12.0, x-1.0,  12.0, x-2.0,  11.0, x-1.0,  11.0,
      x-1.0,  12.0, x+0.0,  12.0, x-1.0,  11.0, x+0.0,  11.0,
      x+0.0,  12.0, x+1.0,  12.0, x+0.0,  11.0, x+1.0,  11.0];
  } else if (n==6) {
    // J
    shape = [
      x-2.0,  12.0, x-1.0,  12.0, x-2.0,  11.0, x-1.0,  11.0,
      x+0.0,  12.0, x+1.0,  12.0, x+0.0,  11.0, x+1.0,  11.0,
      x-1.0,  12.0, x+0.0,  12.0, x-1.0,  11.0, x+0.0,  11.0,
      x+0.0,  11.0, x+1.0,  11.0, x+0.0,  10.0, x+1.0,  10.0];
  } else if (n==7) {
    // T
    shape = [
      x-2.0,  12.0, x-1.0,  12.0, x-2.0,  11.0, x-1.0,  11.0,
      x-1.0,  11.0, x,  11.0, x-1.0,  10.0, x,  10.0,
      x-1.0,  12.0, x,  12.0, x-1.0,  11.0, x,  11.0,
      x,  12.0, x+1.0,  12.0, x,  11.0, x+1.0,  11.0];
  }

  // Do rotation
  if (shapeOrder == 1) {
    rotationTimes = 0
    return shape;
  }

  // Other shape
  for (rotationTimes = 0; rotationTimes < Math.ceil(Math.random()*4-1); rotationTimes++) {
    n;
    if (rotationTimes == 0) {n = 2;}
    else if (rotationTimes == 1) {n = 0;}
    else if (rotationTimes == 2) {n = 1;}
    else if (rotationTimes == 3) {n = 3;}
    baseX = shape[16+n*2]+0.5;
    baseY = shape[16+n*2+1]+0.5;
    degree = Math.PI/2;
    for (i = 0; i < 32; i+=2) {
      x = shape[i];
      y = shape[i+1];
      shape[i]=Math.round((x-baseX) * Math.cos(degree)-(y-baseY)*Math.sin(degree)+baseX);
      shape[i+1]=Math.round((x-baseX) * Math.sin(degree)+(y-baseY)*Math.cos(degree)+baseY);
    }
  }
  return shape;
}

function randomColor() {
  var r = Math.random();
  var g = Math.random();
  var b = Math.random();
  var newCol = [
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,

    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,

    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,

    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0,
    r,  g,  b,  1.0
  ];

  return newCol;
}