import mssql from "mssql";
import getPool from "../database/config.mjs";

const getAllRequests = async () => {
	const pool = await getPool();
	const result = await pool
		.request()
		.query(
			"SELECT FR.*, U.username AS createdByName FROM FeatureRequests FR JOIN Users U ON FR.createdBy = U.id"
		);

	return result.recordset;
};

const getRequestById = async (id) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("id", mssql.Int, id)
		.query(
			"SELECT FR.*, U.username AS createdByName FROM FeatureRequests FR JOIN Users U ON FR.createdBy = U.idWHERE id = @id"
		);

	return result.recordset[0];
};

const createRequest = async ({ title, createdBy, description }) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("title", mssql.NVarChar, title)
		.input("createdBy", mssql.Int, createdBy)
		.input("description", mssql.NVarChar, description)
		.query(
			"INSERT INTO FeatureRequests (title, createdBy, description) OUTPUT INSERTED.* VALUES (@title, @createdBy, @description)"
		);
	return result.recordset[0];
};

export { getAllRequests, getRequestById, createRequest };
