import mssql from "mssql";
import getPool from "../database/config.mjs";

const getAllIssues = async () => {
	const pool = await getPool();
	const result = await pool.request().query(`
        SELECT 
            Issues.id,
            Issues.title,
            Issues.description,
            Issues.status,
            Issues.createdBy,
            Issues.createdAt,
            Issues.updatedAt,
            COUNT(IssueComments.id) AS commentCount
        FROM 
            Issues
        LEFT JOIN 
            IssueComments ON Issues.id = IssueComments.issueId
        GROUP BY 
            Issues.id, Issues.title, Issues.description, Issues.status, 
            Issues.createdBy, Issues.createdAt, Issues.updatedAt`);

	return result.recordset;
};

const getIssueById = async (id) => {
	const pool = await getPool();
	const result = await pool.request().input("id", mssql.Int, id).query(`
        SELECT 
            Issues.id AS issueId,
            Issues.title AS issueTitle,
            Issues.description AS issueDescription,
            Issues.status AS issueStatus,
            Issues.createdBy AS issueCreatedBy,
            Issues.createdAt AS issueCreatedAt,
            Issues.updatedAt AS issueUpdatedAt,
            IssueComments.id AS commentId,
            IssueComments.comment AS commentText,
            IssueComments.createdBy AS commentCreatedBy,
            IssueComments.createdAt AS commentCreatedAt,
            IssueComments.updatedAt AS commentUpdatedAt
        FROM 
            Issues
        LEFT JOIN 
            IssueComments ON Issues.id = IssueComments.issueId
        WHERE 
            Issues.id = @issueId
        ORDER BY 
            IssueComments.createdAt;
        `);

	if (result.recordset.length === 0) {
		throw new Error("Issue not found");
	}

	const issue = {
		issueId: result.recordset[0].issueId,
		title: result.recordset[0].issueTitle,
		description: result.recordset[0].issueDescription,
		status: result.recordset[0].issueStatus,
		createdBy: result.recordset[0].issueCreatedBy,
		createdAt: result.recordset[0].issueCreatedAt,
		updatedAt: result.recordset[0].issueUpdatedAt,
		comments: result.recordset
			.filter((row) => row.commentId)
			.map((row) => ({
				commentId: row.commentId,
				text: row.commentText,
				createdBy: row.commentCreatedBy,
				createdAt: row.commentCreatedAt,
				updatedAt: row.commentUpdatedAt,
			})),
	};

	return issue;
};

const createIssue = async ({
	title,
	description = null,
	severity,
	createdBy,
}) => {
	const pool = await getPool();
	const result = await pool
		.request()
		.input("title", mssql.NVarChar(255), title)
		.input("description", mssql.NVarChar(1000), description)
		.input("severity", mssql.NVarChar(50), severity)
		.input("createdBy", mssql.Int, createdBy).query(`
            INSERT INTO Issues (
                title, 
                description, 
                severity
                createdBy
            )
            OUTPUT INSERTED.*
            VALUES (
                @title, 
                @description, 
                @createdBy
            );
        `);

	return result.recordset[0];
};

export { getAllIssues, getIssueById, createIssue };
