import { Int, NVarChar } from "mssql";
import getPool from "../database/config.mjs";

const getAllRequests = async () => {
	const pool = await getPool();
	const result = await pool.request().query("SELECT * FROM FeatureRequests");

	return result.recordset;
};

const getRequestById = async (id) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("id", Int, id)
		.query("SELECT * FROM FeatureRequests WHERE id = @id");

	return result.recordset[0];
};

const createRequest = async (title, createdBy) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("title", NVarChar, title)
		.input("createdBy", Int, createdBy)
		.query(
			"INSERT INTO FeatureRequests (title, createdBy) OUTPUT.id VALUES (@title, @createdBy)"
		);
	return result.recordset[0].id;
};
