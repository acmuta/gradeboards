import React from "react";
import { Users } from "lucide-react";
import SplitBadge from "@/components/grades/split-badge";
import { classSize } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Table } from "@/components/ui/table";

type Props = {
  studentCount: number | number[];
};

export default function StudentCard({ studentCount }: Props) {
  const students = Array.isArray(studentCount)
    ? Math.round(studentCount.reduce((a, b) => a + b, 0) / studentCount.length)
    : studentCount;

  return (
    <SplitBadge
      size="lg"
      icon={<Users className="h-4 w-4" />}
      tooltip={
        <div className="flex flex-col items-start gap-2">
          <span className="leading-none inline-flex justify-start items-center gap-1 text-base">
            <span className="text-muted-foreground">{`${
              typeof studentCount === "number"
                ? "Class Size"
                : "Average Class Size"
            }: `}</span>
            <span className="">{students}</span>
          </span>

          <Separator orientation="horizontal" className="w-full" />

          <Table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-center">Size</th>
                <th className="text-center">Students</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">XXXS</td>
                <td className="text-center">1-4</td>
              </tr>
              <tr>
                <td className="text-center">XXS</td>
                <td className="text-center">5-9</td>
              </tr>
              <tr>
                <td className="text-center">XS</td>
                <td className="text-center">10-19</td>
              </tr>
              <tr>
                <td className="text-center">Small</td>
                <td className="text-center">20-29</td>
              </tr>
              <tr>
                <td className="text-center">Medium</td>
                <td className="text-center">30-59</td>
              </tr>
              <tr>
                <td className="text-center">Large</td>
                <td className="text-center">60-99</td>
              </tr>
              <tr>
                <td className="text-center">XL</td>
                <td className="text-center">100-149</td>
              </tr>
              <tr>
                <td className="text-center">XXL</td>
                <td className="text-center">150-199</td>
              </tr>
              <tr>
                <td className="text-center">XXXL</td>
                <td className="text-center">200+</td>
              </tr>
            </tbody>
          </Table>
        </div>
      }
    >
      {classSize(students)}
    </SplitBadge>
  );
}
