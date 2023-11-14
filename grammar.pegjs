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
  / whileStatement
  / ifStatement
  
whileStatement
  = _ "mientras" _ "(" _ condition:expression _ ")" _ "{" _ body:statement* _ "}"
    { return { type: "WhileStatement", condition: condition, body: body }; }
    
ifStatement
  = _ "si" _ "(" _ condition:expression _ ")" _ "{" _ body:statement* _ "}" elseStmt:elseStatement?
    { return { type: "IfStatement", condition, body: body, else: elseStmt || [] }; }
    
elseStatement
  = _ "sino" _ "{" _ body:statement* _ "}" {
    { return body; }
  }

declaration
  = _ varType:type _ vars:variableDeclarationList ";" {
     const variables = vars.map((variable)=>({...variable, varType}))
  
      return {
        type: "Declaration",
        variables: variables,
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
  = left:logicalExpression _ otherTerms:(_ op:bitwiseOperator _ right:logicalExpression {
      return { left, operator: op, right };
    })* {
      return otherTerms.reduce(function (acc, term) {
        return createBinaryOperation(acc, term.operator, term.right);
      }, left);
    }

logicalExpression
  = left:bitwiseExpression _ otherTerms:(_ op:logicalOperator _ right:bitwiseExpression {
      return { left, operator: op, right };
    })* {
      return otherTerms.reduce(function (acc, term) {
        return createBinaryOperation(acc, term.operator, term.right);
      }, left);
    }

bitwiseExpression
  = left:additiveExpression _ otherTerms:(_ op:bitwiseOperator _ right:additiveExpression {
      return { left, operator: op, right };
    })* {
      return otherTerms.reduce(function (acc, term) {
        return createBinaryOperation(acc, term.operator, term.right);
      }, left);
    }

additiveExpression
  = left:otherArithmeticExpression _ otherTerms:(_ op:additiveOperator _ right:otherArithmeticExpression {
      return { left, operator: op, right };
    })* {
      return otherTerms.reduce(function (acc, term) {
        return createBinaryOperation(acc, term.operator, term.right);
      }, left);
    }

otherArithmeticExpression
  = left:primary _ otherTerms:(_ op:otherArithmeticOperator _ right:primary {
      return { left, operator: op, right };
    })* {
      return otherTerms.reduce(function (acc, term) {
        return createBinaryOperation(acc, term.operator, term.right);
      }, left);
    }

primary
  = integer
  / string
  / identifier
  / "(" _ expr:expression _ ")" {
      return expr;
    }

bitwiseOperator
  = "&" / "|"

logicalOperator
  = "&&" / "||"

otherArithmeticOperator
  = "*" / "/"

additiveOperator
  = "+" / "-"
  
type
  = "int" / "float" / "char"
  
integer
  = digits:[0-9]+ { return { type: "Integer", value: parseInt(digits.join(''), 10) }; }

string
  = "\"" value:$([^"]*) "\"" { return { type: "String", value: value }; }

identifier
  = !reservedWords name:identifierName  {
      return { type: "Identifier", name: name };
    }
    
identifierName 
 = $(letter (letter / digit / "_")*) 
 
reservedWords
 = (type / "si" / "sino" / "mientras" / "terminar" / "imprimir" / "leer")
    
letterOrDigit
  = letter / digit

letter
  = [a-zA-Z]

digit
  = [0-9]

_ "whitespace"
  = [ \t\n\r]*
