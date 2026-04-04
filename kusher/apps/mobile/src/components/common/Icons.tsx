import React from 'react';
import { 
  Home, 
  BarChart2, 
  Clock, 
  User, 
  Bell, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Flame,
  Settings,
  Lightbulb,
} from 'lucide-react-native';

interface IconProps {
  color?: string;
  size?: number;
}

export const HomeIcon = ({ color, size = 24 }: IconProps) => <Home color={color} size={size} />;
export const ChartIcon = ({ color, size = 24 }: IconProps) => <BarChart2 color={color} size={size} />;
export const ClockIcon = ({ color, size = 24 }: IconProps) => <Clock color={color} size={size} />;
export const ProfileIcon = ({ color, size = 24 }: IconProps) => <User color={color} size={size} />;
export const NotificationIcon = ({ color, size = 24 }: IconProps) => <Bell color={color} size={size} />;
export const ChevronRightIcon = ({ color, size = 24 }: IconProps) => <ChevronRight color={color} size={size} />;
export const WarningIcon = ({ color, size = 24 }: IconProps) => <AlertCircle color={color} size={size} />;
export const SuccessIcon = ({ color, size = 24 }: IconProps) => <CheckCircle2 color={color} size={size} />;
export const StreakIcon = ({ color, size = 24 }: IconProps) => <Flame color={color} size={size} />;
export const SettingsIcon = ({ color, size = 24 }: IconProps) => <Settings color={color} size={size} />;
export const InsightsIcon = ({ color, size = 24 }: IconProps) => <Lightbulb color={color} size={size} />;
