import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";

const GameCardHeader = () => {
  return (
    <CardHeader>
      <CardTitle>Assembly: Endgame</CardTitle>
      <CardDescription>
        Guess the word in under 8 attempts to keep the programming world safe
        from Assembly!
      </CardDescription>
    </CardHeader>
  );
};

export default memo(GameCardHeader);
