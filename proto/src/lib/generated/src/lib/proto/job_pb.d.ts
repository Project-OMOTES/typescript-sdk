// package: 
// file: src/lib/proto/job.proto

import * as jspb from "google-protobuf";

export class JobSubmission extends jspb.Message {
  getUuid(): string;
  setUuid(value: string): void;

  hasTimeoutMs(): boolean;
  clearTimeoutMs(): void;
  getTimeoutMs(): number;
  setTimeoutMs(value: number): void;

  getWorkflowType(): string;
  setWorkflowType(value: string): void;

  getEsdl(): string;
  setEsdl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobSubmission.AsObject;
  static toObject(includeInstance: boolean, msg: JobSubmission): JobSubmission.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobSubmission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobSubmission;
  static deserializeBinaryFromReader(message: JobSubmission, reader: jspb.BinaryReader): JobSubmission;
}

export namespace JobSubmission {
  export type AsObject = {
    uuid: string,
    timeoutMs: number,
    workflowType: string,
    esdl: string,
  }
}

export class JobResult extends jspb.Message {
  getUuid(): string;
  setUuid(value: string): void;

  getResultType(): JobResult.ResultTypeMap[keyof JobResult.ResultTypeMap];
  setResultType(value: JobResult.ResultTypeMap[keyof JobResult.ResultTypeMap]): void;

  hasOutputEsdl(): boolean;
  clearOutputEsdl(): void;
  getOutputEsdl(): string;
  setOutputEsdl(value: string): void;

  getLogs(): string;
  setLogs(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobResult.AsObject;
  static toObject(includeInstance: boolean, msg: JobResult): JobResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobResult;
  static deserializeBinaryFromReader(message: JobResult, reader: jspb.BinaryReader): JobResult;
}

export namespace JobResult {
  export type AsObject = {
    uuid: string,
    resultType: JobResult.ResultTypeMap[keyof JobResult.ResultTypeMap],
    outputEsdl: string,
    logs: string,
  }

  export interface ResultTypeMap {
    SUCCEEDED: 0;
    TIMEOUT: 1;
    ERROR: 2;
  }

  export const ResultType: ResultTypeMap;
}

export class JobProgressUpdate extends jspb.Message {
  getUuid(): string;
  setUuid(value: string): void;

  getProgress(): number;
  setProgress(value: number): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobProgressUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: JobProgressUpdate): JobProgressUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobProgressUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobProgressUpdate;
  static deserializeBinaryFromReader(message: JobProgressUpdate, reader: jspb.BinaryReader): JobProgressUpdate;
}

export namespace JobProgressUpdate {
  export type AsObject = {
    uuid: string,
    progress: number,
    message: string,
  }
}

export class JobStatusUpdate extends jspb.Message {
  getUuid(): string;
  setUuid(value: string): void;

  getStatus(): JobStatusUpdate.JobStatusMap[keyof JobStatusUpdate.JobStatusMap];
  setStatus(value: JobStatusUpdate.JobStatusMap[keyof JobStatusUpdate.JobStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobStatusUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: JobStatusUpdate): JobStatusUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobStatusUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobStatusUpdate;
  static deserializeBinaryFromReader(message: JobStatusUpdate, reader: jspb.BinaryReader): JobStatusUpdate;
}

export namespace JobStatusUpdate {
  export type AsObject = {
    uuid: string,
    status: JobStatusUpdate.JobStatusMap[keyof JobStatusUpdate.JobStatusMap],
  }

  export interface JobStatusMap {
    REGISTERED: 0;
    ENQUEUED: 1;
    RUNNING: 2;
    FINISHED: 3;
    CANCELLED: 4;
  }

  export const JobStatus: JobStatusMap;
}

export class JobCancel extends jspb.Message {
  getUuid(): string;
  setUuid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobCancel.AsObject;
  static toObject(includeInstance: boolean, msg: JobCancel): JobCancel.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobCancel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobCancel;
  static deserializeBinaryFromReader(message: JobCancel, reader: jspb.BinaryReader): JobCancel;
}

export namespace JobCancel {
  export type AsObject = {
    uuid: string,
  }
}

