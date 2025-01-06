# OPS API
- I decided to create two projects: one with AWS CDK to deploy the necessary resources (Lambda, S3, DynamoDB) and this one for the API service.
- I am also sending the metadata as form-data in the /upload endpoint.
- I decided to create an endpoint /files to retrieve the list of all uploaded files.
- It’s been a while since I last programmed in Node.js, so I had to rely on the AWS SDK documentation to correctly implement v3.
- There are improvements that could be made to the CDK project, such as automating the installation of dependencies for the Lambda functions.
- There are improvements that could be made to the API, such as creating a middleware for better error handling. Also improving route management.