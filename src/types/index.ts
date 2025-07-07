// Types for ideationTool
export interface IdeationToolInput {
    topic: string;
    developers: number;
}

export interface IdeationToolOutput {
    message: string;
    topic: string;
    developerCount: number;
}
