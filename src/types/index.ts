export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  isActive: boolean;
}

export interface HeaderProps {
  title: string;
  showHelp?: boolean;
  onBackOverride?: () => void;
}

export enum SafetyRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}