import { cn } from "@/lib/utils";
import { memo } from "react";
import { Badge } from "./ui/badge";

const LanguageChips = ({
  languages,
  wrongGuessCount,
}: {
  languages: string[];
  wrongGuessCount: number;
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {languages.map((lang, index) => (
        <Badge
          key={lang}
          className={cn(
            "bg-primary/50",
            index < wrongGuessCount && "opacity-50 bg-accent"
          )}
        >
          {lang}
        </Badge>
      ))}
    </div>
  );
};

export default memo(LanguageChips);
