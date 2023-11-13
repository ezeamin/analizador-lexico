let nodeId = 0;

const generateNodeId = () => {
  return `node_${nodeId++}`;
};

export const generateTree = (program) => {
  const elements = {
    edges: [],
    nodes: [],
  };

  nodeId = 0;

  const processNode = (node) => {
    switch (node.type) {
      case 'Program':
        // The program node doesn't have visual representation
        // Process its body instead
        elements.nodes.push({
          id: 'root',
          data: { label: node.type },
          position: { x: 0, y: 0 },
        });
        for (const stmt of node.body) {
          processNode(stmt);
          elements.edges.push({
            id: `${elements.nodes[0].id}_to_${
              elements.nodes[elements.nodes.length - 1].id
            }`,
            source: elements.nodes[0].id,
            target: elements.nodes[elements.nodes.length - 1].id,
          });
        }
        break;

      case 'Declaration':
        // Create a node for variable declaration
        for (const variable of node.variables) {
          const nodeId = generateNodeId();
          elements.nodes.push({
            id: nodeId,
            data: { label: variable.name },
            type: 'output',
            position: { x: 0, y: 0 },
          });
        }
        elements.nodes.push({
          id: generateNodeId(),
          data: { label: node.type },
          position: { x: 0, y: 0 },
        });
        for (const index in node.variables) {
          elements.edges.push({
            id: `${elements.nodes[elements.nodes.length - 1].id}_to_${
              elements.nodes[elements.nodes.length - 2 - index].id
            }`,
            source: elements.nodes[elements.nodes.length - 1].id,
            target: elements.nodes[elements.nodes.length - 2 - index].id,
          });
        }
        break;

      case 'Input':
        // Create a node for input
        const inputNodeId = generateNodeId();
        elements.nodes.push({
          id: inputNodeId,
          data: { label: node.variable.name },
          type: 'output',
          position: { x: 0, y: 0 },
        });
        elements.nodes.push({
          id: generateNodeId(),
          data: { label: node.type },
          position: { x: 0, y: 0 },
        });
        elements.edges.push({
          id: `${elements.nodes[elements.nodes.length - 1].id}_to_${
            elements.nodes[elements.nodes.length - 2].id
          }`,
          source: elements.nodes[elements.nodes.length - 1].id,
          target: elements.nodes[elements.nodes.length - 2].id,
        });
        break;

      case 'Assignment':
        // Left side node
        const leftNodeId = generateNodeId();
        elements.nodes.push({
          id: leftNodeId,
          data: { label: node.variable.name },
          type: 'output',
          position: { x: 0, y: 0 },
        });

        // Process the expression node
        processNode(node.expression);

        const assignmentNodeId = generateNodeId();
        elements.nodes.push({
          id: assignmentNodeId,
          data: { label: node.type }, // "Assignment" node
          position: { x: 0, y: 0 },
        });

        // Connect the left assignment node to the assignment node
        elements.edges.push({
          id: `${assignmentNodeId}_to_${leftNodeId}`,
          source: assignmentNodeId,
          target: leftNodeId,
        });

        // Connect the expression node to the Assignment node
        elements.edges.push({
          id: `${assignmentNodeId}_to_${
            elements.nodes[elements.nodes.length - 2].id
          }`,
          source: assignmentNodeId,
          target: elements.nodes[elements.nodes.length - 2].id,
        });
        break;

      case 'Output':
        // Create a node for output
        const outputNodeId = generateNodeId();

        // Process each parameter in the output node
        for (const param of node.parameters) {
          processNode(param);
        }

        elements.nodes.push({
          id: outputNodeId,
          data: { label: node.type },
          position: { x: 0, y: 0 },
        });

        // Create edges from the output node to each parameter node
        for (let i = 0; i < node.parameters.length; i++) {
          elements.edges.push({
            id: `${outputNodeId}_to_${
              elements.nodes[
                elements.nodes.length - 1 - node.parameters.length + i
              ].id
            }`,
            source: outputNodeId,
            target:
              elements.nodes[
                elements.nodes.length - 1 - node.parameters.length + i
              ].id,
          });
        }
        break;

      case 'BinaryOperation':
        // Create a node for binary operation
        const binaryOpNodeId = generateNodeId();
        elements.nodes.push({
          id: binaryOpNodeId,
          data: { label: node.operator },
          position: { x: 0, y: 0 },
        });

        // Process left and right nodes
        processNode(node.left);

        // Create edges from the binary operation node to left and right nodes
        elements.edges.push({
          id: `${binaryOpNodeId}_to_${
            elements.nodes[elements.nodes.length - 1].id
          }`,
          source: binaryOpNodeId,
          target: elements.nodes[elements.nodes.length - 1].id,
        });

        processNode(node.right);

        elements.edges.push({
          id: `${binaryOpNodeId}_to_${
            elements.nodes[elements.nodes.length - 1].id
          }`,
          source: binaryOpNodeId,
          target: elements.nodes[elements.nodes.length - 1].id,
        });

        // Bring the if root node to the end of the array
        const opRootIndex = elements.nodes.findIndex(
          (el) => el.id === binaryOpNodeId,
        );
        const opRootNode = elements.nodes.splice(opRootIndex, 1);
        elements.nodes.push(opRootNode[0]);
        break;

      case 'IfStatement':
        // Create a node for if statement
        const ifNodeId = generateNodeId();
        elements.nodes.push({
          id: ifNodeId,
          data: { label: 'If' },
          position: { x: 0, y: 0 },
        });

        // Create a node for the condition
        const conditionNodeId = generateNodeId();
        elements.nodes.push({
          id: conditionNodeId,
          data: { label: node.condition.operator },
          position: { x: 0, y: 0 },
        });

        // Create an Condition for the condition
        const ifConditionNodeId = generateNodeId();
        elements.nodes.push({
          id: ifConditionNodeId,
          data: { label: 'Condition' },
          position: { x: 0, y: 0 },
        });

        // Create an edge from the condition node to the root node
        elements.edges.push({
          id: `${ifNodeId}_to_${ifConditionNodeId}`,
          source: ifNodeId,
          target: ifConditionNodeId,
        });
        elements.edges.push({
          id: `${ifConditionNodeId}_to_${conditionNodeId}`,
          source: ifConditionNodeId,
          target: conditionNodeId,
        });

        // Process left and right nodes of condition
        processNode(node.condition.left);

        // Create edges from the condition node to left and right nodes
        elements.edges.push({
          id: `${conditionNodeId}_to_${
            elements.nodes[elements.nodes.length - 1].id
          }`,
          source: conditionNodeId,
          target: elements.nodes[elements.nodes.length - 1].id,
        });

        
        processNode(node.condition.right);

        elements.edges.push({
          id: `${conditionNodeId}_to_${
            elements.nodes[elements.nodes.length - 1].id
          }`,
          source: conditionNodeId,
          target: elements.nodes[elements.nodes.length - 1].id,
        });

        // Create "IfBody" node
        const ifBodyNodeId = generateNodeId();
        elements.nodes.push({
          id: ifBodyNodeId,
          data: { label: 'Body' },
          position: { x: 0, y: 0 },
        });

        // Process the body of the if statement
        for (const nodeStmt of node.body) {
          processNode(nodeStmt);
          elements.edges.push({
            id: `${ifBodyNodeId}_to_${
              elements.nodes[elements.nodes.length - 1].id
            }`,
            source: ifBodyNodeId,
            target: elements.nodes[elements.nodes.length - 1].id,
          });
        }

        // Create an edge from the body node to the root node
        elements.edges.push({
          id: `${ifNodeId}_to_${ifBodyNodeId}`,
          source: ifNodeId,
          target: ifBodyNodeId,
        });

        // Process the else body if it exists
        if (node.else.length > 0) {
          // Create Else node
          const ifElseNodeId = generateNodeId();
          elements.nodes.push({
            id: ifElseNodeId,
            data: { label: 'Else' },
            position: { x: 0, y: 0 },
          });

          // Create an edge from the else node to the root node
          elements.edges.push({
            id: `${ifNodeId}_to_${ifElseNodeId}`,
            source: ifNodeId,
            target: ifElseNodeId,
          });

          for (const nodeElse of node.else) {
            processNode(nodeElse);

            elements.edges.push({
              id: `${ifElseNodeId}_to_${
                elements.nodes[elements.nodes.length - 1].id
              }`,
              source: ifElseNodeId,
              target: elements.nodes[elements.nodes.length - 1].id,
            });
          }
        }

        // Bring the if root node to the end of the array
        const ifRootIndex = elements.nodes.findIndex(
          (el) => el.id === ifNodeId,
        );
        const ifRootNode = elements.nodes.splice(ifRootIndex, 1);
        elements.nodes.push(ifRootNode[0]);

        break;

      case 'Identifier':
      case 'String':
      case 'Integer':
        // Create a node for identifier, string, or integer
        const leafNodeId = generateNodeId();
        elements.nodes.push({
          id: leafNodeId,
          data: { label: node.name || node.value },
          type: 'output',
          position: { x: 0, y: 0 },
        });
        break;

      default:
        // Handle other node types if needed
        break;
    }
  };

  // Start processing from the program node
  processNode(program);

  return elements;
};
