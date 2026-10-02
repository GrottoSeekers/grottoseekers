// Writes that cope with an older live database.
//
// The live database was created before some columns existed, and
// `CREATE TABLE IF NOT EXISTS` never adds them later. Rather than fail a whole
// save because one optional column is missing, these helpers drop any column
// the database says it doesn't have and try again. Columns listed in
// `required` are never dropped.
import { supabase } from './supabase';

const MISSING_COL =
  /'(\w+)' column|column "?(?:\w+\.)?(\w+)"? (?:of relation "\w+" )?does not exist/;

function missingColumn(message: string | undefined): string | null {
  const m = message?.match(MISSING_COL);
  return m ? m[1] || m[2] : null;
}

type Result = { error: { message: string } | null; dropped: string[] };

async function retrying(
  row: Record<string, unknown>,
  required: string[],
  run: (row: Record<string, unknown>) => PromiseLike<{ error: any }>,
): Promise<Result> {
  const values = { ...row };
  const dropped: string[] = [];
  for (let tries = 0; tries < 25; tries++) {
    const { error } = await run(values);
    if (!error) return { error: null, dropped };
    const col = missingColumn(error.message);
    if (!col || !(col in values) || required.includes(col)) {
      return { error: { message: error.message }, dropped };
    }
    delete values[col];
    dropped.push(col);
  }
  return { error: { message: 'Too many missing columns' }, dropped };
}

/** UPDATE `table` SET values WHERE column = value, skipping missing columns. */
export function safeUpdate(
  table: string,
  values: Record<string, unknown>,
  match: [column: string, value: unknown],
  required: string[] = [],
): Promise<Result> {
  return retrying(values, required, (v) =>
    supabase.from(table).update(v).eq(match[0], match[1] as any),
  );
}

/** INSERT a row into `table`, skipping missing columns. */
export function safeInsert(
  table: string,
  values: Record<string, unknown>,
  required: string[] = [],
): Promise<Result> {
  return retrying(values, required, (v) => supabase.from(table).insert(v));
}

/** JSON columns can come back as text on the older database: read either. */
export function jsonArr(v: unknown): any[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const j = JSON.parse(v);
      return Array.isArray(j) ? j : [];
    } catch {}
  }
  return [];
}

export function jsonObj(v: unknown): Record<string, any> {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, any>;
  if (typeof v === 'string') {
    try {
      const j = JSON.parse(v);
      return j && typeof j === 'object' && !Array.isArray(j) ? j : {};
    } catch {}
  }
  return {};
}
