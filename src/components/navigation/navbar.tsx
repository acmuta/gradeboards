


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { universityConfig } from "@/lib/utils"
import Image from "next/image"

export default function Navbar() {
  const uni = universityConfig()
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-1">
            <Image
              className="h-12 w-auto"
              src={`${uni.university_logo[1]}`}
              alt="Logo"
              width={72}
              height={72}
            />
            <h1 className="text-3xl font-bold" style={{ color: uni.primary_color }}>{uni.university_short_name} Grades</h1>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col items-end mr-3">
              <span className="text-sm font-medium text-foreground">Ryan Lahlou</span>
              <Badge variant="secondary" className="text-xs">Student</Badge>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Ryan Lahlou" />
              <AvatarFallback>RL</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  )
}
