/*
  Trabalhin-de-IC versão 2.0 por Aline Gouveia
  (alterado de Fernando Castor, November/2017)
*/

exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    let result = doSolvedpll(formula.clauses, formula.variables);
    return result;
}

let assigFinal = [];
function doSolvedpll (clauses, assignment) {
    var isSat = false;
    let hasOne = true;

    function main (clauses, assignment) {
        let resultMain = {'isSat': false, satisfyingAssignment: null};

        if (clauses.length === 0) {
            resultMain.isSat = true;
            resultMain.satisfyingAssignment = assignment;
        } else {
            hasOne = false;
            for (let i = 0; i < clauses.length && !isSat; i++) {
                if (clauses[i].length == 1) {
                    hasOne = true;
                    if (clauses[i][0] < 0) {
                        assignment[Math.abs(clauses[i]) - 1] = 0;
                    } else {
                        assignment[Math.abs(clauses[i]) - 1] = 1;
                    }
                    remove(clauses, clauses[i][0]);
                }
            }
            console.log(assignment)
            if (!hasOne) {
                assignment[Math.abs(clauses[0][0]) - 1] = 0;
                let clausesAux = clauses.slice();
                remove(clausesAux, -clauses[0][0]);
                if (main(clausesAux, assignment).isSat) {
                    isSat = true;
                    assignment = main(clausesAux, assignment).variables;
                } else {
                    assignment[Math.abs(clauses[0][0]) - 1] == 1;
                    clausesAux = clauses.slice();
                    remove(clausesAux, clauses[0][0]);
                    if (main(clausesAux, assignment).isSat) {
                        isSat = true;
                        assignment = main(clausesAux, assignment).variables;
                    }
                }
            }
            main(clauses, assignment);
        }
    }


    // RETIRAR AS CLAUSURAS DE TAMANHO 01 Q JA TEM VALOR OK E AS Q JA SAO VERDADEIRAS DEVIDO AS VARIAVEIS DETERMINADAS
    function remove (clauses, variable) {
        let continueOK = true;
        for (let i=0; i<clauses.length && continueOK; i++) {
            if (clauses[i].includes(variable)) {
                clauses.splice(i, 1);
                i--;
                console.log(clauses);
            }
            else if (clauses[i].includes(-variable)) {
                if (clauses[i].length > 1) {
                    let ind = clauses[i].indexOf(-variable);
                    clauses[i].splice(ind, 1);
                } else {
                    continueOK = false;
                }
                console.log(clauses);
            }
        }
    }

    // RESULTADO DO DOSOLVEDPLL()
    let result = main(clauses, assignment);
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