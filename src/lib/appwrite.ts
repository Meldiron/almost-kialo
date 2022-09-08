import { Client, Account, Avatars, Locale } from "appwrite";
import { accountStore } from "./accountStore";
import Swal from 'sweetalert2';
import { loadingStore } from "./loadingStore";
import { page } from "$app/stores";
import { get } from "svelte/store";

const client = new Client();

client
    .setEndpoint('https://matej10.appwrite.org/v1')
    .setProject('almostKialo');

const account = new Account(client);
const avatars = new Avatars(client);
const locale = new Locale(client);

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


    getLanguages: async () => {
        return await displayError(async () => {
            return (await locale.getLanguages()).languages;
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

};