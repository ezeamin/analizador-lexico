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
          position: { x: 0, y: 0 }, // Set position as needed
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
            position: { x: 0, y: 0 }, // Set position as needed
          });
        }
        elements.nodes.push({
          id: generateNodeId(),
          data: { label: node.type },
          position: { x: 0, y: 0 }, // Set position as needed
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
          position: { x: 0, y: 0 }, // Set position as needed
        });
        elements.nodes.push({
          id: generateNodeId(),
          data: { label: node.type },
          position: { x: 0, y: 0 }, // Set position as needed
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
        // Create a node for assignment
        const assignmentNodeId = generateNodeId();

        // Left side node
        elements.nodes.push({
          id: assignmentNodeId,
          data: { label: node.variable.name },
          type: 'output',
          position: { x: 0, y: 0 }, // Set position as needed
        });

        // Process the expression node
        processNode(node.expression);

        elements.nodes.push({
          id: generateNodeId(),
          data: { label: node.type }, // "Assignment" node
          position: { x: 0, y: 0 }, // Set position as needed
        });

        // Connect the left assignment node to the assignment node
        elements.edges.push({
          id: `${elements.nodes[elements.nodes.length - 1].id}_to_${
            elements.nodes[elements.nodes.length - 5].id
          }`,
          source: elements.nodes[elements.nodes.length - 1].id,
          target: elements.nodes[elements.nodes.length - 5].id,
        });

        // Connect the expression node to the Assignment node
        elements.edges.push({
          id: `${elements.nodes[elements.nodes.length - 1].id}_to_${
            elements.nodes[elements.nodes.length - 4].id
          }`,
          source: elements.nodes[elements.nodes.length - 1].id,
          target: elements.nodes[elements.nodes.length - 4].id,
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
          position: { x: 0, y: 0 }, // Set position as needed
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
          position: { x: 0, y: 0 }, // Set position as needed
        });

        // Process left and right nodes
        processNode(node.left);
        processNode(node.right);

        // Create edges from the binary operation node to left and right nodes
        elements.edges.push({
          id: `${binaryOpNodeId}_to_${
            elements.nodes[elements.nodes.length - 1].id
          }`,
          source: binaryOpNodeId,
          target: elements.nodes[elements.nodes.length - 1].id,
        });
        elements.edges.push({
          id: `${binaryOpNodeId}_to_${
            elements.nodes[elements.nodes.length - 2].id
          }`,
          source: binaryOpNodeId,
          target: elements.nodes[elements.nodes.length - 2].id,
        });
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
          position: { x: 0, y: 0 }, // Set position as needed
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
