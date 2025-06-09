const azureConfig = {
  key: "Cb7KlEYQsNXF7fAfB8R24AoCGdOj5GajTu7gXPz4XK1FLnwriekkJQQJ99BFACLArgHXJ3w3AAAbACOGiO17",
  region: "southcentralus",
  endpoint: "https://api.cognitive.microsofttranslator.com"
};

async function traducirTexto(texto, idiomaDestino) {
  const response = await fetch(`${azureConfig.endpoint}/translate?api-version=3.0&to=${idiomaDestino}`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": azureConfig.key,
      "Ocp-Apim-Subscription-Region": azureConfig.region,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([{ Text: texto }])
  });

  const data = await response.json();
  return data[0]?.translations[0]?.text || texto;
}

async function traducirPagina(idiomaDestino) {
  const elementos = document.body.querySelectorAll("*:not(script):not(style):not(noscript)");

  for (const el of elementos) {
    for (const nodo of el.childNodes) {
      if (nodo.nodeType === Node.TEXT_NODE && nodo.nodeValue.trim().length > 0) {
        const textoOriginal = nodo.nodeValue.trim();
        try {
          const textoTraducido = await traducirTexto(textoOriginal, idiomaDestino);
          nodo.nodeValue = textoTraducido;
        } catch (error) {
          console.warn("Error traduciendo:", textoOriginal, error);
        }
      }
    }
  }
}
