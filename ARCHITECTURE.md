# Architecture Documentation

## Overview

The n8n-nodes-data-converter is a modular, extensible data conversion node for n8n. It follows n8n's best practices while maintaining a clean separation of concerns.

## Design Principles

1. **Modularity**: Each conversion type is isolated in its own module
2. **Simplicity**: Operations do one thing well
3. **Extensibility**: Easy to add new conversion types
4. **Error Resilience**: Comprehensive error handling with clear messages
5. **Performance**: Efficient memory usage and streaming where possible

## Project Structure

```
n8n-nodes-data-converter/
├── nodes/
│   └── DataConverter/
│       ├── DataConverter.node.ts      # Main node definition
│       └── dataconverter.svg          # Node icon
├── utils/
│   ├── Base64Operations.ts            # Base64 conversion utilities
│   ├── BinaryOperations.ts            # Binary data handling
│   ├── FormatOperations.ts            # Format conversions (JSON/XML/YAML/CSV)
│   ├── HtmlOperations.ts              # HTML generation
│   └── EncodingOperations.ts          # Text encoding utilities
├── types/
│   └── DataConverterTypes.ts          # TypeScript type definitions
└── docs/                               # Documentation

```

## Component Architecture

### Main Node (DataConverter.node.ts)

The main node file implements the n8n INodeType interface:

```typescript
export class DataConverter implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Data Converter',
    name: 'dataConverter',
    icon: 'file:dataconverter.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: 'Convert between various data formats',
    defaults: { name: 'Data Converter' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [],
    usableAsTool: true,
    properties: [...]
  }
}
```

### Resource-Based Operations

The node uses a resource-based structure for organization:

1. **Base64**: Text/Binary/JSON encoding and decoding
2. **Binary**: Binary data transformations
3. **Format**: JSON/XML/YAML/CSV conversions
4. **HTML**: HTML generation from data
5. **Encoding**: URL/HTML/Hex encoding

### Utility Modules

Each utility module exports pure functions for specific operations:

#### Base64Operations.ts
```typescript
export const base64Encode = (input: string): string => { ... }
export const base64Decode = (input: string): string => { ... }
export const base64EncodeBinary = (buffer: Buffer): string => { ... }
export const base64DecodeBinary = (input: string): Buffer => { ... }
```

#### FormatOperations.ts
```typescript
export const jsonToXml = (json: any): string => { ... }
export const xmlToJson = (xml: string): any => { ... }
export const jsonToYaml = (json: any): string => { ... }
export const yamlToJson = (yaml: string): any => { ... }
```

## Data Flow

1. **Input Processing**
   - Node receives input data from previous node
   - Validates input based on selected operation
   - Extracts relevant fields

2. **Conversion**
   - Routes to appropriate utility function
   - Performs conversion with error handling
   - Validates output

3. **Output Generation**
   - Formats result based on operation type
   - Adds metadata if needed
   - Returns to n8n workflow

## Error Handling Strategy

### Validation Errors
- Input validation before processing
- Clear error messages with examples
- Suggest corrections

### Conversion Errors
- Try-catch blocks around all conversions
- Preserve original data on failure
- Support continueOnFail option

### Error Message Format
```typescript
throw new NodeOperationError(
  this.getNode(),
  `Invalid ${format}: ${error.message}`,
  { description: 'Check that your input is valid ${format} format' }
);
```

## Performance Considerations

### Memory Management
- Stream processing for large files where possible
- Efficient buffer handling for binary operations
- Cleanup after processing

### Optimization Strategies
- Lazy loading of heavy dependencies
- Caching compiled schemas/parsers
- Batch processing support

## Extension Points

### Adding New Operations

1. Create utility function in appropriate module:
```typescript
// utils/NewOperations.ts
export const newConversion = (input: any): any => {
  // Implementation
}
```

2. Add operation to node properties:
```typescript
{
  name: 'New Conversion',
  value: 'newConversion',
  description: 'Convert X to Y'
}
```

3. Add case in execute function:
```typescript
case 'newConversion':
  result = newConversion(inputData);
  break;
```

## Dependencies

### Core Dependencies
- `js-yaml`: YAML parsing and generation
- `xml2js`: XML to JSON conversion
- `csv-parse`/`csv-stringify`: CSV operations
- `marked`: Markdown to HTML conversion

### Peer Dependencies
- `n8n-workflow`: Core n8n types and utilities

## Security Considerations

### Input Sanitization
- All inputs validated before processing
- Size limits for large inputs
- Protection against malicious payloads

### Safe Defaults
- Conservative parsing options
- No code execution from user input
- Sandboxed operations

## Testing Strategy

### Unit Tests
- Test each utility function independently
- Edge cases and error conditions
- Type safety validation

### Integration Tests
- Full workflow testing
- Resource combinations
- Error propagation

## Version Management

### Semantic Versioning
- MAJOR: Breaking changes to operations
- MINOR: New operations or features
- PATCH: Bug fixes and improvements

### Backward Compatibility
- Maintain operation signatures
- Deprecate before removing
- Migration guides for breaking changes