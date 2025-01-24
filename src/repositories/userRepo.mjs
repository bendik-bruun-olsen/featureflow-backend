import { NVarChar, Int } from "mssql";
import getPool from "../database/config.mjs";

const getAllUsers = async () => {
	const pool = await getPool();
	const result = await pool
		.request()
		.query("SELECT userId, firstName, lastName, email FROM Users");

	return result.recordset;
};

const getUserById = async (userId) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("userId", Int, userId)
		.query(
			"SELECT userId, firstName, lastName, email FROM Users WHERE userId = @userId"
		);

	return result.recordset;
};

const getUserByEmail = async (email) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("email", NVarChar, email)
		.query("SELECT * FROM Users WHERE LOWER(email) = LOWER(@email)");

	return result.recordset[0];
};

const createUser = async ({ username, email, password }) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("username", NVarChar, username)
		.input("email", NVarChar, email)
		.input("password", NVarChar, password)
		.query(
			"INSERT INTO Users (username, email, password) OUTPUT INSERTED.id VALUES (@username, @email, @password)"
		);
	return result.recordset[0].id;
};

export { getAllUsers, getUserById, getUserByEmail, createUser };
