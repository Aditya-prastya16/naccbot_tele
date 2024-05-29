
const TelegramBot = require("node-telegram-bot-api")
const token = "6764327046:AAFypQ9b_FaeRSpvEbP_C7yMIFfV19Kw9es";
const options = {
    polling : true
}

const naccbot = new TelegramBot(token, options )


const prefix = "."
const sayHi = new RegExp(`^${prefix}halo$`)
const gempa = new RegExp(`^${prefix}gempa$`)
const anime = new RegExp(`^${prefix}anime$`)


naccbot.onText(sayHi, (callback) => {
    naccbot.sendMessage(callback
        .from.id, "Hallo Juga")
})

naccbot.onText(gempa, async(callback)=> {
    const BMKG_ENDPOOINT = "https://data.bmkg.go.id/DataMKG/TEWS/"

    const apiCall = await fetch(BMKG_ENDPOOINT + "autogempa.json" )
    const {
        Infogempa: {
            gempa : {
                Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Shakemap
            }
        }
    } = await apiCall.json()

    const BMKGImage = BMKG_ENDPOOINT + Shakemap
    const resultText = `
    Waktu: ${Tanggal} | ${Jam}
    Besaran: ${Magnitude} SR
    Wilayah: ${Wilayah}
    Potensi: ${Potensi}
    Kedalaman: ${Kedalaman}
    `

    naccbot.sendPhoto(callback.from.id, BMKGImage, {
        caption: resultText
    })
})



naccbot.onText(anime, async (callback) => {
    try {
        const MAL_ENDPOINT = "https://kitsu.io/api/edge/anime";
        
        // Ambil respons dari API
        const apiResponse = await fetch(MAL_ENDPOINT);
        const responseData = await apiResponse.json();

        // Pastikan respons memiliki data yang diharapkan
        if (responseData && responseData.data && responseData.data.length > 0) {
            // Pilih secara acak indeks data dari array
            const randomIndex = Math.floor(Math.random() * responseData.data.length);
            
            // Ambil judul dan cover image anime dari data yang dipilih secara acak
            const animeData = responseData.data[randomIndex].attributes;
            const titles = animeData.titles;
            const coverImage = animeData.posterImage.original;

            // Siapkan teks hasil
            let resultTextAnime = "Judul Anime: \n";
            for (const title in titles) {
                resultTextAnime += `${title}: ${titles[title]}\n`;
            }
            resultTextAnime += `\nCover Image: ${coverImage}`;

            // Kirim pesan ke pengguna
            naccbot.sendPhoto(callback.from.id, coverImage, { caption: resultTextAnime });
        } else {
            // Kasus jika data kosong
            naccbot.sendMessage(callback.from.id, "Tidak ada data anime ditemukan.");
        }
    } catch (error) {
        // Tangani kesalahan jika terjadi
        console.error("Terjadi kesalahan:", error);
        naccbot.sendMessage(callback.from.id, "Terjadi kesalahan saat mengambil data anime.");
    }
});



