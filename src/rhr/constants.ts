import {Vector} from "../utils";

export const Directions  = {
    IntoPage: 0,
    OutOfPage: 1,
    Left: 2,
    Right: 3,
    Up: 4,
    Down: 5,
    None: 6
};

export const DirectionVectors: Record<number, Vector> = {
    [Directions.IntoPage]: [0, 0, -1],
    [Directions.OutOfPage]: [0, 0, 1],
    [Directions.Left]: [-1, 0, 0],
    [Directions.Right]: [1, 0, 0],
    [Directions.Up]: [0, 1, 0],
    [Directions.Down]: [0, -1, 0],
    [Directions.None]: [0, 0, 0]
}
