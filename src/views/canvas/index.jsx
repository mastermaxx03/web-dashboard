import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, useNodesState, useEdgesState, Controls } from 'reactflow';
import CustomNode from './CustomNode';

import { Box, Paper, Typography, IconButton, Slide, TextField, Button, Menu, MenuItem } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import dagre from 'dagre';

import 'reactflow/dist/style.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'top';
    node.sourcePosition = 'bottom';
    node.position = { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 };
    return node;
  });
  return { nodes, edges };
};
// ---------------------------------

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  custom: CustomNode
};

const initialPanelItems = [
  { name: 'RMU', color: '#ffeb3b' },
  { name: 'Transformer', color: '#ffcc80' },
  { name: 'Feeder', color: '#ef9a9a' },
  { name: 'Compressor', color: '#90caf9' }
];

const panelColors = [
  '#FFCDD2', // Light Red
  '#E1BEE7', // Light Purple
  '#C5CAE9', // Light Indigo
  '#BBDEFB', // Light Blue
  '#B2EBF2', // Light Cyan
  '#C8E6C9', // Light Green
  '#FFF9C4', // Light Yellow
  '#FFE0B2', // Light Orange
  '#D7CCC8', // Light Brown
  '#F5F5F5', // Light Grey
  '#CFD8DC', // Light Blue Grey
  '#F8BBD0', // Pink
  '#D1C4E9' // Deep Purple A100
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * panelColors.length);
  return panelColors[randomIndex];
};

export default function CanvasPage() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isFocusMode, setFocusMode] = useState(false);

  const [panelItems, setPanelItems] = useState(initialPanelItems);
  const [newItemName, setNewItemName] = useState('');

  const [transformerCount, setTransformerCount] = useState(0);
  const [feederCount, setFeederCount] = useState(0);
  const [rmuCount, setRmuCount] = useState(0);
  const [customItemCounts, setCustomItemCounts] = useState({});

  const [connectionMenu, setConnectionMenu] = useState(null);
  const currentConnection = useRef(null);
  const connectionCounts = useRef({});

  const handleToggleFocusMode = () => setFocusMode((prev) => !prev);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setFocusMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddCustomItem = () => {
    if (newItemName.trim() === '' || panelItems.some((item) => item.name.toLowerCase() === newItemName.trim().toLowerCase())) {
      setNewItemName('');
      return;
    }
    const newItem = {
      name: newItemName.trim(),
      color: getRandomColor()
    };
    setPanelItems((prevItems) => [...prevItems, newItem]);
    setCustomItemCounts((prevCounts) => ({
      ...prevCounts,
      [newItem.name]: 0
    }));
    setNewItemName('');
  };

  const onConnectStart = useCallback((event, { nodeId, handleId, handleType }) => {}, []);

  const onConnect = useCallback((params) => {
    currentConnection.current = params;
  }, []);

  const onConnectEnd = useCallback((event) => {
    if (currentConnection.current) {
      setConnectionMenu({
        x: event.clientX,
        y: event.clientY
      });
    } else {
      setConnectionMenu(null);
      currentConnection.current = null;
    }
  }, []);

  const handleCableTypeSelection = useCallback(
    (cableType) => {
      if (!currentConnection.current) {
        console.error('Connection parameters missing for edge creation.');
        setConnectionMenu(null);
        return;
      }

      const { source, sourceHandle, target, targetHandle } = currentConnection.current;

      let edgeLabel = '';
      let edgeStyle = {};
      const connectionKey = `${source}-${target}`;

      if (cableType === 'HT Cable') {
        edgeLabel = 'HT Cable';
        connectionCounts.current[connectionKey] = 0;
        edgeStyle = { strokeWidth: 2 }; // HT Cable back to default React Flow style
      } else if (cableType === 'Normal Cable') {
        edgeLabel = '';

        connectionCounts.current[connectionKey] = (connectionCounts.current[connectionKey] || 0) + 1;
        const count = connectionCounts.current[connectionKey];

        if (count === 1) {
          edgeStyle = { stroke: '#9e9e9e', strokeWidth: 2 };
        } else if (count === 2) {
          edgeStyle = { stroke: '#616161', strokeWidth: 3, strokeDasharray: '5 5' };
        } else if (count === 3) {
          edgeStyle = { stroke: '#424242', strokeWidth: 4, strokeDasharray: '1 4' };
        } else {
          const colors = ['#000000', '#333333', '#666666'];
          const thickness = 2 + (count - 4) * 0.5;
          edgeStyle = {
            stroke: colors[(count - 4) % colors.length],
            strokeWidth: Math.min(thickness, 6),
            strokeDasharray: '2 2'
          };
        }
      }

      const newEdge = {
        id: `e-${source}-${target}-${getId()}`,
        source: source,
        sourceHandle: sourceHandle,
        target: target,
        targetHandle: targetHandle,
        type: cableType === 'Normal Cable' ? 'default' : 'smoothstep',
        label: edgeLabel,
        style: edgeStyle
      };

      setEdges((eds) => addEdge(newEdge, eds));

      currentConnection.current = null;
      setConnectionMenu(null);
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      if (!nodeData) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });

      let newLabel = nodeData.name;
      let currentCount = 0;

      switch (nodeData.name) {
        case 'Transformer':
          setTransformerCount((prev) => prev + 1);
          currentCount = transformerCount + 1;
          newLabel = `${nodeData.name} ${currentCount}`;
          break;
        case 'Feeder':
          setFeederCount((prev) => prev + 1);
          currentCount = feederCount + 1;
          newLabel = `${nodeData.name} ${currentCount}`;
          break;
        case 'RMU':
          setRmuCount((prev) => prev + 1);
          currentCount = rmuCount + 1;
          newLabel = `${nodeData.name} ${currentCount}`;
          break;
        default:
          setCustomItemCounts((prevCounts) => {
            const updatedCount = (prevCounts[nodeData.name] || 0) + 1;
            currentCount = updatedCount;
            newLabel = `${nodeData.name} ${currentCount}`;
            return { ...prevCounts, [nodeData.name]: updatedCount };
          });

          break;
      }

      const newNode = {
        id: getId(),
        type: 'custom',
        position,
        data: { label: newLabel, color: nodeData.color }
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, transformerCount, feederCount, rmuCount, customItemCounts]
  );

  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  const normalStyle = { display: 'flex', height: 'calc(100vh - 64px)', position: 'relative' };
  const focusStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: 'white' };

  return (
    <Box sx={isFocusMode ? focusStyle : normalStyle}>
      {!isFocusMode && (
        <>
          <Slide direction="right" in={isSidebarVisible} mountOnEnter unmountOnExit>
            <Paper elevation={3} sx={{ width: '250px', p: 2, zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Components
                </Typography>
                <IconButton onClick={toggleSidebar}>
                  <ChevronLeftIcon />
                </IconButton>
              </Box>

              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {panelItems.map((item) => (
                  <Box
                    key={item.name}
                    onDragStart={(event) => onDragStart(event, item)}
                    draggable
                    sx={{ p: 1, border: '1px solid grey', m: 1, cursor: 'grab', userSelect: 'none' }}
                  >
                    {item.name}
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Custom
                </Typography>
                <TextField
                  label="Component Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddCustomItem();
                  }}
                  sx={{ mb: 1 }}
                />
                <Button variant="contained" fullWidth onClick={handleAddCustomItem}>
                  Add Component
                </Button>
              </Box>
            </Paper>
          </Slide>
          <Slide direction="right" in={!isSidebarVisible} mountOnEnter unmountOnExit>
            <IconButton
              onClick={toggleSidebar}
              sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1300, backgroundColor: 'white', boxShadow: 1 }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Slide>
        </>
      )}

      <Box sx={{ flexGrow: 1, height: '100%', position: 'relative' }} ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
          >
            <IconButton
              onClick={handleToggleFocusMode}
              title="Toggle Focus Mode"
              sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'white', boxShadow: 1 }}
            >
              {isFocusMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton
              onClick={onLayout}
              title="Auto-Layout"
              sx={{ position: 'absolute', top: 50, right: 10, zIndex: 10, backgroundColor: 'white', boxShadow: 1 }}
            >
              <AccountTreeIcon />
            </IconButton>
            <Controls showLock={false} />

            {/* Cable Type Selection Menu */}
            {connectionMenu && (
              <Menu
                open={Boolean(connectionMenu)}
                onClose={() => {
                  setConnectionMenu(null);
                  currentConnection.current = null;
                }}
                anchorReference="anchorPosition"
                anchorPosition={{ top: connectionMenu.y + 10, left: connectionMenu.x + 10 }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              >
                <MenuItem onClick={() => handleCableTypeSelection('HT Cable')}>HT Cable</MenuItem>
                <MenuItem onClick={() => handleCableTypeSelection('Normal Cable')}>Normal Cable</MenuItem>
              </Menu>
            )}
          </ReactFlow>
        </ReactFlowProvider>
      </Box>
    </Box>
  );
}
