import robot from 'robotjs';

export default function takeScreen(pos: { x: number, y: number }) {
  const screeen = robot.screen.capture(pos.x, pos.y, 200, 200);
}