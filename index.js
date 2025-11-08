import express from "express";//cria o servidor
import bodyParser from "body-parser"; //para ler os dados enviados do form
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv"; //ler as variaveis do .env
import { GoogleGenerativeAI } from "@google/generative-ai"; //SDK do gemini
import { marked } from "marked"; // converte Markdown para HTML

dotenv.config(); //carrega as variaveis do .env

const app = express(); //cria o servidor.
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true })); //le os dados do HTML
app.use(express.static(path.join(__dirname, "public")));// chama a pasta public

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);//aplicando a chave da ai
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); //modelo do gemini

// rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/gerar", async (req, res) => { //cria uma rota chamada gerar
  const dados = req.body; //pega todos os dados do forms

  const prompt = `
Você é um assistente médico. Gere um relatório em markdown com seções claras:
## ⚠️ Alertas de Risco  
## 🏥 Encaminhamento Recomendado  
## 🩺 Resumo da Situação  

Baseado nestes dados:
- Pressão arterial: ${dados.pressao}
- Frequência cardíaca: ${dados.frequencia}
- Temperatura: ${dados.temperatura}
- Saturação: ${dados.saturacao}
- Idade: ${dados.idade}
- Sexo: ${dados.sexo}
- Doenças crônicas: ${dados.doencas}
- Alergias: ${dados.alergias}
- Tipo sanguíneo: ${dados.tipo}
- Medicamentos contínuos: ${dados.medicamentos}
- Sintomas: ${dados.sintomas}
`;

  try {
    const result = await model.generateContent(prompt);//gera o relatorio
    const texto = result.response.text();//retorna em forma de texto

    //converte markdown para HTML
    const htmlConvertido = marked.parse(texto);

    res.send(`
      <html>
        <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="/style.css">
          <title>Resultado da Triagem</title>
        </head>
        <body class="resultado">
          <div class="card resultado-card">
            <h1>📋 Relatório Médico</h1>
            <div class="texto-resultado">${htmlConvertido}</div>
            <a class="botao-voltar" href="/">← Nova Triagem</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.send(`<h1>Erro ao gerar relatório</h1><p>${error.message}</p>`);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
