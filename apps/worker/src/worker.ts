import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "./activities";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows"),
    activities,
    taskQueue: "email-cadence-queue",
    // LOCAL DEVELOPMENT
    connection: await NativeConnection.connect({
      address: "localhost:7233",
    }),
    namespace: "default",
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
