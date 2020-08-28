
/*
 *
 * Conversation database structure:
 * {
 *      user1: user1_ptr,
 *      user2: user2_ptr,
 *      timesamp: <last time a message was sent>
 * }
 * 
 * Message database structure:
 * {
 *      text: "whatever they said...",
 *      conversation: <ptr to conversation>
 *      timestamp: <when it was sent>
 *      author: <user1_ptr or user2_ptr>
 * }
 */

/*
 * expecting a message of the format:
 * {
 *      TODO
 * }
 */
Parse.Cloud.define('send_message', async function(req, res) {
    
});


/*
 * queries all the most recent conversations that a user has
 *
 * return format:
 * {
 *      user_name: "...",
 *      last_message: "...",
 *      timestamp: <time_of_last_message>
 * }
 */
Parse.Cloud.define('get_conversations', async function(req, res) {
    const user = req.user;

    const ConvoClass = Parse.Object.extend("Conversation");
    const query1 = new Parse.Query(ConvoClass);
    const query2 = new Parse.Query(ConvoClass);
    query1.equalTo("user1", user);
    query2.equalTo("user2", user);
    const query = Parse.Query.or(query1, query2);

    const convos = await query.find({ useMasterKey: true });

    let convo_list = Promise.all(convos.map(async (convo) => {
        let otherUserPtr;
        if (convo.get("user1").equals(user)) {
            otherUserPtr = convo.get("user2");
        }
        else {
            otherUserPtr = convo.get("user1");
        }

        const otherQuery = new Parse.Query(Parse.User);
        otherQuery.equalTo("objectId", otherUserPtr.id);
        let other = await otherQuery.find({ useMasterKey: true });
        let otherName = other.get("username");

        lastMessageAt = convo.get("timestamp");

        return {
            user_name: otherName,
            last_message: "not yet implemented",
            timestamp: lastMessageAt
        };
    }));

    return convo_list;
});


/*
 * queries all the most recent messages within a given conversation
 *
 * return format:
 * 
 */
Parse.Cloud.define('get_messages', async function(req, res) {

});


Parse.Cloud.define('create_random_convo', async function(req, res) {
    const ConvoClass = Parse.Object.extend("Conversation");

    const user1q = new Parse.Query(Parse.User);
    user1q.equalTo("objectId", "PbY2FyGu1g");
    let user1 = await user1q.find({ useMasterKey: true });
    const user2q = new Parse.Query(Parse.User);
    user2q.equalTo("objectId", "c7loOCLvrj");
    let user2 = await user2q.find({ useMasterKey: true });

    let convo = new ConvoClass();
    convo.set("user1", user1[0]);
    convo.set("user2", user2[0]);
    convo.set("timestamp", new Date());

    convo.save();
});
