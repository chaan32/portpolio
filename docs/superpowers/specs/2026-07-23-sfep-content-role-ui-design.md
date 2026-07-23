# SFEP Content and Role UI Refinement

## Goal

Keep the existing SFEP portfolio design while reducing repeated information,
improving technical accuracy, and making the Role section faster to scan.

## Scope

### Overview

Reorder the overview blocks to:

1. Project Summary
2. Manufacturing Problem
3. Solution
4. Technology Tags

Shorten Project Summary to three concise paragraphs:

- Spring Boot and Kafka Event-Driven Architecture based Smart Factory backend
- JDBC Batch Insert storage optimization and ONNX Runtime prediction
- Prometheus and Grafana based performance and server monitoring

### Role

Keep Role focused on implementation ownership without quantitative results.
Use these six responsibilities:

- Event-Driven Backend Architecture
- Messaging Architecture
- Performance Optimization
- AI Integration
- Monitoring
- Benchmark

Update the UI to a compact two-column grid:

- Three rows and two columns on desktop
- One column on mobile
- Remove oversized title pills and excessive top whitespace
- Use a small blue accent line and a clear title at the top of each card
- Place the description directly below the title
- Keep card heights balanced without forcing unnecessary fixed height

### Project Highlights

- Consumer Group: `Storage / Alert 독립 처리`
- 50,000 events/sec: `로컬 Benchmark 최대 처리량`
- Keep quantitative results separate from Role

### Event-Driven Architecture

Replace the absolute isolation claim with:

> DB 저장 병목이 위험 알림 처리에 직접 전파되지 않도록 Storage Consumer Group과 Alert Consumer Group을 독립적으로 구성했습니다.

### Consumer Group

Clarify that excess consumers are allowed but idle:

> Consumer 수가 Partition 수를 초과하면 일부 Consumer는 할당받을 Partition이 없어 유휴 상태가 됩니다.

### Rolling Window

Represent statistics as parallel feature extraction:

`최근 50개 이벤트 → Mean / Max / Min / Standard Deviation / Trend → 52 Features → ONNX Runtime → Failure Probability`

### Demo

Use:

- Title: `AI 기반 실시간 설비 고장 위험 알림`
- Description: `설비별 최근 50개 이벤트에서 52개 Feature를 생성하고, ONNX 모델로 고장 확률을 예측해 위험 설비를 표시합니다.`

### Tech Stack

Remove `Swing Event Bus` from Messaging. Keep:

- Apache Kafka
- Consumer Group
- Kafka Partition
- SSE

### Benchmark Strategy

Replace the repeated introduction with one concise explanation covering:

- JDBC Batch Size
- Consumer Concurrency
- Kafka Partition
- max.poll.records
- Hikari Connection Pool
- Processing time, storage throughput, Consumer Lag, and alert latency comparison

### Why Technology

Update Consumer Group reasons to:

- Partition 기반 병렬 처리
- Storage / Alert 기능 분리
- Consumer Lag 완화
- 처리 흐름 확장성 확보

## Responsive Behavior

- Preserve the existing page width and section components.
- Collapse the Role grid to one column on narrow screens.
- Keep title and body text wrapping inside each Role card.
- Do not introduce fixed heights that create empty space.

## Verification

- Run the existing HTML/link check.
- Confirm removed phrases no longer exist.
- Confirm the updated stylesheet query invalidates browser cache.
- Inspect the SFEP page at desktop and mobile widths.
