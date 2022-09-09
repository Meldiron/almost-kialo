import { Client, Account, Avatars, Locale, Databases, ID } from "appwrite";
import { accountStore } from "./accountStore";
import Swal from 'sweetalert2';
import { loadingStore } from "./loadingStore";
import { page } from "$app/stores";
import { get } from "svelte/store";
import { langsStore } from "./langsStore";

const client = new Client();

client
    .setEndpoint('https://matej10.appwrite.org/v1')
    .setProject('almostKialo');

const account = new Account(client);
const avatars = new Avatars(client);
const locale = new Locale(client);
const database = new Databases(client);

const displayError = async (cb: any) => {
    try {
        loadingStore.set(true);
        const res = await cb();
        return res;
    } catch (err: any) {
        Swal.fire("Something Went Wrong!", err.message ? err.message : err.toString(), "error");
        console.error(err);
    } finally {
        loadingStore.set(false);
    }

    return null;
};

export const AppwriteService = {
    login: async () => {
        loadingStore.set(true);

        const redirectUrl = window.location.href;

        account.createOAuth2Session("github", redirectUrl, redirectUrl)
    },


    logout: async () => {
        return await displayError(async () => {
            const res = await account.deleteSession('current');
            await AppwriteService.fetchAccount();
            return res;
        });
    },

    setProfile: async (nickname: string) => {
        return await displayError(async () => {
            const prefs = await account.getPrefs();
            const res = await account.updatePrefs({
                ...prefs,
                profile: {
                    nickname: nickname
                }
            });
            await AppwriteService.fetchAccount();
            return res;
        });
    },

    getProfile: async (userId: string) => {
        return await displayError(async () => {
            return await database.getDocument('main', 'profiles', userId);
        });
    },

    createDiscussion: async (title: string, description: string, parentId: string = '_noParent', languageCode: string, isNegative: boolean, tags: string[]) => {
        return await displayError(async () => {
            const user = await account.get();
            const userId = user.$id;

            const discussion = await database.createDocument('main', 'discussions', ID.unique(), {
                userId,
                title,
                description,
                parentId,
                isNegative,
                tags,
                tagsSearch: tags.join(" "),
                languageCode,
                totalPositive: 0,
                totalNegative: 0
            });

            return discussion;
        });
    },

    getDiscussions: async (queries: string[]) => {
        return await displayError(async () => {
            return database.listDocuments('main', 'discussions', queries);
        });
    },

    getDiscussion: async (id: string) => {
        return await displayError(async () => {
            return database.getDocument('main', 'discussions', id);
        });
    },

    deleteDiscussion: async (id: string) => {
        return await displayError(async () => {
            return database.deleteDocument('main', 'discussions', id);
        });
    },

    getLanguageFromCode: (languageCode: string) => {
        const lang = (get(langsStore) ?? []).find((l) => l.code === languageCode);
        return lang?.name ?? 'Unknown';
    },

    fetchLanguages: async () => {
        return await displayError(async () => {
            const languages = (await locale.getLanguages()).languages;
            langsStore.set(languages);
        });
    },

    fetchAccount: async () => {
        try {
            const acc = await account.get();
            accountStore.set(acc);
            return acc;
        } catch (err) {
            console.warn(err);
            accountStore.set(null);
            return null;
        }
    },

    getFlag: (country: string) => {
        return avatars.getFlag(country).toString();
    },

    getProfilePicture: (name: string) => {
        return avatars.getInitials(name, 64, 64).toString();
    },

};