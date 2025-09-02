# Changelog

All notable changes to n8n-nodes-data-converter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2025-01-02

### Fixed
- **Remove Special Characters**: Added "Keep Filename Characters" option to preserve dots, hyphens, and underscores
  - Fixes issue where file extensions were lost when removing special characters from filenames
  - Option is available in both single operation and "Apply Multiple Operations" modes
  - Preserves: dots (.) for extensions, hyphens (-) and underscores (_) for filename separators

## [0.3.0] - 2025-01-02

### Added
- **Apply Multiple Operations** feature for String resource:
  - Chain multiple string operations in a single transformation
  - Sortable operations list with drag-and-drop reordering
  - Configurable options per operation (truncate length, padding settings, etc.)
  - Support for all 14 string operations in sequence
  - Operations are applied in the order specified by the user
- Enhanced flexibility for complex text processing pipelines
- Example use cases:
  - Remove special characters → Convert to snake_case
  - Normalize whitespace → Slugify → Truncate
  - Clean filename → Convert to kebab-case → Pad text

### Changed
- String resource operations are now more flexible while maintaining backward compatibility
- All single operations continue to work exactly as before

## [0.2.0] - 2025-01-02

### Added
- New String resource with comprehensive text transformation capabilities:
  - **Filename cleaning**: Remove/replace unsafe characters for file systems
  - **Case conversions**: Title, Camel, Kebab, Snake, Upper, Lower Case
  - **Text slugification**: Create URL-friendly slugs from any text
  - **Whitespace normalization**: Clean up extra spaces, tabs, and line breaks
  - **Special character removal**: Keep only letters and numbers
  - **Text manipulation**: Capitalize first, reverse text, truncate, pad text
- Full AI agent compatibility for all string operations

### Changed
- Reorganized resource options in alphabetical order for better usability
- Updated ESLint compliance for n8n node standards

## [0.1.1] - 2024-09-02

### Fixed
- Fixed node icon not displaying in n8n interface by ensuring SVG file is copied to dist directory during build

## [0.1.0] - 2024-01-02

### Added

#### 🎉 Initial Release
- First public release of n8n-nodes-data-converter
- Comprehensive data conversion capabilities in a single node

#### 📦 Base64 Operations
- Text to Base64 encoding
- Base64 to Text decoding
- Binary to Base64 conversion
- Base64 to Binary conversion
- JSON to Base64 encoding
- Base64 to JSON decoding
- Data URL creation from binary/text
- Data URL parsing with MIME type extraction

#### 🔄 Binary Operations
- JSON to Binary conversion
- Binary to JSON parsing
- Text to Binary encoding
- Binary to Text decoding
- Efficient buffer handling

#### 📄 Format Conversions
- JSON to XML transformation
- XML to JSON parsing
- JSON to YAML conversion
- YAML to JSON parsing
- JSON to CSV export
- CSV to JSON import
- JSON to Markdown formatting
- CSV to Markdown table generation

#### 🌐 HTML Generation
- JSON to HTML table creation
- JSON to HTML list generation
- CSV to HTML table conversion
- Markdown to HTML rendering
- Customizable styling options

#### 🔤 Encoding Operations
- URL encoding and decoding
- HTML entity encoding and decoding
- Hexadecimal encoding and decoding
- Support for various character sets

#### 🤖 AI Agent Compatibility
- Full support for AI agent usage (`usableAsTool: true`)
- Clear operation descriptions
- Structured input/output examples
- Predictable error handling

#### 📚 Documentation
- Comprehensive README with examples
- Architecture documentation
- Deployment guide
- Development instructions (CLAUDE.md)

### Technical Details
- Built with TypeScript for type safety
- Modular architecture for maintainability
- Comprehensive error handling
- Support for `continueOnFail` option
- Minimal external dependencies
- Optimized for performance

## [Unreleased]

### Planned Features
- Streaming support for large files
- Compression operations (gzip, zip)
- Additional format support (TOML, INI)
- Batch processing optimizations
- Custom delimiter support for CSV
- Pretty-printing options for JSON/XML
- Schema validation for conversions

### Under Consideration
- WebAssembly acceleration for heavy operations
- Caching for repeated conversions
- Progress indicators for long operations
- Preview mode for large files
- Integration with cloud storage services

---

## Version Guidelines

- **MAJOR** version: Incompatible API changes
- **MINOR** version: New functionality in a backward compatible manner
- **PATCH** version: Backward compatible bug fixes

## Reporting Issues

Please report issues on [GitHub](https://github.com/jezweb/n8n-nodes-data-converter/issues)