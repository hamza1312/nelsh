import {int, text, sqliteTable, numeric} from 'drizzle-orm/sqlite-core';
import {nanoid} from "nanoid";


const timestamp = (n: string) => int(n, { mode: "timestamp" });
const bool = (n: string) => int(n, { mode: "boolean" });

const idLike = (s: string) => text(s, { length: 21 });

const idPrimary = idLike("id")
    .notNull()
    .primaryKey()

const createdAt = timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull();

const updatedAt = timestamp("updated_at").$onUpdateFn(() => new Date());


export const file = sqliteTable("file", {
    id: idPrimary,
    userId: text("user_id").notNull(),
    fileName: text("file_name").notNull(),
    extension: text("extension").notNull(),
    iv: text("iv").notNull(),
    size: int("size").notNull(),


    createdAt,
    updatedAt,
})