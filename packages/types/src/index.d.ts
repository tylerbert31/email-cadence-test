export type CadenceStepType = "SEND_EMAIL" | "WAIT";
export interface BaseStep {
    id: string;
    type: CadenceStepType;
}
export interface SendEmailStep extends BaseStep {
    type: "SEND_EMAIL";
    subject: string;
    body: string;
}
export interface WaitStep extends BaseStep {
    type: "WAIT";
    seconds: number;
}
export type CadenceStep = SendEmailStep | WaitStep;
export interface Cadence {
    id: string;
    name: string;
    steps: CadenceStep[];
}
export interface EnrollmentState {
    cadenceId: string;
    contactEmail: string;
    currentStepIndex: number;
    stepsVersion: number;
    status: "RUNNING" | "COMPLETED" | "FAILED";
    steps: CadenceStep[];
}
export interface CreateCadenceDto {
    name: string;
    steps: CadenceStep[];
}
export interface EnrollContactDto {
    cadenceId: string;
    contactEmail: string;
}
export interface UpdateCadenceStepsDto {
    steps: CadenceStep[];
}
