import { Module } from "@nestjs/common";
import { TemporalModule } from "./temporal/temporal.module";
import { CadenceController } from "./cadence/cadence.controller";
import { CadenceService } from "./cadence/cadence.service";
import { EnrollmentController } from "./enrollment/enrollment.controller";
import { EnrollmentService } from "./enrollment/enrollment.service";

@Module({
  imports: [TemporalModule],
  controllers: [CadenceController, EnrollmentController],
  providers: [CadenceService, EnrollmentService],
})
export class AppModule {}
