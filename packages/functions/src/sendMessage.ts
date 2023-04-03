import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyHandler } from "aws-lambda";
import { AttributeMap } from "aws-sdk/clients/dynamodb";

const TableName = Table.WSConnections.tableName;
const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
	console.log(event.body);
	const messageData = JSON.parse(event.body!).data;
	const { stage, domainName } = event.requestContext;

	const apiG = new ApiGatewayManagementApi({
		endpoint: `${domainName}/${stage}`,
	});

	// Handler for when client asks for code
	if (messageData === "GET_CODE") {
		const conn = await dynamoDb
			.get({ TableName, Key: {id: event.requestContext.connectionId} })
			.promise();
		await apiG
			.postToConnection({
				ConnectionId: event.requestContext.connectionId as string,
				Data: parseInt(conn.Item!.clientCode).toString(36).toUpperCase()
			})
			.promise();
		return { statusCode: 200, body: "Message sent" };
	}

	// Cleanup
	// Get all the connections
	const connections = await dynamoDb
		.scan({ TableName, ProjectionExpression: "id" })
		.promise();
	const postToConnection = async function (value: AttributeMap) {
		try {
			// Send the message to the given client
			await apiG
				.postToConnection({ ConnectionId: value.id as string, Data: "PING" })
				.promise();
		} catch (e: any) {
			if (e.statusCode === 410) {
				// Remove stale connections
				await dynamoDb.delete({ TableName, Key: {id: value.id as string} }).promise();
			}
		}
	};
	// Iterate through all the connections
	await Promise.all(connections.Items!.map(postToConnection));

	return { statusCode: 200, body: "Message sent" };
};