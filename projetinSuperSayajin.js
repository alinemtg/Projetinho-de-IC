/*
  Trabalhin-de-IC por Aline Gouveia
  (alterado de Fernando Castor, November/2017)
*/

exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    let result = solvedpll(formula.clauses, formula.variables);
    return result;
}

function solvedpll (clauses, assignment) {

    let continueOK = true;
    let isSat = false;

    // ATRIBUIR VALORES PARA TORNAR VERDADEIRAS AS CLAUSURAS DE TAM 1
    let assigAux = assignment.slice();
    let clausesAux = [];
    let hasOne = false;
    for (let i=0; i<clauses.length && continueOK; i++) {
        if (clauses[i].length == 1) {
            hasOne = true;
            if (assigAux[Math.abs(clauses[i])-1] === 0) {
                assigAux[Math.abs(clauses[i])-1] = 2;
                clausesAux.push (clauses[i][0]);
                if (clauses[i][0] < 0) {
                    assignment[Math.abs(clauses[i])-1] = 0;
                } else {
                    assignment[Math.abs(clauses[i])-1] = 1;
                }
            } else {
                if ((clauses[i] > 0 && assignment[Math.abs(clauses[i]) - 1] !== 1) || (clauses[i] < 0 && assignment[Math.abs(clauses[i]) - 1] !== 0)) {
                    continueOK = false;
                }
            }
        }
    }

    // RETIRAR AS CLAUSURAS DE TAMANHO 01 Q JA TEM VALOR OK OU Q JA SAO VERDADEIRAS DEVIDO AS VARIAVEIS DETERMINADAS
    for (let i=0; i<clausesAux.length; i++){
        for (let ii=0; ii<clauses.length; ii++){
            console.log(clauses[ii]);
            console.log(clausesAux[i]);
            console.log(clauses[ii].includes(clausesAux[i]));
            if (clauses[ii].includes(clausesAux[i])) {
                clauses.splice(ii, 1);
                ii--;
            }
        }
    }

    // PARA CASO NAO ENCONTRAR UMA CLAUSURA UNITARIA, BACKTRACKING É NOSSA CHOICEE
    if (!hasOne){
        for (let i=0; i<assigAux; i++){
            if (assigAux[i] == 0) {
                assigAux = 0;


            }
        }

    }

    function testAtributionVariable (assignment, clauses){

    }

    console.log(clauses);
    //console.log(clausesAux);
    //console.log(assignment);
    //console.log(assigAux);



    // RESULTADO DO SOLVEDPLL()
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
    let text = cnfArchive.split("\r\n");

    // UTILIZACAO DAS FUNCOES INTERNAS A READFORMULA()
    let clauses = readClauses(text);
    let variables = readVariables (clauses);
    let specOk = checkProblemSpecification (text, clauses, variables);


    // DEFINICAO DAS FUNCOES INTERNAS

    // PRODUCAO DO ARRAY CLAUSES[] A PARTIR DO CNF
    function readClauses (text) {
        let textF = text.filter(function(line){
            return line [0] !== 'c' && line[0] !== '' && line[0] !== 'p' // extrai as linhas com apenas numeros
        });
        textF = textF.join (''); // une todos os numeros num mesmo texto
        textF = textF.split(" 0"); // separa cada clausura como elemento de text[], mas elas ainda estao com as variaveis agrupadas
        textF.pop(); // remove o ultimo elemento de text[], que é vazio e gerado devido ao ultimo '0'

        let clauses = [];
        for (let i=0; i<textF.length; i++) { // transforma cada clausura de text[] num array com suas variaveis
            clauses[i] = textF[i].split(" ");
            for (j=0; j<clauses[i].length; j++) { // passa cada elemento para o tipo numero
                clauses[i][j] = parseInt(clauses[i][j])
            }
        }
        return clauses;
    }

    // PRODUCAO DO ARRAY VARIABLES[] A PARTIR DE CLAUSES[]
    function readVariables (clauses) {
        let variables = []; // cria array inicial
        for (let i=0; i<clauses.length; i++) {
            for (j = 0; j < clauses[i].length; j++) { // caso o valor da variavel seja maior que o tamanho de variables[], quer dizer que ainda nao a contamos
                while ((Math.abs(clauses[i][j])) > variables.length) {
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
        linep = linep.join();
        linep = linep.split(' '); // coloca elementos da linha p num array
        let numVariables = parseInt(linep[2]);
        let numClauses = parseInt(linep[3]);

        // confere se os dois arrays obtidos nos metodos acima correspondem aos dados da linha p
        var specOk = true;
        if (variables.length !== numVariables || clauses.length !== numClauses) {
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