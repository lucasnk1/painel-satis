const express = require('express');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');

const app = express();
app.use(express.json());

app.post('/sendFeedback', (req, res) => {
    const feedback = req.body;

    const headers = ["Nº", "Atendimento", "Estrutura", "Tempo de Espera", "Atendimento Médico", "Sugestões", "Data"];
    const rows = [[
        1,
        feedback.atendimento,
        feedback.estrutura,
        feedback.tempo_espera,
        feedback.atendimento_medico,
        feedback.sugestoes,
        feedback.date,
    ]];

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Avaliações');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ticon.noreply@gmail.com',
            pass: 'cion2929',
        },
    });

    transporter.sendMail({
        from: 'ticon.noreply@gmail.com',
        to: 'lucasleuck.52@gmail.com',
        subject: `Nova Avaliação - ${new Date().toLocaleDateString()}`,
        text: `Uma nova avaliação foi recebida em ${new Date().toLocaleString('pt-BR')}. Confira os detalhes no anexo.`,
        attachments: [
            { filename: 'avaliacao.xlsx', content: buffer },
        ],
    }, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao enviar e-mail.');
        }
        res.send('Avaliação enviada com sucesso!');
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
