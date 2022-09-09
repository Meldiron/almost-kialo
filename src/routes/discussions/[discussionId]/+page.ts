/** @type {import('./$types').PageLoad} */
export function load({ params }: any) {
    return {
        discussionId: params.discussionId
    };
}