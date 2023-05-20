/*
DISCLAIMER:
Este ejercicio es un ejemplo del tipo de algoritmos que hay que mantener para el rol de "Desarrollador de Algoritmos RegExp".
Puede que sepas implementar mejores algoritmos, pero es necesario que puedas mantener lo que ya existe.
El código a continuación sirve para comprobar que producto asignar a un ingrediente (tomates secos).
Tiene 3 errores que provocan que 3 productos que sí sirven como "tomates secos" se descarten por quedar con puntuación negativa.
Major puntuación significa que el producto es más adecuado, puedes ver los resultados revisando los console.log.
Cada error tiene una dificultad y afecta a un producto diferente:
- Fácil: Hay un fallo en un regex en "WORDS".
- Medio: Falta agregar un elemento en los listados en "WORDS".
- Difícil: Hay un error en el orden del algoritmo.
Puedes responder directamente en el chat de la entrevista si quieres. NO CONTESTES EN LOS COMENTARIOS
*/

////////////////////////////////////////////////////////////////////////////////
// WORDS

const importantWords = [
    `nueces\\?`,
    `tomates\\s?secos\\?`,
    `verdes\\?`,  
      
  ];
  const importantWordsRegex = importantWords.map(w => new RegExp(`(^|\\s)${w}(\\s|$)`, "i"));
  
  const brands = [
    "damico",
    "globe ?italia",
    "gourmet",
    "la ?especia"
  ];
//error aca
  const brandsRegex = new RegExp(`(?:^|\\s)(${brands.map(brand => brand.replace(/\?/g, "\\?")).join("|")})(?:\\s|$)`, "gi");



  
  ////////////////////////////////////////////////////////////////////////////////
  // INIT
  //get product el ingrediente estaba en plural 
  const products = getProduct({
    ingredient: "tomates secos",
    products: [
        { id: 1, name: "Tomates" },
        { id: 2, name: "Tomates Cheika secos" },
        { id: 7, name: "Tomates La Especia secos" },
        { id: 3, name: "Gourmet tomate seco al sol" },
        { id: 4, name: "Tomates secos en aceite de oliva" },
        { id: 5, name: "Tomate seco en aceite con nueces" },
        { id: 6, name: "Jugo de tomate" },
    ]
  });
  
  ////////////////////////////////////////////////////////////////////////////////
  // SORT AND SHOW LOGS
  function getProduct({ ingredient, products }) {
    products.forEach(product => {
      const score = getScore({ ingredient, product });
      product.score = score;
    });
  
    products = products.sort((a, b) => b.score - a.score);
    console.log("products", products);
  
    const bestProducts = products.filter(p => p.score > 0);
    console.log("bestProducts", bestProducts);
    return bestProducts; 
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  // ALGORITHM (GET A PRODUCT SCORE)
  
  function getScore({ ingredient, product }) {
    let score = 0;
  
    let ingredientName = clean(ingredient);
    let productName = clean(product.name);
  
    // RETIEVES BRAND
    let productBrand = "";
    const productBrandMatch = productName.match(brandsRegex);
    if (productBrandMatch) {
      productBrand = productBrandMatch[1];
      productName = productName.replace(brandsRegex, " ");
      productName = clean(productName);
    }
  
    // CHECK MAIN (FIRST) WORD MATCHES
    const productName0 = tokenize(productName.split(/\s/)[0]);
    const ingredient0 = tokenize(ingredientName.split(/\s/)[0]);
    if (productName0 != ingredient0) return -1000;
  
    // CHECK IF "importantWords" MATCH BETWEEN INGREDIENT AND PRODUCT
    for (const regex of importantWordsRegex) {
      const ingredientMatch = ingredientName.match(regex);
      const productMatch = productName.match(regex);
      if (ingredientMatch && !productMatch) return -99;
      if (productMatch && !ingredientMatch) return -99;
    }
  
    // CALCULATE SCORE FROM MATCHING WORDS
    const ingredientWords = ingredientName.split(/\s+/g);
    let missingProductWords = productName;
    for (let ingredientWord of ingredientWords) {
      const ingredientToken = tokenize(ingredientWord);
      const ingredientRegex = new RegExp(`(^|\\s)${ingredientToken}[aeious]*(\\s|$)`);
      const match = missingProductWords.match(ingredientRegex);
      if (match) {
        score += 1;
        missingProductWords = missingProductWords.replace(match[0], " ");
      }
    }
    score -= clean(missingProductWords).split(/\s+/g).length * 0.1;
  
    return score;
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  // UTILS
  
  // REMOVE DETERMINANTS, PRONOUNS..
  function clean(word) {
    return word.toLowerCase()
      .replace(/(^|\s)(el|la|al|en|de)(\s|$)/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  // REMOVE PLURALS, ETC..
  function tokenize(word) {
    return word.toLowerCase()
      .replace(/[aeious]+(\s|$)/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }