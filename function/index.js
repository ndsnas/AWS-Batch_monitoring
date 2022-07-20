const Influx = require("influx");
async function exporter(event, context, callback) {
  console.log("***EVENT***", JSON.stringify(event));
  let res = {
    statusCode: 200,
    body: "Success",
  };

  const influxURL = "https://influx-url:8086";
  const influx = new Influx.InfluxDB(influxURL);
  influx
    .writePoints(
      [
        {
          measurement: "batch_job_status",
          tags: {
            job_id: event.detail?.jobId,
            job_name: event.detail?.jobName,
            status: event.detail?.status,
            job_queue: event.detail?.jobQueue,
          },
          fields: {
            job_definition: event.detail?.jobDefinition,
            status_reason: event.detail?.statusReason,
            log_stream: event.detail?.container?.logStreamName,
          },
        },
      ],
      {
        database: "batchStatusDB",
      }
    )
    .catch((error) => {
      res = {
        statusCode: 500,
        body: "Fail",
        description: error.stack,
      };
      console.error(`Error saving data to InfluxDB! ${error.stack}`);
    });

  console.log("Finish");

  callback(null, res);
}

module.exports = {
  exporter,
};
