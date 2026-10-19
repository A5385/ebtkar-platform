// src\packages\infra\src\kafka-client.ts
import { createEnvInstance } from '@org/env';
import { Consumer, EachMessagePayload, Kafka, ProducerRecord } from 'kafkajs';

const env = createEnvInstance(process.env);

const brokers = [`${env.get('KAFKA_HOST') || '127.0.0.1'}:${env.get('KAFKA_PORT') || '9092'}`];

const clientId = 'org-kafka-client';

const kafkaClient = new Kafka({
    clientId,
    brokers,
});

const kafkaProducer = kafkaClient.producer();

const connectKafkaProducer = async (): Promise<void> => {
    await kafkaProducer.connect();
};

const disconnectKafkaProducer = async (): Promise<void> => {
    await kafkaProducer.disconnect();
};

const publishKafkaEvent = async (props: ProducerRecord): Promise<void> => {
    await kafkaProducer.send(props);
};

type KafkaConsumerOptions = {
    topic: string;
    groupId: string;
    onMessage: (payload: EachMessagePayload) => Promise<void>;
};

const startKafkaConsumer = async ({
    topic,
    groupId,
    onMessage,
}: KafkaConsumerOptions): Promise<Consumer> => {
    const consumer = kafkaClient.consumer({
        groupId,
    });

    await consumer.connect();

    await consumer.subscribe({
        topic,
        fromBeginning: false,
    });

    await consumer.run({
        eachMessage: onMessage,
    });

    return consumer;
};

export {
    connectKafkaProducer,
    disconnectKafkaProducer,
    kafkaClient,
    kafkaProducer,
    publishKafkaEvent,
    startKafkaConsumer,
};
export type { KafkaConsumerOptions };
