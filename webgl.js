  keyEventListener();
  var tetris = Array(200).fill(0.0);
  tetris = tetris.concat(Array(10).fill(1.0));
  
  // number of tiles
  var num = 0;

  // This count ratation times of each tile.
  var rotationTimes = 0;

  // Only for square case
  var shapeOrder = 0;

  // Game Over
  var gameover = false;

  // Now create an array of positions for the square.
  var positions = [
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
  // Now set up the colors for the vertices
  var colors = Array(224).fill(1.0);
 
  positions = positions.concat(generateNewTile());
  colors = colors.concat(randomColor());

  main();
  var intervalId = setInterval(drop, 500);

function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Initializing scene params
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 90 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);


  // Draw the scene
  drawScene(gl, programInfo, buffers, projectionMatrix, [0.0, 0.0, -10.0]);
  //drawScene(gl, programInfo, buffers, projectionMatrix, [0.0, 0.0, -10.0]);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, projectionMatrix, translateArray) {
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 translateArray);  // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }





  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;

    // Draw Lines
    var i = 0;
    for( i; i<(19+9); i++) {
      gl.drawArrays(gl.LINE_STRIP, offset+i*2, 2);
    }
    //console.log(i);

    for ( j=0; j<(positions.length)/4-(19+9); j++) {
      gl.drawArrays(gl.TRIANGLE_STRIP, offset+i*2+j*4, vertexCount);
    }
	
    //gl.drawArrays(gl.TRIANGLE_STRIP, 4, vertexCount);
    
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// Game Start
function drop() {

  // Check if it is reach the end
  var p = false;
  var n;
  if (rotationTimes%4 == 0) {n = 2;}
  else if (rotationTimes%4 == 1) {n = 0;}
  else if (rotationTimes%4 == 2) {n = 1;}
  else if (rotationTimes%4 == 3) {n = 3;}
  for ( i = n; i < 4*4; i+=4){
		square_pos = 2*(num*16+28*2 + i);
		x = positions[square_pos] + 5;
    if (positions[square_pos+1] > 9) {
      continue;
    }
		y = Math.abs(positions[square_pos+1] - 9);
    
    if (tetris[10*(y+1)+x] == 1 ) {
      p = true;
      for ( i = n; i < 4*4; i +=4){
        square_pos = 2*(num*16+28*2 + i);
		    x = positions[square_pos] + 5;
        y = Math.abs(positions[square_pos+1] - 9);

        // Check if game is over
        gameover = checkGameOver(tetris,x);
        
        tetris[10*y+x] = 1;
      }
      //console.log("stop");
      break;
    }
  }

  if (gameover) {
    alert("Game Over.");
  }

  if (p) {
    //console.log("stop");
    positions = positions.concat(generateNewTile());
    colors = colors.concat(randomColor());
    num++;
  }
	translateTetris(num, 0, -1.0);
	main();
}