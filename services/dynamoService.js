import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME;

export const saveFileData = async (fileId, fileData) => {
  const data = {
    fileId,
    ...fileData,
    fileStatus: "UPLOADED",
  };
  await dynamoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(data),
    })
  );
};

export const listFiles = async () => {
  // scan all items from dynamodb
  const response = await dynamoClient.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );
  return response.Items.map((item) => {
    return {
      fileId: item.fileId.S,
      fileName: item.fileName.S,
      uploadedAt: item.uploadedAt.S,
    };
  });
};

export const getFileItem = async (fileId) => {
  const fileItem = await dynamoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        fileId: { S: fileId },
      },
    })
  );
  // if file not found, return 404
  if (!fileItem.Item) {
    const error = new Error("File not found");
    error.statusCode = 404;
    throw error;
  }
  return unmarshall(fileItem.Item);
};
