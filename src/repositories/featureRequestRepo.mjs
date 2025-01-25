import mssql from "mssql";
import getPool from "../database/config.mjs";

const getAllRequests = async (userId) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("userId", mssql.Int, userId)
		.query(
			`SELECT 
				fr.id, 
				fr.title, 
				fr.description, 
				fr.status, 
				fr.createdAt, 
				u.username AS createdByName, 
				ISNULL(SUM(fv.vote), 0) AS voteCount,
				ISNULL((
					SELECT fv.vote
					FROM FeatureVotes fv
					WHERE fv.featureId = fr.id AND fv.userId = @userId
				), 0) AS userVote
			FROM 
				FeatureRequests fr
			LEFT JOIN 
				FeatureVotes fv ON fr.id = fv.featureId
			INNER JOIN 
				Users u ON fr.createdBy = u.id
			GROUP BY 
				fr.id, fr.title, fr.description, fr.status, fr.createdAt, u.username;`
		);

	return result.recordset;
};

const getRequestById = async (id) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("id", mssql.Int, id)
		.query(
			`SELECT 
				FR.id AS featureRequestId, 
				FR.title, 
				FR.description, 
				FR.status, 
				FR.createdAt, 
				U.username AS createdByName 
			FROM FeatureRequests FR 
			JOIN Users U ON FR.createdBy = U.id 
			WHERE FR.id = @id`
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
			`INSERT INTO FeatureRequests (title, createdBy, description) 
			OUTPUT INSERTED.* 
			VALUES (@title, @createdBy, @description)`
		);
	return result.recordset[0];
};

export { getAllRequests, getRequestById, createRequest };
