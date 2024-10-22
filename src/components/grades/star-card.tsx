import { Star, StarHalf, Sparkles } from "lucide-react";
import { gpaToStars } from "@/lib/utils";
import SplitBadge from "@/components/grades/split-badge";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/ui/table";
import GPAStars from "@/components/grades/gpa-stars";
interface StarCardProps {
  gpa: number;
  size?: "sm" | "lg";
}

export default function StarCard({ gpa, size = "sm" }: StarCardProps) {

  return (
    <SplitBadge
      leftContent="Score"
      size={size}
      tooltip={
        <div className="flex flex-col items-start gap-2">
          <span className="leading-none inline-flex justify-start items-center gap-1 text-base">
            <span className="text-muted-foreground">Average GPA: </span>
            <span className="">{Number(gpa).toFixed(2)}</span>
          </span>
          <Separator orientation="horizontal" className="w-full" />
          <Table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-center pr-4">Stars</th>
                <th className="text-center">GPA Range</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pr-4"><GPAStars gpa={2.00} size="sm" /></td>
                <td className="text-center">2.10 - 2.35</td>
              </tr>
              <tr>
                <td className="pr-4"><GPAStars gpa={2.25} size="sm" /></td>
                <td className="text-center">2.35 - 2.60</td>
              </tr>
              <tr>
                <td className="pr-4"><GPAStars gpa={2.50} size="sm" /></td>
                <td className="text-center">2.60 - 2.85</td>
              </tr>
              <tr>
                <td className="pr-4"><GPAStars gpa={2.75} size="sm" /></td>
                <td className="text-center">2.85 - 3.10</td>
              </tr>
              <tr>
                <td className="pr-4"><GPAStars gpa={3.00} size="sm" /></td>
                <td className="text-center">3.10 - 3.35</td>
              </tr>
              <tr>
                <td className="pr-4"><GPAStars gpa={3.25} size="sm" /></td>
                <td className="text-center">3.35 - 3.60</td>
              </tr>
              <tr>
                <td className="pr-4"><GPAStars gpa={3.50} size="sm" /></td>
                <td className="text-center">3.60 - 3.99</td>
              </tr>
              {Number(gpa) === 4.00 && (
                <tr>
                  <td className="pr-4"><GPAStars gpa={4.00} size="sm" /></td>
                  <td className="text-center">4.00</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      }
    >
      <GPAStars gpa={gpa} size={size === "lg" ? "lg" : "sm"} className="gap-1" />
    </SplitBadge>
  );
}
