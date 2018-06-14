  // LEITURA DO ARQUIVO CNF
let fs = require ('fs');
let text = fs.readFileSync ('simple.cnf', 'utf8');
let entrada3 = text.split ("\n");

function readClauses (entrada) {
  let entrada2 = entrada.filter (function (line){
    return line [0] !== 'c' && line[0] !== '' && line[0] !== 'p'                                  ;
  })
  let entrada1 = entrada2.join ('');
  let entrada = entrada1.split ('0'); // DEFINIR CADA CLAUSURA COMO ELEMENTO DO ARRAY ENTRADA
  entrada.pop(); // REMOVE O ULTIMO ELEMENTO (VAZIO POS ULTIMO '0')
  return entrada;
}

let clauses = readClauses (entrada3);
for (int i=0; i<clause.length(); i++) {
  clauses[i] = clauses[i].split(' ');
  for (int j=0; j<clauses[i].length(); j++) {
    clauses[i][j] = parseInt(clauses[i][j]);
  }
}


let linhap = entrada3.filter (function (line) {
  return line[0] === 'p'
})
linhap = linhap.split(' ');
var numVariables = linhap[2];
var numClauses = linhap[3];