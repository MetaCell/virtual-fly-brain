# API Request Logging

This document describes the comprehensive logging system implemented for the Virtual Fly Brain REST API.

## Overview

The Flask application now includes detailed logging for all REST endpoint requests. This logging is designed to be visible in Kubernetes pod logs and provides comprehensive tracking of API usage.

## Features

### Request Tracking
- **Unique Request IDs**: Each request gets a unique identifier combining timestamp and microsecond precision
- **Complete Request Data**: Logs include all input parameters, headers, and metadata
- **Response Tracking**: Success/error status and response times are logged
- **Error Details**: Detailed error information including exception type and message

### Log Format
All logs use structured JSON format for easy parsing and analysis:

```json
{
  "request_id": "2024-01-15T10:30:45.123456_567890",
  "endpoint": "term_info",
  "method": "GET",
  "url": "http://localhost:8080/get_term_info?id=FBbt_00003624",
  "path": "/get_term_info",
  "remote_addr": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "args": {"id": "FBbt_00003624"},
  "form_data": {},
  "json_data": null,
  "content_length": null
}
```

## Logged Endpoints

The following REST endpoints are instrumented with logging:

- `GET /` - Static file serving (index.html)
- `GET /get_instances` - Get instances by short_form parameter
- `GET /get_term_info` - Get term information by id parameter
- `GET /run_query` - Run queries by id and query_type parameters

## Log Types

### REQUEST_START
Logged when a request begins processing:
- Request metadata (URL, method, headers)
- Input parameters (query args, form data, JSON body)
- Client information (IP, User-Agent)

### REQUEST_END
Logged when a request completes successfully:
- Request ID (matches REQUEST_START)
- Processing duration in milliseconds
- Response status code

### REQUEST_ERROR
Logged when a request fails:
- Request ID (matches REQUEST_START)
- Processing duration until error
- Exception type and error message

## Example Log Output

```
2024-01-15 10:30:45,123 - vfb_api - INFO - REQUEST_START: {"request_id": "2024-01-15T10:30:45.123456_567890", "endpoint": "term_info", "method": "GET", "url": "http://localhost:8080/get_term_info?id=FBbt_00003624", "path": "/get_term_info", "remote_addr": "192.168.1.100", "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36", "args": {"id": "FBbt_00003624"}, "form_data": {}, "json_data": null, "content_length": null}

2024-01-15 10:30:45,456 - vfb_api - INFO - REQUEST_END: {"request_id": "2024-01-15T10:30:45.123456_567890", "status": "SUCCESS", "duration_ms": 333.45, "response_status": 200}
```

## Kubernetes Integration

The logging is configured to write to stdout, which makes it automatically available through:

```bash
# View real-time logs
kubectl logs -f <pod-name>

# View logs with timestamps
kubectl logs --timestamps <pod-name>

# View recent logs
kubectl logs --tail=100 <pod-name>

# Follow logs for a specific container
kubectl logs -f <pod-name> -c <container-name>
```

## Log Analysis

The structured JSON format allows for easy log analysis:

```bash
# Filter for specific endpoints
kubectl logs <pod-name> | grep "get_term_info"

# Extract request IDs for debugging
kubectl logs <pod-name> | grep "REQUEST_START" | jq -r '.request_id'

# Monitor response times
kubectl logs <pod-name> | grep "REQUEST_END" | jq '.duration_ms'

# Track errors
kubectl logs <pod-name> | grep "REQUEST_ERROR"
```

## Configuration

The logging system is configured in `__main__.py`:

- **Log Level**: INFO (captures all request information)
- **Format**: Timestamped with logger name and level
- **Handler**: StreamHandler (outputs to stdout)
- **Logger Name**: `vfb_api`

## Implementation Details

The logging is implemented using a Python decorator `@log_request` that:

1. Captures request start time and generates unique ID
2. Extracts all request data (URL, parameters, headers)
3. Logs REQUEST_START with complete request information
4. Executes the endpoint function
5. Logs REQUEST_END with timing and status information
6. Handles exceptions and logs REQUEST_ERROR with error details

## Benefits

- **Production Monitoring**: Track API usage patterns and performance
- **Debugging**: Trace specific requests through the system
- **Performance Analysis**: Monitor response times and identify bottlenecks
- **Error Tracking**: Capture and analyze application errors
- **Compliance**: Maintain audit trail of API access
- **Capacity Planning**: Understand load patterns and peak usage
