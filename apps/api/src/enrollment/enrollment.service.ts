import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { WorkflowClient } from "@temporalio/client";
import {
  EnrollContactDto,
  EnrollmentState,
  UpdateCadenceStepsDto,
} from "@repo/types";
import { CadenceService } from "../cadence/cadence.service";

@Injectable()
export class EnrollmentService {
  constructor(
    @Inject("TEMPORAL_CLIENT") private readonly temporalClient: WorkflowClient,
    private readonly cadenceService: CadenceService,
  ) {}

  async enroll(dto: EnrollContactDto) {
    const cadence = this.cadenceService.findOne(dto.cadenceId);

    const workflowId = `enrollment-${dto.contactEmail}-${Date.now()}`;

    const handle = await this.temporalClient.start("cadenceWorkflow", {
      taskQueue: "email-cadence-queue",
      workflowId,
      args: [
        {
          cadenceId: cadence.id,
          contactEmail: dto.contactEmail,
          steps: cadence.steps,
        },
      ],
    });

    return { enrollmentId: handle.workflowId };
  }

  async getStatus(id: string): Promise<EnrollmentState> {
    const handle = this.temporalClient.getHandle(id);
    try {
      return await handle.query("getState");
    } catch (e) {
      throw new NotFoundException("Enrollment not found or workflow expired");
    }
  }

  async updateCadence(id: string, dto: UpdateCadenceStepsDto) {
    const handle = this.temporalClient.getHandle(id);
    await handle.signal("updateCadence", dto.steps);
    return { success: true };
  }
}
