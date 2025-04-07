import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

interface KeyboardProps {
  onClick: (key: string) => void;
  disabled: boolean;
  guessedLetters: string[];
  currentWord: string;
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const Keyboard = ({
  onClick,
  disabled,
  guessedLetters,
  currentWord,
}: KeyboardProps) => {
  const keyboardKeys = useMemo(() => ALPHABET.split(""), []);

  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {keyboardKeys.map((key) => {
        const isGuessed = guessedLetters.includes(key);
        const isCorrect = isGuessed && currentWord.includes(key);
        const isWrong = isGuessed && !currentWord.includes(key);

        const buttonClass = cn(
          "w-[2rem] rounded-[0.18rem] h-[2rem] font-bold bg-accent disabled:opacity-15",
          isCorrect && "bg-green-500",
          isWrong && "bg-red-500"
        );

        return (
          <button
            className={buttonClass}
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