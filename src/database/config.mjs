import sql from "mssql";

const config = {
	user: "bendik",
	password: "12345",
	database: "FeatureFlow",
	server: "DESKTOP-96H53G4",
	options: {
		trustServerCertificate: true,
	},
	port: 1433,
};

let poolPromise;
export default async function getPool() {
	if (!poolPromise) {
		try {
			poolPromise = await sql.connect(config);
			console.log("Connected to SQL Server");
		} catch (err) {
			console.error("Database connection failed: ", err.message);
			throw new Error("Failed to connect to the database.");
		}
	}
	return poolPromise;
}
