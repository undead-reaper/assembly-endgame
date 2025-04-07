"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Gamepad, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Keyboard from "@/components/Keyboard";
import { Button } from "@/components/ui/button";
import { cn, getFarewellText, useIsMounted } from "@/lib/utils";
import ReactConfetti from "react-confetti";

const languages: string[] = [
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

const GameArea = () => {
  const [currentWord, setCurrentWord] = React.useState<string>("");
  const splitWord = currentWord!.split("");
  const [guessedLetters, setGuessedLetters] = React.useState<string[]>([]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const isMounted = useIsMounted();

  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount: number = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  useEffect(() => fetchRandomWord(7), []);

  function fetchRandomWord(maxLength?: number) {
    setLoading(true);
    fetch(`/api/random-word/?maxLength=${maxLength}`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentWord(data.word);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching random word:", error);
        setLoading(false);
      });
  }

  () => fetchRandomWord(7);

  const isGameWon: boolean = splitWord.every((letter) =>
    guessedLetters.includes(letter)
  );
  const isGameLost: boolean = wrongGuessCount >= numGuessesLeft;
  const isGameOver: boolean = isGameWon || isGameLost;
  const farewellText: string = getFarewellText(languages[wrongGuessCount - 1]);
  const lastGuess: string = guessedLetters[guessedLetters.length - 1];
  const isLastGuessWrong: boolean =
    lastGuess !== undefined && !currentWord.includes(lastGuess);

  function handleKeyClick(key: string) {
    const isGuessed: boolean = guessedLetters.includes(key);
    setGuessedLetters((prev) => {
      if (isGuessed) {
        return prev;
      } else {
        return [...prev, key];
      }
    });
  }

  function handlePlayAgain() {
    fetchRandomWord(7);
    setGuessedLetters([]);
  }

  const cardContent: () => React.JSX.Element = () => {
    return (
      <>
        {isGameWon && <ReactConfetti recycle={false} numberOfPieces={1000} />}
        <CardHeader>
          <CardTitle>Assembly: Endgame</CardTitle>
          <CardDescription>
            Guess the word in under 8 attempts to keep the programming world
            safe from Assembly!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert
            variant={isGameLost ? "destructive" : "default"}
            className="mb-5"
            aria-live="polite"
            role="status"
          >
            <Info />
            <AlertTitle>
              {isGameWon
                ? "Congratulations, you won!"
                : isGameLost
                ? "Oh no, you lost!"
                : isLastGuessWrong
                ? farewellText
                : "Keep guessing!"}
            </AlertTitle>
            <AlertDescription>
              {isGameWon
                ? "You guessed the word! The programming world is safe. Play again?"
                : isGameLost
                ? "You lost! Assembly is taking over the world!"
                : isLastGuessWrong
                ? "Don't worry, you can still win!"
                : "You are doing great!"}
            </AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-2 justify-center">
            {languages.map((lang, index) => {
              const isLost: boolean = index < wrongGuessCount;

              return (
                <Badge
                  key={lang}
                  className={cn(
                    "bg-primary/50",
                    isLost && "opacity-50 bg-accent"
                  )}
                >
                  {lang}
                </Badge>
              );
            })}
          </div>

          {/* Comnbined visually-hidden aria-live region for status updates*/}
          <div className="sr-only" aria-live="polite" role="status">
            <p>
              {currentWord.includes(lastGuess)
                ? `Correct! The letter ${lastGuess} is in the word.`
                : `Sorry! The letter ${lastGuess} is not in the word.`}
              You have {numGuessesLeft} guesses left.
            </p>
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
              const isGuessed: boolean = guessedLetters.includes(letter);
              const shouldRevealLetter: boolean = isGuessed || isGameOver;

              return (
                <span
                  className={cn(
                    "bg-accent/75 w-[2rem] h-[2rem] items-center flex justify-center font-bold border-b border-accent-foreground",
                    isGuessed && isGameWon && "text-green-500",
                    isGameOver && !isGuessed && "text-red-500"
                  )}
                  key={index}
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
  };

  return (
    <div className="flex flex-col w-full max-w-[400px] max-h-[700px] h-full p-5">
      <Card className="h-full w-full">
        {isMounted && !loading ? (
          cardContent()
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="animate-spin text-primary" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default GameArea;
