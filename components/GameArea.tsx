"use client";

import { fetchRandomWord, RandomWordResponse } from "@/app/actions";
import Keyboard from "@/components/Keyboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getFarewellText, useIsMounted } from "@/lib/utils";
import { Gamepad, Info, Loader2 } from "lucide-react";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useTransition,
} from "react";
import ReactConfetti from "react-confetti";
import { toast } from "sonner";
import GameCardHeader from "./GameCardHeader";
import LanguageChips from "./LanguageChips";

const LANGUAGES = [
  "JavaScript",
  "Python",
  "TypeScript",
  "Rust",
  "Go",
  "Kotlin",
  "C#",
  "Swift",
  "Assembly",
];

const MAX_WORD_LENGTH = 7;

const GameArea = () => {
  const [currentWord, setCurrentWord] = React.useState("");
  const [guessedLetters, setGuessedLetters] = React.useState<string[]>([]);
  const [isFetchingWord, startFetchingTransition] = useTransition();
  const isMounted = useIsMounted();

  const fetchWord = useCallback(async () => {
    const length = MAX_WORD_LENGTH;
    startFetchingTransition(async () => {
      const result: RandomWordResponse = await fetchRandomWord(length);
      if (result.error) {
        console.error("Error fetching word:", result.error);
        toast.error("Failed to fetch a word. Please try again.", {
          description: result.error,
        });
        setCurrentWord("");
      } else {
        setCurrentWord(result.word!);
      }
    });
  }, []);

  useEffect(() => {
    fetchWord();
  }, []);

  const handlePlayAgain = useCallback(() => {
    fetchWord();
  }, [fetchWord]);

  const handleKeyClick = useCallback((key: string) => {
    setGuessedLetters((prev) => {
      if (prev.includes(key)) {
        return prev;
      }
      return [...prev, key];
    });
  }, []);

  const splitWord = useMemo(() => currentWord.split(""), [currentWord]);

  const numGuessesLeft = LANGUAGES.length - 1;

  const wrongGuessCount = useMemo(
    () =>
      guessedLetters.filter((letter) => !currentWord.includes(letter)).length,
    [guessedLetters, currentWord]
  );

  const isGameWon = useMemo(
    () =>
      currentWord &&
      splitWord.every((letter) => guessedLetters.includes(letter)),
    [splitWord, guessedLetters, currentWord]
  );

  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;

  const lastGuess = guessedLetters[guessedLetters.length - 1];
  const isLastGuessWrong =
    lastGuess !== undefined && !currentWord.includes(lastGuess);

  const farewellText = isLastGuessWrong
    ? getFarewellText(LANGUAGES[wrongGuessCount - 1])
    : "";

  const getGameStatusMessages = useMemo(() => {
    if (isGameWon) {
      return {
        title: "Congratulations, you won!",
        description:
          "You guessed the word! The programming world is safe. Play again?",
      };
    } else if (isGameLost) {
      return {
        title: "Oh no, you lost!",
        description: "You lost! Assembly is taking over the world!",
      };
    } else if (isLastGuessWrong) {
      return {
        title: farewellText,
        description: "Don't worry, you can still win!",
      };
    } else {
      return {
        title: "Keep guessing!",
        description: "You are doing great!",
      };
    }
  }, [isGameWon, isGameLost, isLastGuessWrong, farewellText]);

  const renderCardContent = () => (
    <>
      {isGameWon && <ReactConfetti recycle={false} numberOfPieces={1000} />}
      <GameCardHeader />
      <CardContent>
        <Alert
          variant={isGameLost ? "destructive" : "default"}
          className="mb-5"
          aria-live="polite"
          role="status"
        >
          <Info />
          <AlertTitle>{getGameStatusMessages.title}</AlertTitle>
          <AlertDescription>
            {getGameStatusMessages.description}
          </AlertDescription>
        </Alert>

        <LanguageChips
          languages={LANGUAGES}
          wrongGuessCount={wrongGuessCount}
        />

        {/* Screen reader only status updates */}
        <div className="sr-only" aria-live="polite" role="status">
          {lastGuess && (
            <p>
              {currentWord.includes(lastGuess)
                ? `Correct! The letter ${lastGuess} is in the word.`
                : `Sorry! The letter ${lastGuess} is not in the word.`}
              You have {numGuessesLeft - wrongGuessCount} guesses left.
            </p>
          )}
          <p>
            Current word:{" "}
            {splitWord
              .map((letter) =>
                guessedLetters.includes(letter) ? letter + "." : "blank."
              )
              .join(" ")}
          </p>
        </div>

        <div className="flex flex-wrap text-center gap-1 gap-y-2 justify-center mt-10">
          {splitWord.map((letter, index) => {
            const isGuessed = guessedLetters.includes(letter);
            const shouldRevealLetter = isGuessed || isGameOver;

            return (
              <span
                className={cn(
                  "bg-accent/75 w-[2rem] h-[2rem] items-center flex justify-center font-bold border-b border-accent-foreground",
                  isGuessed && isGameWon && "text-green-500",
                  isGameOver && !isGuessed && "text-red-500"
                )}
                key={`${letter}-${index}`}
              >
                {shouldRevealLetter ? letter.toUpperCase() : ""}
              </span>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-center mt-10">
          <Keyboard
            onClick={handleKeyClick}
            disabled={isGameOver}
            guessedLetters={guessedLetters}
            currentWord={currentWord}
          />
          {isGameOver && (
            <Button
              onClick={handlePlayAgain}
              className="absolute z-10 sm:relative sm:mt-8"
            >
              <Gamepad />
              Play Again
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );

  return (
    <div className="flex flex-col w-full max-w-[400px] max-h-[700px] h-full p-5">
      <Card className="h-full w-full">
        {isMounted && !isFetchingWord ? (
          renderCardContent()
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="animate-spin text-primary" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default memo(GameArea);