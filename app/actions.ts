"use server";
import words from "@/data/words.json";

export type RandomWordResponse = {
  word?: string;
  error?: string;
};

async function generateWord(maxLength: number): Promise<string> {
  let filteredWords = words.filter((word) => word.length <= maxLength);

  if (filteredWords.length === 0) {
    throw new Error("No words found matching the criteria");
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
}

export async function fetchRandomWord(
  maxLength: number
): Promise<RandomWordResponse> {
  try {
    const word = await generateWord(maxLength);
    return { word };
  } catch (error) {
    console.error("Error fetching random word:", error);
    return { error: `${error}` };
  }
}
