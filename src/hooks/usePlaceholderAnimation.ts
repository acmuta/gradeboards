import { useState, useEffect } from 'react';
import { titlecase } from '@/lib/utils';
import {
  config_data as APIParams,
  data_course,
  data_term
} from "@/../public/data/grade_config.js";

export function usePlaceholderAnimation() {
  const [placeholderText, setPlaceholderText] = useState('');

  useEffect(() => {
    const courses = data_course;
    const terms = data_term;
    const instructors = APIParams.instructor;
    let isAnimating = true;

    const animatePlaceholder = async () => {
      while (isAnimating) {
        const course = courses && courses.length > 0 
          ? courses[Math.floor(Math.random() * courses.length)].toUpperCase() 
          : '';

        let placeholderParts = [course];

        if (Math.random() < 0.5 && terms && terms.length > 0) {
          const term = titlecase(terms[Math.floor(Math.random() * terms.length)]);
          const termSwapped = term.split(' ').reverse().join(' ');
          placeholderParts = [termSwapped, ...placeholderParts]
        }

        if (Math.random() < 0.5 && instructors && instructors.length > 0) {
          const instructor = titlecase(instructors[Math.floor(Math.random() * instructors.length)]);
          placeholderParts = [...placeholderParts, instructor];
        }

        const fullPlaceholder = placeholderParts.join(' ');

        for (let i = 0; i <= fullPlaceholder.length && isAnimating; i++) {
          setPlaceholderText(fullPlaceholder.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        await new Promise(resolve => setTimeout(resolve, 4000));

        for (let i = fullPlaceholder.length; i >= 0 && isAnimating; i--) {
          setPlaceholderText(fullPlaceholder.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    animatePlaceholder();

    return () => {
      isAnimating = false;
    };
  }, []);

  return placeholderText;
}