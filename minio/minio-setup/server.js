// const DEFAULT_RABBIT_URL = 'amqp://wajaffnk:wajaffnk@rabbitmq:5672/';

async function connect() {
  try {
    console.log("minio startup service running");
  } catch (error) {
    console.error('Error connecting to MinIO:', error);
  }
}

 await connect();
 process.exit(0)