import mssql from "mssql";
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
		.input("id", mssql.Int, id)
		.query("SELECT * FROM FeatureRequests WHERE id = @id");

	return result.recordset[0];
};

const createRequest = async (title, createdBy, description) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("title", mssql.NVarChar, title)
		.input("createdBy", mssql.Int, createdBy)
		.input("description", mssql.NVarChar, description)
		.query(
			"INSERT INTO FeatureRequests (title, createdBy, description) OUTPUT.* VALUES (@title, @createdBy, @description)"
		);
	return result.recordset[0].id;
};

export { getAllRequests, getRequestById, createRequest };
