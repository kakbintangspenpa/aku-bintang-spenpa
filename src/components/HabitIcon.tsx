import React from 'react';
import {
  SunMedium,
  Activity,
  Apple,
  BookOpen,
  HeartHandshake,
  Moon,
  CheckCircle2,
  HelpCircle,
  LucideProps
} from 'lucide-react';

interface HabitIconProps extends LucideProps {
  name: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'SunMedium':
      return <SunMedium {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Apple':
      return <Apple {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'HeartHandshake':
      return <HeartHandshake {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
