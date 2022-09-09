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

  const data = JSON.parse(req.env['APPWRITE_FUNCTION_EVENT_DATA'] ?? '{}');

  const discussionId = data.$id;

  console.log("📝 Discussion:", discussionId);

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

  console.log("🤖 Listing sub-discussion ...");

  const getAllPages = async (parentId, cursor = undefined) => {
    const queries = [
      sdk.Query.limit(100),
      sdk.Query.equal('parentId', parentId)
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
      ...(await getAllPages(parentId, lastId))
    ];
  };

  const getSubDiscussions = async (parentId) => {
    const allDiscussionIds = await getAllPages(parentId);

    if (allDiscussionIds.length <= 0) {
      return [];
    }

    const allChildren = [];

    for (const allDiscussionId of allDiscussionIds) {
      allChildren.push(...(await getSubDiscussions(allDiscussionId)));
    }

    return [
      ...allDiscussionIds,
      ...allChildren
    ];
  }

  const discussionIds = [...new Set(await getSubDiscussions(discussionId))];

  console.log("🤖 Found " + discussionIds.length + " sub-discussions");

  console.log(discussionIds);

  console.log("🤖 Deleting all sub-discussion ...");

  for (const discussionId of discussionIds) {
    await database.deleteDocument('main', 'discussions', discussionId);
  }

  console.log("🥳 Done");

  res.json({
    done: true
  });
};
