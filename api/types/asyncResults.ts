import { Result } from "neverthrow";

export type AsyncResult<T, E> = Promise<Result<T, E>>;
