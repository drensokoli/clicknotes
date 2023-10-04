import { encryptData } from "./crypto";

export async function notionApiKeySubmit(notionApiKey: any, userEmail: any, cryptoKey: string) {
    try {
        const encryptedNotionApiKey = encryptData(notionApiKey, cryptoKey);
        const response = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail,
                notionApiKey: encryptedNotionApiKey,
            }),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function moviesLinkSubmit(link: string, userEmail: any, cryptoKey: string) {
    try {
        const extractedValue = extractValueFromUrl(link);
        const encryptedValue = encryptData(extractedValue, cryptoKey);
        const response = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail,
                moviesPageLink: encryptedValue,
            }),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function tvShowsLinkSubmit(link: string, userEmail: any, cryptoKey: string) {
    try {
        const extractedValue = extractValueFromUrl(link);
        const encryptedValue = encryptData(extractedValue, cryptoKey);
        const response = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail,
                tvShowsPageLink: encryptedValue,
            }),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function booksLinkSubmit(link: string, userEmail: any, cryptoKey: string) {
    try {
        const extractedValue = extractValueFromUrl(link);
        const encryptedValue = encryptData(extractedValue, cryptoKey);
        const response = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail,
                booksPageLink: encryptedValue,
            }),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function extractValueFromUrl(url: string) {
    const regex = /([a-f0-9]{32})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}