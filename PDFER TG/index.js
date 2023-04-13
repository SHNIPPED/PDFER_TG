import axios from 'axios'
import Values from './Values.js';
import { jsPDF } from 'jspdf'

import TelegramApi from 'node-telegram-bot-api'

const token = "5968321076:AAHheArs3fahOfUoZdm7ltzDAZXK978mIFs"

const bot = new TelegramApi(token, { polling: true });


bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
        return bot.sendMessage(chatId, 'Добро пожаловать в PDFER TG введите вашу почту для поиска прикрепренных учащихся');
    }

    if (text != null) {
        const url = `http://localhost:3300/Email/${text}`;
        try {
            await axios.get(url)
                .then(function (response) {
                    for (var i in Object.keys(response)) {
                        try {
                            console.log(response.data[i].Name + response.data[i]._id)

                            let ChildrenOptions =
                            {
                                reply_markup: JSON.stringify({
                                    inline_keyboard: [
                                        [{ text: 'Выбрать', callback_data: response.data[i]._id }],
                                    ]
                                })
                            }
                            bot.sendMessage(chatId, `${response.data[i].Name} ${response.data[i].Surname} `, ChildrenOptions);
                        }
                        catch {
                            return
                        }
                    }
                });
        }
        catch (error) { bot.sendMessage(chatId, "Такого участника нет") }
    }

})


bot.on(
    'callback_query', async msg => {
        let Title
        const chatId = msg.message.chat.id;
        const id = msg.data;
        const url = `http://localhost:3300/User/${id}`
        console.log(id)
        await axios.get(url).then(async function (response) {
            console.log(response.data.Name)

            await axios.get(`http://localhost:3300/Quantum/${response.data.Quantum}`).then(function (response1) {
                Title = response1.data.Title
            })

            const doc = new jsPDF('landscape')
            var _img = Values.img;
            var Sizes = doc.internal.pageSize;
            var _MyFont = Values.myFont;
            var Sizes = doc.internal.pageSize;
            doc.addFileToVFS("MyFont.ttf", _MyFont);
            doc.addFont("MyFont.ttf", "MyFont", "normal");
            doc.setFont("MyFont");
            doc.addImage(_img, 'PNG', 0, 0, Sizes.getWidth(), Sizes.getHeight());
            doc.setFontSize(23);
            doc.text('Настоящим подтверждается, что', 91, 80)
            doc.text(`${response.data.Name} ${response.data.Surname} ${response.data.Patronomic}`, 148, 95, { align: 'center' })
            doc.text('прошёл обучение по направлению', 89, 110)
            doc.text(`${Title}`, 89, 125)
            doc.text(`в объёме 64 часа`, 149, 140, { align: 'center' })
            doc.setFontSize(15);
            var arrayOfStrings = response.data.Date.split('T');
            doc.text(`${arrayOfStrings[0]}`, 149, 195, { align: 'center' })
            doc.setFontSize(23);

            doc.save("sertificate.pdf")

        })
        bot.sendDocument(chatId, `sertificate.pdf`)
    }
)

process.once('SIGINT', () => bot.stopPolling('SIGINT'))
process.once('SIGTERM', () => bot.stopPolling('SIGTERM'))
