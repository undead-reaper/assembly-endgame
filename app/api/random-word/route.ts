
import { NextRequest, NextResponse } from 'next/server';
import words from '@/data/words.json';

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url);
    const maxLengthParam = searchParams.get('maxLength');
    
    
    const maxLength = maxLengthParam ? parseInt(maxLengthParam, 10) : undefined;
    
    
    let filteredWords = words;
    if (maxLength && !isNaN(maxLength)) {
      filteredWords = words.filter(word => word.length <= maxLength);
    }
    
    
    if (filteredWords.length === 0) {
      return NextResponse.json(
        { error: "No words found matching the criteria" }, 
        { status: 404 }
      );
    }
    
    
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const randomWord = filteredWords[randomIndex];
    
    
    return NextResponse.json({ word: randomWord });
    
  } catch (error) {
    console.error('Error fetching random word:', error);
    return NextResponse.json(
      { error: "Failed to get random word" }, 
      { status: 500 }
    );
  }
}