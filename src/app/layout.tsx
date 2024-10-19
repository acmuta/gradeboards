import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"
 
import { cn } from "@/lib/utils"
import Link from "next/link";
import Navbar from "@/components/navigation/navbar";
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
}) 

export const metadata: Metadata = {
  title: "UTA Grades",
  description: "A tool to view grade distributions, professor info, and grade balancing recommendations at UT Arlington. An ACM Gradeboards project.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
			<body className={`${fontSans.className} antialiased`}>
				<div className="bg-gray-100 dark:bg-gray-900 min-h-screen relative">
						<header className="w-full sticky top-0 bg-white dark:bg-gray-800 shadow">
							<Navbar />
						</header>

						<main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between p-24">{children}</main>

					<footer className="w-full bottom-0 bg-white dark:bg-gray-800 shadow mt-8">
						<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
							<div className="flex justify-between items-center">
								<p className="text-sm text-gray-500 dark:text-gray-400 inline-flex gap-1">
									© 2024 Gradeboards, an 
									<Link href="https://acmuta.com">
										ACM UTA Project
									</Link>
									. View project source code{" "}
									<Link
										href="https://github.com/lryanle/handydandy"
										className="underline"
									>
										here
									</Link>
									.
								</p>
							</div>
						</div>
					</footer>
				</div>
			</body>
		</html>
  )
}