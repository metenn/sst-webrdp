import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyHandler } from "aws-lambda";
import { AttributeMap } from "aws-sdk/clients/dynamodb";

const TableName = Table.WSConnections.tableName;
const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
	// console.log(event.body);
	const messageData = JSON.parse(event.body!).data;
	const { stage, domainName } = event.requestContext;

	const apiG = new ApiGatewayManagementApi({
		endpoint: `${domainName}/${stage}`,
	});

	// Handler for when client asks for code
	const conn = await dynamoDb
		.get({ TableName, Key: { id: event.requestContext.connectionId } })
		.promise();
	// console.log(conn);
	if (conn.Item!.clientCode) {
		const query = await dynamoDb
			.scan({ TableName, ProjectionExpression: "id, clientId" })
			.promise();
		for(const item of query.Items!) {
			if (item.clientId === event.requestContext.connectionId) {
				console.log(item);
				await apiG
					.postToConnection({ ConnectionId: item.id as string, Data: messageData })
					.promise();
				break;
			}
		}
		console.log(query);
	}
	else {
		await apiG
			.postToConnection({ ConnectionId: conn.Item!.clientId as string, Data: messageData })
			.promise();
	}

	return { statusCode: 200, body: "Message sent to peer" };
};