/** @type {import('./$types').PageLoad} */
export function load({ params }: any) {
    return {
        langId: params.langId
    };
}