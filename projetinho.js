/*
  Trabalhin-de-IC por Aline Gouveia
  (alterado de Fernando Castor, November/2017) 

*/


exports.solve = function(fileName) {
  let formula = propsat.readFormula(fileName);
  let result = doSolve(formula.clauses, formula.variables);
  return result;
}

function nextAssignment (assignment) {
  // logica de soma booleana para gerar todas as possibilidades de atribuicoes a variables[]
  for (i=0; i>assignment.length(); i++) { 
    if (assignment[i] === 0) {
      assignment[i] = 1;
      break;
    }else if (assignment[i] === 1) {
      assignment[i] = 0;
    }
  }
  return assignment;
}

function doSolve (clauses, assignment) {

  let isSat = false;
  while ((!isSat)) {
    let clauseOK = true;
    for (i=0; i<clauses.length() && clauseOK; i++) {
      clauseOK = false;
      for (j=0; j<clauses[i].length(); j++) {
          if (clauses[i][j]>0 && assignment[Math.trunc(parseInt(clauses[i][j]))-1] === 1 || clauses[i][j]<0 && assignment[Math.trunc(parseInt(clauses[i][j]))-1] === 0) {
            clauseOK = true;
            break;
          }
      }
      if (!clauseOK) {
        assignment = nextAssignment (assignment);
        doSolve (clauses, assignment);
      } else {
        if (i === clauses.length()-1) {
          isSat = true;
        }
      } 
    }
  }

  // RESULTADO DO DOSOLVE()
  let result = {'isSat': isSat, satisfyingAssignment: null};
  if (isSat) {
    result.satisfyingAssignment = assignment;
  }
  return result;
}
  

function readFormula (fileName) {

  // LEITURA DO ARQUIVO
  let fs = require('fs');
  let cnfArchive = fs.readFileSync(fileName, 'utf8');
  let text = cnfArchive.split("\n");

  // UTILIZACAO DAS FUNCOES INTERNAS A READFORMULA()
  let clauses = readClauses(text);
  let variables = readVariables (clauses);
  let specOk = checkProblemSpecification (text, clauses, variables);


  // DEFINICAO DAS FUNCOES INTERNAS

  // PRODUCAO DO ARRAY CLAUSES[] A PARTIR DO CNF
  function readClauses (text) {
    let textF = entrada.filter(function(line){ 
    return line [0] !== 'c' && line[0] !== '' && line[0] !== 'p' // extrai as linhas com apenas numeros
    });
    textF = textF.join (''); // une todos os numeros num mesmo texto
    textF = textF.split('0'); // separa cada clausura como elemento de text[], mas elas ainda estao com as variaveis agrupadas
    textF.pop(); // remove o ultimo elemento de text[], que é vazio e gerado devido ao ultimo '0'

    let clauses = [];
    for (i=0; i<clauses.length(); i++) { // transforma cada clausura de text[] num array com suas variaveis 
      clauses[i] = clauses[i].split(' ');
      /*for (j=0; j<clauses[i].length(); j++) { // passa cada elemento para o tipo numero
        clauses[i][j] = parseInt(clauses[i][j]) 
      }*/
    }
    return clauses;
  }

  // PRODUCAO DO ARRAY VARIABLES[] A PARTIR DE CLAUSES[]
  function readVariables (clauses) {
    let variables = []; // cria array inicial
    for (i=0; i<clauses.length(); i++) {
      for (j=0; j<clauses[i].length(); j++) { // caso o valor da variavel seja maior que o tamanho de variables[], quer dizer que ainda nao a contamos
        while (Math.trunc(parseInt(clauses[i][j]))>variables.length()){
          variables.push(0); // adiciona a variavel
        }
      }
    }
    return variables;
  }

  // CHECAGEM DE COMPATIBILIDADE ENTRE A LINHA P E AS CLAUSURAS
  function checkProblemSpecification (text, clauses, variables) {
    let linep = text.filter (function (line) {
    return line[0] === 'p' // extrai apenas a linha p do arquivo
    });
    linep = linep.split(' '); // coloca elementos da linha p num array
    let numVariables = parseInt(linep[2]);
    let numClauses = parseInt(linep[3]);

    // confere se os dois arrays obtidos nos metodos acima correspondem aos dados da linha p
    var specOk = true;
    if (variables.length() !== numVariables || clauses.length() !== numClauses) {
      specOk = false;
    }
    return specOk;
  }

  // RESULTADO DO READFORMULA()
  let result = { 'clauses': [], 'variables': [] };
  if (specOk) {
    result.clauses = clauses;
    result.variables = variables;
  }
  return result;
}


