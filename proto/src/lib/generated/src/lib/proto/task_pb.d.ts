// package: 
// file: src/lib/proto/task.proto

import * as jspb from "google-protobuf";

export class TaskResult extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  getCeleryTaskId(): string;
  setCeleryTaskId(value: string): void;

  getCeleryTaskType(): string;
  setCeleryTaskType(value: string): void;

  getResultType(): TaskResult.ResultTypeMap[keyof TaskResult.ResultTypeMap];
  setResultType(value: TaskResult.ResultTypeMap[keyof TaskResult.ResultTypeMap]): void;

  hasOutputEsdl(): boolean;
  clearOutputEsdl(): void;
  getOutputEsdl(): Uint8Array | string;
  getOutputEsdl_asU8(): Uint8Array;
  getOutputEsdl_asB64(): string;
  setOutputEsdl(value: Uint8Array | string): void;

  getLogs(): string;
  setLogs(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskResult.AsObject;
  static toObject(includeInstance: boolean, msg: TaskResult): TaskResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskResult;
  static deserializeBinaryFromReader(message: TaskResult, reader: jspb.BinaryReader): TaskResult;
}

export namespace TaskResult {
  export type AsObject = {
    jobId: string,
    celeryTaskId: string,
    celeryTaskType: string,
    resultType: TaskResult.ResultTypeMap[keyof TaskResult.ResultTypeMap],
    outputEsdl: Uint8Array | string,
    logs: string,
  }

  export interface ResultTypeMap {
    SUCCEEDED: 0;
    ERROR: 1;
  }

  export const ResultType: ResultTypeMap;
}

export class TaskProgressUpdate extends jspb.Message {
  getJobId(): string;
  setJobId(value: string): void;

  getCeleryTaskId(): string;
  setCeleryTaskId(value: string): void;

  getCeleryTaskType(): string;
  setCeleryTaskType(value: string): void;

  getProgress(): number;
  setProgress(value: number): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskProgressUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: TaskProgressUpdate): TaskProgressUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskProgressUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskProgressUpdate;
  static deserializeBinaryFromReader(message: TaskProgressUpdate, reader: jspb.BinaryReader): TaskProgressUpdate;
}

export namespace TaskProgressUpdate {
  export type AsObject = {
    jobId: string,
    celeryTaskId: string,
    celeryTaskType: string,
    progress: number,
    message: string,
  }
}

