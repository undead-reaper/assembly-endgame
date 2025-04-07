// app/api/random-word/route.ts
import { NextRequest, NextResponse } from 'next/server';
import words from '@/data/words.json';

export async function GET(request: NextRequest) {
  try {
    // Get the maxLength parameter from the URL, if provided
    const { searchParams } = new URL(request.url);
    const maxLengthParam = searchParams.get('maxLength');
    
    // Parse maxLength as a number if provided
    const maxLength = maxLengthParam ? parseInt(maxLengthParam, 10) : undefined;
    
    // Filter words by maxLength if specified
    let filteredWords = words;
    if (maxLength && !isNaN(maxLength)) {
      filteredWords = words.filter(word => word.length <= maxLength);
    }
    
    // Check if we have any words after filtering
    if (filteredWords.length === 0) {
      return NextResponse.json(
        { error: "No words found matching the criteria" }, 
        { status: 404 }
      );
    }
    
    // Select a random word from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const randomWord = filteredWords[randomIndex];
    
    // Return the random word
    return NextResponse.json({ word: randomWord });
    
  } catch (error) {
    console.error('Error fetching random word:', error);
    return NextResponse.json(
      { error: "Failed to get random word" }, 
      { status: 500 }
    );
  }
}