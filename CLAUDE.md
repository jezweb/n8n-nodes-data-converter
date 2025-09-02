# Claude Development Instructions

## Project Overview

This is an n8n community node for comprehensive data conversion operations. The node provides a single interface for Base64, Binary, Format conversions, HTML generation, and text encoding operations.

## Development Guidelines

### Code Style and Standards

1. **TypeScript First**
   - Use strict type checking
   - Define interfaces for all data structures
   - Avoid `any` types where possible

2. **Simplicity Over Complexity**
   - Each operation should do one thing well
   - Avoid over-engineering
   - Keep functions pure when possible
   - Modular architecture

3. **Error Handling**
   - Always validate inputs
   - Provide clear error messages
   - Include recovery suggestions
   - Support `continueOnFail` pattern

### Project Structure

```
n8n-nodes-data-converter/
├── nodes/DataConverter/       # Main node implementation
├── utils/                     # Operation utilities
├── types/                     # TypeScript definitions
└── docs/                      # Documentation
```

### Making Changes

1. **Adding New Operations**
   - Add utility function to appropriate module
   - Update type definitions
   - Add to node properties
   - Update documentation
   - Test thoroughly

2. **Modifying Existing Operations**
   - Maintain backward compatibility
   - Update tests
   - Update documentation
   - Consider version bump

### Testing Guidelines

1. **Before Committing**
   - Run `npm run build`
   - Run `npm run lint`
   - Test in n8n locally
   - Check error cases

2. **Test Coverage**
   - Valid inputs
   - Invalid inputs
   - Edge cases
   - Large data handling
   - Error conditions

### Git Workflow

1. **Commit Messages**
   - Use conventional commits
   - Be descriptive
   - Reference issues if applicable

2. **Commit Strategy**
   - Atomic commits
   - Logical groupings
   - Build should pass at each commit

### Documentation Requirements

1. **Code Comments**
   - Document complex logic
   - Explain non-obvious decisions
   - Include examples for utilities

2. **User Documentation**
   - Keep README current
   - Update CHANGELOG for changes
   - Include examples

### Performance Considerations

1. **Memory Usage**
   - Stream large files when possible
   - Clean up buffers
   - Avoid memory leaks

2. **Processing Efficiency**
   - Optimize hot paths
   - Use appropriate data structures
   - Consider async operations

### Security Guidelines

1. **Input Validation**
   - Never trust user input
   - Validate sizes
   - Check for injection attacks
   - Sanitize outputs

2. **Dependencies**
   - Keep minimal
   - Regular updates
   - Security audits

### n8n Specific Requirements

1. **Node Properties**
   - Clear display names
   - Helpful descriptions
   - Logical groupings
   - Good defaults

2. **AI Agent Compatibility**
   - Always set `usableAsTool: true`
   - Clear operation descriptions
   - Predictable behavior
   - Structured outputs

### Common Patterns

1. **Resource-Based Structure**
```typescript
resource: ['base64', 'binary', 'format', 'html', 'encoding']
operation: ['specific operations per resource']
```

2. **Error Handling**
```typescript
try {
  // Operation
} catch (error) {
  if (this.continueOnFail()) {
    return { error: error.message };
  }
  throw new NodeOperationError(this.getNode(), error.message);
}
```

3. **Input Processing**
```typescript
const input = this.getNodeParameter('input', itemIndex) as string;
if (!input) {
  throw new NodeOperationError(this.getNode(), 'Input is required');
}
```

### Publishing Checklist

- [ ] Version bump in package.json
- [ ] Update CHANGELOG.md
- [ ] Run full test suite
- [ ] Build successful
- [ ] Documentation updated
- [ ] Git tag created
- [ ] Push to GitHub
- [ ] Publish to npm

### Maintenance

1. **Regular Updates**
   - Dependency updates
   - Security patches
   - n8n compatibility

2. **Issue Management**
   - Respond promptly
   - Reproduce issues
   - Fix and test
   - Update documentation

### Future Enhancements

Consider these for future versions:
- Streaming for large files
- Compression operations
- Additional format support
- Performance optimizations
- Batch processing improvements

## Development Commands

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev

# Lint
npm run lint

# Format code
npm run format

# Local testing
npm link
cd ~/.n8n/custom
npm link n8n-nodes-data-converter
```

## Important Notes

- Keep operations focused and simple
- Prioritize user experience
- Maintain backward compatibility
- Document everything
- Test edge cases
- Consider performance implications
- Follow n8n best practices