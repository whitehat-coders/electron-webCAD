var canvas = document.getElementById("glCanvas");
initGL(canvas);
var shape = gl.TRIANGLE_STRIP;

main();
var bbox = canvas.getBoundingClientRect();
console.log(bbox);
    var triangleVertexPositionBuffer;
    var squareVertexPositionBuffer;
    var gl;
    var shaderProgram;
    var mvMatrix ;
    var pMatrix ;
    var z = -5;
    var pointcords = {"points":[]};
     localStorage.setItem('points', JSON.stringify(pointcords));

function livepoints(x,y){
    pointcords.points.push(x);
    pointcords.points.push(y);
    pointcords.points.push(0);
    localStorage.setItem('points', JSON.stringify(pointcords));
    pointcords = JSON.parse(localStorage.getItem('points'));
    console.log(pointcords);
    return pointcords;
}

function main() {
    
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();;
}

function initGL(canvas){
    try {
        gl = canvas.getContext("webgl2");
        console.log(gl);
        
        gl.viewportWidth = canvas.width=window.innerWidth-25;
        gl.viewportHeight = canvas.height=window.innerHeight-25;
        
    } catch(e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-( ");
    }
}

function initShaders(){
    
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function initBuffers() {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    
    var vertices = [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
    
   
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var viewangle = 90 * Math.PI / 180;
    var aspect = (gl.viewportWidth / gl.viewportHeight);
    pMatrix = mat4.create();
    
    
    mat4.perspective(pMatrix, viewangle, aspect, 0.1, 100);
    
    mvMatrix = mat4.create();
   
    //move to -1.5,0,-7 and draw triangle
    mat4.translate(mvMatrix, mvMatrix, [-0.0, 0.0, -20]);
      
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    
    //move to 3,0,0 from triangle draw standpoint and draw square
    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    
    
    gl.drawArrays(shape, 0, squareVertexPositionBuffer.numItems);
}

function getShader(gl, id){
    var shaderScript = document.getElementById(id);
  
      if (!shaderScript) {
          return null;
      }

      var str = "";
      var k = shaderScript.firstChild;
      while (k) {
          if (k.nodeType == 3)
              str += k.textContent;
          k = k.nextSibling;
      }

      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
          return null;
      }

      gl.shaderSource(shader, str);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(shader));
          return null;
      }

      return shader;
}

function setMatrixUniforms() {
    
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  }


function drawScene2(z) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var viewangle = 45 * Math.PI / 180;
    var aspect = gl.viewportWidth / gl.viewportHeight;
    pMatrix = mat4.create();
    console.log(pMatrix);
    
    mat4.perspective(pMatrix, viewangle, aspect, 0.1, 100.0 );
    
    mvMatrix = mat4.create();
    mat4.identity(mvMatrix);
  
    //move to -1.5,0,-7 and draw triangle
    mat4.translate(mvMatrix, mvMatrix, [-0.0, 0.0, z]);
      
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    
    //move to 3,0,0 from triangle draw standpoint and draw square
    mat4.translate(mvMatrix, mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    
    
    gl.drawArrays(shape, 0, squareVertexPositionBuffer.numItems);
}


function drawScened() {
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var viewangle = 90 * Math.PI / 180;
    var aspect = (gl.viewportWidth / gl.viewportHeight);
    pMatrix = mat4.create();
    
    
    mat4.perspective(pMatrix, viewangle, aspect, 0.1, 100);
    
    mvMatrix = mat4.create();
   
    //move to -1.5,0,-7 and draw triangle
    mat4.translate(mvMatrix, mvMatrix, [0, 0, -20]);
      
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_STRIP, 0, triangleVertexPositionBuffer.numItems);
    

}

function initBuffersd(x,y) {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    pointcords = livepoints(x,y);
    var vertices = pointcords.points;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = (pointcords.points.length)/triangleVertexPositionBuffer.itemSize;
    
}

function initBuffersm(x,y) {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    pointcords = JSON.parse(localStorage.getItem('points'));
    pointcords.points.push(x);
    pointcords.points.push(y);
    pointcords.points.push(0);
    var vertices = pointcords.points;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = (pointcords.points.length)/triangleVertexPositionBuffer.itemSize;
    
}
