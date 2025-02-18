async function getWords(page, level) {
    try {
        const response = await fetch(
            `https://jisho.org/api/v1/search/words?keyword=jlpt-n${level}&page=${page}`
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function getAllWords(level) {
    let page = 1;
    let hasMoreData = true;

    const words = [];

    while(hasMoreData) {
        const res = await getWords(page, level);

        if (res.data.length) {
            words.push(...res.data)
            page = page + 1;
        } else {
            hasMoreData = false;
        }
    }

    return words
}