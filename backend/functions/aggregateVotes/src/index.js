const sdk = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - object with request body data
    'env' - object with environment variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  console.log("📝 Time:", new Date().toISOString());

  const database = new sdk.Databases(client);

  if (
    !req.env['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.env['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.warn("⚠️ Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.env['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.env['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.env['APPWRITE_FUNCTION_API_KEY']);
  }

  console.log("🤖 Getting all discussions ...");

  const getAllPages = async (cursor = undefined) => {
    const queries = [
      sdk.Query.limit(100)
    ];

    if (cursor) {
      queries.push(sdk.Query.cursorAfter(cursor));
    }

    const response = await database.listDocuments('main', 'discussions', queries);

    const documents = response.documents;

    if (documents.length <= 0) {
      return [];
    }

    const lastId = documents[documents.length - 1].$id;

    return [
      ...documents.map((d) => d.$id),
      ...(await getAllPages(lastId))
    ];
  };

  const allDiscussionIds = await getAllPages();

  console.log("🤖 Found " + allDiscussionIds.length + " discussions");

  console.log("🤖 Aggregating discussions ...");

  for (const discussionId of allDiscussionIds) {
    const positiveDiscussions = await database.listDocuments('main', 'discussions', [sdk.Query.limit(1), sdk.Query.equal('parentId', discussionId), sdk.Query.equal('isNegative', false)]);
    const negativeDiscussions = await database.listDocuments('main', 'discussions', [sdk.Query.limit(1), sdk.Query.equal('parentId', discussionId), sdk.Query.equal('isNegative', true)]);

    await database.updateDocument('main', 'discussions', discussionId, {
      totalNegative: negativeDiscussions.total,
      totalPositive: positiveDiscussions.total
    });
  }

  console.log("🥳 Done");

  res.json({
    done: true
  });
};
