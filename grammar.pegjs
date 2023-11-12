{
  function createBinaryOperation(left, op, right) {
    return {
      type: "BinaryOperation",
      operator: op,
      left,
      right,
    };
  }
}

start
  = "programa" _ name:identifier "(" _ params:paramList* _ ")" _ "{" _ stmts:statement* _ finish:finishStatement _ "}" _ {
      return {
        type: "Program",
        name: name,
        parameters: params,
        body: stmts,
        // end: finish,
      };
    }

paramList
  = param:identifier otherParams:("," _ id:identifier { return id; })* {
      return [param].concat(otherParams);
    }

finishStatement
  = "terminar" _ ";" { 
    return {type: "Finish", name: "terminar"} 
  }

statement
  = declaration
  / input
  / output
  / assignment

declaration
  = "int" _ vars:variableDeclarationList ";" {
      return {
        type: "Declaration",
        variables: vars,
      };
    }

variableDeclarationList
  = variable:identifier otherVars:("," _ id:identifier { return id; })* {
      return [variable].concat(otherVars);
    }

input
  = _ "leer" _ variable:identifier ";" {
      return {
        type: "Input",
        variable: variable,
      };
    }

output
  = _ "imprimir" _ "(" _ params:printParameters _ ")" _ ";" {
      return {
        type: "Output",
        parameters: params,
      };
    }

printParameters
  = param:expression otherParams:("," _ id:expression { return id; })* {
      return [param].concat(otherParams);
    }

assignment
  = _ variable:identifier _ "=" _ expr:expression _ ";" {
      return {
        type: "Assignment",
        variable: variable,
        expression: expr,
      };
    }

expression
  = left:primary _ op:operator _ right:primary {
      return createBinaryOperation(left, op, right);
    } / primary

primary
  = integer
  / string
  / identifier
  / "(" _ expr:expression _ ")" {
      return expr;
    }
    
operator
  = "+" / "*" / "-" / "/"
  
integer
  = digits:[0-9]+ { return { type: "Integer", value: parseInt(digits.join(''), 10) }; }

string
  = "\"" value:$([^"]*) "\"" { return { type: "String", value: value }; }

identifier
  = name:$(letter (letter / digit)*) {
      return { type: "Identifier", name: name };
    }

letter
  = [a-zA-Z]

digit
  = [0-9]

_ "whitespace"
  = [ \t\n\r]*
