export async function loadComponent(selector, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.statusText}`);
        }
        const content = await response.text();
        document.querySelector(selector).innerHTML = content;
    }   catch (error) {
        console.error(error);
        }
}
