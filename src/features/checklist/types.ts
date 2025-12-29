export type TaskPhase = 'planificacion' | 'llegada';

export interface TaskDetails {
    requirements?: string[];
    options?: string[];
    costs?: string;
    tips?: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    phase: TaskPhase;
    completed: boolean;
    link?: string;
    isSystem?: boolean;
    details?: TaskDetails;
}
