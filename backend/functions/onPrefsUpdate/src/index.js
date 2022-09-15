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

  const userId = data.$id;

  console.log("📝 User:", userId);

  const nickname = (data.prefs?.profile?.nickname ?? 'Anonymous').slice(0, 255);

  console.log("📝 Nickname:", nickname);

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

  let profile = null;

  try {
    profile = await database.getDocument("main", "profiles", userId);
  } catch (err) {
    console.log(err);
    // 404
  }

  if (profile) {
    console.log("🤖 Updating profile ...");
    await database.updateDocument("main", "profiles", userId, {
      nickname
    });
  } else {
    console.log("🤖 Creating profile ...");
    await database.createDocument("main", "profiles", userId, {
      nickname
    });
  }

  console.log("🥳 Done");

  res.json({
    done: true
  });
};
