export const jsonToBinary = (json: any): Buffer => {
  try {
    const jsonString = JSON.stringify(json);
    return Buffer.from(jsonString, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to convert JSON to binary: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const binaryToJson = (buffer: Buffer): any => {
  try {
    const jsonString = buffer.toString('utf-8');
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Failed to convert binary to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const textToBinary = (text: string, encoding: BufferEncoding = 'utf-8'): Buffer => {
  try {
    return Buffer.from(text, encoding);
  } catch (error) {
    throw new Error(`Failed to convert text to binary: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const binaryToText = (buffer: Buffer, encoding: BufferEncoding = 'utf-8'): string => {
  try {
    return buffer.toString(encoding);
  } catch (error) {
    throw new Error(`Failed to convert binary to text: ${error instanceof Error ? error.message : String(error)}`);
  }
};