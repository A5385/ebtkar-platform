If Kafka and Redis are running in Docker, these are the commands I usually use to **check status, inspect containers, logs, and test connectivity**.

### 1. Check running containers

```bash
docker ps
```

Or specifically:

```bash
docker ps --filter "name=kafka"
docker ps --filter "name=redis"
```

See all containers, including stopped ones:

```bash
docker ps -a
```

### 2. Check Kafka logs

```bash
docker logs <container ID>
```

Follow logs:

```bash
docker logs -f <container ID>
```

If your container has a different name:

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

Then use the actual name.

### 3. Check Redis

Enter Redis CLI:

```bash
docker exec -it redis redis-cli
```

Then:

```redis
PING
```

Expected:

```text
PONG
```

Check Redis information:

```bash
docker exec -it redis redis-cli INFO
```

Check keys:

```bash
docker exec -it redis redis-cli KEYS '*'
```

Check memory:

```bash
docker exec -it redis redis-cli INFO memory
```

### 4. Test Kafka from inside the Kafka container

List topics:

```bash
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --list
```

Describe topics:

```bash
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --describe
```

Create a test topic:

```bash
docker exec -it kafka kafka-topics --bootstrap-server localhost:9092 --create --topic test-topic --partitions 1 --replication-factor 1
```

Produce a message:

```bash
docker exec -it kafka kafka-console-producer --bootstrap-server localhost:9092 --topic test-topic
```

Type:

```text
hello kafka
```

Then `Ctrl+C`.

Consume it:

```bash
docker exec -it kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic test-topic --from-beginning
```

You should see:

```text
hello kafka
```

### 5. Check Kafka container environment

Useful when debugging Kafka configuration:

```bash
docker exec kafka env | grep KAFKA
```

On Windows PowerShell, this also works:

```powershell
docker exec kafka env | Select-String KAFKA
```

### 6. Check Docker networking

```bash
docker network ls
```

Then:

```bash
docker network inspect <network-name>
```

This is particularly important if your **NestJS containers are trying to connect to Kafka/Redis**.

For example, inside Docker Compose, you normally use:

```text
Kafka: kafka:9092
Redis: redis:6379
```

rather than:

```text
localhost:9092
localhost:6379
```

because `localhost` from your NestJS container means **the NestJS container itself**, not Kafka/Redis.

### Quick health check

For Redis:

```bash
docker exec redis redis-cli ping
```

For Kafka:

```bash
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
```

If both return successfully, the services themselves are responding.
