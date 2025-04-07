import { cn } from "@/lib/utils";
import React from "react";

interface KeyboardProps {
  onClick: (key: string) => void;
  disabled: boolean;
  guessedLetters: string[];
  currentWord: string;
}

const Keyboard = ({
  onClick,
  disabled,
  guessedLetters,
  currentWord,
}: KeyboardProps) => {
  const alphabets: string = "abcdefghijklmnopqrstuvwxyz";
  const keyboardKeys: string[] = alphabets.split("");

  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {keyboardKeys.map((key) => {
        const isGuessed: boolean = guessedLetters.includes(key);
        const isCorrect: boolean = isGuessed && currentWord.includes(key);
        const isWrong: boolean = isGuessed && !currentWord.includes(key);

        return (
          <button
            className={cn(
              `w-[2rem] rounded-[0.18rem] h-[2rem] font-bold bg-accent disabled:opacity-15`,
              isCorrect && "bg-green-500",
              isWrong && "bg-red-500"
            )}
            disabled={disabled}
            aria-disabled={disabled || isGuessed}
            aria-label={`Letter ${key}`}
            key={key}
            onClick={() => onClick(key)}
          >
            {key.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;
