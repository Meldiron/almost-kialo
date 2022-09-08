/** @type {import('./$types').PageLoad} */
export function load({ params }: any) {
    return {
        tagId: params.tagId
    };
}