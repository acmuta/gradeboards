import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-wrap">
          © 2024 Gradeboards, an <Link href="https://acmuta.com">ACM UTA Company.</Link> View project source code <Link href="https://github.com/acmuta/gradeboards" className="underline">here.</Link>
        </span>
      </div>
    </div>
  );
}
