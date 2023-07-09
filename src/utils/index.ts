import { IShip } from '../models';

function formServerResJson({ type, data, id }: { type: string; data: unknown; id: number }) {
  const responseJson = JSON.stringify({ type, data: JSON.stringify(data), id });
  console.log(`\x1b[36msent\x1b[0m: ${responseJson}`);
  return responseJson;
}

function createShipPositions(): IShip[] {
  const positions = [
    "[{\"position\":{\"x\":2,\"y\":8},\"direction\":false,\"type\":\"huge\",\"length\":4},{\"position\":{\"x\":7,\"y\":6},\"direction\":true,\"type\":\"large\",\"length\":3},{\"position\":{\"x\":4,\"y\":1},\"direction\":false,\"type\":\"large\",\"length\":3},{\"position\":{\"x\":5,\"y\":3},\"direction\":true,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":2,\"y\":0},\"direction\":true,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":9,\"y\":7},\"direction\":true,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":0,\"y\":8},\"direction\":false,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":0,\"y\":5},\"direction\":true,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":0,\"y\":0},\"direction\":false,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":1,\"y\":3},\"direction\":true,\"type\":\"small\",\"length\":1}]",
    "[{\"position\":{\"x\":5,\"y\":6},\"direction\":false,\"type\":\"huge\",\"length\":4},{\"position\":{\"x\":3,\"y\":5},\"direction\":true,\"type\":\"large\",\"length\":3},{\"position\":{\"x\":5,\"y\":0},\"direction\":true,\"type\":\"large\",\"length\":3},{\"position\":{\"x\":5,\"y\":8},\"direction\":true,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":3,\"y\":1},\"direction\":true,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":7,\"y\":2},\"direction\":true,\"type\":\"medium\",\"length\":2},{\"position\":{\"x\":0,\"y\":1},\"direction\":false,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":0,\"y\":8},\"direction\":false,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":0,\"y\":5},\"direction\":false,\"type\":\"small\",\"length\":1},{\"position\":{\"x\":7,\"y\":0},\"direction\":true,\"type\":\"small\",\"length\":1}]",
  ];

  return JSON.parse(positions[Math.floor(Math.random() * positions.length)]);
}

export { formServerResJson, createShipPositions };
