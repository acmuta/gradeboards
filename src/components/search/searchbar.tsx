"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";
import { titlecase } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Props = {};

export default function Searchbar() {
  const [selectedTab, setSelectedTab] = useState("grades");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tabs
      defaultValue="grades"
      className={`w-full flex justify-center items-center gap-1.5 p-1.5 border rounded-lg ${isHovered ? 'shadow-lg' : ''} transition-shadow duration-200`}
      onValueChange={(val) => setSelectedTab(val)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Popover onOpenChange={(open) => {
        setIsPopoverOpen(open);
        setIsHovered(open);
      }}>
        <PopoverTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button variant="outline" className="w-28 inline-flex justify-between items-center">
              {titlecase(selectedTab)}
              <motion.div
                animate={{ rotate: isPopoverOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown />
              </motion.div>
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-80" sideOffset={1}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grades">Grades</TabsTrigger>
              <TabsTrigger value="reviews" disabled>
                Reviews
                <Badge className="px-2 ml-2">WIP</Badge>
            </TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, x: selectedTab === "grades" ? 5 : -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: selectedTab === "grades" ? 5 : -5 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent
                  value="grades"
                  className="flex flex-col gap-2 justify-center items-center mt-0"
                >
                  <Image
                    src="https://placehold.co/320x180.png"
                    width="320"
                    height="180"
                    alt="Grades Preview"
                    className="mt-2"
                  />
                  <CardDescription className="w-full text-base">
                    Explore course grade distributions and professor ratings
                    with our popular search tool.
                  </CardDescription>
                </TabsContent>
                <TabsContent
                  value="reviews"
                  className="flex flex-col gap-2 justify-center items-center mt-0"
                >
                  <Image
                    src="https://placehold.co/320x180.png"
                    width="320"
                    height="180"
                    alt="Reviews Preview"
                    className="mt-2"
                  />
                  <CardDescription className="w-full text-base">
                    Find authentic student reviews and contribute your own on
                    professors and courses.
                  </CardDescription>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </PopoverContent>
      </Popover>

      <TabsContent value="grades" className="mt-0 w-full">
        <Input 
          type="text" 
          placeholder="Search 1..." 
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        />
      </TabsContent>
      <TabsContent value="reviews" className="mt-0 w-full">
        <Input 
          type="text" 
          placeholder="Search 2..." 
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        />
      </TabsContent>
    </Tabs>
  );
}
