import { ApiGatewayManagementApi, DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const TableName = Table.WSConnections.tableName;
const dynamoDb = new DynamoDB.DocumentClient();

function randomInRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min) + min);
}

const CODE_MIN = parseInt("1000", 36);
const CODE_MAX = parseInt("ZZZZ", 36);

function genCode() {
	return randomInRange(CODE_MIN, CODE_MAX);
}

export const main: APIGatewayProxyHandler = async (event, context, callback) => {
	// Consultant
	if (event.queryStringParameters?.consultant === "yes") {
		const params = {
			TableName: Table.WSConnections.tableName,
			ProjectionExpression: "id, clientCode"
		};
		if (!event.queryStringParameters?.code) {
			return { statusCode: 400, body: "BadRequest" };
		}

		const code = parseInt(event.queryStringParameters.code, 36);
		// console.log(code);

		const res1 = await dynamoDb.scan(params).promise();
		// console.log(res1);
		let valid = false;
		let targetId = "";
		for (const elem of res1.Items!) {
			if (parseInt(elem.clientCode) === code) {
				valid = true;
				targetId = elem.id;
				break;
			}
		}
		if (!valid) {
			return { statusCode: 404, body: "NoClient" };
		}
		// console.log(targetId);
		const params2 = {
			TableName: Table.WSConnections.tableName,
			Item: {
				id: event.requestContext.connectionId,
				clientCode: null,
				clientId: targetId
			},
		};
		// console.log("We're back")
		// console.log(event.requestContext.connectionId)
		// console.log(code)

		await dynamoDb.put(params2).promise();
	}
	// Client
	else {
		const code = genCode();
		const params = {
			TableName: Table.WSConnections.tableName,
			Item: {
				id: event.requestContext.connectionId,
				clientCode: JSON.stringify(genCode()),
				clientId: null
			},
		};
		// console.log("We're back")
		// console.log(event.requestContext.connectionId)
		// console.log(code)

		await dynamoDb.put(params).promise();
	}

	return { statusCode: 200, body: "Connected" };
};