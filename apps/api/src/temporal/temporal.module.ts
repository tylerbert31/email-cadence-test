import { Module, Global } from "@nestjs/common";
import { Connection, WorkflowClient } from "@temporalio/client";

@Global()
@Module({
  providers: [
    {
      provide: "TEMPORAL_CLIENT",
      useFactory: async () => {
        const connection = await Connection.connect({
          address: "localhost:7233", // Placeholder Temporal Server Address
        });
        return new WorkflowClient({
          connection,
          namespace: "default", // Placeholder Namespace
        });
      },
    },
  ],
  exports: ["TEMPORAL_CLIENT"],
})
export class TemporalModule {}
