import robot from 'robotjs';

export default function drawRectangle(a: number, b: number, pos: { x: number, y: number }) {
  let { x, y } = pos;
  robot.setMouseDelay(100);
  robot.mouseToggle("down");

  robot.dragMouse(x += a, y);
  robot.dragMouse(x, y += b);
  robot.dragMouse(x -= a, y);
  robot.dragMouse(x, y -=b);
  
  robot.mouseToggle("up");
  robot.setMouseDelay(10);
};