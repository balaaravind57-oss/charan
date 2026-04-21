import { useState, useEffect, useCallback } from 'react';

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 25;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isOccupied = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export function useSnake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize food correctly on mount
  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      if (!gameOver && !isPaused) {
        setDirection((prevDir) => {
          switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
              return prevDir !== 'DOWN' ? 'UP' : prevDir;
            case 'ArrowDown':
            case 's':
            case 'S':
              return prevDir !== 'UP' ? 'DOWN' : prevDir;
            case 'ArrowLeft':
            case 'a':
            case 'A':
              return prevDir !== 'RIGHT' ? 'LEFT' : prevDir;
            case 'ArrowRight':
            case 'd':
            case 'D':
              return prevDir !== 'LEFT' ? 'RIGHT' : prevDir;
            default:
              return prevDir;
          }
        });
      }
    },
    [gameOver, isPaused]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Wall collision checking
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        // Self collision checking
        if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision checking
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 120); // standard speed
    return () => clearInterval(interval);
  }, [direction, gameOver, isPaused, food]);

  return {
    snake,
    food,
    direction,
    score,
    gameOver,
    isPaused,
    gridSize: GRID_SIZE,
    resetGame,
    setIsPaused,
  };
}
