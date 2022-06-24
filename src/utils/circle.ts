import robot from 'robotjs';

export default function drawCircle(R: number, pos: { x: number; y: number }) {
  robot.moveMouse(R, R);

  for (let i = 0; i <= Math.PI * 2.1; i += 0.2) {
    const x = pos.x + R * Math.cos(i);
    const y = pos.y + R * Math.sin(i);

    robot.mouseToggle('down');
    robot.dragMouse(x, y);
    robot.mouseToggle('up');
  }

  robot.moveMouse(pos.x, pos.y);
}
