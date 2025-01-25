import mssql from "mssql";
import getPool from "../database/config.mjs";

const getVote = async (featureId, userId) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("featureId", mssql.Int, featureId)
		.input("userId", mssql.Int, userId)
		.query(
			"SELECT * FROM FeatureVotes WHERE featureId = @featureId AND userId = @userId"
		);
	return result.recordset[0];
};

const addVote = async (featureId, userId, vote) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("featureId", mssql.Int, featureId)
		.input("userId", mssql.Int, userId)
		.input("vote", mssql.Int, vote)
		.query(
			"INSERT INTO FeatureVotes (featureId, userId, vote) OUTPUT INSERTED.* VALUES (@featureId, @userId, @vote)"
		);

	return result.recordset[0];
};

const deleteVote = async (id) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("id", mssql.Int, id)
		.query("DELETE FROM FeatureVotes WHERE id = @id");

	return result.rowsAffected[0] === 1 ? true : false;
};

const updateVote = async (id, vote) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("id", mssql.Int, id)
		.input("vote", mssql.Int, vote)
		.query("UPDATE FeatureVotes SET vote = @vote WHERE id = @id");

	return result.rowsAffected[0] === 1 ? true : false;
};

export { getVote, addVote, deleteVote, updateVote };
