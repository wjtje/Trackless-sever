// Copyright (c) 2020 Wouter van der Wal

export default interface ServerError {
  message?: string;
  status?: number;
  code?: string;
  type?: string;
}
