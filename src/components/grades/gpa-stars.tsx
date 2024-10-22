import React from "react"
import { cn, gpaToStars } from "@/lib/utils"
import { Sparkles, Star, StarHalf } from "lucide-react"

type GPAStarsProps = {
  gpa: number;
  size: "sm" | "lg";
  className?: string;
}

export default function GPAStars({ gpa, size, className }: GPAStarsProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {Array.from({
        length: Math.floor(gpaToStars(gpa || 0)),
      }).map((_, index) =>
        index === 0 && gpaToStars(gpa || 0) >= 4 ? (
          <Sparkles
            key={index}
            size={size === "lg" ? 20 : 12}
            className="inline-block text-orange-400 fill-current"
          />
        ) : (
          <Star
            key={index}
            size={size === "lg" ? 20 : 12}
            className="inline-block text-orange-400 fill-current"
          />
        )
      )}
      {gpaToStars(gpa || 0) % 1 !== 0 && gpaToStars(gpa || 0) !== 3.5 && (
        <div className="relative inline-block">
          <Star size={size === "lg" ? 20 : 12} className="text-zinc-300 fill-current" />
          <StarHalf
            size={size === "lg" ? 20 : 12}
            className="absolute top-0 left-0 text-orange-400 fill-current"
          />
        </div>
      )}
      {Array.from({
        length: Math.floor(3 - gpaToStars(gpa || 0)),
      }).map((_, index) => (
        <Star
          key={index}
          size={size === "lg" ? 20 : 12}
          className="inline-block text-zinc-300 fill-current"
        />
      ))}
    </div>
  )
}