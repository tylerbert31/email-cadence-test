import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";
import { EnrollContactDto, UpdateCadenceStepsDto } from "@repo/types";

@Controller("enrollments")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  enroll(@Body() dto: EnrollContactDto) {
    return this.enrollmentService.enroll(dto);
  }

  @Get(":id")
  getStatus(@Param("id") id: string) {
    return this.enrollmentService.getStatus(id);
  }

  @Post(":id/update-cadence")
  updateCadence(@Param("id") id: string, @Body() dto: UpdateCadenceStepsDto) {
    return this.enrollmentService.updateCadence(id, dto);
  }
}
