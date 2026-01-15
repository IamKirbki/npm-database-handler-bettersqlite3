import { BetterSqlite3TableSchemaBuilder } from "./BetterSqlite3TableSchemaBuilder.js";
import BetterSqlite3Adapter from "./BetterSqlite3Adapter.js";
import { AbstractSchemaBuilder } from "@iamkirbki/database-handler-core";

export class BetterSqlite3SchemaBuilder implements AbstractSchemaBuilder {
    // eslint-disable-next-line no-unused-vars
    constructor(private _adapter: BetterSqlite3Adapter){}

    // eslint-disable-next-line no-unused-vars
    async createTable(name: string, callback: (table: BetterSqlite3TableSchemaBuilder) => void) {
        const tableBuilder = new BetterSqlite3TableSchemaBuilder();
        callback(tableBuilder);

        const cols = tableBuilder.build();
        const query = `CREATE TABLE ${name} ${cols}`;
        
        const statement = await this._adapter.prepare(query);
        statement.run();
    }

    async dropTable(name: string, cascade?: boolean): Promise<void> {
        const query = `DROP TABLE IF EXISTS ${name}`;
        // eslint-disable-next-line no-undef
        if (cascade) console.warn("SQLite does not support CASCADE on DROP TABLE. Ignoring cascade option.");
        const statement = await this._adapter.prepare(query);
        statement.run();
    }

    // eslint-disable-next-line no-unused-vars
    async alterTable(_oldName: string, _callback: (table: BetterSqlite3TableSchemaBuilder) => void): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // // eslint-disable-next-line no-unused-vars
    // async alterTable(oldName: string, callback: (table: BetterSqlite3TableSchemaBuilder) => void) {
    //     const tableBuilder = new BetterSqlite3TableSchemaBuilder();
    //     callback(tableBuilder);
        
    //     const cols = tableBuilder.build();
    //     const query = `ALTER TABLE ${oldName} ${cols}`;
    //     const statement = await this._adapter.prepare(query);
    //     statement.run();
    // }
}