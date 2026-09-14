import {
  mkdir,
  open,
  readFile,
  rename,
  unlink,
  copyFile,
} from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { databaseSchema, readDatabase, type Database } from "../domain/model";

function isCode(error: unknown, code: string) {
  return error instanceof Error && "code" in error && error.code === code;
}

export class StoreError extends Error {}

/** All read/modify/write work uses the same filesystem lock, including initialization. */
export class JsonStore {
  readonly file: string;
  readonly seed: string;
  constructor(
    file = resolve(
      /*turbopackIgnore: true*/ process.env.DEMANDS_DATA_FILE ||
        ".local/demands.json",
    ),
    seed = resolve("data/seed.json"),
  ) {
    this.file = file;
    this.seed = seed;
  }

  private async locked<T>(operation: () => Promise<T>): Promise<T> {
    await mkdir(dirname(this.file), { recursive: true });
    const lockPath = `${this.file}.lock`;
    const deadline = Date.now() + 4000;
    let lock;
    for (;;) {
      try {
        lock = await open(lockPath, "wx");
        break;
      } catch (error) {
        if (!isCode(error, "EEXIST")) throw error;
        if (Date.now() > deadline)
          throw new StoreError(
            "Os dados estão em uso. Se o servidor caiu, consulte a recuperação de trava no README.",
          );
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    }
    try {
      await lock.writeFile(
        JSON.stringify({ pid: process.pid, at: new Date().toISOString() }),
      );
      return await operation();
    } finally {
      await lock.close();
      await unlink(lockPath);
    }
  }

  private async load(path: string): Promise<Database> {
    const text = await readFile(path, "utf8");
    try {
      return readDatabase(JSON.parse(text));
    } catch {
      throw new StoreError(
        "Arquivo de dados inválido ou de outra versão. Os dados foram preservados; consulte a recuperação no README.",
      );
    }
  }

  private async write(db: Database) {
    const valid = databaseSchema.parse(db);
    const temporary = `${this.file}.${randomUUID()}.tmp`;
    try {
      const handle = await open(temporary, "wx");
      try {
        await handle.writeFile(JSON.stringify(valid, null, 2) + "\n");
        await handle.sync();
      } finally {
        await handle.close();
      }
      await rename(temporary, this.file);
    } finally {
      await unlink(temporary).catch((error) => {
        if (!isCode(error, "ENOENT")) throw error;
      });
    }
  }

  private async current(): Promise<Database> {
    try {
      return await this.load(this.file);
    } catch (error) {
      if (!isCode(error, "ENOENT")) throw error;
      const seed = await this.load(this.seed);
      await this.write(seed);
      return seed;
    }
  }

  async read(): Promise<Database> {
    return this.locked(() => this.current());
  }

  async update<T>(change: (db: Database) => T): Promise<T> {
    return this.locked(async () => {
      const db = await this.current();
      const result = change(db);
      await this.write(db);
      return structuredClone(result);
    });
  }

  async reset(): Promise<string | null> {
    return this.locked(async () => {
      const seed = await this.load(this.seed);
      const backup = `${this.file}.${Date.now()}.backup`;
      let saved: string | null = backup;
      try {
        await copyFile(this.file, backup);
      } catch (error) {
        if (!isCode(error, "ENOENT")) throw error;
        saved = null;
      }
      await this.write(seed);
      return saved;
    });
  }
}
