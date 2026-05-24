# Docker Staging Setup

## Quick Start

```bash
cd docker
docker compose -f docker-compose-staging.yml up -d --build
```

Access app at http://localhost:8100

## Data Persistence

- MySQL data: `./mysql_data`
- Redis data: `./redis_data`
