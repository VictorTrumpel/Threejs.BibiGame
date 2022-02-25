var mouse = {
  x: {
    current: 0,
    previous: 0,
    calc: 0,
  },
  y: {
    current: 0,
    previous: 0,
    calc: 0,
  },
};

var container = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function mousemove(e) {
  mouse.x.current = e.clientX;
  mouse.y.current = e.clientY;
  mouse.x.calc = mouse.x.current - container.width / 2;
  mouse.y.calc = mouse.y.current - container.height / 2;
}

function rotate() {
  //move head
  const headRY = calc(mouse.x.calc, -200, 200, -Math.PI / 4, Math.PI / 4);
  const headRX = calc(mouse.y.calc, -200, 200, -Math.PI / 4, Math.PI / 4);

  head.rotation.y += (headRY - head.rotation.y) / speed;
  head.rotation.x += (headRX - head.rotation.x) / speed;
}

function calc(v: number, vmin: number, vmax: number, tmin: number, tmax: number) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + pc * dt;
  return tv;
}
