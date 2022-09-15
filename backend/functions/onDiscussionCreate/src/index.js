const sdk = require("node-appwrite");

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200
  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  const data = JSON.parse(req.variables['APPWRITE_FUNCTION_EVENT_DATA'] ?? '{}');

  const userId = req.variables['APPWRITE_FUNCTION_USER_ID'];
  const discussionId = data.$id;

  console.log("📝 User:", userId);
  console.log("📝 Discussion:", discussionId);

  const database = new sdk.Databases(client);

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.warn("⚠️ Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);
  }

  console.log("🤖 Updating discussion ...");
  await database.updateDocument("main", "discussions", discussionId, {
    userId,
    tagsSearch: data.tags.join(" "),
    totalNegative: 0,
    totalPositive: 0
  }, [
    // This ensures proper permission on document. Update is not allowed
    sdk.Permission.delete(sdk.Role.user(userId)),
    sdk.Permission.read(sdk.Role.user(userId)), // Read needed because of bug in Appwrite - to delete, you also need read when documentSecurity=true
  ]);

  console.log("🥳 Done");

  res.json({
    done: true
  });
};
