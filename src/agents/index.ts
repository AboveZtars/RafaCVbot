import {Configuration, OpenAIApi} from "openai";
import {classifierPrompt, defaultRafaPrompt} from "../prompts";
import {createCache, setCacheList, getCacheList} from "../momentoCache";
import {CacheClient, Configurations, CredentialProvider} from "@gomomento/sdk";
import {
  skillsContext,
  personalDataContext,
  personalityContext,
} from "../prompts";

export class Agents {
  configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(this.configuration);

  async clasifierAgent(text: string) {
    const resp = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {role: "system", content: classifierPrompt},
        {role: "user", content: text},
      ],
    });
    if (resp.data.choices[0].message?.content) {
      return resp.data.choices[0].message?.content;
    } else {
      return "No se pudo clasificar el mensaje";
    }
  }

  async rafaAgent(text: string, contextCategory: string) {
    let context = "";
    if (contextCategory === "Personalidad") {
      context = personalityContext;
    } else if (contextCategory === "Habilidades") {
      context = skillsContext;
    } else if (contextCategory === "Datos personales") {
      context = personalDataContext;
    }

    const chatCompletion = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      temperature: 0,
      messages: [
        {role: "system", content: defaultRafaPrompt},
        {
          role: "system",
          content:
            "Siguiendo el hilo del chat,\n" +
            "da una respuesta adecuada para el mensaje de user\n" +
            "utilizando la informacion dada en el contexto proporcionado en caso de ser necesario,\n" +
            "No menciones que el contexto fue proporcionado, solo usalo como si fuera informacion que ya sabes.\n" +
            "Si no tienes la informacion adecuada, di honestamente que no sabes la respuesta.\n",
        },
        {
          role: "system",
          content: "Contexto:\n" + context,
        },
        {role: "user", content: text},
      ],
    });

    return chatCompletion.data.choices[0].message?.content;
  }
}

/* const momentoClient = new CacheClient({
      configuration: Configurations.Laptop.v1(),
      credentialProvider: CredentialProvider.fromString({
        authToken: process.env.MOMENTO_API_KEY || "",
      }),
      defaultTtlSeconds: 60 * 60 * 24,
    });
    await createCache(momentoClient); */
