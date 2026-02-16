import {
  proxyActivities,
  sleep,
  defineSignal,
  defineQuery,
  setHandler,
} from "@temporalio/workflow";
import type * as activities from "./activities";
import { CadenceStep, EnrollmentState } from "@repo/types";

const { sendEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

export const updateCadenceSignal =
  defineSignal<[CadenceStep[]]>("updateCadence");
export const getStateQuery = defineQuery<EnrollmentState>("getState");

export async function cadenceWorkflow(params: {
  cadenceId: string;
  contactEmail: string;
  steps: CadenceStep[];
}): Promise<void> {
  let { cadenceId, contactEmail, steps } = params;
  let currentStepIndex = 0;
  let stepsVersion = 1;
  let status: EnrollmentState["status"] = "RUNNING";

  setHandler(updateCadenceSignal, (newSteps) => {
    steps = newSteps;
    stepsVersion++;

    // Update rules:
    // 3. If new steps length <= currentStepIndex, mark workflow COMPLETED.
    if (steps.length <= currentStepIndex) {
      status = "COMPLETED";
    }
  });

  setHandler(getStateQuery, () => ({
    cadenceId,
    contactEmail,
    currentStepIndex,
    stepsVersion,
    status,
    steps,
  }));

  while (currentStepIndex < steps.length && status === "RUNNING") {
    const step = steps[currentStepIndex];

    if (step.type === "SEND_EMAIL") {
      await sendEmail(step.subject, step.body);
    } else if (step.type === "WAIT") {
      console.log(`Waiting ${step.seconds} seconds`);
      await sleep(step.seconds * 1000);
    }

    currentStepIndex++;
  }

  status = "COMPLETED";
}
